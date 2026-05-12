import { notFound } from "next/navigation";
import { WatchClient } from "@/components/WatchClient";
import { comments, getChannel, getVideo, videos } from "@/lib/mock";
import {
  chaptersByVideo,
  durationToSeconds,
  sampleSources,
} from "@/lib/extras";

export default async function WatchPage({
  searchParams,
}: {
  searchParams: Promise<{ v?: string }>;
}) {
  const { v } = await searchParams;
  const video = v ? getVideo(v) : videos[1];
  if (!video) notFound();

  const channel = getChannel(video.channelId);
  if (!channel) notFound();

  const chapters = chaptersByVideo[video.id] ?? [];
  const src = sampleSources[video.id] ?? sampleSources.v2;
  const durationSec = durationToSeconds(video.duration);

  return (
    <WatchClient
      video={video}
      channel={channel}
      chapters={chapters}
      src={src}
      durationSec={durationSec}
      comments={comments}
    />
  );
}
