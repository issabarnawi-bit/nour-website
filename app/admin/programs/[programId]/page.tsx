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
    <ProgramDetailsPage
      programId={programId}
    />
  );
}