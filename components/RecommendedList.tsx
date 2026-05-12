import Link from "next/link";
import { getChannel, videos } from "@/lib/mock";
import { MoreIcon } from "./icons";

export function RecommendedList({ currentId }: { currentId: string }) {
  const list = videos.filter((v) => v.id !== currentId);

  return (
    <aside className="flex flex-col gap-2">
      <div className="flex gap-2 mb-1">
        <button className="rounded-lg bg-yt-text px-3 py-1.5 text-sm font-medium text-yt-bg">
          すべて
        </button>
        <button className="rounded-lg bg-yt-surface px-3 py-1.5 text-sm hover:bg-yt-surface-2">
          関連動画
        </button>
        <button className="rounded-lg bg-yt-surface px-3 py-1.5 text-sm hover:bg-yt-surface-2">
          そのチャンネル
        </button>
      </div>
      {list.map((v) => {
        const channel = getChannel(v.channelId);
        const isLive = v.duration === "LIVE";
        return (
          <Link
            key={v.id}
            href={`/watch?v=${v.id}`}
            className="flex gap-2 group"
          >
            <div className="relative shrink-0">
              <img
                src={v.thumbnail}
                alt=""
                className="w-[168px] aspect-video rounded-lg object-cover"
                loading="lazy"
              />
              {isLive ? (
                <span className="absolute bottom-1 left-1 rounded bg-yt-red px-1 py-0.5 text-[10px] font-semibold">
                  ライブ
                </span>
              ) : (
                <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1 py-0.5 text-[11px] font-medium">
                  {v.duration}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="line-clamp-2 text-sm font-medium leading-snug">
                {v.title}
              </h3>
              <p className="mt-1 text-xs text-yt-text-secondary truncate">
                {channel?.name}
              </p>
              <p className="text-xs text-yt-text-secondary">
                {v.views} ・ {v.uploadedAt}
              </p>
            </div>
            <span
              className="p-1 h-fit -mt-1 hidden group-hover:block rounded-full hover:bg-yt-surface-2"
              aria-label="その他"
            >
              <MoreIcon className="size-5" />
            </span>
          </Link>
        );
      })}
    </aside>
  );
}
