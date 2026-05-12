"use client";

import { useState } from "react";
import { comments as defaultComments } from "@/lib/mock";
import { parseTimestamp } from "@/lib/extras";
import type { Comment } from "@/lib/types";
import { DislikeIcon, HeartIcon, LikeIcon, MoreIcon, PinIcon, VerifiedIcon } from "./icons";

type Props = {
  initialComments?: Comment[];
  onSeek?: (sec: number) => void;
};

export function Comments({ initialComments, onSeek }: Props = {}) {
  const [items, setItems] = useState<Comment[]>(
    initialComments ?? defaultComments
  );
  const [draft, setDraft] = useState("");
  const [active, setActive] = useState(false);
  const [sort, setSort] = useState<"top" | "new">("top");

  const sorted = [...items].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    if (sort === "top") return parseLikes(b.likes) - parseLikes(a.likes);
    return 0;
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.trim()) return;
    const c: Comment = {
      id: `local-${Date.now()}`,
      author: "@you",
      avatar: "https://picsum.photos/seed/me/48/48",
      timeAgo: "たった今",
      text: draft.trim(),
      likes: "0",
    };
    setItems((prev) => [c, ...prev]);
    setDraft("");
    setActive(false);
  }

  return (
    <section>
      <div className="mb-6 flex items-center gap-6">
        <h2 className="text-xl font-bold">{items.length} 件のコメント</h2>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setSort("top")}
            className={`px-3 py-1.5 rounded-full text-sm font-medium ${
              sort === "top"
                ? "bg-yt-text text-yt-bg"
                : "hover:bg-yt-surface-2 text-yt-text"
            }`}
          >
            人気順
          </button>
          <button
            onClick={() => setSort("new")}
            className={`px-3 py-1.5 rounded-full text-sm font-medium ${
              sort === "new"
                ? "bg-yt-text text-yt-bg"
                : "hover:bg-yt-surface-2 text-yt-text"
            }`}
          >
            新しい順
          </button>
        </div>
      </div>

      <form onSubmit={submit} className="mb-8 flex gap-3">
        <div className="size-10 shrink-0 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 grid place-items-center font-semibold">
          K
        </div>
        <div className="flex-1">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onFocus={() => setActive(true)}
            placeholder="コメントを追加..."
            className="w-full border-b border-yt-border bg-transparent py-1 text-sm outline-none focus:border-white"
          />
          {active && (
            <div className="vp-fade-in mt-2 flex items-center justify-between gap-2">
              <span className="text-[11px] text-yt-text-secondary">
                2:30 のようなタイムスタンプは自動でリンクになります
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setDraft("");
                    setActive(false);
                  }}
                  className="rounded-full px-4 py-2 text-sm font-medium hover:bg-yt-surface-2"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  disabled={!draft.trim()}
                  className="rounded-full bg-yt-blue px-4 py-2 text-sm font-medium text-yt-bg disabled:opacity-40 enabled:hover:bg-blue-400"
                >
                  コメント
                </button>
              </div>
            </div>
          )}
        </div>
      </form>

      <div className="space-y-6">
        {sorted.map((c) => (
          <CommentRow key={c.id} comment={c} onSeek={onSeek} />
        ))}
      </div>
    </section>
  );
}

function CommentRow({
  comment,
  onSeek,
}: {
  comment: Comment;
  onSeek?: (sec: number) => void;
}) {
  const [liked, setLiked] = useState(false);
  return (
    <div className="flex gap-3 group/comment">
      <img
        src={comment.avatar}
        alt=""
        className="size-10 shrink-0 rounded-full object-cover"
      />
      <div className="flex-1 min-w-0">
        {comment.pinned && (
          <div className="flex items-center gap-1.5 mb-1 text-xs text-yt-text-secondary">
            <PinIcon className="size-3.5" />
            <span>投稿者によって固定されています</span>
          </div>
        )}
        <div className="flex items-center gap-1.5 flex-wrap">
          {comment.isCreator ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-yt-surface-2 px-2 py-0.5">
              <span className="text-sm font-medium">{comment.author}</span>
              {comment.verified && (
                <VerifiedIcon className="size-3 text-yt-text-secondary" />
              )}
            </span>
          ) : (
            <>
              <span className="text-sm font-medium">{comment.author}</span>
              {comment.verified && (
                <VerifiedIcon className="size-3 text-yt-text-secondary" />
              )}
            </>
          )}
          <span className="text-xs text-yt-text-secondary">{comment.timeAgo}</span>
        </div>
        <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed">
          <Linkified text={comment.text} onSeek={onSeek} />
        </p>
        <div className="mt-2 flex items-center gap-3 text-yt-text-secondary">
          <button
            onClick={() => setLiked((l) => !l)}
            className={`flex items-center gap-1 hover:text-yt-text ${
              liked ? "text-yt-blue" : ""
            }`}
          >
            <LikeIcon className="size-5" />
            <span className="text-xs">{comment.likes}</span>
          </button>
          <button className="hover:text-yt-text" aria-label="低評価">
            <DislikeIcon className="size-5" />
          </button>
          {comment.creatorHearted && (
            <span className="relative" title="投稿者がハートを送りました">
              <img
                src="https://picsum.photos/seed/ringo-avatar/96/96"
                alt=""
                className="size-6 rounded-full object-cover"
              />
              <HeartIcon className="absolute -bottom-1 -right-1 size-3.5 text-yt-red" />
            </span>
          )}
          <button className="text-xs font-medium hover:text-yt-text px-3 py-1 rounded-full hover:bg-yt-surface-2">
            返信
          </button>
        </div>
        {!!comment.replies && (
          <button className="mt-2 flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium text-yt-blue hover:bg-blue-500/10">
            <svg viewBox="0 0 24 24" className="size-5" fill="currentColor">
              <path d="M7 10l5 5 5-5z" />
            </svg>
            {comment.replies} 件の返信
          </button>
        )}
      </div>
      <button
        className="p-1 -m-1 h-fit rounded-full hover:bg-yt-surface-2 opacity-0 group-hover/comment:opacity-100"
        aria-label="その他"
      >
        <MoreIcon className="size-5" />
      </button>
    </div>
  );
}

function parseLikes(s: string): number {
  const m = s.match(/^([\d.]+)\s*([KMB])?/i);
  if (!m) return 0;
  const n = parseFloat(m[1]);
  const u = (m[2] ?? "").toUpperCase();
  if (u === "K") return n * 1_000;
  if (u === "M") return n * 1_000_000;
  if (u === "B") return n * 1_000_000_000;
  return n;
}

function Linkified({
  text,
  onSeek,
}: {
  text: string;
  onSeek?: (sec: number) => void;
}) {
  const re = /(\d{1,2}:\d{2}(?::\d{2})?)/g;
  const parts: React.ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  let key = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    const sec = parseTimestamp(m[1]);
    if (sec !== null && onSeek) {
      parts.push(
        <button
          key={`t-${key++}`}
          onClick={() => onSeek(sec)}
          className="text-yt-blue hover:underline mx-0.5 font-medium"
        >
          {m[1]}
        </button>
      );
    } else {
      parts.push(m[1]);
    }
    last = m.index + m[1].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}
