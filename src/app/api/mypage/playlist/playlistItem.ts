import { api } from "@/app/lib/api";
import { useSnackbarStore } from "@/app/store/useSnackbar";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const createPlaylistItem = async ({
  playlistId,
  coverId,
}: {
  playlistId: number;
  coverId: number;
}) => {
  const res = await api.post(`/api/playlist/${playlistId}/items`, {
    coverId,
  });

  return res.data;
};

export const deletePlaylistItem = async ({
  playlistId,
  coverId,
}: {
  playlistId: number;
  coverId: number;
}) => {
  try {
    const res = await api.delete(
      `/api/playlist/${playlistId}/items/${coverId}`,
    );

    return res.data;
  } catch (error) {
    return {
      success: false,
      message: "플레이리스트에서 곡을 삭제하지 못했습니다.",
    };
  }
};

export const reorderPlaylistItems = async ({
  playlistId,
  orderedItemIds,
}: {
  playlistId: number;
  orderedItemIds: number[];
}) => {
  try {
    const res = await api.post(`/api/playlist/${playlistId}/items/reorder`, {
      orderedItemIds,
    });

    return res.data;
  } catch (error) {
    return {
      success: false,
      message: "플레이리스트 곡 순서 변경에 실패했습니다.",
    };
  }
};

export const useCreatePlaylistItemMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPlaylistItem,

    onSuccess: (res, variables) => {
      if (!res?.success) return;

      queryClient.invalidateQueries({
        queryKey: ["myPlaylist"],
      });

      queryClient.invalidateQueries({
        queryKey: ["playlistItems", variables.playlistId],
      });

      useSnackbarStore
        .getState()
        .show("플레이리스트에 곡을 추가했습니다.", "success");
    },

    onError: (error) => {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message;

        if (message === "Cover already in playlist") {
          useSnackbarStore
            .getState()
            .show("이미 이 플레이리스트에 추가된 곡입니다.", "warning");

          return;
        }
      }

      useSnackbarStore
        .getState()
        .show("플레이리스트에 곡을 추가하지 못했습니다.", "error");
    },
  });
};

export const useDeletePlaylistItemMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePlaylistItem,
    onSuccess: (res, variables) => {
      if (!res?.success) return;

      queryClient.invalidateQueries({
        queryKey: ["playlistDetail"],
      });

      queryClient.invalidateQueries({
        queryKey: ["playlistItems", variables.playlistId],
      });
    },
  });
};

export const useReorderPlaylistItemsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reorderPlaylistItems,
    onSuccess: (res, variables) => {
      if (!res?.success) return;
      queryClient.invalidateQueries({
        queryKey: ["playlistDetail"],
      });
      queryClient.invalidateQueries({
        queryKey: ["playlistItems", variables.playlistId],
      });
    },
  });
};
