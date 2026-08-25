import ProgramDeparturesPage from "../../../../../src/features/programs/ProgramDeparturesPage";

type PageProps = {
  params: Promise<{ programId: string }>;
};

export default async function Page({ params }: PageProps) {
  const { programId } = await params;
  return <ProgramDeparturesPage programId={programId} />;
}
