import PlaylistPlayerClient from "./components/PlaylistPlayerClient";

export const dynamic = "force-dynamic";

export default async function PlaylistPlayerPage({
  params,
  searchParams,
}: {
  params: Promise<{ playlistId: string }>;
  searchParams: Promise<{ itemId?: string }>;
}) {
  const { playlistId } = await params;
  const { itemId } = await searchParams;

  return <PlaylistPlayerClient playlistId={playlistId} />;
}
