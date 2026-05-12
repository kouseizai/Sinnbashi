"use client";

import { useState } from "react";
import { Modal } from "./Modal";
import {
  FacebookIcon,
  LinkIcon,
  TwitterIcon,
} from "./icons";

type Platform = {
  name: string;
  icon: React.ReactNode;
  color: string;
};

const platforms: Platform[] = [
  { name: "X", icon: <TwitterIcon className="size-7" />, color: "bg-black" },
  { name: "Facebook", icon: <FacebookIcon className="size-7" />, color: "bg-[#1877F2]" },
  { name: "LINE", icon: <span className="text-white font-bold text-base">L</span>, color: "bg-[#06C755]" },
  { name: "WhatsApp", icon: <span className="text-white font-bold text-base">W</span>, color: "bg-[#25D366]" },
  { name: "Reddit", icon: <span className="text-white font-bold text-base">R</span>, color: "bg-[#FF4500]" },
  { name: "Email", icon: <span className="text-white font-bold text-base">@</span>, color: "bg-zinc-500" },
  { name: "Embed", icon: <span className="text-white font-mono text-sm">{`</>`}</span>, color: "bg-zinc-600" },
];

export function ShareModal({
  open,
  onClose,
  videoId,
  videoTitle,
}: {
  open: boolean;
  onClose: () => void;
  videoId: string;
  videoTitle: string;
}) {
  const [startAt, setStartAt] = useState(false);
  const [time, setTime] = useState("0:00");
  const [copied, setCopied] = useState(false);

  const url = `https://tubekit.example/watch?v=${videoId}${startAt ? `&t=${timeToSec(time)}` : ""}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="共有" maxWidth="max-w-lg">
      <p className="text-xs text-yt-text-secondary mb-4 line-clamp-1">
        {videoTitle}
      </p>
      <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-2 px-2 pb-3">
        {platforms.map((p) => (
          <button
            key={p.name}
            onClick={onClose}
            className="flex flex-col items-center gap-1.5 shrink-0"
          >
            <span
              className={`grid size-16 place-items-center rounded-full ${p.color}`}
            >
              {p.icon}
            </span>
            <span className="text-xs">{p.name}</span>
          </button>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-2 rounded-xl bg-[#121212] p-2 pl-4 ring-1 ring-yt-border">
        <LinkIcon className="size-5 text-yt-text-secondary shrink-0" />
        <input
          readOnly
          value={url}
          onFocus={(e) => e.currentTarget.select()}
          className="flex-1 bg-transparent text-sm outline-none truncate"
        />
        <button
          onClick={copy}
          className="rounded-full bg-yt-blue px-4 py-2 text-sm font-medium text-yt-bg hover:bg-blue-400"
        >
          {copied ? "コピー済み" : "コピー"}
        </button>
      </div>
      <label className="mt-4 flex items-center gap-2 text-sm cursor-pointer">
        <input
          type="checkbox"
          checked={startAt}
          onChange={(e) => setStartAt(e.target.checked)}
          className="size-4 accent-yt-blue"
        />
        <span>開始位置</span>
        <input
          type="text"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          disabled={!startAt}
          className="w-20 rounded bg-[#121212] px-2 py-1 text-sm outline-none ring-1 ring-yt-border disabled:opacity-50"
        />
      </label>
    </Modal>
  );
}

function timeToSec(t: string): number {
  const parts = t.split(":").map((p) => parseInt(p, 10) || 0);
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return 0;
}
