import { StubPage } from "@/components/StubPage";

export default function HelpPage() {
  return (
    <StubPage
      title="ヘルプ"
      description="使い方やよくある質問"
      sections={[
        {
          heading: "はじめに",
          items: [
            { label: "アカウントの作成方法" },
            { label: "動画の検索と再生" },
            { label: "チャンネル登録の方法" },
            { label: "再生リストを作成する" },
          ],
        },
        {
          heading: "視聴",
          items: [
            { label: "字幕を有効にする" },
            { label: "再生速度を変える" },
            { label: "ミニプレーヤーを使う" },
            { label: "オフライン再生をする" },
          ],
        },
        {
          heading: "クリエイター向け",
          items: [
            { label: "動画をアップロードする", href: "/upload" },
            { label: "サムネイルを設定する" },
            { label: "字幕を追加する" },
            { label: "視聴維持率を確認する" },
          ],
        },
      ]}
    />
  );
}
