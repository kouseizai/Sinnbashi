import { FeedPage } from "@/components/FeedPage";
import {
  ClockIcon,
  FilmIcon,
  HistoryIcon,
  LibraryIcon,
  LiveIcon,
  MusicIcon,
  NewsIcon,
  ShoppingIcon,
  SportsIcon,
  SubsIcon,
  TrendingIcon,
} from "@/components/icons";
import { videos } from "@/lib/mock";

type Config = {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
};

const CFG: Record<string, Config> = {
  trending: {
    title: "急上昇",
    subtitle: "今 最も視聴されている動画",
    icon: <TrendingIcon className="size-9 text-yt-red" />,
  },
  subscriptions: {
    title: "登録チャンネル",
    subtitle: "新しい動画から表示しています",
    icon: <SubsIcon className="size-9" />,
  },
  history: {
    title: "再生履歴",
    subtitle: "最近視聴した動画",
    icon: <HistoryIcon className="size-9" />,
  },
  library: {
    title: "ライブラリ",
    icon: <LibraryIcon className="size-9" />,
  },
  playlists: {
    title: "再生リスト",
    icon: <LibraryIcon className="size-9" />,
  },
  music: {
    title: "音楽",
    icon: <MusicIcon className="size-9 text-yt-red" />,
  },
  movies: {
    title: "映画",
    icon: <FilmIcon className="size-9" />,
  },
  live: {
    title: "ライブ",
    icon: <LiveIcon className="size-9 text-yt-red" />,
  },
  news: {
    title: "ニュース",
    icon: <NewsIcon className="size-9" />,
  },
  sports: {
    title: "スポーツ",
    icon: <SportsIcon className="size-9" />,
  },
  shopping: {
    title: "ショッピング",
    icon: <ShoppingIcon className="size-9" />,
  },
  watchlater: {
    title: "後で見る",
    icon: <ClockIcon className="size-9" />,
  },
};

export default async function FeedSlug({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cfg = CFG[slug] ?? {
    title: slug,
    icon: <LibraryIcon className="size-9" />,
  };

  // History: reverse to feel chronological. Subs: filter to top channels. Others: all.
  let list = videos;
  if (slug === "history") list = [...videos].reverse();
  if (slug === "subscriptions")
    list = videos.filter((v) =>
      ["ch-ringo", "ch-jihen", "ch-umj"].includes(v.channelId)
    );
  if (slug === "live") list = videos.filter((v) => v.duration === "LIVE");

  return (
    <FeedPage
      title={cfg.title}
      subtitle={cfg.subtitle}
      videos={list}
      icon={cfg.icon}
      empty={
        slug === "live"
          ? "現在ライブ配信中の動画はありません"
          : "コンテンツがありません"
      }
    />
  );
}
