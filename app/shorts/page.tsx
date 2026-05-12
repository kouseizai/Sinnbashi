import Link from "next/link";
import { MoreIcon, ShortsIcon } from "@/components/icons";
import { shorts } from "@/lib/mock";
import type { Short } from "@/lib/types";

const accentClass: Record<NonNullable<Short["accent"]>, string> = {
  yellow: "text-[#FFE000]",
  white: "text-white",
  red: "text-[#FF3D3D]",
  cyan: "text-[#3EE0FF]",
  lime: "text-[#A9F23A]",
};

export default function ShortsPage() {
  return (
    <div className="px-4 sm:px-6 pt-6 pb-12">
      <div className="mb-6 flex items-center gap-3">
        <ShortsIcon className="size-9 text-yt-red" />
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">ショート</h1>
          <p className="mt-1 text-sm text-yt-text-secondary">縦型の短尺動画</p>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        {shorts.map((s) => (
          <ShortGridCard key={s.id} short={s} />
        ))}
      </div>
    </div>
  );
}

function ShortGridCard({ short: s }: { short: Short }) {
  const accent = accentClass[s.accent ?? "white"];
  return (
    <Link
      href={`/shorts/${s.id}`}
      className="group relative block overflow-hidden rounded-xl bg-black aspect-[9/16]"
    >
      <img
        src={s.thumbnail}
        alt=""
        className="absolute inset-0 h-full w-full object-cover transition-transform group-hover:scale-105"
        loading="lazy"
      />
      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/70 to-transparent pointer-events-none" />
      {s.tag && (
        <span className="absolute top-2 left-2 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-medium backdrop-blur-sm">
          {s.tag}
        </span>
      )}
      <span
        className="absolute top-2 right-2 grid size-7 place-items-center rounded-full bg-black/60 hover:bg-black/80 opacity-0 group-hover:opacity-100"
        aria-label="その他"
      >
        <MoreIcon className="size-4" />
      </span>
      {s.bigText && (
        <div
          className={`absolute inset-x-3 top-10 text-center font-black uppercase whitespace-pre-line leading-[0.95] tracking-tight ${accent}`}
          style={{
            fontSize: "1.65rem",
            textShadow: "0 2px 4px rgba(0,0,0,0.7), 0 0 1px rgba(0,0,0,0.9)",
            WebkitTextStroke: "0.5px rgba(0,0,0,0.6)",
          }}
        >
          {s.bigText}
        </div>
      )}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-3 pt-10">
        <p className="line-clamp-2 text-[13px] font-medium leading-snug">{s.title}</p>
        <div className="mt-1 flex items-center gap-1 text-[11px] text-white/80">
          <svg viewBox="0 0 24 24" className="size-3.5" fill="currentColor">
            <path d="M12 4.5C7 4.5 2.7 7.6 1 12c1.7 4.4 6 7.5 11 7.5s9.3-3.1 11-7.5C21.3 7.6 17 4.5 12 4.5zm0 12.5a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0-8a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
          </svg>
          {s.views} 回視聴
        </div>
      </div>
    </Link>
  );
}
