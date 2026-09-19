"use client";

import { Box, Typography } from "@mui/material";

import {
  closestCenter,
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  restrictToParentElement,
  restrictToVerticalAxis,
} from "@dnd-kit/modifiers";

import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { FiPlay, FiShuffle } from "react-icons/fi";
import { PiMusicNotesSimple } from "react-icons/pi";
import { RxDragHandleDots2 } from "react-icons/rx";

import SortablePlaylistItemCard from "../SortablePlaylistItemCard";
import { PlaylistItem } from "../playlistTypes";

type PlaylistDetailPanelProps = {
  selectedPlaylistName: string;
  selectedPlaylistId: number;
  selectedPlaylistItems: PlaylistItem[];

  onDeleteItem: (itemId: number) => void;
  onDragEnd: (event: DragEndEvent) => void;

  // 추가
  onSequentialPlay: () => void;
  onShufflePlay: () => void;
};

const PlaylistDetailPanel = ({
  selectedPlaylistName,
  selectedPlaylistId,
  selectedPlaylistItems,
  onDeleteItem,
  onDragEnd,
  onSequentialPlay,
  onShufflePlay,
}: PlaylistDetailPanelProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
  );

  const hasItems = selectedPlaylistItems.length > 0;

  return (
    <Box
      component="section"
      sx={{
        width: "100%",
        overflow: "hidden",

        border: "1px solid #E5E5E5",
        borderRadius: "16px",

        backgroundColor: "#fff",
      }}
    >
      {!selectedPlaylistName ? (
        <Box
          sx={{
            minHeight: "260px",

            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",

            gap: "12px",
          }}
        >
          <Box
            sx={{
              width: "64px",
              height: "64px",

              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              borderRadius: "50%",

              backgroundColor: "#F5F5F5",
              color: "#A0A0A0",
            }}
          >
            <PiMusicNotesSimple size={28} />
          </Box>

          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            플레이리스트를 선택해주세요.
          </Typography>
        </Box>
      ) : (
        <>
          {/* =========================
              HEADER
          ========================= */}
          <Box
            sx={{
              px: {
                xs: "18px",
                sm: "24px",
              },

              py: "20px",

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

              gap: "16px",

              borderBottom: hasItems ? "1px solid #EEEEEE" : "none",

              backgroundColor: "#FAFAFA",
            }}
          >
            {/* 왼쪽: 제목 / 정보 */}
            <Box sx={{ minWidth: 0 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",

                  gap: "10px",

                  minWidth: 0,
                }}
              >
                <Typography
                  sx={{
                    fontSize: "19px",
                    fontWeight: 700,

                    color: "#181818",

                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {selectedPlaylistName}
                </Typography>

                <Box
                  sx={{
                    height: "24px",

                    px: "9px",

                    display: "flex",
                    alignItems: "center",

                    flexShrink: 0,

                    borderRadius: "999px",

                    backgroundColor: "#EEEEEE",

                    fontSize: "11px",
                    fontWeight: 600,

                    color: "#666",
                  }}
                >
                  {selectedPlaylistItems.length}곡
                </Box>
              </Box>

              {hasItems && (
                <Box
                  sx={{
                    mt: "8px",

                    display: "flex",
                    alignItems: "center",

                    gap: "4px",

                    color: "#888",
                  }}
                >
                  <RxDragHandleDots2 size={14} />

                  <Typography
                    sx={{
                      fontSize: "12px",
                      color: "inherit",
                    }}
                  >
                    드래그해서 재생 순서를 변경할 수 있어요.
                  </Typography>
                </Box>
              )}
            </Box>

            {/* 오른쪽: 재생 버튼 */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",

                gap: "8px",

                flexShrink: 0,

                width: {
                  xs: "100%",
                  sm: "auto",
                },
              }}
            >
              {/* 순차 재생 */}
              <Box
                component="button"
                type="button"
                disabled={!hasItems}
                onClick={onSequentialPlay}
                sx={{
                  height: "40px",

                  px: "16px",

                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",

                  gap: "7px",

                  flex: {
                    xs: 1,
                    sm: "initial",
                  },

                  border: "1px solid #DDDDDD",
                  borderRadius: "999px",

                  backgroundColor: "#fff",
                  color: "#181818",

                  fontSize: "13px",
                  fontWeight: 600,

                  whiteSpace: "nowrap",

                  cursor: hasItems ? "pointer" : "default",

                  opacity: hasItems ? 1 : 0.4,

                  transition: "background-color 0.15s ease",

                  "&:hover": hasItems
                    ? {
                        backgroundColor: "#F2F2F2",
                      }
                    : {},
                }}
              >
                <FiPlay size={16} />
                순차 재생
              </Box>

              {/* 랜덤 재생 */}
              <Box
                component="button"
                type="button"
                disabled={!hasItems}
                onClick={onShufflePlay}
                sx={{
                  height: "40px",

                  px: "16px",

                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",

                  gap: "7px",

                  flex: {
                    xs: 1,
                    sm: "initial",
                  },

                  border: 0,
                  borderRadius: "999px",

                  backgroundColor: "#181818",
                  color: "#fff",

                  fontSize: "13px",
                  fontWeight: 600,

                  whiteSpace: "nowrap",

                  cursor: hasItems ? "pointer" : "default",

                  opacity: hasItems ? 1 : 0.4,

                  transition: "background-color 0.15s ease",

                  "&:hover": hasItems
                    ? {
                        backgroundColor: "#333",
                      }
                    : {},
                }}
              >
                <FiShuffle size={16} />
                랜덤 재생
              </Box>
            </Box>
          </Box>

          {/* =========================
              EMPTY
          ========================= */}
          {!hasItems ? (
            <Box
              sx={{
                minHeight: "240px",

                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",

                gap: "12px",
              }}
            >
              <Box
                sx={{
                  width: "60px",
                  height: "60px",

                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",

                  borderRadius: "50%",

                  backgroundColor: "#F5F5F5",
                  color: "#AAA",
                }}
              >
                <PiMusicNotesSimple size={26} />
              </Box>

              <Box sx={{ textAlign: "center" }}>
                <Typography
                  sx={{
                    fontSize: "14px",
                    fontWeight: 600,
                  }}
                >
                  아직 담긴 곡이 없습니다.
                </Typography>

                <Typography
                  sx={{
                    mt: "4px",

                    fontSize: "12px",
                    color: "#999",
                  }}
                >
                  마음에 드는 커버곡을 추가해보세요.
                </Typography>
              </Box>
            </Box>
          ) : (
            /* =========================
                LIST
            ========================= */
            <Box
              sx={{
                maxHeight: "520px",

                overflowY: "auto",

                px: {
                  xs: "10px",
                  sm: "16px",
                },

                py: "6px",

                "&::-webkit-scrollbar": {
                  width: "5px",
                },

                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "#D8D8D8",
                  borderRadius: "10px",
                },
              }}
            >
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                modifiers={[restrictToVerticalAxis, restrictToParentElement]}
                onDragEnd={onDragEnd}
              >
                <SortableContext
                  items={selectedPlaylistItems.map((item) => item.itemId)}
                  strategy={verticalListSortingStrategy}
                >
                  {selectedPlaylistItems.map((item) => (
                    <SortablePlaylistItemCard
                      key={item.itemId}
                      playlistId={selectedPlaylistId}
                      item={item}
                      onDelete={() => onDeleteItem(item.itemId)}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default PlaylistDetailPanel;
