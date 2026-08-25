import ProgramDeparturePricingPage from "../../../../../src/features/programs/ProgramDeparturePricingPage";

type PageProps = {
  params: Promise<{ programId: string }>;
};

export default async function Page({ params }: PageProps) {
  const { programId } = await params;
  return <ProgramDeparturePricingPage programId={programId} />;
}
