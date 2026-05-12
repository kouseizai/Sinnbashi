import Link from "next/link";
import type { Video } from "../lib/types";
import { getChannel } from "../lib/mock";
import { MoreIcon, VerifiedIcon } from "./icons";

export function VideoCard({ video }: { video: Video }) {
  const channel = getChannel(video.channelId);
  const isLive = video.duration === "LIVE";

  return (
    <div className="flex flex-col gap-3 group">
      <Link
        href={`/watch?v=${video.id}`}
        className="relative block aspect-video overflow-hidden rounded-xl bg-yt-surface"
      >
        <img
          src={video.thumbnail}
          alt={video.title}
          className="h-full w-full object-cover transition-transform"
          loading="lazy"
        />
        {isLive ? (
          <span className="absolute bottom-2 left-2 flex items-center gap-1 rounded bg-yt-red px-1.5 py-0.5 text-[11px] font-semibold uppercase">
            <span className="size-1.5 rounded-full bg-white" />
            ライブ配信中
          </span>
        ) : (
          <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-xs font-medium">
            {video.duration}
          </span>
        )}
      </Link>
      <div className="flex gap-3">
        <Link
          href={`/channel/${video.channelId}`}
          className="shrink-0"
        >
          <img
            src={channel?.avatar}
            alt={channel?.name}
            className="size-9 rounded-full object-cover"
          />
        </Link>
        <div className="flex-1 min-w-0">
          <Link href={`/watch?v=${video.id}`}>
            <h3 className="line-clamp-2 text-sm font-medium leading-snug">
              {video.title}
            </h3>
          </Link>
          <Link
            href={`/channel/${video.channelId}`}
            className="mt-1 flex items-center gap-1 text-xs text-yt-text-secondary hover:text-yt-text"
          >
            <span className="truncate">{channel?.name}</span>
            {channel?.verified && (
              <VerifiedIcon className="size-3 text-yt-text-secondary" />
            )}
          </Link>
          <div className="text-xs text-yt-text-secondary">
            {video.views} ・ {video.uploadedAt}
          </div>
        </div>
        <button
          className="hidden group-hover:block p-1 -m-1 h-fit rounded-full hover:bg-yt-surface-2"
          aria-label="その他"
        >
          <MoreIcon className="size-5" />
        </button>
      </div>
    </div>
  );
}
