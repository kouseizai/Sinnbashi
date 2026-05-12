"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getChannel } from "@/lib/mock";
import {
  chaptersByVideo,
  durationToSeconds,
  uploadedAtToDaysAgo,
  viewsToNumber,
} from "@/lib/extras";
import type { Video } from "@/lib/types";
import { SearchIcon, VerifiedIcon } from "./icons";

type Props = {
  videos: Video[];
  initialQuery: string;
  initialSort: string;
  initialLength: string;
  initialWhen: string;
  initialChap: boolean;
};

const LENGTHS = [
  { id: "any", label: "指定なし" },
  { id: "short", label: "4分未満" },
  { id: "mid", label: "4–20分" },
  { id: "long", label: "20分以上" },
];

const WHENS = [
  { id: "any", label: "指定なし" },
  { id: "today", label: "今日" },
  { id: "week", label: "1週間以内" },
  { id: "month", label: "1ヶ月以内" },
];

const SORTS = [
  { id: "relevance", label: "関連度順" },
  { id: "date", label: "アップロード日順" },
  { id: "views", label: "再生回数順" },
  { id: "rating", label: "評価順" },
];

export function SearchClient({
  videos,
  initialQuery,
  initialSort,
  initialLength,
  initialWhen,
  initialChap,
}: Props) {
  const router = useRouter();
  const [q, setQ] = useState(initialQuery);
  const [sort, setSort] = useState(initialSort);
  const [len, setLen] = useState(initialLength);
  const [when, setWhen] = useState(initialWhen);
  const [chap, setChap] = useState(initialChap);

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return videos
      .filter((v) => {
        if (needle) {
          const hay = `${v.title} ${v.description} ${v.category}`.toLowerCase();
          if (!hay.includes(needle)) return false;
        }
        if (chap && !(chaptersByVideo[v.id]?.length > 0)) return false;
        const sec = durationToSeconds(v.duration);
        if (len === "short" && !(sec > 0 && sec < 240)) return false;
        if (len === "mid" && !(sec >= 240 && sec <= 1200)) return false;
        if (len === "long" && !(sec > 1200)) return false;
        const days = uploadedAtToDaysAgo(v.uploadedAt);
        if (when === "today" && days > 1) return false;
        if (when === "week" && days > 7) return false;
        if (when === "month" && days > 30) return false;
        return true;
      })
      .sort((a, b) => {
        if (sort === "views") return viewsToNumber(b.views) - viewsToNumber(a.views);
        if (sort === "date")
          return uploadedAtToDaysAgo(a.uploadedAt) - uploadedAtToDaysAgo(b.uploadedAt);
        if (sort === "rating") return viewsToNumber(b.likes) - viewsToNumber(a.likes);
        if (needle) {
          const sa = a.title.toLowerCase().includes(needle) ? 1 : 0;
          const sb = b.title.toLowerCase().includes(needle) ? 1 : 0;
          if (sa !== sb) return sb - sa;
        }
        return viewsToNumber(b.views) - viewsToNumber(a.views);
      });
  }, [chap, len, q, sort, videos, when]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (sort !== "relevance") params.set("sort", sort);
    if (len !== "any") params.set("len", len);
    if (when !== "any") params.set("when", when);
    if (chap) params.set("chap", "1");
    router.replace(`/search?${params.toString()}`);
  }

  return (
    <div className="max-w-[1280px] mx-auto px-4 py-6">
      <form onSubmit={submit} className="mb-6">
        <div className="flex items-center gap-2 bg-yt-surface rounded-full px-5 py-2 border border-yt-border focus-within:border-yt-blue">
          <SearchIcon className="size-5 text-yt-text-secondary shrink-0" />
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="動画を検索..."
            className="flex-1 bg-transparent outline-none text-yt-text placeholder-yt-text-secondary"
          />
          <button
            type="submit"
            className="rounded-full bg-yt-text text-yt-bg px-4 py-1.5 text-sm font-medium"
          >
            検索
          </button>
        </div>
      </form>

      <div className="grid md:grid-cols-[260px_1fr] gap-6">
        <aside className="space-y-5 md:sticky md:top-20 md:self-start">
          <FilterGroup title="動画の長さ">
            {LENGTHS.map((o) => (
              <Radio
                key={o.id}
                name="len"
                value={o.id}
                checked={len === o.id}
                onChange={() => setLen(o.id)}
                label={o.label}
              />
            ))}
          </FilterGroup>

          <FilterGroup title="アップロード日">
            {WHENS.map((o) => (
              <Radio
                key={o.id}
                name="when"
                value={o.id}
                checked={when === o.id}
                onChange={() => setWhen(o.id)}
                label={o.label}
              />
            ))}
          </FilterGroup>

          <FilterGroup title="並べ替え">
            {SORTS.map((o) => (
              <Radio
                key={o.id}
                name="sort"
                value={o.id}
                checked={sort === o.id}
                onChange={() => setSort(o.id)}
                label={o.label}
              />
            ))}
          </FilterGroup>

          <FilterGroup title="特徴">
            <label className="flex items-center gap-3 cursor-pointer py-1">
              <input
                type="checkbox"
                checked={chap}
                onChange={(e) => setChap(e.target.checked)}
                className="size-4 accent-yt-blue"
              />
              <span className="text-sm">チャプターあり</span>
            </label>
          </FilterGroup>

          <button
            type="button"
            onClick={() => {
              setQ("");
              setSort("relevance");
              setLen("any");
              setWhen("any");
              setChap(false);
              router.replace("/search");
            }}
            className="w-full text-sm text-yt-text-secondary hover:text-yt-text border border-yt-border rounded-full px-3 py-2"
          >
            フィルタをリセット
          </button>
        </aside>

        <div>
          <div className="mb-4 text-sm text-yt-text-secondary">
            {results.length === 0
              ? "条件に一致する動画がありません"
              : `${results.length} 件の結果`}
            {q.trim() && (
              <span>
                {" "}「<span className="text-yt-text">{q}</span>」
              </span>
            )}
          </div>

          <div className="flex flex-col gap-5">
            {results.map((v) => {
              const channel = getChannel(v.channelId);
              const hasChapters = (chaptersByVideo[v.id]?.length ?? 0) > 0;
              return (
                <Link
                  key={v.id}
                  href={`/watch?v=${v.id}`}
                  className="group flex flex-col sm:flex-row gap-4 rounded-xl p-2 -m-2 hover:bg-yt-surface-2"
                >
                  <div className="relative w-full sm:w-[360px] aspect-video shrink-0 rounded-xl overflow-hidden">
                    <img
                      src={v.thumbnail}
                      alt={v.title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                    <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-xs font-medium">
                      {v.duration}
                    </span>
                    {hasChapters && (
                      <span className="absolute top-2 left-2 rounded bg-yt-blue/95 px-2 py-0.5 text-[10px] font-medium">
                        チャプターあり
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium line-clamp-2 leading-snug">
                      {v.title}
                    </h3>
                    <p className="text-xs text-yt-text-secondary mt-1">
                      {v.views} ・ {v.uploadedAt}
                    </p>
                    <div className="mt-3 flex items-center gap-2 text-xs text-yt-text-secondary">
                      <img
                        src={channel?.avatar}
                        alt=""
                        className="size-6 rounded-full object-cover"
                      />
                      <span>{channel?.name}</span>
                      {channel?.verified && (
                        <VerifiedIcon className="size-3" />
                      )}
                    </div>
                    <p className="mt-2 text-sm text-yt-text-secondary line-clamp-2">
                      {v.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-xs font-medium text-yt-text-secondary uppercase tracking-wide mb-2">
        {title}
      </h3>
      <div className="flex flex-col">{children}</div>
    </div>
  );
}

function Radio({
  name,
  value,
  checked,
  onChange,
  label,
}: {
  name: string;
  value: string;
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <label className="flex items-center gap-3 cursor-pointer py-1">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="size-4 accent-yt-blue"
      />
      <span className="text-sm">{label}</span>
    </label>
  );
}
