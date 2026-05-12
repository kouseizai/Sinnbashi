"use client";

import { useEffect } from "react";
import { CloseIcon } from "./icons";

export function Modal({
  open,
  onClose,
  title,
  children,
  maxWidth = "max-w-md",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}) {
  useEffect(() => {
    if (!open) return;
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onEsc);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onEsc);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/70"
        aria-hidden
      />
      <div
        className={`relative w-full ${maxWidth} max-h-[85vh] overflow-y-auto rounded-2xl bg-yt-surface vp-fade-in shadow-2xl`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-yt-border sticky top-0 bg-yt-surface">
          <h2 className="text-lg font-medium">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-yt-surface-2"
            aria-label="閉じる"
          >
            <CloseIcon className="size-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
