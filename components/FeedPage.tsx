import { VideoCard } from "./VideoCard";
import type { Video } from "@/lib/types";

export function FeedPage({
  title,
  subtitle,
  videos,
  icon,
  empty = "コンテンツがありません",
}: {
  title: string;
  subtitle?: string;
  videos: Video[];
  icon?: React.ReactNode;
  empty?: string;
}) {
  return (
    <div className="px-4 sm:px-6 pt-6 pb-12">
      <div className="mb-6 flex items-center gap-3">
        {icon}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">{title}</h1>
          {subtitle && (
            <p className="mt-1 text-sm text-yt-text-secondary">{subtitle}</p>
          )}
        </div>
      </div>
      {videos.length === 0 ? (
        <div className="py-24 text-center text-yt-text-secondary">{empty}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10">
          {videos.map((v) => (
            <VideoCard key={v.id} video={v} />
          ))}
        </div>
      )}
    </div>
  );
}
