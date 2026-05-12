"use client";

import { useEffect, useRef, useState } from "react";
import type { Video } from "@/lib/types";
import { PlayIcon } from "./icons";

export function VideoPlayer({ video }: { video: Video }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  // Simulated playback when 'playing'
  useEffect(() => {
    if (!playing) return;
    const total = parseDuration(video.duration);
    const tick = setInterval(() => {
      setElapsed((e) => {
        const next = e + 1;
        setProgress(Math.min(100, (next / total) * 100));
        if (next >= total) {
          setPlaying(false);
          return total;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(tick);
  }, [playing, video.duration]);

  const total = parseDuration(video.duration);

  return (
    <div
      ref={containerRef}
      className="relative aspect-video w-full overflow-hidden rounded-xl bg-black group"
    >
      <img
        src={video.thumbnail
          .replace("/640/360", "/1280/720")
          .replace("/hqdefault.jpg", "/maxresdefault.jpg")}
        alt={video.title}
        className="h-full w-full object-cover"
      />

      {!playing && (
        <button
          onClick={() => setPlaying(true)}
          className="absolute inset-0 grid place-items-center bg-black/30 hover:bg-black/40"
          aria-label="再生"
        >
          <span className="grid size-20 place-items-center rounded-full bg-yt-red shadow-xl">
            <PlayIcon className="size-10 translate-x-0.5" />
          </span>
        </button>
      )}

      {/* Controls bar */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent px-4 pb-2 pt-12 opacity-0 transition-opacity group-hover:opacity-100">
        <input
          type="range"
          className="vp-range"
          min={0}
          max={100}
          value={progress}
          onChange={(e) => {
            const p = Number(e.target.value);
            setProgress(p);
            setElapsed(Math.floor((p / 100) * total));
          }}
        />
        <div className="flex items-center gap-3 text-white">
          <button
            onClick={() => setPlaying((p) => !p)}
            className="p-1 hover:opacity-80"
            aria-label={playing ? "一時停止" : "再生"}
          >
            {playing ? (
              <svg viewBox="0 0 24 24" className="size-7" fill="currentColor">
                <path d="M6 5h4v14H6zm8 0h4v14h-4z" />
              </svg>
            ) : (
              <PlayIcon className="size-7" />
            )}
          </button>
          <button
            onClick={() => setMuted((m) => !m)}
            className="p-1 hover:opacity-80"
            aria-label={muted ? "ミュート解除" : "ミュート"}
          >
            {muted ? (
              <svg viewBox="0 0 24 24" className="size-6" fill="currentColor">
                <path d="M3.63 3.63a.996.996 0 0 0 0 1.41L7.29 8.7 7 9H3v6h4l5 5v-6.59l4.18 4.18c-.49.37-1.02.68-1.6.91-.36.15-.58.53-.58.92 0 .72.73 1.18 1.39.91.8-.33 1.55-.77 2.22-1.31l1.34 1.34a.996.996 0 1 0 1.41-1.41L5.05 3.63c-.39-.39-1.02-.39-1.42 0zM19 12c0 .82-.15 1.61-.41 2.34l1.53 1.53c.56-1.17.88-2.48.88-3.87 0-3.83-2.4-7.11-5.78-8.4-.59-.23-1.22.23-1.22.86v.19c0 .38.25.71.61.85C17.18 6.54 19 9.06 19 12zm-8.71-6.29l-.17.17L12 7.76V4l-1.71 1.71zM16.5 12A4.5 4.5 0 0 0 14 7.97v1.79l2.48 2.48c.01-.08.02-.16.02-.24z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="size-6" fill="currentColor">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
              </svg>
            )}
          </button>
          <span className="text-sm">
            {fmt(elapsed)} / {video.duration === "LIVE" ? "LIVE" : video.duration}
          </span>
          <div className="ml-auto flex items-center gap-2">
            <button className="rounded bg-black/40 px-2 py-0.5 text-xs hover:bg-black/60">
              CC
            </button>
            <button className="p-1 hover:opacity-80" aria-label="設定">
              <svg viewBox="0 0 24 24" className="size-6" fill="currentColor">
                <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65A.488.488 0 0 0 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z" />
              </svg>
            </button>
            <button
              onClick={() => containerRef.current?.requestFullscreen()}
              className="p-1 hover:opacity-80"
              aria-label="全画面"
            >
              <svg viewBox="0 0 24 24" className="size-6" fill="currentColor">
                <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function parseDuration(d: string): number {
  if (d === "LIVE") return 99999;
  const parts = d.split(":").map(Number);
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return 0;
}

function fmt(sec: number): string {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.floor(sec % 60);
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}
