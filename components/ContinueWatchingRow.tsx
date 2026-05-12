import Link from "next/link";
import { ClockIcon } from "./icons";
import { getChannel, videos } from "@/lib/mock";

export function ContinueWatchingRow() {
  // Use a deterministic subset: items 1, 5, 8, 11 (indexes)
  const list = [videos[1], videos[5], videos[8], videos[11]].filter(Boolean);

  return (
    <section className="px-4 py-4 border-y border-yt-border">
      <div className="flex items-center gap-2 mb-3">
        <ClockIcon className="size-6" />
        <h2 className="text-xl font-bold">続きを見る</h2>
      </div>
      <div className="no-scrollbar flex gap-3 overflow-x-auto">
        {list.map((v, i) => {
          const channel = getChannel(v.channelId);
          const progress = [38, 62, 22, 88][i];
          return (
            <Link
              key={v.id}
              href={`/watch?v=${v.id}`}
              className="group shrink-0 w-[300px]"
            >
              <div className="relative aspect-video overflow-hidden rounded-xl">
                <img
                  src={v.thumbnail}
                  alt=""
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-xs font-medium">
                  {v.duration}
                </span>
                <span className="absolute inset-x-0 bottom-0 h-1 bg-white/30">
                  <span
                    className="block h-full bg-yt-red"
                    style={{ width: `${progress}%` }}
                  />
                </span>
              </div>
              <h3 className="mt-2 line-clamp-2 text-sm font-medium leading-snug">
                {v.title}
              </h3>
              <p className="mt-0.5 text-xs text-yt-text-secondary truncate">
                {channel?.name}
              </p>
              <p className="text-xs text-yt-text-secondary">{progress}% 視聴済み</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
