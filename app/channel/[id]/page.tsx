import Link from "next/link";
import { notFound } from "next/navigation";
import { VideoCard } from "@/components/VideoCard";
import { LikeIcon, MoreIcon, VerifiedIcon } from "@/components/icons";
import { SubscribeButton } from "@/components/WatchActions";
import { getChannel, shorts, videos } from "@/lib/mock";

const tabs = [
  { id: "home", label: "ホーム" },
  { id: "videos", label: "動画" },
  { id: "shorts", label: "ショート" },
  { id: "live", label: "ライブ" },
  { id: "playlists", label: "再生リスト" },
  { id: "community", label: "コミュニティ" },
  { id: "about", label: "概要" },
];

export default async function ChannelPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { id } = await params;
  const { tab } = await searchParams;
  const channel = getChannel(id);
  if (!channel) notFound();

  const channelVideos = videos.filter((v) => v.channelId === id);
  const featured = channelVideos[0];
  const liveVideos = channelVideos.filter((v) => v.duration === "LIVE");
  const activeTab = tab ?? "home";

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
          <p className="mt-2 text-sm text-yt-text-secondary line-clamp-2 max-w-2xl">
            最新動画「{featured?.title ?? "—"}」をはじめ、ライブ映像やドキュメンタリーをお届けします。 ...<button className="text-yt-text font-medium">もっと見る</button>
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
      <div className="mt-6 border-b border-yt-border sticky top-14 bg-yt-bg z-20">
        <div className="px-4 sm:px-6 flex gap-6 overflow-x-auto no-scrollbar">
          {tabs.map((t) => (
            <Link
              key={t.id}
              href={t.id === "home" ? `/channel/${id}` : `/channel/${id}?tab=${t.id}`}
              scroll={false}
              className={`shrink-0 py-3 text-sm font-medium uppercase tracking-wide border-b-2 ${
                t.id === activeTab
                  ? "border-yt-text text-yt-text"
                  : "border-transparent text-yt-text-secondary hover:text-yt-text"
              }`}
            >
              {t.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="px-4 sm:px-6 mt-6">
        {activeTab === "home" && (
          <HomeTab
            channelId={id}
            featured={featured}
            videos={channelVideos.slice(0, 8)}
          />
        )}
        {activeTab === "videos" && (
          <VideosTab videos={channelVideos} />
        )}
        {activeTab === "shorts" && <ShortsTab />}
        {activeTab === "live" && <LiveTab videos={liveVideos} />}
        {activeTab === "playlists" && <PlaylistsTab />}
        {activeTab === "community" && <CommunityTab channel={channel} />}
        {activeTab === "about" && <AboutTab channel={channel} totalVideos={channelVideos.length} />}
      </div>
    </div>
  );
}

function HomeTab({
  channelId,
  featured,
  videos: list,
}: {
  channelId: string;
  featured?: (typeof videos)[number];
  videos: typeof videos;
}) {
  if (!featured) return <p className="py-12 text-center text-yt-text-secondary">動画がありません</p>;
  return (
    <>
      {/* Featured */}
      <div className="flex flex-col md:flex-row gap-6 pb-8 border-b border-yt-border">
        <Link
          href={`/watch?v=${featured.id}`}
          className="md:w-1/2 aspect-video rounded-xl overflow-hidden bg-yt-surface"
        >
          <img src={featured.thumbnail} alt={featured.title} className="w-full h-full object-cover" />
        </Link>
        <div className="md:w-1/2">
          <h2 className="text-lg font-bold">{featured.title}</h2>
          <p className="text-xs text-yt-text-secondary mt-1">
            {featured.views} ・ {featured.uploadedAt}
          </p>
          <p className="mt-3 text-sm text-yt-text-secondary line-clamp-4">
            {featured.description}
          </p>
        </div>
      </div>
      {/* Recent uploads */}
      <div className="mt-6">
        <h2 className="text-base font-medium mb-4">最近のアップロード <span className="text-yt-text-secondary text-sm">▸</span></h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10">
          {list.map((v) => <VideoCard key={v.id} video={v} />)}
        </div>
      </div>
    </>
  );
}

function VideosTab({ videos: list }: { videos: typeof videos }) {
  return (
    <>
      <div className="flex items-center gap-2 mb-4">
        {["最新", "人気", "古い順"].map((label, i) => (
          <button
            key={label}
            className={`rounded-lg px-3 py-1.5 text-sm ${
              i === 0
                ? "bg-yt-text text-yt-bg font-medium"
                : "bg-yt-surface hover:bg-yt-surface-2"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      {list.length === 0 ? (
        <p className="py-12 text-center text-yt-text-secondary">動画がありません</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10">
          {list.map((v) => <VideoCard key={v.id} video={v} />)}
        </div>
      )}
    </>
  );
}

function ShortsTab() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
      {shorts.map((s) => (
        <Link
          key={s.id}
          href={`/shorts/${s.id}`}
          className="relative overflow-hidden rounded-xl"
        >
          <img src={s.thumbnail} alt={s.title} className="w-full aspect-[9/16] object-cover" />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2">
            <p className="line-clamp-2 text-xs font-medium">{s.title}</p>
            <p className="mt-0.5 text-[10px] text-white/80">{s.views} 回視聴</p>
          </div>
        </Link>
      ))}
    </div>
  );
}

function LiveTab({ videos: list }: { videos: typeof videos }) {
  if (list.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-yt-text-secondary mb-4">現在ライブ配信中の動画はありません</p>
        <p className="text-xs text-yt-text-secondary">
          通知をオンにすると、ライブ配信開始時にお知らせします
        </p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10">
      {list.map((v) => <VideoCard key={v.id} video={v} />)}
    </div>
  );
}

function PlaylistsTab() {
  const playlists = [
    { name: "人気の動画", count: 24, thumb: "https://picsum.photos/seed/playlist-popular/640/360" },
    { name: "Next.js 完全攻略シリーズ", count: 18, thumb: "https://picsum.photos/seed/playlist-nextjs/640/360" },
    { name: "初心者向けチュートリアル", count: 11, thumb: "https://picsum.photos/seed/playlist-beginner/640/360" },
    { name: "ライブ配信アーカイブ", count: 14, thumb: "https://picsum.photos/seed/playlist-live/640/360" },
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10">
      {playlists.map((p) => (
        <div key={p.name} className="group">
          <div className="relative rounded-xl overflow-hidden">
            <img src={p.thumb} alt="" className="w-full aspect-video object-cover" />
            <div className="absolute inset-y-0 right-0 w-1/3 bg-black/80 flex flex-col items-center justify-center text-center">
              <p className="text-lg font-medium">{p.count}</p>
              <p className="text-[10px]">動画</p>
            </div>
          </div>
          <h3 className="mt-2 text-sm font-medium line-clamp-2">{p.name}</h3>
          <p className="text-xs text-yt-text-secondary mt-1">プレイリストを見る</p>
        </div>
      ))}
    </div>
  );
}

function CommunityTab({ channel }: { channel: { name: string; avatar: string } }) {
  const posts = [
    {
      time: "3 日前",
      text: "次回の動画、撮影が終わりました！来週の土曜21時公開予定です。お楽しみに 🎬",
      likes: "8.4万",
    },
    {
      time: "1 週間前",
      text: "コミュニティの皆さんに質問！次に取り上げてほしいトピックは？\nA: パフォーマンス最適化\nB: テスト戦略\nC: デザインシステム",
      likes: "12万",
    },
    {
      time: "2 週間前",
      text: "1万人達成ありがとうございます🙏 引き続き役立つ動画をお届けします。",
      likes: "5.2万",
    },
  ];
  return (
    <div className="max-w-3xl space-y-6">
      {posts.map((p, i) => (
        <article key={i} className="rounded-xl bg-yt-surface p-4">
          <header className="flex items-center gap-3 mb-3">
            <img src={channel.avatar} alt="" className="size-10 rounded-full object-cover" />
            <div>
              <p className="text-sm font-medium">{channel.name}</p>
              <p className="text-xs text-yt-text-secondary">{p.time}</p>
            </div>
            <button className="ml-auto rounded-full p-1.5 hover:bg-yt-surface-2">
              <MoreIcon className="size-5" />
            </button>
          </header>
          <p className="text-sm whitespace-pre-wrap leading-relaxed">{p.text}</p>
          <footer className="mt-3 flex items-center gap-4 text-yt-text-secondary">
            <button className="flex items-center gap-1 hover:text-yt-text">
              <LikeIcon className="size-5" />
              <span className="text-xs">{p.likes}</span>
            </button>
            <button className="text-xs hover:text-yt-text">コメント</button>
          </footer>
        </article>
      ))}
    </div>
  );
}

function AboutTab({
  channel,
  totalVideos,
}: {
  channel: { name: string; handle: string; subscribers: string };
  totalVideos: number;
}) {
  return (
    <div className="max-w-3xl">
      <div className="rounded-xl bg-yt-surface p-6 space-y-4">
        <div>
          <h2 className="text-sm font-medium mb-2">概要</h2>
          <p className="text-sm text-yt-text-secondary whitespace-pre-wrap leading-relaxed">
            {channel.name} 公式チャンネル。ミュージックビデオ、ライブ映像、最新作の情報をお届けします。
            {"\n\n"}
            お仕事のお問い合わせ: contact@example.com
          </p>
        </div>
        <div className="border-t border-yt-border pt-4">
          <h2 className="text-sm font-medium mb-2">リンク</h2>
          <ul className="space-y-2 text-sm">
            <li className="flex gap-3"><span className="text-yt-text-secondary w-24">公式サイト</span><a className="text-yt-blue hover:underline" href="#">kronekodow.com</a></li>
            <li className="flex gap-3"><span className="text-yt-text-secondary w-24">X (Twitter)</span><a className="text-yt-blue hover:underline" href="#">{channel.handle}</a></li>
            <li className="flex gap-3"><span className="text-yt-text-secondary w-24">Instagram</span><a className="text-yt-blue hover:underline" href="#">@official_account</a></li>
          </ul>
        </div>
        <div className="border-t border-yt-border pt-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-yt-text-secondary">登録者</p>
            <p className="font-medium">{channel.subscribers}</p>
          </div>
          <div>
            <p className="text-yt-text-secondary">動画</p>
            <p className="font-medium">{totalVideos}</p>
          </div>
          <div>
            <p className="text-yt-text-secondary">合計視聴回数</p>
            <p className="font-medium">8.2 億回</p>
          </div>
          <div>
            <p className="text-yt-text-secondary">登録日</p>
            <p className="font-medium">2008/04/12</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function seedColor(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return `hsl(${h % 360} 60% 25%)`;
}
