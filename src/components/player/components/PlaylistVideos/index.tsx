"use client";

import React from "react";

import { Box, Button, Grid, Menu, MenuItem, Typography } from "@mui/material";

import {
  KeyboardArrowDownRounded,
  PlayArrowRounded,
  QueueMusicRounded,
  ShuffleRounded,
} from "@mui/icons-material";

import { useRouter, useSearchParams } from "next/navigation";

import PostCard from "@/components/PostCard";

import {
  Playlist,
  PlaylistItem,
} from "@/app/mypage/playlist/components/playlistTypes";

import { useMyPlaylistQuery } from "@/app/api/mypage/playlist/playlist";

const PlaylistVideos = ({
  isViewer,
  playlistId,
  data,
  isVideolistLoading,
}: {
  isViewer: boolean;
  playlistId: number;
  data: PlaylistItem[];
  isVideolistLoading: boolean;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { data: playlists, isLoading, isError } = useMyPlaylistQuery();

  /*
   * 현재 재생 방식
   *
   * URL:
   * ?mode=sequential
   * ?mode=shuffle
   */
  const mode =
    searchParams.get("mode") === "shuffle" ? "shuffle" : "sequential";

  const isShuffle = mode === "shuffle";

  const [menuAnchor, setMenuAnchor] = React.useState<HTMLElement | null>(null);

  const isMenuOpen = Boolean(menuAnchor);

  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setMenuAnchor(null);
  };

  /*
   * 플레이리스트 변경
   *
   * 현재 순차/랜덤 재생 모드를 유지한다.
   */
  const handleSelectPlaylist = (nextPlaylistId: number) => {
    const params = new URLSearchParams();

    params.set("mode", mode);

    /*
     * 랜덤 재생 중 다른 플레이리스트로 변경하면
     * 새로운 랜덤 큐를 만들 수 있도록
     * 새로운 seed 발급
     */
    if (isShuffle) {
      params.set("seed", String(Date.now()));
    }

    router.push(`/mypage/playlist/${nextPlaylistId}/play?${params.toString()}`);
  };

  const currentPlaylist = playlists?.data?.find(
    (playlist: Playlist) => playlist.playlistId === playlistId,
  );

  const currentPlaylistName = currentPlaylist?.name;

  return (
    <Box>
      {/* ==========================================
          PLAYLIST TOOLBAR
      ========================================== */}
      <Box
        sx={{
          mb: "16px",

          px: {
            xs: "12px",
            sm: "16px",
          },

          py: "12px",

          display: "flex",

          flexDirection: {
            xs: "column",
            sm: "row",
          },

          alignItems: {
            xs: "stretch",
            sm: "center",
          },

          justifyContent: "space-between",

          gap: "12px",

          borderRadius: "12px",

          backgroundColor: "#F7F7F7",
        }}
      >
        {/* 현재 플레이리스트 */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",

            minWidth: 0,

            gap: "10px",
          }}
        >
          <Box
            sx={{
              width: "36px",
              height: "36px",

              display: {
                xs: "none",
                sm: "flex",
              },

              alignItems: "center",
              justifyContent: "center",

              flexShrink: 0,

              borderRadius: "10px",

              backgroundColor: "#EAEAEA",
              color: "#555",
            }}
          >
            <QueueMusicRounded
              sx={{
                fontSize: "21px",
              }}
            />
          </Box>

          <Box
            sx={{
              minWidth: 0,
            }}
          >
            <Typography
              sx={{
                mb: "2px",

                fontSize: "11px",
                color: "#888",
              }}
            >
              현재 재생목록
            </Typography>

            <Button
              onClick={handleOpenMenu}
              endIcon={<KeyboardArrowDownRounded />}
              sx={{
                minWidth: 0,

                p: 0,

                justifyContent: "flex-start",

                color: "#181818",

                fontSize: "15px",
                fontWeight: 700,

                textTransform: "none",

                "&:hover": {
                  backgroundColor: "transparent",
                },

                "& .MuiButton-endIcon": {
                  ml: "4px",
                },
              }}
            >
              <Box
                component="span"
                sx={{
                  maxWidth: {
                    xs: "200px",
                    sm: "300px",
                  },

                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {currentPlaylistName ?? "플레이리스트 선택"}
              </Box>
            </Button>
          </Box>
        </Box>

        {/* 현재 재생 모드 */}
        <Box
          sx={{
            height: "34px",

            px: "12px",

            display: "flex",
            alignItems: "center",

            gap: "6px",

            alignSelf: {
              xs: "flex-start",
              sm: "center",
            },

            flexShrink: 0,

            borderRadius: "999px",

            backgroundColor: "#fff",

            border: "1px solid #E5E5E5",

            color: "#555",
          }}
        >
          {isShuffle ? (
            <ShuffleRounded
              sx={{
                fontSize: "17px",
              }}
            />
          ) : (
            <PlayArrowRounded
              sx={{
                fontSize: "18px",
              }}
            />
          )}

          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: 600,
            }}
          >
            {isShuffle ? "랜덤 재생" : "순차 재생"}
          </Typography>
        </Box>
      </Box>

      {/* ==========================================
          PLAYLIST SELECT MENU
      ========================================== */}
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

              width: {
                xs: "calc(100vw - 40px)",
                sm: "300px",
              },

              maxWidth: "300px",
              maxHeight: "360px",

              borderRadius: "12px",

              border: "1px solid #EEEEEE",

              boxShadow: "0 8px 28px rgba(0, 0, 0, 0.12)",
            },
          },
        }}
        MenuListProps={{
          sx: {
            py: "6px",
          },
        }}
      >
        {/* 메뉴 제목 */}
        <Box
          sx={{
            px: "14px",
            pt: "6px",
            pb: "8px",
          }}
        >
          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: 600,

              color: "#888",
            }}
          >
            재생할 플레이리스트 선택
          </Typography>
        </Box>

        {isLoading && (
          <MenuItem disabled>
            <Typography fontSize={13} color="text.secondary">
              불러오는 중...
            </Typography>
          </MenuItem>
        )}

        {isError && (
          <MenuItem disabled>
            <Typography fontSize={13} color="text.secondary">
              목록을 불러오지 못했습니다.
            </Typography>
          </MenuItem>
        )}

        {!isLoading && playlists?.data?.length === 0 && (
          <MenuItem disabled>
            <Typography fontSize={13} color="text.secondary">
              플레이리스트가 없습니다.
            </Typography>
          </MenuItem>
        )}

        {playlists?.data?.map((playlist: Playlist) => {
          const isCurrentPlaylist = playlist.playlistId === playlistId;

          return (
            <MenuItem
              key={playlist.playlistId}
              selected={isCurrentPlaylist}
              disabled={isCurrentPlaylist}
              onClick={() => {
                if (isCurrentPlaylist) {
                  return;
                }

                handleSelectPlaylist(playlist.playlistId);

                handleCloseMenu();
              }}
              sx={{
                minHeight: "52px",

                mx: "6px",
                px: "10px",

                borderRadius: "8px",

                "&.Mui-selected": {
                  backgroundColor: "#F0F0F0",
                },

                "&.Mui-disabled": {
                  opacity: 1,
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",

                  width: "100%",
                  minWidth: 0,

                  gap: "10px",
                }}
              >
                {/* 작은 아이콘 */}
                <Box
                  sx={{
                    width: "34px",
                    height: "34px",

                    flexShrink: 0,

                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",

                    borderRadius: "8px",

                    backgroundColor: isCurrentPlaylist ? "#222" : "#EFEFEF",

                    color: isCurrentPlaylist ? "#fff" : "#777",
                  }}
                >
                  <QueueMusicRounded
                    sx={{
                      fontSize: "18px",
                    }}
                  />
                </Box>

                {/* 이름 / 곡 수 */}
                <Box
                  sx={{
                    flex: 1,
                    minWidth: 0,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "13px",

                      fontWeight: isCurrentPlaylist ? 700 : 500,

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

                {isCurrentPlaylist && (
                  <Box
                    sx={{
                      px: "7px",
                      py: "3px",

                      flexShrink: 0,

                      borderRadius: "999px",

                      backgroundColor: "#E7E7E7",

                      fontSize: "10px",
                      fontWeight: 600,

                      color: "#555",
                    }}
                  >
                    재생 중
                  </Box>
                )}
              </Box>
            </MenuItem>
          );
        })}
      </Menu>

      {/* ==========================================
          VIDEO LIST
      ========================================== */}
      <Grid container spacing={2}>
        {isVideolistLoading
          ? Array.from(new Array(4)).map((_, idx) => (
              <Grid
                key={`skeleton-${idx}`}
                size={
                  isViewer
                    ? { xs: 12 }
                    : {
                        xs: 12,
                        sm: 6,
                        md: 4,
                      }
                }
              >
                <div className="flex gap-4 mb-4">
                  <div className="w-32 h-20 bg-gray-200 animate-pulse rounded-lg" />

                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 animate-pulse rounded w-full" />

                    <div className="h-4 bg-gray-200 animate-pulse rounded w-2/3" />
                  </div>
                </div>
              </Grid>
            ))
          : data?.map((post: PlaylistItem) => (
              <Grid
                key={post.itemId}
                size={
                  isViewer
                    ? { xs: 12 }
                    : {
                        xs: 12,
                        sm: 6,
                        md: 4,
                      }
                }
              >
                <PostCard
                  isViewer
                  isPlaylistPlayer
                  playlistId={playlistId}
                  playlistItemId={post.itemId}
                  coverId={post.coverId}
                  coverTitle={post.coverTitle}
                  coverArtist={post.coverArtist}
                  coverGenre={post.coverGenre ?? ""}
                  createdAt=""
                  likeCount={post.likeCount ?? 0}
                  link={post.link}
                  musicId={0}
                  userId={0}
                  commentCount={0}
                />
              </Grid>
            ))}
      </Grid>
    </Box>
  );
};

export default PlaylistVideos;
