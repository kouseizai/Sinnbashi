"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  BellIcon,
  ChannelIcon,
  FeedbackIcon,
  HelpIcon,
  KeyboardIcon,
  LanguageIcon,
  LockIcon,
  SearchIcon,
  SettingsIcon,
  SignOutIcon,
  StudioIcon,
  SwitchAccountIcon,
  ThemeIcon,
  VerifiedIcon,
  VideoPlusIcon,
} from "./icons";
import { videos } from "@/lib/mock";

/* ---------- generic popover wrapper that closes on outside click ---------- */
function Popover({
  anchor,
  open,
  onClose,
  align = "right",
  width = "w-80",
  children,
}: {
  anchor: React.RefObject<HTMLElement | null>;
  open: boolean;
  onClose: () => void;
  align?: "right" | "left";
  width?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (
        ref.current &&
        !ref.current.contains(e.target as Node) &&
        anchor.current &&
        !anchor.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open, onClose, anchor]);

  if (!open) return null;
  return (
    <div
      ref={ref}
      className={`absolute top-full mt-2 ${align === "right" ? "right-0" : "left-0"} ${width} max-h-[min(70vh,600px)] overflow-y-auto rounded-xl bg-yt-surface shadow-2xl ring-1 ring-yt-border/60 vp-fade-in z-50`}
    >
      {children}
    </div>
  );
}

function MenuItem({
  icon,
  label,
  hint,
  trailing,
  href,
  onClick,
  divider,
}: {
  icon?: React.ReactNode;
  label: string;
  hint?: string;
  trailing?: React.ReactNode;
  href?: string;
  onClick?: () => void;
  divider?: boolean;
}) {
  const inner = (
    <div
      className={`flex items-center gap-4 px-4 py-2 hover:bg-yt-surface-2 cursor-pointer ${divider ? "border-t border-yt-border" : ""}`}
    >
      {icon && <span className="size-6 grid place-items-center text-yt-text shrink-0">{icon}</span>}
      <span className="flex-1 text-sm truncate">{label}</span>
      {hint && <span className="text-xs text-yt-text-secondary">{hint}</span>}
      {trailing}
    </div>
  );
  if (href) {
    return (
      <Link href={href} onClick={onClick}>
        {inner}
      </Link>
    );
  }
  return <button type="button" onClick={onClick} className="block w-full text-left">{inner}</button>;
}

/* ---------------------- Account dropdown ---------------------- */
export function AccountButton({ email }: { email: string }) {
  const ref = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const initial = email.charAt(0).toUpperCase();
  return (
    <div className="relative">
      <button
        ref={ref}
        onClick={() => setOpen((v) => !v)}
        className="grid size-8 place-items-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-sm font-semibold ring-2 ring-transparent hover:ring-white/20"
        aria-label="アカウント"
      >
        {initial}
      </button>
      <Popover anchor={ref} open={open} onClose={() => setOpen(false)} width="w-[320px]">
        <div className="flex gap-3 p-4 border-b border-yt-border">
          <div className="grid size-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-base font-semibold">
            {initial}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1">
              <p className="font-medium truncate">K</p>
              <VerifiedIcon className="size-3.5 text-yt-text-secondary" />
            </div>
            <p className="text-xs text-yt-text-secondary truncate">@k_user</p>
            <p className="text-xs text-yt-text-secondary truncate mt-0.5">{email}</p>
            <Link
              href="/channel/ch-ringo"
              onClick={() => setOpen(false)}
              className="mt-2 inline-block text-sm text-yt-blue hover:underline"
            >
              Google アカウントを管理
            </Link>
          </div>
        </div>
        <div className="py-1 border-b border-yt-border">
          <MenuItem icon={<ChannelIcon />} label="あなたのチャンネル" href="/channel/ch-ringo" onClick={() => setOpen(false)} />
          <MenuItem icon={<SwitchAccountIcon />} label="アカウントを切り替える" />
          <MenuItem icon={<SignOutIcon />} label="ログアウト" />
        </div>
        <div className="py-1 border-b border-yt-border">
          <MenuItem icon={<StudioIcon />} label="YouTube Studio" />
          <MenuItem icon={<VideoPlusIcon />} label="購入とメンバーシップ" />
        </div>
        <div className="py-1 border-b border-yt-border">
          <MenuItem icon={<LockIcon />} label="データとプライバシー" />
          <MenuItem icon={<ThemeIcon />} label="デザイン: ダーク" hint="ダーク" />
          <MenuItem icon={<LanguageIcon />} label="言語: 日本語" hint="日本語" />
          <MenuItem icon={<LanguageIcon />} label="場所: 日本" hint="JP" />
          <MenuItem icon={<KeyboardIcon />} label="キーボードショートカット" />
        </div>
        <div className="py-1 border-b border-yt-border">
          <MenuItem icon={<SettingsIcon />} label="設定" href="/account" onClick={() => setOpen(false)} />
        </div>
        <div className="py-1">
          <MenuItem icon={<HelpIcon />} label="ヘルプ" href="/help" onClick={() => setOpen(false)} />
          <MenuItem icon={<FeedbackIcon />} label="フィードバックの送信" />
        </div>
      </Popover>
    </div>
  );
}

