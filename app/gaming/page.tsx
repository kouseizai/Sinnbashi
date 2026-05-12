import { FeedPage } from "@/components/FeedPage";
import { GamingIcon } from "@/components/icons";
import { videos } from "@/lib/mock";

export default function GamingPage() {
  return (
    <FeedPage
      title="ゲーム"
      subtitle="今 ゲーム カテゴリで人気の動画"
      icon={<GamingIcon className="size-9" />}
      videos={videos}
    />
  );
}
