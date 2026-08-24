import ProgramDetailContentPage from "../../../../../src/features/programs/ProgramDetailContentPage";

type PageProps = {
  params: Promise<{ programId: string }>;
};

export default async function Page({ params }: PageProps) {
  const { programId } = await params;
  return <ProgramDetailContentPage programId={programId} />;
}
