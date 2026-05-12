import Link from "next/link";
import { ShortsIcon } from "@/components/icons";
import { shorts } from "@/lib/mock";

export default function ShortsPage() {
  return (
    <div className="px-4 sm:px-6 pt-6 pb-12">
      <div className="mb-6 flex items-center gap-3">
        <ShortsIcon className="size-9 text-yt-red" />
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">ショート</h1>
          <p className="mt-1 text-sm text-yt-text-secondary">
            縦型の短尺動画
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        {shorts.map((s) => (
          <Link
            key={s.id}
            href={`/shorts/${s.id}`}
            className="group relative overflow-hidden rounded-xl"
          >
            <img
              src={s.thumbnail}
              alt={s.title}
              className="w-full aspect-[9/16] object-cover transition-transform group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-3">
              <p className="line-clamp-2 text-sm font-medium">{s.title}</p>
              <p className="mt-1 text-xs text-white/80">{s.views} 回視聴</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
