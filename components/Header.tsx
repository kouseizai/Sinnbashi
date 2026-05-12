"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  AccountButton,
  CreateButton,
  NotificationButton,
  SearchAutocomplete,
} from "./HeaderMenus";
import { ArrowBackIcon, MenuIcon, MicIcon, SearchIcon } from "./icons";

function YoutubeLogo() {
  return (
    <Link
      href="/"
      aria-label="YouTube ホーム"
      className="flex items-center gap-1.5"
    >
      <span className="grid h-[22px] w-[32px] place-items-center rounded-[6px] bg-yt-red">
        <svg
          viewBox="0 0 24 24"
          className="size-3.5 translate-x-[1px]"
          fill="white"
          aria-hidden="true"
        >
          <path d="M8 5v14l11-7z" />
        </svg>
      </span>
      <span className="text-[20px] font-bold tracking-tight leading-none">
        YouTube
      </span>
      <span className="text-[11px] text-yt-text-secondary ml-0.5 self-start mt-1">
        JP
      </span>
    </Link>
  );
}

export function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const router = useRouter();
  const sp = useSearchParams();
  const [query, setQuery] = useState("");
  const [mobileSearch, setMobileSearch] = useState(false);
  const [showSuggest, setShowSuggest] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    setQuery(sp.get("q") ?? "");
  }, [sp]);

  const submit = (q: string) => {
    const t = q.trim();
    router.push(t ? `/search?q=${encodeURIComponent(t)}` : "/search");
    setShowSuggest(false);
    setMobileSearch(false);
  };

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-2 bg-yt-bg px-2 sm:px-4">
      {!mobileSearch && (
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <button
            onClick={onMenuClick}
            className="rounded-full p-2 hover:bg-yt-surface-2 transition-colors"
            aria-label="メニュー"
          >
            <MenuIcon className="size-6" />
          </button>
          <YoutubeLogo />
        </div>
      )}

      <div
        className={`flex-1 ${mobileSearch ? "flex" : "hidden sm:flex"} items-center justify-center px-2 sm:px-10 max-w-2xl mx-auto`}
      >
        {mobileSearch && (
          <button
            onClick={() => setMobileSearch(false)}
            className="rounded-full p-2 hover:bg-yt-surface-2 sm:hidden mr-1"
            aria-label="戻る"
          >
            <ArrowBackIcon className="size-5" />
          </button>
        )}
        <form
          ref={formRef}
          className="flex flex-1 relative"
          onSubmit={(e) => {
            e.preventDefault();
            submit(query);
          }}
        >
          <div className="flex flex-1 items-center rounded-l-full border border-yt-border bg-[#121212] px-4 focus-within:border-yt-blue">
            <SearchIcon className="size-4 text-yt-text-secondary mr-3 sm:hidden" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowSuggest(true);
              }}
              onFocus={() => setShowSuggest(true)}
              placeholder="検索"
              className="flex-1 bg-transparent py-2 text-base outline-none placeholder:text-yt-text-secondary"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setShowSuggest(true);
                }}
                className="ml-2 rounded-full p-1 hover:bg-yt-surface-2 text-yt-text-secondary"
                aria-label="クリア"
              >
                <svg viewBox="0 0 24 24" className="size-5" fill="currentColor">
                  <path d="M12.71 12l8.15 8.15-.71.71L12 12.71l-8.15 8.15-.71-.71L11.29 12 3.15 3.85l.71-.71L12 11.29l8.15-8.15.71.71L12.71 12z" />
                </svg>
              </button>
            )}
          </div>
          <button
            type="submit"
            className="flex w-16 items-center justify-center rounded-r-full border border-l-0 border-yt-border bg-yt-surface hover:bg-yt-surface-2"
            aria-label="検索"
          >
            <SearchIcon className="size-5" />
          </button>
          {showSuggest && (
            <SearchAutocomplete
              query={query}
              onPick={(q) => {
                setQuery(q);
                submit(q);
              }}
              onClose={() => setShowSuggest(false)}
            />
          )}
        </form>
        <button
          className="ml-2 hidden sm:flex size-10 items-center justify-center rounded-full bg-yt-surface hover:bg-yt-surface-2"
          aria-label="音声で検索"
        >
          <MicIcon className="size-5" />
        </button>
      </div>

      <div className="ml-auto flex items-center gap-1 sm:gap-2">
        <button
          onClick={() => setMobileSearch((v) => !v)}
          className="sm:hidden rounded-full p-2 hover:bg-yt-surface-2"
          aria-label="検索"
        >
          <SearchIcon className="size-5" />
        </button>
        <CreateButton />
        <NotificationButton />
        <AccountButton email="immrka466@gmail.com" />
      </div>
    </header>
  );
}
