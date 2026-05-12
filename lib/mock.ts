import type { Channel, Comment, Short, Video } from "./types";

const yt = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

export const channels: Channel[] = [
  {
    id: "ch-ringo",
    name: "椎名林檎",
    handle: "@SheenaRingo",
    avatar: "https://picsum.photos/seed/ringo-avatar/96/96",
    subscribers: "98.2万",
    verified: true,
  },
  {
    id: "ch-jihen",
    name: "東京事変",
    handle: "@TokyoJihen",
    avatar: "https://picsum.photos/seed/jihen-avatar/96/96",
    subscribers: "67.4万",
    verified: true,
  },
  {
    id: "ch-umj",
    name: "Universal Music Japan",
    handle: "@UniversalMusicJapan",
    avatar: "https://picsum.photos/seed/umj-avatar/96/96",
    subscribers: "412万",
    verified: true,
  },
  {
    id: "ch-emi",
    name: "EMI Records Japan",
    handle: "@EMIRecordsJapan",
    avatar: "https://picsum.photos/seed/emi-avatar/96/96",
    subscribers: "184万",
    verified: true,
  },
  {
    id: "ch-natalie",
    name: "音楽ナタリー",
    handle: "@natalie_music",
    avatar: "https://picsum.photos/seed/natalie-avatar/96/96",
    subscribers: "32.1万",
    verified: true,
  },
  {
    id: "ch-fan",
    name: "林檎博コレクション",
    handle: "@ringohaku",
    avatar: "https://picsum.photos/seed/fan-avatar/96/96",
    subscribers: "12.8万",
  },
];

export const videos: Video[] = [
  {
    id: "v1",
    title: "椎名林檎 - 罪と罰",
    thumbnail: yt("dSXvVmwJxh4"),
    duration: "4:36",
    views: "8,742万 回視聴",
    uploadedAt: "12 年前",
    channelId: "ch-ringo",
    description:
      "椎名林檎 6th シングル「罪と罰」(2000年1月26日リリース) のミュージックビデオ。雪降る夜の都会で歌い上げる、彼女の代表作のひとつ。",
    likes: "62万",
    category: "Music",
  },
  {
    id: "v2",
    title: "椎名林檎 - 丸の内サディスティック",
    thumbnail: yt("4tlUwgtgdZA"),
    duration: "4:32",
    views: "1.2 億 回視聴",
    uploadedAt: "9 年前",
    channelId: "ch-umj",
    description:
      "アルバム『無罪モラトリアム』(1999) 収録。後にカバー・リミックスが多数生まれ、令和の今も歌い継がれる名曲。",
    likes: "94万",
    category: "Music",
  },
  {
    id: "v3",
    title: "椎名林檎 - 本能",
    thumbnail: yt("ECxBHhMc7oI"),
    duration: "4:53",
    views: "9,418万 回視聴",
    uploadedAt: "11 年前",
    channelId: "ch-ringo",
    description:
      "1999年10月27日リリースの 4th シングル「本能」。看護師姿で割れたガラスを蹴り破る、伝説のミュージックビデオ。",
    likes: "78万",
    category: "Music",
  },
  {
    id: "v4",
    title: "椎名林檎 - 長く短い祭",
    thumbnail: yt("3LVAmMxICoA"),
    duration: "4:13",
    views: "4,827万 回視聴",
    uploadedAt: "10 年前",
    channelId: "ch-umj",
    description:
      "2015年配信限定シングル。コカ・コーラ「2015 Summer Campaign」CMソング。浮雲との掛け合いが印象的な祭ばやし。",
    likes: "41万",
    category: "Music",
  },
  {
    id: "v5",
    title: "椎名林檎 - 神様、仏様",
    thumbnail: yt("IZs1-CiqUj4"),
    duration: "5:14",
    views: "3,612万 回視聴",
    uploadedAt: "10 年前",
    channelId: "ch-umj",
    description:
      "「長く短い祭」と同時公開された両A面曲。和装の演者たちと百鬼夜行をモチーフにした世界観。",
    likes: "32万",
    category: "Music",
  },
  {
    id: "v6",
    title: "椎名林檎 - NIPPON",
    thumbnail: yt("p-RLC9ZgjhY"),
    duration: "4:35",
    views: "5,283万 回視聴",
    uploadedAt: "11 年前",
    channelId: "ch-ringo",
    description:
      "NHK 2014 FIFA ワールドカップ放送テーマソング。日の丸を背負い、世界に向かって歌うアスリート讃歌。",
    likes: "48万",
    category: "Music",
  },
  {
    id: "v7",
    title: "椎名林檎 - 鶏と蛇と豚",
    thumbnail: yt("u77yCRwSCXg"),
    duration: "5:38",
    views: "2,941万 回視聴",
    uploadedAt: "5 年前",
    channelId: "ch-umj",
    description:
      "アルバム『三毒史』(2019) のオープニング曲。三毒——貪欲・瞋恚・愚痴を象徴する獣たちが舞う、ジャズ調の楽曲。",
    likes: "24万",
    category: "Music",
  },
  {
    id: "v8",
    title: "椎名林檎 - 公然の秘密",
    thumbnail: yt("ETtDJz9t09U"),
    duration: "5:14",
    views: "1,872万 回視聴",
    uploadedAt: "3 年前",
    channelId: "ch-ringo",
    description:
      "ベストアルバム『百薬の長』(2023) 収録。誰もが薄々気づいている事実を、艶やかに歌い上げる新境地。",
    likes: "18万",
    category: "Music",
  },
  {
    id: "v9",
    title: "椎名林檎 - 人間として",
    thumbnail: yt("vrXKWRELGQs"),
    duration: "4:47",
    views: "1,124万 回視聴",
    uploadedAt: "2 年前",
    channelId: "ch-ringo",
    description:
      "2024年配信シングル。人間であることの不器用さと美しさを、ストリングスに乗せて歌う一曲。",
    likes: "12万",
    category: "Music",
  },
  {
    id: "v10",
    title: "椎名林檎 - 松に鶴",
    thumbnail: yt("3eQWfkA1cGc"),
    duration: "4:30",
    views: "684万 回視聴",
    uploadedAt: "10 か月前",
    channelId: "ch-ringo",
    description:
      "2025年配信シングル。日本の伝統文様「松に鶴」をモチーフに、清廉な祝祭感を湛えた新曲。",
    likes: "8.4万",
    category: "Music",
  },
  {
    id: "v11",
    title: "椎名林檎 - 白日のもと",
    thumbnail: yt("6feOXhluBfk"),
    duration: "4:18",
    views: "512万 回視聴",
    uploadedAt: "9 か月前",
    channelId: "ch-ringo",
    description:
      "2025年8月配信。真昼の光を浴びながら、隠していた本音を晒す——内省と告白の楽曲。",
    likes: "6.2万",
    category: "Music",
  },
  {
    id: "v12",
    title: "椎名林檎 - 芒に月",
    thumbnail: yt("0YzLEB4e_2c"),
    duration: "4:42",
    views: "428万 回視聴",
    uploadedAt: "11 か月前",
    channelId: "ch-ringo",
    description:
      "2025年6月配信。秋の夜長、月光に揺れる芒の野を歩くような幽玄な世界観。",
    likes: "5.7万",
    category: "Music",
  },
];

