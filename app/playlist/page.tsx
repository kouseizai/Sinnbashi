import Link from "next/link";
import { ClockIcon, PlayIcon } from "@/components/icons";
import { getChannel, videos } from "@/lib/mock";

export default async function PlaylistPage({
  searchParams,
}: {
  searchParams: Promise<{ list?: string }>;
}) {
  const { list } = await searchParams;
  const title = list === "WL" ? "後で見る" : "再生リスト";
  const items = videos.slice(0, 8);
  const total = items.reduce((acc, v) => acc + parseDur(v.duration), 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[360px_minmax(0,1fr)] gap-6 px-4 sm:px-6 pt-6 pb-12">
      {/* Playlist sidebar */}
      <aside className="lg:sticky lg:top-20 lg:self-start rounded-2xl overflow-hidden bg-gradient-to-b from-pink-900/40 to-zinc-900 p-5">
        <div
          className="aspect-video rounded-xl mb-4 bg-cover bg-center"
          style={{ backgroundImage: `url(${items[0]?.thumbnail})` }}
        />
        <h1 className="text-2xl font-bold leading-tight">{title}</h1>
        <p className="mt-2 text-sm text-yt-text-secondary">あなた ・ {items.length} 本の動画</p>
        <p className="mt-1 text-xs text-yt-text-secondary">合計 {fmtDur(total)}</p>
        <p className="mt-3 text-xs text-yt-text-secondary">非公開</p>
        <div className="mt-4 flex gap-2">
          <Link
            href={`/watch?v=${items[0]?.id}`}
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-yt-text text-yt-bg py-2 text-sm font-medium hover:bg-white/90"
          >
            <PlayIcon className="size-5" /> すべて再生
          </Link>
          <button className="rounded-full bg-yt-surface px-4 py-2 text-sm font-medium hover:bg-yt-surface-2">
            シャッフル
          </button>
        </div>
      </aside>

      <div>
        <div className="flex items-center gap-2 mb-4">
          <ClockIcon className="size-5" />
          <h2 className="text-lg font-bold">{items.length} 本</h2>
        </div>
        <div className="space-y-3">
          {items.map((v, i) => {
            const c = getChannel(v.channelId);
            return (
              <Link
                key={v.id}
                href={`/watch?v=${v.id}&list=${list ?? "PL"}`}
                className="group flex gap-3 rounded-lg p-2 hover:bg-yt-surface-2"
              >
                <span className="w-6 text-center text-sm text-yt-text-secondary self-center">
                  {i + 1}
                </span>
                <div className="relative shrink-0">
                  <img
                    src={v.thumbnail}
                    alt=""
                    className="w-[168px] aspect-video rounded-lg object-cover"
                  />
                  <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1 py-0.5 text-[11px] font-medium">
                    {v.duration}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="line-clamp-2 text-sm font-medium">{v.title}</h3>
                  <p className="mt-1 text-xs text-yt-text-secondary">{c?.name}</p>
                  <p className="text-xs text-yt-text-secondary">
                    {v.views} ・ {v.uploadedAt}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function parseDur(d: string): number {
  if (d === "LIVE") return 0;
  const parts = d.split(":").map(Number);
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return 0;
}

function fmtDur(sec: number): string {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  if (h > 0) return `${h}時間 ${m}分`;
  return `${m}分`;
}
