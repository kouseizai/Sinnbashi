"use client";

import { useRef, useState } from "react";

type Stage = "select" | "details" | "done";

export function UploadClient() {
  const [stage, setStage] = useState<Stage>("select");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Tech");
  const [visibility, setVisibility] = useState<"public" | "unlisted" | "private">(
    "public"
  );

  const handleFile = (f: File) => {
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setStage("details");
    setTitle(f.name.replace(/\.[^.]+$/, ""));
    let p = 0;
    const id = setInterval(() => {
      p = Math.min(100, p + Math.random() * 12 + 4);
      setProgress(Math.floor(p));
      if (p >= 100) clearInterval(id);
    }, 250);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStage("done");
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">動画をアップロード</h1>
      <p className="text-sm text-yt-text-secondary mb-6">
        デモアプリです。実際には保存されませんが、エンドツーエンドの体験を確認できます。
      </p>

      {stage === "select" && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-colors ${
            dragging
              ? "border-yt-blue bg-yt-blue/5"
              : "border-yt-border hover:bg-yt-surface-2"
          }`}
        >
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-yt-surface flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              width="32"
              height="32"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-yt-text-secondary"
            >
              <path d="M12 4v12" />
              <path d="m6 10 6-6 6 6" />
              <path d="M5 20h14" />
            </svg>
          </div>
          <h2 className="text-lg font-medium mb-1">
            ここに動画ファイルをドラッグ＆ドロップ
          </h2>
          <p className="text-sm text-yt-text-secondary mb-4">
            またはクリックしてファイルを選択
          </p>
          <button
            type="button"
            className="rounded-full bg-yt-blue text-yt-bg px-5 py-2 text-sm font-medium"
          >
            ファイルを選択
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
          />
          <p className="mt-6 text-xs text-yt-text-secondary">
            非公開でアップロードした場合、リンクを知っている人のみに表示されます。
          </p>
        </div>
      )}

      {stage === "details" && file && (
        <form onSubmit={onSubmit} className="grid md:grid-cols-[1fr_320px] gap-6">
          <div className="space-y-5">
            <div>
              <label className="text-xs font-medium text-yt-text-secondary uppercase tracking-wide">
                タイトル (必須)
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                maxLength={100}
                className="mt-1 w-full bg-yt-surface border border-yt-border rounded-lg px-3 py-2 outline-none focus:border-yt-blue"
              />
              <div className="text-[11px] text-yt-text-secondary mt-1">
                {title.length} / 100
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-yt-text-secondary uppercase tracking-wide">
                説明
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                placeholder="視聴者に伝えたいことを書きましょう。タイムスタンプ (例: 0:30) を入れるとプレーヤーがチャプターとして認識します。"
                className="mt-1 w-full bg-yt-surface border border-yt-border rounded-lg px-3 py-2 outline-none focus:border-yt-blue resize-y"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-yt-text-secondary uppercase tracking-wide">
                  カテゴリ
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-1 w-full bg-yt-surface border border-yt-border rounded-lg px-3 py-2 outline-none focus:border-yt-blue"
                >
                  {[
                    "Tech",
                    "Music",
                    "Cooking",
                    "Travel",
                    "Gaming",
                    "Science",
                    "Fitness",
                  ].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-yt-text-secondary uppercase tracking-wide">
                  公開設定
                </label>
                <select
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value as typeof visibility)}
                  className="mt-1 w-full bg-yt-surface border border-yt-border rounded-lg px-3 py-2 outline-none focus:border-yt-blue"
                >
                  <option value="public">公開</option>
                  <option value="unlisted">限定公開</option>
                  <option value="private">非公開</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={!title.trim() || progress < 100}
              className="w-full rounded-full bg-yt-blue text-yt-bg py-3 font-medium disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {progress < 100
                ? `アップロード中... ${progress}%`
                : "公開する"}
            </button>
          </div>

          <aside className="space-y-3">
            <div className="rounded-xl overflow-hidden bg-black aspect-video">
              {preview && (
                <video
                  src={preview}
                  controls
                  className="w-full h-full object-contain"
                />
              )}
            </div>
            <div className="text-xs text-yt-text-secondary">
              <div className="font-medium text-yt-text truncate">{file.name}</div>
              <div className="mt-1">{(file.size / 1_048_576).toFixed(1)} MB</div>
            </div>
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span>アップロード進捗</span>
                <span className="tabular-nums">{progress}%</span>
              </div>
              <div className="h-1.5 rounded bg-yt-surface overflow-hidden">
                <div
                  className="h-full bg-yt-blue transition-[width]"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </aside>
        </form>
      )}

      {stage === "done" && (
        <div className="text-center py-16">
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-yt-blue/20 flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              width="32"
              height="32"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-yt-blue"
            >
              <path d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-2">アップロード完了!</h2>
          <p className="text-yt-text-secondary mb-6">
            「{title}」が {visibility === "public" ? "公開" : visibility === "unlisted" ? "限定公開" : "非公開"}でアップロードされました。
          </p>
          <button
            onClick={() => {
              setStage("select");
              setFile(null);
              setPreview(null);
              setProgress(0);
              setTitle("");
              setDescription("");
            }}
            className="rounded-full bg-yt-text text-yt-bg px-5 py-2 text-sm font-medium"
          >
            別の動画をアップロード
          </button>
        </div>
      )}
    </div>
  );
}
