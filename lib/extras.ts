// Supplemental data that the base mock.ts does not carry.
// Real MP4 sources (sample CDN) and chapter timings keyed by video id.

export type Chapter = { start: number; title: string };

export const sampleSources: Record<string, string> = {
  v1: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  v2: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  v3: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  v4: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
  v5: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  v6: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
  v7: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  v8: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
  v9: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
  v10: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
  v11: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4",
  v12: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
};

export const chaptersByVideo: Record<string, Chapter[]> = {
  v2: [
    { start: 0, title: "イントロ — Cache Components とは" },
    { start: 90, title: "use cache ディレクティブ" },
    { start: 240, title: "cacheLife と cacheTag" },
    { start: 420, title: "PPR との関係" },
    { start: 540, title: "実装例 & まとめ" },
  ],
  v3: [
    { start: 0, title: "材料を準備" },
    { start: 60, title: "パスタを茹でる" },
    { start: 180, title: "ソースの黄金比" },
    { start: 360, title: "仕上げと盛り付け" },
    { start: 480, title: "失敗しない3つのコツ" },
  ],
  v5: [
    { start: 0, title: "オープニング" },
    { start: 180, title: "中盤の難所" },
    { start: 720, title: "強敵バトル" },
    { start: 1200, title: "ラスボス前哨戦" },
    { start: 1620, title: "ラスボス戦" },
    { start: 1860, title: "エンディング" },
  ],
  v7: [
    { start: 0, title: "宇宙膨張の発見" },
    { start: 120, title: "ハッブル定数の謎" },
    { start: 360, title: "JWST 最新観測" },
    { start: 720, title: "DESI のデータ" },
    { start: 960, title: "新理論と今後" },
  ],
  v9: [
    { start: 0, title: "TypeScript 7 概要" },
    { start: 180, title: "Native Go 実装の中身" },
    { start: 600, title: "ベンチマーク検証" },
    { start: 960, title: "移行手順" },
    { start: 1200, title: "まとめ" },
  ],
  v11: [
    { start: 0, title: "材料" },
    { start: 60, title: "タレを作る" },
    { start: 240, title: "麺を茹でる" },
    { start: 420, title: "盛り付け" },
  ],
  v12: [
    { start: 0, title: "100日サバイバル開始" },
    { start: 600, title: "資源集めと拠点" },
    { start: 1500, title: "都市計画" },
    { start: 2400, title: "完成披露" },
  ],
};

export function durationToSeconds(d: string): number {
  if (d === "LIVE") return 0;
  const parts = d.split(":").map(Number);
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return 0;
}

export function parseTimestamp(text: string): number | null {
  const m = text.match(/^(?:(\d+):)?(\d{1,2}):(\d{2})$/);
  if (!m) return null;
  const [, h, mm, ss] = m;
  return (h ? parseInt(h) * 3600 : 0) + parseInt(mm) * 60 + parseInt(ss);
}

export function viewsToNumber(views: string): number {
  const s = views.replace(/\s+(views?|watching)/i, "").trim();
  const m = s.match(/^([\d.]+)\s*([KMB])?$/i);
  if (!m) return 0;
  const n = parseFloat(m[1]);
  const unit = (m[2] ?? "").toUpperCase();
  if (unit === "K") return n * 1_000;
  if (unit === "M") return n * 1_000_000;
  if (unit === "B") return n * 1_000_000_000;
  return n;
}

export function uploadedAtToDaysAgo(s: string): number {
  const m = s.match(/(\d+)\s+(minute|hour|day|week|month|year)s?\s+ago/i);
  if (!m) return s.match(/now|streaming/i) ? 0 : 1000;
  const n = parseInt(m[1]);
  const unit = m[2].toLowerCase();
  if (unit.startsWith("minute")) return n / (24 * 60);
  if (unit.startsWith("hour")) return n / 24;
  if (unit.startsWith("day")) return n;
  if (unit.startsWith("week")) return n * 7;
  if (unit.startsWith("month")) return n * 30;
  if (unit.startsWith("year")) return n * 365;
  return 0;
}
