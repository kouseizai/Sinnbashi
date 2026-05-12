import { StubPage } from "@/components/StubPage";

export default function AccountPage() {
  return (
    <StubPage
      title="アカウント"
      description="K の YouTube アカウント設定"
      sections={[
        {
          heading: "アカウント",
          items: [
            { label: "メールアドレス", hint: "immrka466@gmail.com" },
            { label: "チャンネル名", hint: "K" },
            { label: "ハンドル", hint: "@k_user" },
          ],
        },
        {
          heading: "再生と動作",
          items: [
            { label: "再生品質", hint: "自動 (推奨)" },
            { label: "自動再生", hint: "オン" },
            { label: "字幕を常に表示", hint: "オフ" },
            { label: "アンビエントモード", hint: "オン" },
          ],
        },
        {
          heading: "プライバシー",
          items: [
            { label: "登録チャンネルを非公開にする", hint: "オフ" },
            { label: "保存した再生リストを非公開にする", hint: "オフ" },
            { label: "高評価した動画を非公開にする", hint: "オン" },
          ],
        },
        {
          heading: "通知",
          items: [
            { label: "登録チャンネルの新着", hint: "オン" },
            { label: "返信", hint: "オン" },
            { label: "メンション", hint: "オン" },
          ],
        },
      ]}
    />
  );
}
