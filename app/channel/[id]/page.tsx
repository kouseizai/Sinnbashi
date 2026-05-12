import Link from "next/link";
import { notFound } from "next/navigation";
import { VideoCard } from "@/components/VideoCard";
import { VerifiedIcon } from "@/components/icons";
import { SubscribeButton } from "@/components/WatchActions";
import { getChannel, videos } from "@/lib/mock";

const tabs = ["ホーム", "動画", "ショート", "ライブ", "再生リスト", "コミュニティ", "概要"];

export default async function ChannelPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const channel = getChannel(id);
  if (!channel) notFound();

  const channelVideos = videos.filter((v) => v.channelId === id);
  const featured = channelVideos[0];

  return (
    <div className="pb-12">
      {/* Banner */}
      <div className="px-4 sm:px-6 pt-4">
        <div
          className="h-32 sm:h-48 lg:h-60 w-full rounded-2xl"
          style={{
            background: `linear-gradient(135deg, ${seedColor(channel.id)}, #0f0f0f 80%)`,
          }}
        />
      </div>

      {/* Header */}
      <div className="px-4 sm:px-6 mt-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
        <img
          src={channel.avatar}
          alt={channel.name}
          className="size-28 sm:size-36 rounded-full object-cover"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-3xl sm:text-4xl font-bold">{channel.name}</h1>
            {channel.verified && (
              <VerifiedIcon className="size-5 text-yt-text-secondary" />
            )}
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-yt-text-secondary">
            <span className="text-yt-text font-medium">{channel.handle}</span>
            <span>・</span>
            <span>チャンネル登録者数 {channel.subscribers}人</span>
            <span>・</span>
            <span>{channelVideos.length} 本の動画</span>
          </div>
          <p className="mt-2 text-sm text-yt-text-secondary">
            「{featured?.title ?? "—"}」 ほか
          </p>
          <div className="mt-4 flex gap-2">
            <SubscribeButton />
            <button className="rounded-full bg-yt-surface px-4 py-2 text-sm font-medium hover:bg-yt-surface-2">
              参加
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6 border-b border-yt-border">
        <div className="px-4 sm:px-6 flex gap-6 overflow-x-auto no-scrollbar">
          {tabs.map((t, i) => (
            <Link
              key={t}
              href="#"
              className={`shrink-0 py-3 text-sm font-medium border-b-2 ${
                i === 1
                  ? "border-yt-text"
                  : "border-transparent text-yt-text-secondary hover:text-yt-text"
              }`}
            >
              {t}
            </Link>
          ))}
        </div>
      </div>

      {/* Videos */}
      <div className="px-4 sm:px-6 mt-6">
        <h2 className="text-lg font-bold mb-4">動画</h2>
        {channelVideos.length === 0 ? (
          <p className="py-12 text-center text-yt-text-secondary">
            このチャンネルにはまだ動画がありません
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10">
            {channelVideos.map((v) => (
              <VideoCard key={v.id} video={v} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function seedColor(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return `hsl(${h % 360} 60% 25%)`;
}
