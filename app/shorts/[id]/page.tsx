import { notFound } from "next/navigation";
import { ShortsPlayer } from "@/components/ShortsPlayer";
import { shorts } from "@/lib/mock";

export default async function ShortDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const idx = shorts.findIndex((s) => s.id === id);
  if (idx === -1) notFound();
  // Re-order so the requested short is first; rest follow for swipe-down feed
  const ordered = [shorts[idx], ...shorts.filter((_, i) => i !== idx)];
  return <ShortsPlayer shorts={ordered} />;
}
