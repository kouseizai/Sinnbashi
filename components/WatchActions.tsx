"use client";

import { useEffect, useRef, useState } from "react";
import { SaveModal } from "./SaveModal";
import { ShareModal } from "./ShareModal";
import {
  DislikeIcon,
  DownloadIcon,
  LikeIcon,
  MoreIcon,
  SaveIcon,
  ShareIcon,
} from "./icons";

export function WatchActions({
  initialLikes,
  videoId,
  videoTitle,
}: {
  initialLikes: string;
  videoId: string;
  videoTitle: string;
}) {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [saveOpen, setSaveOpen] = useState(false);
  const [more, setMore] = useState(false);

  return (
    <div className="flex flex-wrap items-center gap-2 relative">
      <div className="flex items-center overflow-hidden rounded-full bg-yt-surface">
        <button
          onClick={() => {
            setLiked((v) => !v);
            if (disliked) setDisliked(false);
          }}
          className="flex items-center gap-2 px-4 py-2 hover:bg-yt-surface-2 border-r border-yt-border"
        >
          <LikeIcon className={`size-6 ${liked ? "text-yt-blue" : ""}`} />
          <span className="text-sm font-medium">{initialLikes}</span>
        </button>
        <button
          onClick={() => {
            setDisliked((v) => !v);
            if (liked) setLiked(false);
          }}
          className="px-4 py-2 hover:bg-yt-surface-2"
          aria-label="低評価"
        >
          <DislikeIcon className={`size-6 ${disliked ? "text-yt-blue" : ""}`} />
        </button>
      </div>
      <button
        onClick={() => setShareOpen(true)}
        className="flex items-center gap-2 rounded-full bg-yt-surface px-4 py-2 hover:bg-yt-surface-2"
      >
        <ShareIcon className="size-6" />
        <span className="text-sm font-medium">共有</span>
      </button>
      <button className="flex items-center gap-2 rounded-full bg-yt-surface px-4 py-2 hover:bg-yt-surface-2">
        <DownloadIcon className="size-6" />
        <span className="text-sm font-medium">オフライン</span>
      </button>
      <button
        onClick={() => setSaveOpen(true)}
        className="flex items-center gap-2 rounded-full bg-yt-surface px-4 py-2 hover:bg-yt-surface-2"
      >
        <SaveIcon className="size-6" />
        <span className="text-sm font-medium">保存</span>
      </button>
      <button
        onClick={() => setMore((v) => !v)}
        className="rounded-full bg-yt-surface p-2 hover:bg-yt-surface-2"
        aria-label="その他"
      >
        <MoreIcon className="size-6" />
      </button>

      {more && (
        <div className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-yt-surface ring-1 ring-yt-border shadow-2xl py-2 z-30">
          {[
            "再生リストに追加",
            "オフライン",
            "クリップを作成",
            "保存",
            "書き起こしを表示",
            "問題を報告",
          ].map((item) => (
            <button
              key={item}
              onClick={() => setMore(false)}
              className="block w-full px-4 py-2 text-left text-sm hover:bg-yt-surface-2"
            >
              {item}
            </button>
          ))}
        </div>
      )}

      <ShareModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        videoId={videoId}
        videoTitle={videoTitle}
      />
      <SaveModal open={saveOpen} onClose={() => setSaveOpen(false)} />
    </div>
  );
}

type BellLevel = "all" | "personalized" | "none";

const bellOptions: { id: BellLevel; label: string; hint: string }[] = [
  { id: "all", label: "すべて", hint: "新しい動画と公開予定の通知を受け取ります" },
  {
    id: "personalized",
    label: "カスタマイズ",
    hint: "視聴履歴に基づいて通知をお送りします",
  },
  { id: "none", label: "なし", hint: "新規通知を受け取りません" },
];

export function SubscribeButton() {
  const [subbed, setSubbed] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const [bellLevel, setBellLevel] = useState<BellLevel>("personalized");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!bellOpen) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setBellOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [bellOpen]);

  if (!subbed) {
    return (
      <button
        onClick={() => setSubbed(true)}
        className="rounded-full px-4 py-2 text-sm font-medium bg-yt-text text-yt-bg hover:bg-white/90"
      >
        チャンネル登録
      </button>
    );
  }

  return (
    <div ref={ref} className="relative flex items-center">
      <button
        onClick={() => setBellOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full bg-yt-surface px-4 py-2 text-sm font-medium hover:bg-yt-surface-2"
      >
        <BellInline level={bellLevel} />
        登録済み
        <svg viewBox="0 0 24 24" className="size-4" fill="currentColor">
          <path d="M7 10l5 5 5-5z" />
        </svg>
      </button>
      {bellOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 rounded-xl bg-yt-surface ring-1 ring-yt-border shadow-2xl py-2 z-30 vp-fade-in">
          <div className="px-4 py-2 text-sm font-medium border-b border-yt-border">
            このチャンネルに通知する
          </div>
          {bellOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => {
                setBellLevel(opt.id);
                setBellOpen(false);
              }}
              className="flex w-full items-start gap-3 px-4 py-2 text-left hover:bg-yt-surface-2"
            >
              <span className="mt-0.5 grid size-5 shrink-0 place-items-center">
                {bellLevel === opt.id ? (
                  <svg viewBox="0 0 24 24" className="size-4" fill="currentColor">
                    <path d="M9.55 18.2 3.65 12.3l1.4-1.4 4.5 4.5 9.9-9.9 1.4 1.4z" />
                  </svg>
                ) : null}
              </span>
              <span className="flex-1">
                <span className="block text-sm">{opt.label}</span>
                <span className="block text-xs text-yt-text-secondary">{opt.hint}</span>
              </span>
            </button>
          ))}
          <div className="border-t border-yt-border mt-1 pt-1">
            <button
              onClick={() => {
                setSubbed(false);
                setBellOpen(false);
              }}
              className="flex w-full items-center gap-3 px-4 py-2 text-left hover:bg-yt-surface-2 text-sm"
            >
              <svg viewBox="0 0 24 24" className="size-5" fill="currentColor">
                <path d="M14 8H8v8h6V8zm-2 6H10v-4h2v4z" />
              </svg>
              登録解除
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function BellInline({ level }: { level: BellLevel }) {
  if (level === "all") {
    return (
      <svg viewBox="0 0 24 24" className="size-5" fill="currentColor">
        <path d="M10 20h4c0 1.1-.9 2-2 2s-2-.9-2-2zm10-2.65V19H4v-1.65l2-1.88v-5.15C6 7.4 7.56 5.1 10 4.34v-.38a2 2 0 0 1 4 0v.38c2.44.75 4 3.05 4 6.32v5.15z" />
      </svg>
    );
  }
  if (level === "none") {
    return (
      <svg viewBox="0 0 24 24" className="size-5" fill="currentColor">
        <path d="M4.27 3 3 4.27l3.55 3.55c-.55 1.03-.55 2.27-.55 3.43v5.15L4 18.35V19h13.73l2 2 1.27-1.27L4.27 3zM12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-9.35L20 14.5V19h-1l-5-5 4-1.35z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="currentColor">
      <path d="M10 20h4c0 1.1-.9 2-2 2s-2-.9-2-2zm10-2.65V19H4v-1.65l2-1.88v-5.15C6 7.4 7.56 5.1 10 4.34v-.38a2 2 0 0 1 4 0v.38c2.44.75 4 3.05 4 6.32v5.15zM12 4c-3.31 0-4.5 2.61-4.5 5.5V13H4v3h16v-3h-3.5V9.5C16.5 6.61 15.31 4 12 4z" />
    </svg>
  );
}
