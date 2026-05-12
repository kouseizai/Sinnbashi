import Link from "next/link";
import type { Video } from "../lib/types";
import { getChannel } from "../lib/mock";
import { ClockIcon, MoreIcon, SaveIcon, VerifiedIcon } from "./icons";

// Deterministic pseudo-random progress per video id for "watched %" indicator
function watchedPct(id: string): number | null {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  const bucket = h % 10;
  if (bucket < 4) return null; // 60% of cards: not watched
  return 15 + ((h >>> 4) % 70); // remaining: 15–85% progress
}

export function VideoCard({ video }: { video: Video }) {
  const channel = getChannel(video.channelId);
  const isLive = video.duration === "LIVE";
  const pct = isLive ? null : watchedPct(video.id);

  return (
    <div className="flex flex-col gap-3 group">
      <Link
        href={`/watch?v=${video.id}`}
        className="relative block aspect-video overflow-hidden rounded-xl bg-yt-surface"
      >
        <img
          src={video.thumbnail}
          alt={video.title}
          className="h-full w-full object-cover transition-transform group-hover:scale-[1.02]"
          loading="lazy"
        />

        {/* Hover overlay quick actions */}
        <span
          className="absolute right-2 top-2 hidden gap-1 group-hover:flex"
          aria-hidden
        >
          <span
            title="後で見る"
            className="grid size-8 place-items-center rounded-full bg-black/80 hover:bg-black text-white"
          >
            <ClockIcon className="size-4" />
          </span>
          <span
            title="再生キューに追加"
            className="grid size-8 place-items-center rounded-full bg-black/80 hover:bg-black text-white"
          >
            <SaveIcon className="size-4" />
          </span>
        </span>

        {/* Hover-only inline duration ("Watch later" style badge) */}
        <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-xs font-medium opacity-100 group-hover:opacity-0 transition-opacity">
          {isLive ? null : video.duration}
        </span>
        <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
          {isLive ? null : "後で見る動画として保存"}
        </span>

        {isLive && (
          <span className="absolute bottom-2 left-2 flex items-center gap-1 rounded bg-yt-red px-1.5 py-0.5 text-[11px] font-semibold uppercase">
            <span className="size-1.5 rounded-full bg-white animate-pulse" />
            ライブ配信中
          </span>
        )}

        {pct !== null && (
          <span className="absolute inset-x-0 bottom-0 h-1 bg-white/30">
            <span
              className="block h-full bg-yt-red"
              style={{ width: `${pct}%` }}
            />
          </span>
        )}
      </Link>
      <div className="flex gap-3">
        <Link href={`/channel/${video.channelId}`} className="shrink-0">
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
