import MediaDetailsPage from "../../../../src/features/media/MediaDetailsPage";

type PageProps = {
  params: Promise<{
    mediaId: string;
  }>;
};

export default async function Page({
  params,
}: PageProps) {
  const { mediaId } = await params;

  return (
    <MediaDetailsPage
      mediaId={mediaId}
    />
  );
}