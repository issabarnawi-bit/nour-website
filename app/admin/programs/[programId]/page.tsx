import ProgramDetailsPage from "../../../../src/features/programs/ProgramDetailsPage";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function Page({
  params,
}: PageProps) {
  const { id } = await params;

  return (
    <ProgramDetailsPage
      programId={id}
    />
  );
}