/* ---------------------- Notifications dropdown ---------------------- */
const mockNotifications = [
  {
    avatar: "https://picsum.photos/seed/ringo-avatar/96/96",
    title: "椎名林檎が新しい動画を投稿しました: 松に鶴",
    time: "1 時間前",
    thumb: "https://i.ytimg.com/vi/3eQWfkA1cGc/hqdefault.jpg",
  },
  {
    avatar: "https://picsum.photos/seed/u2/48/48",
    title: "@miyu_jihen さんがあなたのコメントに返信しました",
    time: "3 時間前",
  },
  {
    avatar: "https://picsum.photos/seed/umj-avatar/96/96",
    title: "Universal Music Japan のライブ配信が始まりました",
    time: "5 時間前",
    thumb: "https://i.ytimg.com/vi/4tlUwgtgdZA/hqdefault.jpg",
    live: true,
  },
  {
    avatar: "https://picsum.photos/seed/u3/48/48",
    title: "@kabuki_fan さんがあなたを登録しました",
    time: "12 時間前",
  },
  {
    avatar: "https://picsum.photos/seed/jihen-avatar/96/96",
    title: "東京事変が新しい動画を投稿しました",
    time: "1 日前",
    thumb: "https://i.ytimg.com/vi/ECxBHhMc7oI/hqdefault.jpg",
  },
  {
    avatar: "https://picsum.photos/seed/natalie-avatar/96/96",
    title: "音楽ナタリーが「椎名林檎」の動画をアップロードしました",
    time: "2 日前",
  },
];

