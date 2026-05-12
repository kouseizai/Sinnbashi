import Link from "next/link";
import { ShortsIcon } from "./icons";
import { shorts } from "../lib/mock";

export function ShortsRow() {
  return (
    <section className="px-4 py-4 border-y border-yt-border">
      <div className="flex items-center gap-2 mb-3">
        <ShortsIcon className="size-7 text-yt-red" />
        <h2 className="text-xl font-bold">ショート</h2>
      </div>
      <div className="no-scrollbar flex gap-2 overflow-x-auto">
        {shorts.map((s) => (
          <Link
            key={s.id}
            href={`/shorts/${s.id}`}
            className="group relative shrink-0 w-[210px] overflow-hidden rounded-xl"
          >
            <img
              src={s.thumbnail}
              alt={s.title}
              className="h-[372px] w-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-3">
              <p className="line-clamp-2 text-sm font-medium">{s.title}</p>
              <p className="mt-1 text-xs text-white/80">{s.views} 回視聴</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
