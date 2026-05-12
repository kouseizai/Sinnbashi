"use client";

import { useState } from "react";

export function DescriptionCard({
  views,
  uploadedAt,
  description,
}: {
  views: string;
  uploadedAt: string;
  description: string;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      onClick={() => !expanded && setExpanded(true)}
      className={`rounded-xl bg-yt-surface p-3 cursor-pointer ${expanded ? "" : "hover:bg-yt-surface-2"}`}
    >
      <div className="flex flex-wrap items-center gap-2 text-sm font-semibold">
        <span>{views}</span>
        <span>{uploadedAt}</span>
        <span className="rounded bg-yt-surface-2 px-2 py-0.5 text-xs">#nextjs</span>
        <span className="rounded bg-yt-surface-2 px-2 py-0.5 text-xs">#react</span>
        <span className="rounded bg-yt-surface-2 px-2 py-0.5 text-xs">#typescript</span>
      </div>
      <p
        className={`mt-2 whitespace-pre-wrap text-sm leading-relaxed ${
          expanded ? "" : "line-clamp-2"
        }`}
      >
        {description}
        {expanded && (
          <>
            {"\n\n"}
            このチャンネルでは、フロントエンド開発に関する最新情報を毎週お届けしています。
            {"\n"}・Twitter: @tubekit
            {"\n"}・Discord: discord.gg/tubekit
            {"\n"}・お仕事のご依頼: contact@tubekit.example
          </>
        )}
      </p>
      {expanded && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(false);
          }}
          className="mt-3 text-sm font-medium"
        >
          一部を表示
        </button>
      )}
    </div>
  );
}
