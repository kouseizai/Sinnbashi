"use client";

import { useEffect, useRef, useState } from "react";
import { MoreIcon, SettingsIcon } from "./icons";

type ChatMsg = {
  id: string;
  author: string;
  avatar: string;
  text: string;
  color: string;
  badge?: "member" | "moderator" | "owner";
  superchat?: { amount: string; color: string };
};

const seedNames = [
  "@aki_lover",
  "@miya_jpop",
  "@kazu_rock",
  "@nana_v",
  "@taka",
  "@haru_band",
  "@you_san",
  "@neko_dev",
  "@beat_master",
  "@kakeru",
  "@ai_neko",
  "@kenshi",
  "@yuya_t",
  "@mio",
  "@sora_chan",
];

const seedMessages = [
  "待ってましたー！",
  "音バランス完璧",
  "ベースかっこよすぎる",
  "やっぱ生バンド最高",
  "リハだけでも涙出る",
  "ドラム神",
  "Live最高",
  "今日からリスナーになりました",
  "ライブ行きます！",
  "東京公演まじで楽しみ",
  "今のソロやばい",
  "イントロでぞわぞわした",
  "ベース見えてる！",
  "音量大きめお願いします",
  "もう一回再生してください",
  "ありがとうございます！",
  "サウンドチェック中もかっこいい",
  "次回参戦予定",
  "メンバー紹介またお願いします",
  "今日も髪型決まってる",
];

const palette = [
  "#FF6B6B",
  "#FFD93D",
  "#6BCB77",
  "#4D96FF",
  "#9B5DE5",
  "#F15BB5",
  "#00BBF9",
  "#00F5D4",
];

function randomMsg(i: number): ChatMsg {
  const name = seedNames[i % seedNames.length];
  const text = seedMessages[(i * 7) % seedMessages.length];
  const color = palette[(i * 3) % palette.length];
  const isMember = i % 13 === 0;
  const isMod = i % 41 === 0;
  const isSuper = i % 17 === 0;
  return {
    id: `m-${i}-${Date.now()}`,
    author: name,
    avatar: `https://picsum.photos/seed/u${i}/40/40`,
    text,
    color,
    badge: isMod ? "moderator" : isMember ? "member" : undefined,
    superchat: isSuper
      ? {
          amount: ["¥500", "¥1,000", "¥3,000", "¥5,000"][i % 4],
          color: ["#1E88E5", "#43A047", "#FFB300", "#E53935"][i % 4],
        }
      : undefined,
  };
}

export function LiveChat() {
  const [items, setItems] = useState<ChatMsg[]>(() =>
    Array.from({ length: 8 }, (_, i) => randomMsg(i))
  );
  const [draft, setDraft] = useState("");
  const counter = useRef(items.length);
  const endRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [stuck, setStuck] = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      setItems((prev) => {
        counter.current += 1;
        const next = [...prev, randomMsg(counter.current)];
        return next.slice(-80);
      });
    }, 1800);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (stuck) endRef.current?.scrollIntoView({ block: "end" });
  }, [items, stuck]);

  const onScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    setStuck(el.scrollHeight - el.scrollTop - el.clientHeight < 40);
  };

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const t = draft.trim();
    if (!t) return;
    counter.current += 1;
    setItems((prev) => [
      ...prev,
      {
        id: `me-${counter.current}`,
        author: "K",
        avatar: "https://picsum.photos/seed/me/40/40",
        text: t,
        color: "#fff",
      },
    ]);
    setDraft("");
    setStuck(true);
  };

  return (
    <aside className="flex flex-col rounded-xl bg-yt-surface ring-1 ring-yt-border h-[680px] max-h-[80vh] sticky top-20">
      <div className="flex items-center justify-between px-4 py-2 border-b border-yt-border">
        <h3 className="text-sm font-medium">トップチャット</h3>
        <div className="flex items-center gap-1">
          <button className="rounded-full p-1.5 hover:bg-yt-surface-2" aria-label="設定">
            <SettingsIcon className="size-5" />
          </button>
          <button className="rounded-full p-1.5 hover:bg-yt-surface-2" aria-label="その他">
            <MoreIcon className="size-5" />
          </button>
        </div>
      </div>
      <div
        ref={containerRef}
        onScroll={onScroll}
        className="flex-1 overflow-y-auto px-3 py-2 space-y-1.5 text-sm"
      >
        {items.map((m) =>
          m.superchat ? (
            <div
              key={m.id}
              className="rounded-lg overflow-hidden"
              style={{ background: m.superchat.color }}
            >
              <div className="flex items-center gap-2 px-3 py-2">
                <img src={m.avatar} alt="" className="size-6 rounded-full object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-medium truncate">{m.author}</span>
                    <span className="font-bold">{m.superchat.amount}</span>
                  </div>
                </div>
              </div>
              <div className="px-3 pb-2 text-sm">{m.text}</div>
            </div>
          ) : (
            <div key={m.id} className="flex items-start gap-2 group/m">
              <img src={m.avatar} alt="" className="size-6 rounded-full shrink-0 mt-0.5 object-cover" />
              <p className="flex-1 leading-snug text-[13px]">
                {m.badge === "moderator" && <Badge color="bg-[#4d8cef]" label="🔧" />}
                {m.badge === "member" && <Badge color="bg-[#0f9d58]" label="★" />}
                <span style={{ color: m.color }} className="mr-1.5 text-xs font-medium">
                  {m.author}
                </span>
                <span className="text-yt-text">{m.text}</span>
              </p>
            </div>
          )
        )}
        <div ref={endRef} />
      </div>
      <form onSubmit={send} className="border-t border-yt-border p-3 flex items-center gap-2">
        <img src="https://picsum.photos/seed/me/40/40" alt="" className="size-7 rounded-full object-cover" />
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="チャット..."
          className="flex-1 bg-transparent border-b border-yt-border focus:border-white outline-none py-1 text-sm placeholder:text-yt-text-secondary"
          maxLength={200}
        />
        <button
          type="submit"
          disabled={!draft.trim()}
          className="grid size-8 place-items-center rounded-full hover:bg-yt-surface-2 disabled:opacity-30"
          aria-label="送信"
        >
          <svg viewBox="0 0 24 24" className="size-5" fill="currentColor">
            <path d="M2 21l21-9L2 3v7l15 2-15 2z" />
          </svg>
        </button>
      </form>
    </aside>
  );
}

function Badge({ color, label }: { color: string; label: string }) {
  return (
    <span className={`inline-grid place-items-center size-4 rounded text-[10px] mr-1 align-middle ${color}`}>
      {label}
    </span>
  );
}
