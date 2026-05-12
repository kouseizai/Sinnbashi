import { StubPage } from "@/components/StubPage";

export default function ReportHistoryPage() {
  return (
    <StubPage
      title="報告履歴"
      description="あなたが過去に報告した動画やコメントの一覧"
      sections={[
        {
          heading: "最近の報告",
          items: [
            {
              label: "報告履歴はありません",
              hint: "動画やコメントを報告すると、ここに表示されます",
            },
          ],
        },
      ]}
    />
  );
}