export const shorts: Short[] = [
  {
    id: "s1",
    title: "丸の内サディスティック イントロ #shorts",
    thumbnail: yt("4tlUwgtgdZA"),
    views: "284万",
  },
  {
    id: "s2",
    title: "本能 サビ 15秒",
    thumbnail: yt("ECxBHhMc7oI"),
    views: "612万",
  },
  {
    id: "s3",
    title: "罪と罰 ラストの叫び",
    thumbnail: yt("dSXvVmwJxh4"),
    views: "192万",
  },
  {
    id: "s4",
    title: "NIPPON 「行く先は」",
    thumbnail: yt("p-RLC9ZgjhY"),
    views: "342万",
  },
  {
    id: "s5",
    title: "長く短い祭 浮雲との掛け合い",
    thumbnail: yt("3LVAmMxICoA"),
    views: "168万",
  },
  {
    id: "s6",
    title: "鶏と蛇と豚 イントロのジャズ",
    thumbnail: yt("u77yCRwSCXg"),
    views: "98万",
  },
];

export const comments: Comment[] = [
  {
    id: "c0",
    author: "椎名林檎",
    avatar: "https://picsum.photos/seed/ringo-avatar/96/96",
    timeAgo: "1 週間前 (編集済み)",
    text: "ご視聴ありがとうございます。新しいライブツアー「林檎博'26」の詳細を近日公開します。お楽しみに。",
    likes: "12万",
    replies: 184,
    pinned: true,
    isCreator: true,
    verified: true,
  },
  {
    id: "c1",
    author: "@maru_no_uchi",
    avatar: "https://picsum.photos/seed/u1/48/48",
    timeAgo: "2 時間前",
    text: "何度聴いても色褪せない。林檎さんの声、まだ20歳そこそこなのにこの貫禄...",
    likes: "1,284",
    replies: 24,
    creatorHearted: true,
  },
  {
    id: "c2",
    author: "@miyu_jihen",
    avatar: "https://picsum.photos/seed/u2/48/48",
    timeAgo: "5 時間前",
    text: "2:36 のフレーズで毎回鳥肌立つ。歌詞も曲も完璧",
    likes: "542",
    replies: 8,
  },
  {
    id: "c3",
    author: "@kabuki_fan",
    avatar: "https://picsum.photos/seed/u3/48/48",
    timeAgo: "8 時間前",
    text: "歌舞伎町の夜が似合う一曲。MVの世界観も最高すぎる",
    likes: "318",
  },
  {
    id: "c4",
    author: "@nana_lyrics",
    avatar: "https://picsum.photos/seed/u4/48/48",
    timeAgo: "12 時間前",
    text: "言葉選びのセンスが圧倒的。日本語の表現力を再認識する。",
    likes: "412",
    replies: 6,
  },
  {
    id: "c5",
    author: "@vintage_pop",
    avatar: "https://picsum.photos/seed/u5/48/48",
    timeAgo: "1 日前",
    text: "イントロのリフ、今聴いても新しい。1999年にこれ出してたのほんとに信じられない",
    likes: "892",
    replies: 14,
  },
  {
    id: "c6",
    author: "@aki_band",
    avatar: "https://picsum.photos/seed/u6/48/48",
    timeAgo: "1 日前",
    text: "ベースラインだけ抜き出しても完成してる。亀田さんの編曲が天才",
    likes: "267",
  },
];

export const filterChips = [
  "すべて",
  "椎名林檎",
  "東京事変",
  "ライブ",
  "J-POP",
  "ロック",
  "ジャズ",
  "ミュージックビデオ",
  "ベストアルバム",
  "1999",
  "三毒史",
  "百薬の長",
  "林檎博",
  "カバー",
  "リミックス",
  "ミックスリスト",
  "最近アップロードされた動画",
  "視聴済み",
];

export function getChannel(id: string) {
  return channels.find((c) => c.id === id);
}

export function getVideo(id: string) {
  return videos.find((v) => v.id === id);
}