export function NotificationButton() {
  const ref = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(mockNotifications.length);

  return (
    <div className="relative">
      <button
        ref={ref}
        onClick={() => {
          setOpen((v) => !v);
          setUnread(0);
        }}
        className="relative rounded-full p-2 hover:bg-yt-surface-2"
        aria-label="通知"
      >
        <BellIcon className="size-6" />
        {unread > 0 && (
          <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-yt-red px-1 text-[10px] font-medium leading-none">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>
      <Popover anchor={ref} open={open} onClose={() => setOpen(false)} width="w-[400px]">
        <div className="flex items-center justify-between px-4 py-3 border-b border-yt-border">
          <h3 className="text-base font-medium">通知</h3>
          <button
            className="rounded-full p-2 hover:bg-yt-surface-2"
            aria-label="通知設定"
          >
            <SettingsIcon className="size-5" />
          </button>
        </div>
        <div className="py-1">
          {mockNotifications.map((n, i) => (
            <div
              key={i}
              className="flex gap-3 px-4 py-3 hover:bg-yt-surface-2 cursor-pointer"
            >
              <img
                src={n.avatar}
                alt=""
                className="size-10 shrink-0 rounded-full object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm line-clamp-2">{n.title}</p>
                <p className="text-xs text-yt-text-secondary mt-0.5">{n.time}</p>
              </div>
              {n.thumb && (
                <div className="relative shrink-0">
                  <img
                    src={n.thumb}
                    alt=""
                    className="w-20 aspect-video rounded object-cover"
                  />
                  {n.live && (
                    <span className="absolute bottom-0.5 left-0.5 rounded bg-yt-red px-1 py-px text-[8px] font-semibold">
                      ライブ
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
          <div className="py-4 text-center text-sm text-yt-text-secondary">
            これより前の通知はありません
          </div>
        </div>
      </Popover>
    </div>
  );
}

/* ---------------------- Create dropdown ---------------------- */
export function CreateButton() {
  const ref = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        ref={ref}
        onClick={() => setOpen((v) => !v)}
        className="hidden sm:flex items-center gap-2 rounded-full bg-yt-surface px-4 py-2 hover:bg-yt-surface-2"
        aria-label="作成"
      >
        <VideoPlusIcon className="size-6" />
        <span className="text-sm font-medium">作成</span>
      </button>
      <Popover anchor={ref} open={open} onClose={() => setOpen(false)} width="w-56">
        <div className="py-2">
          <MenuItem icon={<VideoPlusIcon />} label="動画をアップロード" href="/upload" onClick={() => setOpen(false)} />
          <MenuItem icon={<StudioIcon />} label="ライブ配信" />
          <MenuItem icon={<VideoPlusIcon />} label="投稿を作成" />
        </div>
      </Popover>
    </div>
  );
}

/* ---------------------- Search autocomplete ---------------------- */
export function SearchAutocomplete({
  query,
  onPick,
  onClose,
}: {
  query: string;
  onPick: (q: string) => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const recent = ["椎名林檎", "丸の内サディスティック", "東京事変", "本能", "罪と罰"];
  const titles = videos.map((v) => v.title.replace(/^椎名林檎 - /, ""));

  const trimmed = query.trim();
  const filtered = trimmed
    ? Array.from(
        new Set([
          ...titles.filter((t) => t.toLowerCase().includes(trimmed.toLowerCase())),
          ...recent.filter((t) => t.toLowerCase().includes(trimmed.toLowerCase())),
        ])
      ).slice(0, 12)
    : null;

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute left-0 right-16 top-full mt-1 max-h-96 overflow-y-auto rounded-xl bg-yt-surface shadow-2xl ring-1 ring-yt-border/60 z-50"
    >
      {filtered === null ? (
        <>
          <div className="px-4 py-2 text-xs font-medium text-yt-text-secondary">
            最近の検索
          </div>
          {recent.map((q) => (
            <button
              key={q}
              onClick={() => onPick(q)}
              className="flex w-full items-center gap-4 px-4 py-2 text-left hover:bg-yt-surface-2"
            >
              <ClockSmall />
              <span className="text-sm flex-1">{q}</span>
              <span className="text-xs text-yt-blue">削除</span>
            </button>
          ))}
        </>
      ) : filtered.length === 0 ? (
        <div className="px-4 py-6 text-sm text-yt-text-secondary text-center">
          一致する候補がありません
        </div>
      ) : (
        filtered.map((s) => (
          <button
            key={s}
            onClick={() => onPick(s)}
            className="flex w-full items-center gap-4 px-4 py-2 text-left hover:bg-yt-surface-2"
          >
            <SearchIcon className="size-4 text-yt-text-secondary" />
            <span
              className="text-sm flex-1"
              dangerouslySetInnerHTML={{
                __html: highlight(s, trimmed),
              }}
            />
          </button>
        ))
      )}
    </div>
  );
}

function highlight(text: string, q: string) {
  const idx = text.toLowerCase().indexOf(q.toLowerCase());
  if (idx === -1) return escapeHtml(text);
  const before = escapeHtml(text.slice(0, idx));
  const match = escapeHtml(text.slice(idx, idx + q.length));
  const after = escapeHtml(text.slice(idx + q.length));
  return `${before}<b>${match}</b>${after}`;
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!
  );
}

function ClockSmall() {
  return (
    <svg viewBox="0 0 24 24" className="size-4 text-yt-text-secondary" fill="currentColor" aria-hidden="true">
      <path d="M14.97 16.95L10 13.87V7h2v5.76l4.03 2.49zM12 3c-4.96 0-9 4.04-9 9s4.04 9 9 9 9-4.04 9-9-4.04-9-9-9m0-1c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2z" />
    </svg>
  );
}
