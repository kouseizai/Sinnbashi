"use client";

import { useRef, useState } from "react";
import { EnhancedPlayer, type EnhancedPlayerHandle } from "./EnhancedPlayer";
import { ChapterList } from "./ChapterList";
import { Comments } from "./Comments";
import { DescriptionCard } from "./DescriptionCard";
import { LiveChat } from "./LiveChat";
import { RecommendedList } from "./RecommendedList";
import { SubscribeButton, WatchActions } from "./WatchActions";
import { VerifiedIcon } from "./icons";
import type { Channel, Comment, Video } from "@/lib/types";
import type { Chapter } from "@/lib/extras";

function hashtagsFor(video: { title: string; category: string }): string[] {
  const tags = new Set<string>();
  const t = video.title.toLowerCase();
  if (t.includes("next.js")) tags.add("#nextjs");
  if (t.includes("typescript")) tags.add("#typescript");
  if (t.includes("lo-fi") || t.includes("lofi")) tags.add("#lofi");
  if (t.includes("minecraft")) tags.add("#minecraft");
  if (t.includes("elden")) tags.add("#eldenring");
  if (t.includes("4k")) tags.add("#4k");
  if (t.includes("ライブ") || t.includes("live")) tags.add("#live");
  // category fallback
  const catTag: Record<string, string> = {
    Tech: "#programming",
    Music: "#music",
    Gaming: "#gaming",
    Cooking: "#cooking",
    Travel: "#travel",
    Science: "#science",
    Fitness: "#fitness",
    Live: "#live",
  };
  if (catTag[video.category]) tags.add(catTag[video.category]);
  tags.add("#shorts");
  return Array.from(tags).slice(0, 3);
}

type Props = {
  video: Video;
  channel: Channel;
  chapters: Chapter[];
  src: string;
  durationSec: number;
  comments: Comment[];
};

export function WatchClient({
  video,
  channel,
  chapters,
  src,
  durationSec,
  comments,
}: Props) {
  const playerRef = useRef<EnhancedPlayerHandle>(null);
  const [currentTime, setCurrentTime] = useState(0);

  const seek = (sec: number) => {
    playerRef.current?.seek(sec);
    setCurrentTime(sec);
  };

  return (
    <div className="grid grid-cols-1 gap-6 px-4 pt-6 pb-12 xl:grid-cols-[minmax(0,1fr)_402px]">
      <div className="max-w-[1280px] min-w-0">
        <EnhancedPlayer
          ref={playerRef}
          src={src}
          poster={video.thumbnail.replace("/640/360", "/1280/720")}
          chapters={chapters}
          durationSec={durationSec || undefined}
          onTimeUpdate={setCurrentTime}
        />

        <div className="mt-3 flex gap-2 text-sm text-yt-blue">
          {hashtagsFor(video).map((tag) => (
            <a
              key={tag}
              href={`/search?q=${encodeURIComponent(tag)}`}
              className="hover:underline"
            >
              {tag}
            </a>
          ))}
        </div>
        <h1 className="mt-1 text-xl font-bold leading-snug">{video.title}</h1>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span
              className={`relative size-10 shrink-0 rounded-full ${video.duration === "LIVE" ? "ring-2 ring-yt-red ring-offset-2 ring-offset-yt-bg" : ""}`}
            >
              <img
                src={channel.avatar}
                alt={channel.name}
                className="size-full rounded-full object-cover"
              />
              {video.duration === "LIVE" && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded bg-yt-red px-1 text-[9px] font-bold tracking-wider">
                  ライブ
                </span>
              )}
            </span>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-medium">{channel.name}</span>
                {channel.verified && (
                  <VerifiedIcon className="size-3.5 text-yt-text-secondary" />
                )}
              </div>
              <p className="text-xs text-yt-text-secondary">
                チャンネル登録者数 {channel.subscribers}
              </p>
            </div>
            <SubscribeButton />
          </div>
          <WatchActions
            initialLikes={video.likes}
            videoId={video.id}
            videoTitle={video.title}
          />
        </div>

        <div className="mt-4">
          <DescriptionCard
            views={video.views}
            uploadedAt={video.uploadedAt}
            description={video.description}
          />
        </div>

        {chapters.length > 0 && (
          <div className="mt-4 xl:hidden">
            <ChapterList
              chapters={chapters}
              currentTime={currentTime}
              onJump={seek}
            />
          </div>
        )}

        <div className="mt-6 xl:hidden">
          <h2 className="mb-3 text-lg font-bold">関連動画</h2>
          <RecommendedList currentId={video.id} />
        </div>

        <div className="mt-6">
          <Comments initialComments={comments} onSeek={seek} />
        </div>
      </div>

      <div className="hidden xl:block space-y-4">
        {video.duration === "LIVE" && <LiveChat />}
        {chapters.length > 0 && (
          <ChapterList
            chapters={chapters}
            currentTime={currentTime}
            onJump={seek}
          />
        )}
        <RecommendedList currentId={video.id} />
      </div>
    </div>
  );
}
