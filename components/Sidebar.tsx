"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ClockIcon,
  FilmIcon,
  FlagIcon,
  GamingIcon,
  HelpIcon,
  HistoryIcon,
  HomeFilledIcon,
  HomeIcon,
  LibraryIcon,
  LiveIcon,
  MusicIcon,
  NewsIcon,
  SettingsIcon,
  ShoppingIcon,
  ShortsIcon,
  SportsIcon,
  SubsIcon,
  TrendingIcon,
} from "./icons";
import { channels } from "../lib/mock";

type Item = {
  icon: React.ComponentType<{ className?: string }>;
  iconActive?: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
};

const mainItems: Item[] = [
  { icon: HomeIcon, iconActive: HomeFilledIcon, label: "ホーム", href: "/" },
  { icon: ShortsIcon, label: "ショート", href: "/shorts" },
  { icon: SubsIcon, label: "登録チャンネル", href: "/feed/subscriptions" },
];

const youItems: Item[] = [
  { icon: HistoryIcon, label: "履歴", href: "/feed/history" },
  { icon: ClockIcon, label: "後で見る", href: "/playlist?list=WL" },
  { icon: LibraryIcon, label: "再生リスト", href: "/feed/playlists" },
];

const exploreItems: Item[] = [
  { icon: TrendingIcon, label: "急上昇", href: "/feed/trending" },
  { icon: ShoppingIcon, label: "ショッピング", href: "/feed/shopping" },
  { icon: MusicIcon, label: "音楽", href: "/feed/music" },
  { icon: FilmIcon, label: "映画", href: "/feed/movies" },
  { icon: LiveIcon, label: "ライブ", href: "/feed/live" },
  { icon: GamingIcon, label: "ゲーム", href: "/gaming" },
  { icon: NewsIcon, label: "ニュース", href: "/feed/news" },
  { icon: SportsIcon, label: "スポーツ", href: "/feed/sports" },
];

const settingsItems: Item[] = [
  { icon: SettingsIcon, label: "設定", href: "/account" },
  { icon: FlagIcon, label: "報告履歴", href: "/reporthistory" },
  { icon: HelpIcon, label: "ヘルプ", href: "/help" },
];

function NavLink({
  item,
  active,
  collapsed = false,
}: {
  item: Item;
  active: boolean;
  collapsed?: boolean;
}) {
  const Icon = active && item.iconActive ? item.iconActive : item.icon;
  if (collapsed) {
    return (
      <Link
        href={item.href}
        className={`flex flex-col items-center gap-1 rounded-lg px-1 py-4 hover:bg-yt-surface-2 ${active ? "bg-yt-surface-2" : ""}`}
      >
        <Icon className="size-6" />
        <span className="text-[10px] leading-tight">{item.label}</span>
      </Link>
    );
  }
  return (
    <Link
      href={item.href}
      className={`flex items-center gap-6 rounded-lg px-3 py-2 hover:bg-yt-surface-2 ${active ? "bg-yt-surface-2 font-medium" : ""}`}
    >
      <Icon className="size-6 shrink-0" />
      <span className="text-sm whitespace-nowrap">{item.label}</span>
    </Link>
  );
}

function Section({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t border-yt-border py-3 px-3">
      {title && (
        <h3 className="px-3 pb-2 text-base font-medium">{title}</h3>
      )}
      <div className="flex flex-col gap-0.5">{children}</div>
    </div>
  );
}

export function MiniSidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden lg:flex sticky top-14 h-[calc(100vh-3.5rem)] w-[72px] shrink-0 flex-col overflow-y-auto no-scrollbar bg-yt-bg py-1">
      {mainItems.map((item) => (
        <NavLink
          key={item.href}
          item={item}
          active={pathname === item.href}
          collapsed
        />
      ))}
      <NavLink
        item={{ icon: LibraryIcon, label: "ライブラリ", href: "/feed/library" }}
        active={pathname === "/feed/library"}
        collapsed
      />
    </aside>
  );
}

