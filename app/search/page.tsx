import { SearchClient } from "@/components/SearchClient";
import { videos } from "@/lib/mock";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; sort?: string; len?: string; when?: string; chap?: string }>;
}) {
  const sp = await searchParams;
  return (
    <SearchClient
      initialQuery={sp.q ?? ""}
      initialSort={sp.sort ?? "relevance"}
      initialLength={sp.len ?? "any"}
      initialWhen={sp.when ?? "any"}
      initialChap={sp.chap === "1"}
      videos={videos}
    />
  );
}
