"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import type { Chapter } from "@/lib/extras";

export type EnhancedPlayerHandle = {
  seek: (sec: number) => void;
  play: () => void;
  pause: () => void;
};

type Props = {
  src: string;
  poster?: string;
  chapters?: Chapter[];
  durationSec?: number;
  onTimeUpdate?: (t: number) => void;
};

const SPEEDS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.5, 3];

function fmt(sec: number): string {
  if (!isFinite(sec)) return "0:00";
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.floor(sec % 60);
  if (h > 0) {
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  return `${m}:${String(s).padStart(2, "0")}`;
}

export const EnhancedPlayer = forwardRef<EnhancedPlayerHandle, Props>(
  function EnhancedPlayer(
    { src, poster, chapters = [], durationSec, onTimeUpdate },
    ref
  ) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);
    const hideTimerRef = useRef<number | null>(null);

    const [playing, setPlaying] = useState(false);
    const [current, setCurrent] = useState(0);
    const [total, setTotal] = useState(durationSec ?? 0);
    const [volume, setVolume] = useState(1);
    const [muted, setMuted] = useState(false);
    const [speed, setSpeed] = useState(1);
    const [showSettings, setShowSettings] = useState(false);
    const [showSpeedMenu, setShowSpeedMenu] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const [isFs, setIsFs] = useState(false);
    const [isPip, setIsPip] = useState(false);
    const [buffered, setBuffered] = useState(0);
    const [hoverX, setHoverX] = useState<number | null>(null);
    const [hoverTime, setHoverTime] = useState<number | null>(null);

    useImperativeHandle(ref, () => ({
      seek: (sec: number) => {
        const v = videoRef.current;
        if (!v) return;
        v.currentTime = sec;
        v.play().catch(() => {});
      },
      play: () => videoRef.current?.play(),
      pause: () => videoRef.current?.pause(),
    }));

    const scheduleHide = useCallback(() => {
      if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = window.setTimeout(() => {
        if (!videoRef.current?.paused) setShowControls(false);
      }, 2500);
    }, []);

    const onMouseMove = () => {
      setShowControls(true);
      scheduleHide();
    };

    const togglePlay = useCallback(() => {
      const v = videoRef.current;
      if (!v) return;
      if (v.paused) v.play();
      else v.pause();
    }, []);

    const seekBy = useCallback((delta: number) => {
      const v = videoRef.current;
      if (!v) return;
      v.currentTime = Math.max(0, Math.min(v.duration || 0, v.currentTime + delta));
    }, []);

    const toggleFullscreen = useCallback(() => {
      const el = containerRef.current;
      if (!el) return;
      if (!document.fullscreenElement) el.requestFullscreen?.();
      else document.exitFullscreen?.();
    }, []);

    const togglePip = useCallback(async () => {
      const v = videoRef.current;
      if (!v) return;
      try {
        if (document.pictureInPictureElement) {
          await document.exitPictureInPicture();
        } else if (document.pictureInPictureEnabled) {
          await v.requestPictureInPicture();
        }
      } catch {}
    }, []);

    const setSpeedValue = useCallback((s: number) => {
      setSpeed(s);
      if (videoRef.current) videoRef.current.playbackRate = s;
      setShowSpeedMenu(false);
      setShowSettings(false);
    }, []);

    useEffect(() => {
      const onFs = () => setIsFs(!!document.fullscreenElement);
      document.addEventListener("fullscreenchange", onFs);
      return () => document.removeEventListener("fullscreenchange", onFs);
    }, []);

    useEffect(() => {
      const v = videoRef.current;
      if (!v) return;
      const onEnter = () => setIsPip(true);
      const onLeave = () => setIsPip(false);
      v.addEventListener("enterpictureinpicture", onEnter);
      v.addEventListener("leavepictureinpicture", onLeave);
      return () => {
        v.removeEventListener("enterpictureinpicture", onEnter);
        v.removeEventListener("leavepictureinpicture", onLeave);
      };
    }, []);

    useEffect(() => {
      const onKey = (e: KeyboardEvent) => {
        const tag = (document.activeElement?.tagName ?? "").toLowerCase();
        if (tag === "input" || tag === "textarea") return;
        switch (e.key) {
          case " ":
          case "k":
            e.preventDefault();
            togglePlay();
            break;
          case "ArrowLeft":
            e.preventDefault();
            seekBy(-5);
            break;
          case "ArrowRight":
            e.preventDefault();
            seekBy(5);
            break;
          case "j":
            e.preventDefault();
            seekBy(-10);
            break;
          case "l":
            e.preventDefault();
            seekBy(10);
            break;
          case "m":
            e.preventDefault();
            setMuted((m) => {
              if (videoRef.current) videoRef.current.muted = !m;
              return !m;
            });
            break;
          case "f":
            e.preventDefault();
            toggleFullscreen();
            break;
          case "i":
            e.preventDefault();
            togglePip();
            break;
          case ">": {
            e.preventDefault();
            const idx = SPEEDS.indexOf(speed);
            setSpeedValue(SPEEDS[Math.min(SPEEDS.length - 1, idx + 1)]);
            break;
          }
          case "<": {
            e.preventDefault();
            const idx = SPEEDS.indexOf(speed);
            setSpeedValue(SPEEDS[Math.max(0, idx - 1)]);
            break;
          }
          case ".":
            e.preventDefault();
            seekBy(1 / 30);
            break;
          case ",":
            e.preventDefault();
            seekBy(-1 / 30);
            break;
          case "n":
            e.preventDefault();
            jumpNextChapter();
            break;
          case "p":
            e.preventDefault();
            jumpPrevChapter();
            break;
        }
      };

      const jumpNextChapter = () => {
        if (chapters.length === 0) return;
        const next = chapters.find((c) => c.start > current + 0.5);
        if (next && videoRef.current) {
          videoRef.current.currentTime = next.start;
        }
      };
      const jumpPrevChapter = () => {
        if (chapters.length === 0) return;
        let prev: Chapter | null = null;
        for (const c of chapters) {
          if (c.start < current - 0.5) prev = c;
        }
        if (prev && videoRef.current) {
          videoRef.current.currentTime = prev.start;
        }
      };

      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }, [
      chapters,
      current,
      seekBy,
      setSpeedValue,
      speed,
      togglePip,
      togglePlay,
      toggleFullscreen,
    ]);

    const activeChapter = (() => {
      if (chapters.length === 0) return null;
      let active: Chapter | null = chapters[0];
      for (const c of chapters) if (current >= c.start) active = c;
      return active;
    })();

    const onScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
      const t = Number(e.target.value);
      if (videoRef.current) videoRef.current.currentTime = t;
      setCurrent(t);
    };

    const onProgressHover = (e: React.MouseEvent<HTMLDivElement>) => {
      const wrapper = progressRef.current;
      if (!wrapper) return;
      const rect = wrapper.getBoundingClientRect();
      const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
      setHoverX(x);
      setHoverTime(total ? (x / rect.width) * total : 0);
    };

    const hoverChapter = (() => {
      if (hoverTime === null || chapters.length === 0) return null;
      let c: Chapter | null = null;
      for (const ch of chapters) if (hoverTime >= ch.start) c = ch;
      return c;
    })();

    return (
      <div
        ref={containerRef}
        className="relative bg-black rounded-xl overflow-hidden group/player"
        onMouseMove={onMouseMove}
        onMouseLeave={() => {
          if (!videoRef.current?.paused) setShowControls(false);
        }}
      >
        <video
          ref={videoRef}
          className="w-full aspect-video bg-black"
          poster={poster}
          onClick={togglePlay}
          onDoubleClick={toggleFullscreen}
          onPlay={() => {
            setPlaying(true);
            scheduleHide();
          }}
          onPause={() => {
            setPlaying(false);
            setShowControls(true);
          }}
          onTimeUpdate={(e) => {
            const t = e.currentTarget.currentTime;
            setCurrent(t);
            onTimeUpdate?.(t);
          }}
          onLoadedMetadata={(e) => {
            setTotal(e.currentTarget.duration);
            e.currentTarget.playbackRate = speed;
          }}
          onProgress={(e) => {
            const v = e.currentTarget;
            if (v.buffered.length > 0) {
              setBuffered(v.buffered.end(v.buffered.length - 1));
            }
          }}
          onVolumeChange={(e) => {
            setVolume(e.currentTarget.volume);
            setMuted(e.currentTarget.muted);
          }}
          playsInline
          preload="metadata"
        >
          <source src={src} type="video/mp4" />
        </video>

        {!playing && (
          <button
            onClick={togglePlay}
            aria-label="再生"
            className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors"
          >
            <span className="w-20 h-20 rounded-full bg-yt-red flex items-center justify-center shadow-2xl">
              <svg viewBox="0 0 24 24" width="34" height="34" fill="white">
                <path d="M8 5v14l11-7L8 5z" />
              </svg>
            </span>
          </button>
        )}

        <div
          className={`absolute inset-x-0 bottom-0 transition-opacity duration-200 ${
            showControls ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0) 100%)",
          }}
        >
          <div
            ref={progressRef}
            className="px-3 pt-12 pb-1 relative"
            onMouseMove={onProgressHover}
            onMouseLeave={() => {
              setHoverX(null);
              setHoverTime(null);
            }}
          >
            <div className="relative h-1.5 group/progress">
              <div
                className="absolute h-full bg-white/40 rounded"
                style={{ width: `${total ? (buffered / total) * 100 : 0}%` }}
              />
              {chapters.length > 0 ? (
                <div className="absolute inset-0 flex gap-0.5">
                  {chapters.map((c, i) => {
                    const next = chapters[i + 1]?.start ?? total;
                    const segWidth = total ? ((next - c.start) / total) * 100 : 0;
                    const filledRatio = Math.max(
                      0,
                      Math.min(1, (current - c.start) / Math.max(0.001, next - c.start))
                    );
                    return (
                      <div
                        key={i}
                        className="h-full bg-white/25 rounded-sm relative overflow-hidden"
                        style={{ width: `${segWidth}%` }}
                      >
                        <div
                          className="absolute inset-y-0 left-0 bg-yt-red"
                          style={{ width: `${filledRatio * 100}%` }}
                        />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div
                  className="absolute h-full bg-yt-red rounded"
                  style={{ width: `${total ? (current / total) * 100 : 0}%` }}
                />
              )}
              <input
                type="range"
                className="vp-range absolute inset-0 w-full"
                min={0}
                max={total || 0}
                step={0.1}
                value={current}
                onChange={onScrub}
                aria-label="シーク"
              />
            </div>

            {hoverX !== null && hoverTime !== null && (
              <div
                className="absolute -top-2 pointer-events-none vp-fade-in"
                style={{ left: `${hoverX + 12}px`, transform: "translateX(-50%)" }}
              >
                <div className="bg-black/95 px-2 py-1 rounded text-white text-xs tabular-nums whitespace-nowrap">
                  {hoverChapter && (
                    <div className="text-[10px] text-white/70 mb-0.5 max-w-[200px] truncate">
                      {hoverChapter.title}
                    </div>
                  )}
                  {fmt(Math.floor(hoverTime))}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 px-3 pb-2 text-white">
            <button
              onClick={togglePlay}
              aria-label={playing ? "一時停止" : "再生"}
              className="p-2 hover:bg-white/10 rounded transition-colors"
              title="Space / K"
            >
              {playing ? (
                <svg viewBox="0 0 24 24" width="22" height="22" fill="white">
                  <rect x="6" y="5" width="4" height="14" />
                  <rect x="14" y="5" width="4" height="14" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" width="22" height="22" fill="white">
                  <path d="M8 5v14l11-7L8 5z" />
                </svg>
              )}
            </button>

            <button
              onClick={() => seekBy(-10)}
              aria-label="10秒戻る"
              className="p-2 hover:bg-white/10 rounded transition-colors"
              title="J: 10秒戻る"
            >
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M11 5 5 11l6 6" />
                <path d="M5 11h9a5 5 0 0 1 0 10h-4" />
              </svg>
            </button>

            <button
              onClick={() => seekBy(10)}
              aria-label="10秒進む"
              className="p-2 hover:bg-white/10 rounded transition-colors"
              title="L: 10秒進む"
            >
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m13 5 6 6-6 6" />
                <path d="M19 11h-9a5 5 0 0 0 0 10h4" />
              </svg>
            </button>

            <div className="flex items-center gap-1 group/volume">
              <button
                onClick={() => {
                  setMuted((m) => {
                    if (videoRef.current) videoRef.current.muted = !m;
                    return !m;
                  });
                }}
                aria-label={muted ? "ミュート解除" : "ミュート"}
                className="p-2 hover:bg-white/10 rounded transition-colors"
                title="M"
              >
                {muted || volume === 0 ? (
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="white">
                    <path d="M3 9v6h4l5 5V4L7 9H3z" />
                    <path d="M16 9l4 4m0-4-4 4" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="white">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm12.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4z" />
                  </svg>
                )}
              </button>
              <input
                type="range"
                className="vp-range w-0 group-hover/volume:w-20 transition-all"
                min={0}
                max={1}
                step={0.01}
                value={muted ? 0 : volume}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  setVolume(v);
                  setMuted(v === 0);
                  if (videoRef.current) {
                    videoRef.current.volume = v;
                    videoRef.current.muted = v === 0;
                  }
                }}
                aria-label="音量"
              />
            </div>

            <div className="text-xs tabular-nums px-2 text-white/95">
              {fmt(Math.floor(current))}
              <span className="text-white/55"> / {fmt(Math.floor(total))}</span>
            </div>

            {activeChapter && (
              <div className="hidden sm:block text-xs px-2 text-white/85 truncate max-w-[260px]">
                · {activeChapter.title}
              </div>
            )}

            <div className="flex-1" />

            <div className="relative">
              <button
                onClick={() => {
                  setShowSettings((s) => !s);
                  setShowSpeedMenu(false);
                }}
                aria-label="設定"
                className="p-2 hover:bg-white/10 rounded transition-colors"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="22"
                  height="22"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
                </svg>
              </button>
              {showSettings && !showSpeedMenu && (
                <div className="absolute bottom-11 right-0 bg-black/95 backdrop-blur rounded-lg overflow-hidden text-sm vp-fade-in min-w-[200px]">
                  <button
                    onClick={() => setShowSpeedMenu(true)}
                    className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-white/10 text-white"
                  >
                    <span>再生速度</span>
                    <span className="text-white/60">
                      {speed === 1 ? "標準" : `${speed}x`} ›
                    </span>
                  </button>
                </div>
              )}
              {showSpeedMenu && (
                <div className="absolute bottom-11 right-0 bg-black/95 backdrop-blur rounded-lg overflow-hidden text-sm vp-fade-in min-w-[200px] max-h-[300px] overflow-y-auto">
                  <button
                    onClick={() => setShowSpeedMenu(false)}
                    className="w-full px-4 py-2 text-white/60 text-xs uppercase tracking-wide border-b border-white/10 text-left hover:text-white"
                  >
                    ← 再生速度
                  </button>
                  {SPEEDS.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSpeedValue(s)}
                      className={`w-full px-4 py-2 text-left hover:bg-white/10 ${
                        s === speed ? "bg-white/10 text-white" : "text-white/85"
                      }`}
                    >
                      <span className="inline-block w-4">
                        {s === speed ? "✓" : ""}
                      </span>
                      {s === 1 ? "標準 (1x)" : `${s}x`}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={togglePip}
              aria-label="ピクチャインピクチャ"
              className={`p-2 hover:bg-white/10 rounded transition-colors ${
                isPip ? "text-yt-blue" : "text-white"
              }`}
              title="I: PiP"
            >
              <svg
                viewBox="0 0 24 24"
                width="22"
                height="22"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="4" width="18" height="14" rx="2" />
                <rect x="12" y="10" width="7" height="6" rx="1" fill="currentColor" />
              </svg>
            </button>

            <button
              onClick={toggleFullscreen}
              aria-label="全画面"
              className="p-2 hover:bg-white/10 rounded transition-colors"
              title="F"
            >
              {isFs ? (
                <svg
                  viewBox="0 0 24 24"
                  width="22"
                  height="22"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M8 3v5H3M16 3v5h5M8 21v-5H3M16 21v-5h5" />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  width="22"
                  height="22"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 8V3h5M21 8V3h-5M3 16v5h5M21 16v5h-5" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className="absolute top-3 left-3 px-2 py-1 rounded bg-black/60 text-white text-[10px] uppercase tracking-wide opacity-0 group-hover/player:opacity-100 transition-opacity pointer-events-none">
          キー: K/␣ 再生 · J/L ±10秒 · M ミュート · F 全画面 · I PiP · N/P チャプター · &lt;/&gt; 速度
        </div>
      </div>
    );
  }
);
