"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { ChevronRightIcon, MoreIcon, ShortsIcon } from "./icons";
import { shorts } from "@/lib/mock";
import type { Short } from "@/lib/types";

const accentClass: Record<NonNullable<Short["accent"]>, string> = {
  yellow: "text-[#FFE000]",
  white: "text-white",
  red: "text-[#FF3D3D]",
  cyan: "text-[#3EE0FF]",
  lime: "text-[#A9F23A]",
};

export function ShortsRow() {
  const scroller = useRef<HTMLDivElement>(null);

  return (
    <section className="px-4 py-4 border-y border-yt-border">
      <div className="flex items-center gap-2 mb-3">
        <ShortsIcon className="size-7 text-yt-red" />
        <h2 className="text-xl font-bold">ショート</h2>
        <Link
          href="/shorts"
          className="ml-auto text-sm text-yt-text-secondary hover:text-yt-text px-3 py-1 rounded-full hover:bg-yt-surface-2"
        >
          すべて表示
        </Link>
      </div>
      <div className="relative">
        <div
          ref={scroller}
          className="no-scrollbar flex gap-2 overflow-x-auto scroll-smooth"
        >
          {shorts.map((s) => (
            <ShortCard key={s.id} short={s} />
          ))}
        </div>
        <button
          onClick={() =>
            scroller.current?.scrollBy({ left: 600, behavior: "smooth" })
          }
          className="absolute right-0 top-1/2 -translate-y-1/2 hidden sm:flex h-10 w-10 items-center justify-center rounded-full bg-yt-surface ring-1 ring-yt-border hover:bg-yt-surface-2 shadow-lg"
          aria-label="次のショート"
        >
          <ChevronRightIcon className="size-5" />
        </button>
      </div>
    </section>
  );
}

function ShortCard({ short: s }: { short: Short }) {
  const [hover, setHover] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const accent = accentClass[s.accent ?? "white"];

  return (
    <Link
      href={`/shorts/${s.id}`}
      onMouseEnter={() => {
        setHover(true);
        videoRef.current?.play().catch(() => {});
      }}
      onMouseLeave={() => {
        setHover(false);
        videoRef.current?.pause();
        if (videoRef.current) videoRef.current.currentTime = 0;
      }}
      className="group relative shrink-0 w-[210px] aspect-[9/16] overflow-hidden rounded-xl bg-black"
    >
      {/* Thumbnail */}
      <img
        src={s.thumbnail}
        alt=""
        className={`absolute inset-0 h-full w-full object-cover transition-opacity ${hover ? "opacity-0" : "opacity-100"}`}
        loading="lazy"
      />
      {/* Hover preview video */}
      {s.src && (
        <video
          ref={videoRef}
          src={s.src}
          muted
          loop
          playsInline
          preload="metadata"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity ${hover ? "opacity-100" : "opacity-0"}`}
        />
      )}

      {/* Top gradient + tag */}
      <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/70 to-transparent pointer-events-none" />
      {s.tag && (
        <span className="absolute top-2 left-2 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-medium backdrop-blur-sm">
          {s.tag}
        </span>
      )}
      <button
        className="absolute top-2 right-2 grid size-7 place-items-center rounded-full bg-black/60 hover:bg-black/80 opacity-0 group-hover:opacity-100"
        aria-label="その他"
        onClick={(e) => e.preventDefault()}
      >
        <MoreIcon className="size-4" />
      </button>

      {/* Bold overlay text */}
      {s.bigText && (
        <div
          className={`absolute inset-x-3 top-10 text-center font-black uppercase whitespace-pre-line leading-[0.95] tracking-tight ${accent}`}
          style={{
            fontSize: "1.85rem",
            textShadow:
              "0 2px 4px rgba(0,0,0,0.7), 0 0 1px rgba(0,0,0,0.9), -1px -1px 0 rgba(0,0,0,0.4)",
            WebkitTextStroke: "0.5px rgba(0,0,0,0.6)",
          }}
        >
          {s.bigText}
        </div>
      )}

      {/* Bottom gradient + meta */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-3 pt-10">
        <p className="line-clamp-2 text-[13px] font-medium leading-snug">{s.title}</p>
        <div className="mt-1.5 flex items-center gap-1 text-[11px] text-white/80">
          <svg viewBox="0 0 24 24" className="size-3.5" fill="currentColor">
            <path d="M12 4.5C7 4.5 2.7 7.6 1 12c1.7 4.4 6 7.5 11 7.5s9.3-3.1 11-7.5C21.3 7.6 17 4.5 12 4.5zm0 12.5a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0-8a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
          </svg>
          {s.views} 回視聴
        </div>
      </div>
    </Link>
  );
}
