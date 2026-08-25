import Link from "next/link";
import ProgramDetailsPage from "../../../../src/features/programs/ProgramDetailsPage";

type PageProps = {
  params: Promise<{
    programId: string;
  }>;
};

export default async function Page({
  params,
}: PageProps) {
  const { programId } = await params;

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          padding: "20px 24px 16px",
          marginBottom: 8,
        }}
      >
        <Link
          href={`/admin/programs/${programId}/content`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 42,
            padding: "0 16px",
            borderRadius: 11,
            color: "#fff",
            background: "#176fe8",
            boxShadow: "0 8px 22px rgba(23, 111, 232, 0.18)",
            textDecoration: "none",
            fontSize: 13,
            fontWeight: 800,
            lineHeight: 1.2,
          }}
        >
          إدارة محتوى تفاصيل البرنامج
        </Link>
      </div>

      <ProgramDetailsPage programId={programId} />
    </>
  );
}
