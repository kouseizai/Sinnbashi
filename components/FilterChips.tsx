"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useRef } from "react";
import { ChevronRightIcon } from "./icons";
import { filterChips } from "@/lib/mock";

export function FilterChips() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const active = sp.get("chip") ?? "すべて";
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const select = (chip: string) => {
    const params = new URLSearchParams(sp.toString());
    if (chip === "すべて") params.delete("chip");
    else params.set("chip", chip);
    const q = params.toString();
    router.push(q ? `${pathname}?${q}` : pathname, { scroll: false });
  };

  return (
    <div className="sticky top-14 z-30 bg-yt-bg">
      <div className="relative">
        <div
          ref={scrollerRef}
          className="no-scrollbar flex gap-3 overflow-x-auto px-4 py-3"
        >
          {filterChips.map((chip) => (
            <button
              key={chip}
              onClick={() => select(chip)}
              className={`shrink-0 whitespace-nowrap rounded-lg px-3 py-1.5 text-sm transition-colors ${
                chip === active
                  ? "bg-yt-text text-yt-bg font-medium"
                  : "bg-yt-surface text-yt-text hover:bg-yt-surface-2"
              }`}
            >
              {chip}
            </button>
          ))}
        </div>
        <button
          onClick={() =>
            scrollerRef.current?.scrollBy({ left: 200, behavior: "smooth" })
          }
          className="absolute right-0 top-0 hidden h-full items-center bg-gradient-to-l from-yt-bg via-yt-bg to-transparent pl-8 pr-2 sm:flex"
          aria-label="次へ"
        >
          <span className="grid size-8 place-items-center rounded-full bg-yt-surface hover:bg-yt-surface-2">
            <ChevronRightIcon className="size-5" />
          </span>
        </button>
      </div>
    </div>
  );
}
