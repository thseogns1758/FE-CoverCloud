import { api } from "@/app/lib/api";
import { useAuthStore } from "@/app/store/useAuthStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const myPlaylist = async () => {
  try {
    const res = await api.get("/api/playlist/me");

    return res.data;
  } catch (error) {
    // useAuthStore.setState({
    //   accessToken: "",
    //   isLogin: false,
    // });
    // return {
    //   success: false,
    //   message: "로그인 정보를 확인할 수 없습니다.",
    // };
  }
};

export const createPlaylist = async (name: string) => {
  try {
    const res = await api.post("/api/playlist", {
      name,
    });

    return res.data;
  } catch (error) {
    useAuthStore.setState({
      accessToken: "",
      isLogin: false,
    });
    return {
      success: false,
      message: "로그인 정보를 확인할 수 없습니다.",
    };
  }
};

export const patchPlaylist = async (playlistId: number, name: string) => {
  try {
    const res = await api.patch(`/api/playlist/${playlistId}`, {
      name,
    });

    return res.data;
  } catch (error) {
    return {
      success: false,
      message: "플레이리스트 수정에 실패했습니다.",
    };

    // useAuthStore.setState({
    //   accessToken: "",
    //   isLogin: false,
    // });
    // return {
    //   success: false,
    //   message: "로그인 정보를 확인할 수 없습니다.",
    // };
  }
};

export const deletePlaylist = async (playlistId: number) => {
  try {
    const res = await api.delete(`/api/playlist/${playlistId}`);

    return res.data;
  } catch (error) {
    return {
      success: false,
      message: "플레이리스트 삭제에 실패했습니다.",
    };
    // useAuthStore.setState({
    //   accessToken: "",
    //   isLogin: false,
    // });
    // return {
    //   success: false,
    //   message: "로그인 정보를 확인할 수 없습니다.",
    // };
  }
};
export const playlistDetail = async (playlistId: number) => {
  try {
    const res = await api.get(`/api/playlist/${playlistId}`, {
      params: {
        includeItems: true,
      },
    });

    return res.data;
  } catch (error) {
    return {
      success: false,
      message: "플레이리스트 정보를 불러오지 못했습니다.",
    };
  }
};

export const useMyPlaylistQuery = () => {
  const isLogin = useAuthStore((state) => state.isLogin);

  return useQuery({
    queryKey: ["myPlaylist"],
    queryFn: myPlaylist,
    enabled: isLogin,
    staleTime: 1000 * 60,
    retry: false,
  });
};

export const useCreatePlaylistMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (name: string) => createPlaylist(name),
    onSuccess: (res) => {
      if (!res?.success) return;
      queryClient.invalidateQueries({ queryKey: ["myPlaylist"] });
    },
  });
};

export const usePatchPlaylistMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ playlistId, name }: { playlistId: number; name: string }) =>
      patchPlaylist(playlistId, name),
    onSuccess: (res) => {
      if (!res?.success) return;
      queryClient.invalidateQueries({ queryKey: ["myPlaylist"] });
    },
  });
};

export const useDeletePlaylistMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (playlistId: number) => deletePlaylist(playlistId),
    onSuccess: (res) => {
      if (!res?.success) return;
      queryClient.invalidateQueries({ queryKey: ["myPlaylist"] });
    },
  });
};

export const usePlaylistDetailQuery = (playlistId: number | null) => {
  return useQuery({
    queryKey: ["playlistDetail", playlistId],
    queryFn: () => playlistDetail(playlistId!),
    enabled: !!playlistId,
    staleTime: 1000 * 60,
    retry: false,
  });
};
