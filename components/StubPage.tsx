import Link from "next/link";

export function StubPage({
  title,
  description,
  sections,
}: {
  title: string;
  description?: string;
  sections?: { heading: string; items: { label: string; href?: string; hint?: string }[] }[];
}) {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 pb-12">
      <h1 className="text-2xl sm:text-3xl font-bold">{title}</h1>
      {description && (
        <p className="mt-2 text-sm text-yt-text-secondary">{description}</p>
      )}
      <div className="mt-8 space-y-6">
        {(sections ?? []).map((s) => (
          <section key={s.heading} className="rounded-xl bg-yt-surface p-5">
            <h2 className="text-lg font-semibold mb-3">{s.heading}</h2>
            <div className="divide-y divide-yt-border">
              {s.items.map((it) => (
                <div
                  key={it.label}
                  className="flex items-center justify-between py-3"
                >
                  <div>
                    <p className="text-sm">{it.label}</p>
                    {it.hint && (
                      <p className="text-xs text-yt-text-secondary mt-0.5">
                        {it.hint}
                      </p>
                    )}
                  </div>
                  {it.href ? (
                    <Link
                      href={it.href}
                      className="rounded-full bg-yt-surface-2 px-3 py-1 text-xs font-medium hover:bg-yt-surface-3"
                    >
                      開く
                    </Link>
                  ) : (
                    <button className="rounded-full bg-yt-surface-2 px-3 py-1 text-xs font-medium hover:bg-yt-surface-3">
                      変更
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
