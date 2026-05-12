"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  DislikeIcon,
  LikeIcon,
  MoreIcon,
  MusicIcon,
  PlayIcon,
  ShareIcon,
} from "./icons";
import type { Short } from "@/lib/types";

export function ShortsPlayer({ shorts }: { shorts: Short[] }) {
  const [activeId, setActiveId] = useState(shorts[0]?.id);
  const [muted, setMuted] = useState(true);

  return (
    <div className="grid place-items-start py-4">
      <div className="snap-y snap-mandatory overflow-y-auto h-[calc(100vh-3.5rem-2rem)] no-scrollbar">
        {shorts.map((s) => (
          <ShortItem
            key={s.id}
            short={s}
            muted={muted}
            onToggleMute={() => setMuted((m) => !m)}
            onActive={() => setActiveId(s.id)}
            isActive={activeId === s.id}
          />
        ))}
      </div>
    </div>
  );
}

function ShortItem({
  short: s,
  muted,
  onToggleMute,
  isActive,
  onActive,
}: {
  short: Short;
  muted: boolean;
  onToggleMute: () => void;
  isActive: boolean;
  onActive: () => void;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  // Auto-play when scrolled into view
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const v = videoRef.current;
          if (!v) continue;
          if (e.intersectionRatio > 0.6) {
            onActive();
            v.play()
              .then(() => setPlaying(true))
              .catch(() => setPlaying(false));
          } else {
            v.pause();
            setPlaying(false);
          }
        }
      },
      { threshold: [0, 0.6, 1] }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [onActive]);

  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.muted = muted;
  }, [muted]);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  return (
    <div
      ref={wrapRef}
      className="snap-start min-h-[calc(100vh-3.5rem-2rem)] flex items-center justify-center gap-3 py-2"
    >
      <div
        onClick={toggle}
        className="relative w-[min(420px,calc(100vw-160px))] aspect-[9/16] rounded-xl overflow-hidden bg-black cursor-pointer"
      >
        {/* Video */}
        {s.src ? (
          <video
            ref={videoRef}
            src={s.src}
            poster={s.thumbnail}
            playsInline
            loop
            muted={muted}
            preload="auto"
            className="absolute inset-0 h-full w-full object-cover"
            onTimeUpdate={(e) => {
              const v = e.currentTarget;
              if (v.duration) setProgress((v.currentTime / v.duration) * 100);
            }}
          />
        ) : (
          <img
            src={s.thumbnail}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}

        {/* Big play overlay when paused */}
        {!playing && (
          <div className="absolute inset-0 grid place-items-center bg-black/30 pointer-events-none">
            <span className="grid size-20 place-items-center rounded-full bg-black/60 backdrop-blur">
              <PlayIcon className="size-10 translate-x-0.5" />
            </span>
          </div>
        )}

        {/* Top: mute button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleMute();
          }}
          className="absolute top-3 right-3 grid size-9 place-items-center rounded-full bg-black/60 hover:bg-black/80 backdrop-blur"
          aria-label={muted ? "ミュート解除" : "ミュート"}
        >
          {muted ? (
            <svg viewBox="0 0 24 24" className="size-5" fill="currentColor">
              <path d="M3.63 3.63a.996.996 0 0 0 0 1.41L7.29 8.7 7 9H3v6h4l5 5v-6.59l4.18 4.18c-.49.37-1.02.68-1.6.91-.36.15-.58.53-.58.92 0 .72.73 1.18 1.39.91.8-.33 1.55-.77 2.22-1.31l1.34 1.34a.996.996 0 1 0 1.41-1.41L5.05 3.63c-.39-.39-1.02-.39-1.42 0zM19 12c0 .82-.15 1.61-.41 2.34l1.53 1.53c.56-1.17.88-2.48.88-3.87 0-3.83-2.4-7.11-5.78-8.4-.59-.23-1.22.23-1.22.86v.19c0 .38.25.71.61.85C17.18 6.54 19 9.06 19 12zm-8.71-6.29l-.17.17L12 7.76V4l-1.71 1.71zM16.5 12A4.5 4.5 0 0 0 14 7.97v1.79l2.48 2.48c.01-.08.02-.16.02-.24z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="size-5" fill="currentColor">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
            </svg>
          )}
        </button>

        {/* Bottom: channel info + title + music */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 pt-12">
          <div className="flex items-center gap-2 mb-2">
            {s.channelAvatar && (
              <Link href={`/channel/ch-${(s.channel ?? "").replace(/\s/g, "").toLowerCase()}`}>
                <img
                  src={s.channelAvatar}
                  alt=""
                  className="size-9 rounded-full object-cover ring-2 ring-white/40"
                />
              </Link>
            )}
            <Link
              href="#"
              className="text-sm font-medium hover:underline truncate"
              onClick={(e) => e.stopPropagation()}
            >
              {s.channel}
            </Link>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSubscribed((s) => !s);
              }}
              className={`ml-1 rounded-full px-3 py-1 text-xs font-medium ${
                subscribed
                  ? "bg-yt-surface text-yt-text"
                  : "bg-yt-text text-yt-bg hover:bg-white/90"
              }`}
            >
              {subscribed ? "登録済み" : "登録"}
            </button>
          </div>
          <p className="text-sm font-medium line-clamp-2 mb-2">{s.title}</p>
          <div className="flex items-center gap-2 text-[11px] text-white/80">
            <MusicIcon className="size-3.5" />
            <span className="truncate animate-[scroll_12s_linear_infinite]">
              オリジナル楽曲 ・ {s.channel}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="absolute inset-x-0 bottom-0 h-1 bg-white/20">
          <div
            className="h-full bg-white"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Side actions */}
      <div className="flex flex-col items-center gap-4">
        <ActionBtn
          icon={<LikeIcon className={`size-6 ${liked ? "text-yt-red" : ""}`} />}
          label={liked ? "👍" : s.likes ?? "0"}
          onClick={() => {
            setLiked((v) => !v);
            if (disliked) setDisliked(false);
          }}
        />
        <ActionBtn
          icon={<DislikeIcon className={`size-6 ${disliked ? "text-yt-blue" : ""}`} />}
          label="低評価"
          onClick={() => {
            setDisliked((v) => !v);
            if (liked) setLiked(false);
          }}
        />
        <ActionBtn icon={<CommentSvg />} label={s.comments ?? "0"} />
        <ActionBtn icon={<ShareIcon className="size-6" />} label="共有" />
        <ActionBtn icon={<MoreIcon className="size-6" />} label="" />
        {/* Music disc */}
        <span
          className="grid size-12 place-items-center rounded-full bg-black border border-white/30 overflow-hidden animate-spin"
          style={{ animationDuration: "8s" }}
          aria-hidden
        >
          <img
            src={s.channelAvatar ?? s.thumbnail}
            alt=""
            className="size-9 rounded-full object-cover"
          />
        </span>
      </div>
    </div>
  );
}

function ActionBtn({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      className="flex flex-col items-center gap-1"
    >
      <span className="grid size-12 place-items-center rounded-full bg-yt-surface hover:bg-yt-surface-2">
        {icon}
      </span>
      {label && <span className="text-[11px] font-medium">{label}</span>}
    </button>
  );
}

function CommentSvg() {
  return (
    <svg viewBox="0 0 24 24" className="size-6" fill="currentColor">
      <path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1z" />
    </svg>
  );
}
