import PlaylistDitailClient from "./components/PlayListDetailClient";

export const dynamic = "force-dynamic";

export default async function PlaylistDitailPage({
  params,
  searchParams,
}: {
  params: Promise<{ playlistId: string }>;
  searchParams: Promise<{ itemId?: string }>;
}) {
  const { playlistId } = await params;

  return <PlaylistDitailClient playlistId={Number(playlistId)} />;
}
