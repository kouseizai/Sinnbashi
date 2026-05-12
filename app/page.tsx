import { ContinueWatchingRow } from "@/components/ContinueWatchingRow";
import { FilterChips } from "@/components/FilterChips";
import { ShortsRow } from "@/components/ShortsRow";
import { VideoCard } from "@/components/VideoCard";
import { getChannel, videos } from "@/lib/mock";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ chip?: string }>;
}) {
  const { chip } = await searchParams;

  const filtered = (() => {
    if (!chip || chip === "すべて") return videos;
    const q = chip.toLowerCase();
    return videos.filter((v) => {
      const channel = getChannel(v.channelId);
      const haystack = [
        v.title,
        v.description,
        v.category,
        channel?.name ?? "",
        channel?.handle ?? "",
      ]
        .join(" ")
        .toLowerCase();
      // year-style chip
      if (/^\d{4}$/.test(chip)) {
        return haystack.includes(chip);
      }
      if (chip === "ライブ") return v.duration === "LIVE";
      return haystack.includes(q);
    });
  })();

  const above = filtered.slice(0, 8);
  const below = filtered.slice(8);

  return (
    <div>
      <FilterChips />
      <div className="px-4 pt-4 pb-12">
        {filtered.length === 0 ? (
          <p className="py-24 text-center text-yt-text-secondary">
            「{chip}」に一致する動画はありません
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10">
            {above.map((v) => (
              <VideoCard key={v.id} video={v} />
            ))}
          </div>
        )}
      </div>
      {(!chip || chip === "すべて") && (
        <>
          <ContinueWatchingRow />
          <ShortsRow />
        </>
      )}
      {below.length > 0 && (
        <div className="px-4 pt-8 pb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10">
            {below.map((v) => (
              <VideoCard key={v.id} video={v} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
