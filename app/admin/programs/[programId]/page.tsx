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
      <div style={{ display: "flex", justifyContent: "flex-end", padding: "18px 24px 0" }}>
        <Link
          href={`/admin/programs/${programId}/content`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            minHeight: 40,
            padding: "0 14px",
            borderRadius: 10,
            color: "#fff",
            background: "#176fe8",
            textDecoration: "none",
            fontSize: 13,
            fontWeight: 800,
          }}
        >
          إدارة محتوى تفاصيل البرنامج
        </Link>
      </div>
      <ProgramDetailsPage programId={programId} />
    </>
  );
}
