"use client";

import { useState } from "react";
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

export function SubscribeButton({
  channelName,
  subscriberCount,
}: {
  channelName?: string;
  subscriberCount?: string;
}) {
  const [subbed, setSubbed] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  return (
    <div className="relative flex items-center gap-2">
      <button
        onClick={() => setSubbed((v) => !v)}
        className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
          subbed
            ? "bg-yt-surface text-yt-text hover:bg-yt-surface-2"
            : "bg-yt-text text-yt-bg hover:bg-white/90"
        }`}
      >
        {subbed && (
          <svg viewBox="0 0 24 24" className="size-5" fill="currentColor">
            <path d="M10 20h4c0 1.1-.9 2-2 2s-2-.9-2-2zm10-2.65V19H4v-1.65l2-1.88v-5.15C6 7.4 7.56 5.1 10 4.34v-.38a2 2 0 0 1 4 0v.38c2.44.75 4 3.05 4 6.32v5.15z" />
          </svg>
        )}
        {subbed ? "登録済み" : "チャンネル登録"}
        {subbed && (
          <svg viewBox="0 0 24 24" className="size-4" fill="currentColor">
            <path d="M10 6l-1.4 1.4 4.6 4.6-4.6 4.6L10 18l6-6z" />
          </svg>
        )}
      </button>
    </div>
  );
}
