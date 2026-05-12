"use client";

import type { Chapter } from "@/lib/extras";

function fmt(sec: number): string {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.floor(sec % 60);
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function ChapterList({
  chapters,
  currentTime,
  onJump,
}: {
  chapters: Chapter[];
  currentTime: number;
  onJump: (sec: number) => void;
}) {
  if (chapters.length === 0) return null;

  let activeIdx = 0;
  for (let i = 0; i < chapters.length; i++) {
    if (currentTime >= chapters[i].start) activeIdx = i;
  }

  return (
    <section className="rounded-xl bg-yt-surface overflow-hidden">
      <div className="px-4 py-3 flex items-center justify-between border-b border-yt-border">
        <div>
          <h2 className="font-medium text-yt-text text-sm">チャプター</h2>
          <div className="text-[11px] text-yt-text-secondary mt-0.5">
            N / P で次・前のチャプターへ
          </div>
        </div>
        <span className="text-xs text-yt-text-secondary">{chapters.length}個</span>
      </div>
      <div className="max-h-[440px] overflow-y-auto">
        {chapters.map((c, i) => {
          const active = i === activeIdx;
          return (
            <button
              key={i}
              onClick={() => onJump(c.start)}
              className={`w-full flex items-start gap-3 px-4 py-2.5 text-left transition-colors border-l-2 ${
                active
                  ? "bg-yt-surface-2 border-yt-blue"
                  : "border-transparent hover:bg-yt-surface-2"
              }`}
            >
              <span
                className={`text-xs tabular-nums shrink-0 w-12 mt-0.5 ${
                  active ? "text-yt-blue font-medium" : "text-yt-text-secondary"
                }`}
              >
                {fmt(c.start)}
              </span>
              <span
                className={`text-sm ${
                  active ? "text-yt-text font-medium" : "text-yt-text"
                }`}
              >
                {c.title}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
