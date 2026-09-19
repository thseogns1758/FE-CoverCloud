"use client";

import { useState } from "react";

import {
  Box,
  Button,
  Divider,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";

import PlaylistAddRoundedIcon from "@mui/icons-material/PlaylistAddRounded";
import QueueMusicRoundedIcon from "@mui/icons-material/QueueMusicRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

import {
  useMyPlaylistQuery,
  useCreatePlaylistMutation,
} from "@/app/api/mypage/playlist/playlist";

import { useCreatePlaylistItemMutation } from "@/app/api/mypage/playlist/playlistItem";

import { Playlist } from "@/app/mypage/playlist/components/playlistTypes";

import CreatePlaylistButton from "@/components/playlist/CreatePlaylistButton";

import { useSnackbarStore } from "@/app/store/useSnackbar";
import { useAuthStore } from "@/app/store/useAuthStore";
import { useModalStore } from "@/app/store/useModalStore";

interface AddPlaylistButtonProps {
  coverId: number;
}

const AddPlaylistButton = ({ coverId }: AddPlaylistButtonProps) => {
  const { data, isLoading, isError } = useMyPlaylistQuery();

  const createPlaylistItemMutation = useCreatePlaylistItemMutation();

  const createPlaylistMutation = useCreatePlaylistMutation();

  const accessToken = useAuthStore((state) => state.accessToken);

  const isLogin = useAuthStore((state) => state.isLogin);

  const openLoginModal = useModalStore((state) => state.openLoginModal);

  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);

  const isMenuOpen = Boolean(menuAnchor);

  const playlists: Playlist[] = data?.data ?? [];

  /**
   * 메뉴 열기
   *
   * 로그인하지 않았다면
   * 메뉴 대신 로그인 모달 표시
   */
  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!isLogin || !accessToken) {
      openLoginModal();

      useSnackbarStore
        .getState()
        .show("로그인 후 플레이리스트에 곡을 저장할 수 있습니다.", "error");

      return;
    }

    setMenuAnchor(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setMenuAnchor(null);
  };

  /**
   * 현재 곡을 선택한 플레이리스트에 저장
   */
  const handleSaveToPlaylist = async (playlistId: number) => {
    if (!isLogin || !accessToken) {
      openLoginModal();
      return;
    }

    await createPlaylistItemMutation.mutateAsync({
      playlistId,
      coverId,
    });
  };

  /**
   * 새 플레이리스트 생성
   */
  const handleCreatePlaylist = async (name: string) => {
    if (!isLogin || !accessToken) {
      openLoginModal();

      useSnackbarStore
        .getState()
        .show("로그인 후 플레이리스트를 만들 수 있습니다.", "error");

      return;
    }

    try {
      const result = await createPlaylistMutation.mutateAsync(name);

      if (result.success) {
        useSnackbarStore
          .getState()
          .show("새 플레이리스트를 만들었습니다.", "success");

        /*
         * 메뉴는 닫지 않음.
         *
         * 생성 후 새 플레이리스트가 목록에 반영되면
         * 사용자가 바로 선택해서 현재 곡을 넣을 수 있음.
         */
        return;
      }

      useSnackbarStore
        .getState()
        .show("플레이리스트 생성에 실패했습니다.", "error");
    } catch (error) {
      console.error(error);

      useSnackbarStore
        .getState()
        .show("플레이리스트 생성에 실패했습니다.", "error");
    }
  };

  return (
    <Box>
      {/* =========================
          TRIGGER BUTTON
      ========================= */}
      <Button
        variant="outlined"
        onClick={handleOpenMenu}
        startIcon={<PlaylistAddRoundedIcon sx={{ fontSize: "20px" }} />}
        sx={{
          height: "40px",

          px: "16px",
          mb: "12px",

          borderRadius: "999px",

          borderColor: "#D8D8D8",

          backgroundColor: "#fff",
          color: "#222",

          fontSize: "13px",
          fontWeight: 600,

          textTransform: "none",

          "&:hover": {
            borderColor: "#BEBEBE",
            backgroundColor: "#F7F7F7",
          },
        }}
      >
        플레이리스트에 저장
      </Button>

      {/* =========================
          PLAYLIST MENU
      ========================= */}
      <Menu
        anchorEl={menuAnchor}
        open={isMenuOpen}
        onClose={handleCloseMenu}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        slotProps={{
          paper: {
            sx: {
              mt: "6px",

              width: "320px",
              maxWidth: "calc(100vw - 32px)",

              borderRadius: "14px",

              border: "1px solid #EEEEEE",

              boxShadow: "0 10px 32px rgba(0, 0, 0, 0.14)",

              overflow: "hidden",
            },
          },
        }}
        MenuListProps={{
          sx: {
            p: 0,
          },
        }}
      >
        {/* =========================
            HEADER
        ========================= */}
        <Box
          sx={{
            px: "16px",
            pt: "16px",
            pb: "12px",
          }}
        >
          <Typography
            sx={{
              fontSize: "15px",
              fontWeight: 700,

              color: "#181818",
            }}
          >
            플레이리스트에 저장
          </Typography>

          <Typography
            sx={{
              mt: "3px",

              fontSize: "12px",
              color: "#888",
            }}
          >
            이 곡을 저장할 플레이리스트를 선택해주세요.
          </Typography>
        </Box>

        {/* =========================
            LIST
        ========================= */}
        <Box
          sx={{
            maxHeight: "260px",

            overflowY: "auto",

            px: "6px",
            pb: "6px",

            "&::-webkit-scrollbar": {
              width: "5px",
            },

            "&::-webkit-scrollbar-thumb": {
              borderRadius: "10px",
              backgroundColor: "#D7D7D7",
            },
          }}
        >
          {isLoading && (
            <MenuItem disabled>
              <Typography
                sx={{
                  fontSize: "13px",
                  color: "#888",
                }}
              >
                플레이리스트를 불러오는 중...
              </Typography>
            </MenuItem>
          )}

          {isError && (
            <MenuItem disabled>
              <Typography
                sx={{
                  fontSize: "13px",
                  color: "#888",
                }}
              >
                플레이리스트를 불러오지 못했습니다.
              </Typography>
            </MenuItem>
          )}

          {!isLoading && !isError && playlists.length === 0 && (
            <Box
              sx={{
                py: "26px",
                px: "16px",

                textAlign: "center",
              }}
            >
              <QueueMusicRoundedIcon
                sx={{
                  fontSize: "30px",
                  color: "#B5B5B5",
                }}
              />

              <Typography
                sx={{
                  mt: "7px",

                  fontSize: "13px",
                  fontWeight: 600,
                }}
              >
                아직 플레이리스트가 없습니다.
              </Typography>

              <Typography
                sx={{
                  mt: "3px",

                  fontSize: "11px",
                  color: "#999",
                }}
              >
                아래에서 새 플레이리스트를 만들어보세요.
              </Typography>
            </Box>
          )}

          {!isLoading &&
            !isError &&
            playlists.map((playlist: Playlist) => (
              <MenuItem
                key={playlist.playlistId}
                disabled={createPlaylistItemMutation.isPending}
                onClick={() => handleSaveToPlaylist(playlist.playlistId)}
                sx={{
                  minHeight: "56px",

                  px: "10px",

                  borderRadius: "9px",

                  "&:hover": {
                    backgroundColor: "#F5F5F5",
                  },
                }}
              >
                <Box
                  sx={{
                    width: "100%",

                    display: "flex",
                    alignItems: "center",

                    gap: "11px",

                    minWidth: 0,
                  }}
                >
                  {/* 아이콘 */}
                  <Box
                    sx={{
                      width: "38px",
                      height: "38px",

                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",

                      flexShrink: 0,

                      borderRadius: "9px",

                      backgroundColor: "#EFEFEF",

                      color: "#666",
                    }}
                  >
                    <QueueMusicRoundedIcon
                      sx={{
                        fontSize: "20px",
                      }}
                    />
                  </Box>

                  {/* 정보 */}
                  <Box
                    sx={{
                      flex: 1,
                      minWidth: 0,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "13px",

                        fontWeight: 600,

                        color: "#222",

                        overflow: "hidden",

                        textOverflow: "ellipsis",

                        whiteSpace: "nowrap",
                      }}
                    >
                      {playlist.name}
                    </Typography>

                    <Typography
                      sx={{
                        mt: "2px",

                        fontSize: "11px",

                        color: "#999",
                      }}
                    >
                      {playlist.itemCount ?? 0}곡
                    </Typography>
                  </Box>

                  {/* 추가 표시 */}
                  <Box
                    sx={{
                      width: "28px",
                      height: "28px",

                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",

                      flexShrink: 0,

                      borderRadius: "50%",

                      color: "#777",
                    }}
                  >
                    <AddRoundedIcon
                      sx={{
                        fontSize: "18px",
                      }}
                    />
                  </Box>
                </Box>
              </MenuItem>
            ))}
        </Box>

        {/* =========================
            CREATE PLAYLIST
        ========================= */}
        <Divider />

        <Box
          sx={{
            p: "10px",

            backgroundColor: "#FAFAFA",

            /*
             * CreatePlaylistButton 내부의
             * MUI Button 스타일 덮어쓰기
             */
            "& .MuiButton-root": {
              width: "100%",
              height: "42px",

              justifyContent: "flex-start",

              px: "12px",

              borderRadius: "9px",

              backgroundColor: "transparent",

              color: "#222",

              boxShadow: "none",

              fontSize: "13px",
              fontWeight: 600,

              textTransform: "none",

              "&:hover": {
                backgroundColor: "#EEEEEE",

                boxShadow: "none",
              },
            },
          }}
        >
          <CreatePlaylistButton
            buttonText="새 플레이리스트 만들기"
            icon={
              <AddRoundedIcon
                sx={{
                  mr: "6px",
                  fontSize: "19px",
                }}
              />
            }
            onCreate={handleCreatePlaylist}
          />
        </Box>
      </Menu>
    </Box>
  );
};

export default AddPlaylistButton;
