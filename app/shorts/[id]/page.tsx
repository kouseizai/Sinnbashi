import { notFound } from "next/navigation";
import {
  DislikeIcon,
  LikeIcon,
  MoreIcon,
  ShareIcon,
  SaveIcon,
  PlayIcon,
} from "@/components/icons";
import { shorts } from "@/lib/mock";

export default async function ShortDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const short = shorts.find((s) => s.id === id);
  if (!short) notFound();
  const idx = shorts.findIndex((s) => s.id === id);
  const stack = [short, ...shorts.filter((s) => s.id !== id)].slice(0, 4);

  return (
    <div className="flex flex-col items-center gap-6 py-6 px-4">
      {stack.map((s, i) => (
        <div
          key={s.id}
          className="relative flex w-full max-w-[420px] gap-4"
        >
          <div className="relative w-full aspect-[9/16] rounded-xl overflow-hidden bg-black">
            <img
              src={s.thumbnail}
              alt={s.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 grid place-items-center bg-black/30">
              <span className="grid size-20 place-items-center rounded-full bg-yt-red shadow-xl">
                <PlayIcon className="size-10 translate-x-0.5" />
              </span>
            </div>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4">
              <p className="text-base font-medium">{s.title}</p>
              <p className="mt-1 text-sm text-white/80">{s.views} 回視聴</p>
            </div>
          </div>
          <div className="flex flex-col gap-3 justify-end pb-4">
            <ActionBtn icon={<LikeIcon className="size-6" />} label="3.2万" />
            <ActionBtn icon={<DislikeIcon className="size-6" />} label="低評価" />
            <ActionBtn icon={<ShareIcon className="size-6" />} label="共有" />
            <ActionBtn icon={<SaveIcon className="size-6" />} label="保存" />
            <ActionBtn icon={<MoreIcon className="size-6" />} label="" />
          </div>
        </div>
      ))}
      <p className="text-xs text-yt-text-secondary">スクロールで次のショートへ ({idx + 1} / {shorts.length})</p>
    </div>
  );
}

function ActionBtn({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="grid size-12 place-items-center rounded-full bg-yt-surface hover:bg-yt-surface-2">
        {icon}
      </span>
      {label && <span className="text-[11px] font-medium">{label}</span>}
    </div>
  );
}
