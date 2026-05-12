"use client";

import { useState } from "react";
import { Modal } from "./Modal";
import { CheckIcon, GlobeIcon, LockIcon, PlusIcon } from "./icons";

type Playlist = {
  id: string;
  name: string;
  visibility: "public" | "private";
  saved: boolean;
};

const initialPlaylists: Playlist[] = [
  { id: "wl", name: "後で見る", visibility: "private", saved: false },
  { id: "fav", name: "お気に入り", visibility: "private", saved: true },
  { id: "music", name: "音楽コレクション", visibility: "public", saved: false },
  { id: "study", name: "作業用BGM", visibility: "private", saved: false },
  { id: "live", name: "ライブ", visibility: "public", saved: false },
];

export function SaveModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [items, setItems] = useState<Playlist[]>(initialPlaylists);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [newVis, setNewVis] = useState<"public" | "private">("private");

  const toggle = (id: string) =>
    setItems((prev) =>
      prev.map((p) => (p.id === id ? { ...p, saved: !p.saved } : p))
    );

  const create = () => {
    const name = newName.trim();
    if (!name) return;
    setItems((prev) => [
      { id: `new-${Date.now()}`, name, visibility: newVis, saved: true },
      ...prev,
    ]);
    setNewName("");
    setCreating(false);
  };

  return (
    <Modal open={open} onClose={onClose} title="動画を保存" maxWidth="max-w-md">
      <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
        {items.map((p) => (
          <label
            key={p.id}
            className="flex items-center gap-3 py-1 cursor-pointer hover:bg-yt-surface-2 rounded px-2 -mx-2"
          >
            <span
              className={`grid size-5 shrink-0 place-items-center rounded ${
                p.saved
                  ? "bg-yt-text text-yt-bg"
                  : "ring-1 ring-yt-text-secondary"
              }`}
            >
              {p.saved && <CheckIcon className="size-3" />}
            </span>
            <input
              type="checkbox"
              checked={p.saved}
              onChange={() => toggle(p.id)}
              className="sr-only"
            />
            <span className="flex-1 text-sm truncate">{p.name}</span>
            {p.visibility === "private" ? (
              <LockIcon className="size-4 text-yt-text-secondary" />
            ) : (
              <GlobeIcon className="size-4 text-yt-text-secondary" />
            )}
          </label>
        ))}
      </div>

      <div className="mt-4 border-t border-yt-border pt-4">
        {!creating ? (
          <button
            onClick={() => setCreating(true)}
            className="flex w-full items-center gap-3 rounded px-2 py-2 hover:bg-yt-surface-2"
          >
            <PlusIcon className="size-5" />
            <span className="text-sm font-medium">新しい再生リストを作成</span>
          </button>
        ) : (
          <div className="space-y-3">
            <input
              autoFocus
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="再生リスト名を入力"
              className="w-full rounded bg-[#121212] px-3 py-2 text-sm outline-none ring-1 ring-yt-border focus:ring-yt-blue"
            />
            <select
              value={newVis}
              onChange={(e) => setNewVis(e.target.value as "public" | "private")}
              className="w-full rounded bg-[#121212] px-3 py-2 text-sm outline-none ring-1 ring-yt-border"
            >
              <option value="private">非公開</option>
              <option value="public">公開</option>
            </select>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setCreating(false)}
                className="rounded-full px-4 py-2 text-sm font-medium hover:bg-yt-surface-2"
              >
                キャンセル
              </button>
              <button
                onClick={create}
                disabled={!newName.trim()}
                className="rounded-full bg-yt-blue px-4 py-2 text-sm font-medium text-yt-bg disabled:opacity-40"
              >
                作成
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
