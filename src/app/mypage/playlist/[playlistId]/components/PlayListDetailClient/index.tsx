"use client";

import { Box } from "@mui/material";
import { useRouter } from "next/navigation";

import { arrayMove } from "@dnd-kit/sortable";
import { DragEndEvent } from "@dnd-kit/core";

import PlaylistDetailPanel from "../../../components/PlaylistDetailPanel";

import { usePlaylistDetailQuery } from "@/app/api/mypage/playlist/playlist";

import {
  useDeletePlaylistItemMutation,
  useReorderPlaylistItemsMutation,
} from "@/app/api/mypage/playlist/playlistItem";

import { PlaylistItem } from "../../../components/playlistTypes";

import { useSnackbarStore } from "@/app/store/useSnackbar";

const PlaylistDitailClient = ({ playlistId }: { playlistId: number }) => {
  const router = useRouter();

  const deletePlaylistItemMutation = useDeletePlaylistItemMutation();

  const reorderPlaylistItemsMutation = useReorderPlaylistItemsMutation();

  const { data: playlistDetailData, isLoading: isPlaylistDetailLoading } =
    usePlaylistDetailQuery(playlistId ?? null);

  const items: PlaylistItem[] = playlistDetailData?.data?.items ?? [];

  /**
   * 플레이리스트 곡 삭제
   */
  const deletePlaylistItem = async (itemId: number) => {
    if (!playlistId) return;

    await deletePlaylistItemMutation.mutateAsync({
      playlistId,
      coverId: itemId,
    });
  };

  /**
   * 순차 재생
   */
  const handleSequentialPlay = () => {
    if (!playlistId || items.length === 0) return;

    const sortedItems = [...items].sort((a, b) => a.position - b.position);

    const firstItem = sortedItems[0];

    router.push(
      `/mypage/playlist/${playlistId}/play?itemId=${firstItem.itemId}&mode=sequential`,
    );
  };

  /**
   * 랜덤 재생
   */
  const handleShufflePlay = () => {
    if (!playlistId || items.length === 0) return;

    const randomIndex = Math.floor(Math.random() * items.length);

    const randomItem = items[randomIndex];

    router.push(
      `/mypage/playlist/${playlistId}/play?itemId=${randomItem.itemId}&mode=shuffle`,
    );
  };
  /**
   * DND 순서 변경
   */
  const handlePlaylistItemDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id || !playlistId) {
      return;
    }

    const oldIndex = items.findIndex(
      (item) => item.itemId === Number(active.id),
    );

    const newIndex = items.findIndex((item) => item.itemId === Number(over.id));

    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    const reorderedItems = arrayMove<PlaylistItem>(items, oldIndex, newIndex);

    const itemIds = reorderedItems.map((item) => item.itemId);

    const result = await reorderPlaylistItemsMutation.mutateAsync({
      playlistId,
      orderedItemIds: itemIds,
    });

    if (result.success) {
      useSnackbarStore
        .getState()
        .show("플레이리스트 순서가 변경되었습니다.", "success");
    } else {
      useSnackbarStore
        .getState()
        .show("플레이리스트 순서 변경에 실패했습니다.", "error");
    }
  };

  return (
    <Box>
      {playlistDetailData && !isPlaylistDetailLoading && (
        <PlaylistDetailPanel
          selectedPlaylistName={playlistDetailData.data.name}
          selectedPlaylistId={playlistId}
          selectedPlaylistItems={items}
          onDeleteItem={deletePlaylistItem}
          onDragEnd={handlePlaylistItemDragEnd}
          // 추가
          onSequentialPlay={handleSequentialPlay}
          onShufflePlay={handleShufflePlay}
        />
      )}
    </Box>
  );
};

export default PlaylistDitailClient;