export function FullSidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden lg:block sticky top-14 h-[calc(100vh-3.5rem)] w-60 shrink-0 overflow-y-auto bg-yt-bg pb-6">
      <div className="py-3 px-3">
        <div className="flex flex-col gap-0.5">
          {mainItems.map((item) => (
            <NavLink key={item.href} item={item} active={pathname === item.href} />
          ))}
        </div>
      </div>
      <Section title="あなた >">
        {youItems.map((item) => (
          <NavLink key={item.href} item={item} active={pathname === item.href} />
        ))}
      </Section>
      <Section title="登録チャンネル">
        {channels.slice(0, 6).map((c) => (
          <Link
            key={c.id}
            href={`/channel/${c.id}`}
            className="flex items-center gap-6 rounded-lg px-3 py-2 hover:bg-yt-surface-2"
          >
            <img
              src={c.avatar}
              alt=""
              className="size-6 shrink-0 rounded-full object-cover"
            />
            <span className="text-sm truncate">{c.name}</span>
          </Link>
        ))}
      </Section>
      <Section title="探索">
        {exploreItems.map((item) => (
          <NavLink key={item.href} item={item} active={pathname === item.href} />
        ))}
      </Section>
      <Section>
        {settingsItems.map((item) => (
          <NavLink key={item.href} item={item} active={pathname === item.href} />
        ))}
      </Section>
      <div className="px-6 pt-3 text-xs text-yt-text-secondary leading-relaxed">
        <div className="flex flex-wrap gap-x-2 gap-y-1">
          <a className="hover:text-yt-text" href="#">概要</a>
          <a className="hover:text-yt-text" href="#">プレス</a>
          <a className="hover:text-yt-text" href="#">著作権</a>
          <a className="hover:text-yt-text" href="#">お問い合わせ</a>
          <a className="hover:text-yt-text" href="#">クリエイター</a>
          <a className="hover:text-yt-text" href="#">広告掲載</a>
          <a className="hover:text-yt-text" href="#">開発者</a>
        </div>
        <div className="mt-3 flex flex-wrap gap-x-2 gap-y-1">
          <a className="hover:text-yt-text" href="#">利用規約</a>
          <a className="hover:text-yt-text" href="#">プライバシー</a>
          <a className="hover:text-yt-text" href="#">ポリシーと安全性</a>
          <a className="hover:text-yt-text" href="#">YouTube の仕組み</a>
          <a className="hover:text-yt-text" href="#">新機能を試す</a>
        </div>
        <p className="mt-4 text-[#717171]">© 2026 TubeKit Demo</p>
      </div>
    </aside>
  );
}

export function MobileSidebarDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/60 transition-opacity lg:hidden ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      />
      <div
        className={`fixed inset-y-0 left-0 z-50 w-60 transform overflow-y-auto bg-yt-bg pb-6 transition-transform lg:hidden ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="h-14" />
        <FullSidebarContents onNavigate={onClose} />
      </div>
    </>
  );
}

function FullSidebarContents({ onNavigate }: { onNavigate: () => void }) {
  const pathname = usePathname();
  return (
    <>
      <div className="py-3 px-3">
        <div className="flex flex-col gap-0.5">
          {mainItems.map((item) => (
            <div key={item.href} onClick={onNavigate}>
              <NavLink item={item} active={pathname === item.href} />
            </div>
          ))}
        </div>
      </div>
      <Section title="あなた >">
        {youItems.map((item) => (
          <div key={item.href} onClick={onNavigate}>
            <NavLink item={item} active={pathname === item.href} />
          </div>
        ))}
      </Section>
      <Section title="探索">
        {exploreItems.map((item) => (
          <div key={item.href} onClick={onNavigate}>
            <NavLink item={item} active={pathname === item.href} />
          </div>
        ))}
      </Section>
    </>
  );
}
