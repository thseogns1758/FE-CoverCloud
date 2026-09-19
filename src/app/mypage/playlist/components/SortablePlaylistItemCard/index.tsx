"use client";

import React, { useEffect, useMemo, useState } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

import {
  Box,
  Menu,
  MenuItem,
  Skeleton,
  Tooltip,
  Typography,
} from "@mui/material";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { RxDragHandleDots2 } from "react-icons/rx";
import { HiDotsHorizontal } from "react-icons/hi";
import { FiPlay, FiTrash2 } from "react-icons/fi";

import { PlaylistItem } from "../playlistTypes";

import {
  detectAndValidateMediaUrl,
  getMediaThumbnail,
} from "@/app/utils/youtube";

const DEFAULT_IMAGE = "/asset/image/default-image.png";

type SortablePlaylistItemCardProps = {
  playlistId: number;
  item: PlaylistItem;
  onDelete: () => void;
};

const SortablePlaylistItemCard = ({
  playlistId,
  item,
  onDelete,
}: SortablePlaylistItemCardProps) => {
  const router = useRouter();

  /* =========================
     MENU
  ========================= */

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const isOptionOpen = Boolean(anchorEl);

  /* =========================
     DND
  ========================= */

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.itemId,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,

    opacity: isDragging ? 0.55 : 1,

    position: "relative",

    zIndex: isDragging ? 10 : 1,
  };

  /* =========================
     THUMBNAIL
  ========================= */

  const videoId = useMemo(() => {
    return detectAndValidateMediaUrl(item.link);
  }, [item.link]);

  const [imageSrc, setImageSrc] = useState("");

  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchThumbnail = async () => {
      setImageLoading(true);

      try {
        if (!videoId) {
          if (!isMounted) return;

          setImageSrc(DEFAULT_IMAGE);
          setImageLoading(false);

          return;
        }

        const thumbnail = await getMediaThumbnail(videoId);

        if (!isMounted) return;

        setImageSrc(thumbnail ?? DEFAULT_IMAGE);

        setImageLoading(false);
      } catch (error) {
        console.error("Thumbnail fetch failed:", error);

        if (!isMounted) return;

        setImageSrc(DEFAULT_IMAGE);
        setImageLoading(false);
      }
    };

    fetchThumbnail();

    return () => {
      isMounted = false;
    };
  }, [videoId]);

  /* =========================
     PLAY
  ========================= */

  const handlePlay = () => {
    router.push(
      `/mypage/playlist/${playlistId}/play?itemId=${item.itemId}&mode=sequential`,
    );
  };

  const handleOptionOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();

    setAnchorEl(event.currentTarget);
  };

  const handleOptionClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();

    handleOptionClose();

    onDelete();
  };

  return (
    <Box
      ref={setNodeRef}
      style={style}
      sx={{
        display: "flex",
        alignItems: "center",

        width: "100%",
        minWidth: 0,

        px: {
          xs: "4px",
          sm: "8px",
        },

        py: "12px",

        borderBottom: "1px solid #EEEEEE",

        transition: "background-color 0.15s ease",

        "&:last-child": {
          borderBottom: "none",
        },

        "&:hover": {
          backgroundColor: "#FAFAFA",
        },

        "&:hover .playlist-play-overlay": {
          opacity: 1,
        },
      }}
    >
      {/* =========================
          DRAG
      ========================= */}

      <Tooltip title="드래그해서 순서 변경" placement="top" arrow>
        <Box
          {...attributes}
          {...listeners}
          sx={{
            width: "38px",
            height: "48px",

            flexShrink: 0,

            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            color: "#AAA",

            cursor: "grab",

            touchAction: "none",

            "&:hover": {
              color: "#555",
            },

            "&:active": {
              cursor: "grabbing",
            },
          }}
        >
          <RxDragHandleDots2 size={19} />
        </Box>
      </Tooltip>

      {/* =========================
          THUMBNAIL
      ========================= */}

      <Box
        onClick={handlePlay}
        sx={{
          position: "relative",

          width: "64px",
          height: "64px",

          flexShrink: 0,

          overflow: "hidden",

          borderRadius: "10px",

          backgroundColor: "#EEE",

          cursor: "pointer",
        }}
      >
        {imageLoading && (
          <Skeleton
            variant="rectangular"
            width="100%"
            height="100%"
            animation="wave"
            sx={{
              position: "absolute",
              inset: 0,
            }}
          />
        )}

        {imageSrc && (
          <Image
            src={imageSrc}
            alt={item.coverTitle || "Playlist thumbnail"}
            fill
            sizes="64px"
            className="object-cover"
            style={{
              opacity: imageLoading ? 0 : 1,

              transition: "opacity 0.2s ease",
            }}
            onLoad={() => setImageLoading(false)}
            onError={() => {
              if (imageSrc !== DEFAULT_IMAGE) {
                setImageSrc(DEFAULT_IMAGE);
              }

              setImageLoading(false);
            }}
          />
        )}

        {!imageLoading && (
          <Box
            className="playlist-play-overlay"
            sx={{
              position: "absolute",
              inset: 0,

              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              backgroundColor: "rgba(0, 0, 0, 0.4)",

              color: "#fff",

              opacity: 0,

              transition: "opacity 0.15s ease",
            }}
          >
            <Box
              sx={{
                width: "32px",
                height: "32px",

                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                borderRadius: "50%",

                backgroundColor: "rgba(255,255,255,0.92)",

                color: "#111",
              }}
            >
              <FiPlay
                size={15}
                style={{
                  marginLeft: "2px",
                }}
              />
            </Box>
          </Box>
        )}
      </Box>

      {/* =========================
          MUSIC INFO
      ========================= */}

      <Box
        onClick={handlePlay}
        sx={{
          flex: 1,
          minWidth: 0,

          ml: "16px",

          cursor: "pointer",
        }}
      >
        <Typography
          sx={{
            fontSize: "15px",
            fontWeight: 600,

            color: "#191919",

            lineHeight: 1.4,

            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {item.coverTitle}
        </Typography>

        <Typography
          sx={{
            mt: "5px",

            fontSize: "13px",
            color: "#777",

            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {item.coverArtist}
        </Typography>
      </Box>

      {/* =========================
          OPTION
      ========================= */}

      <Box
        sx={{
          flexShrink: 0,

          ml: "12px",
        }}
      >
        <Tooltip title="더보기" placement="top" arrow>
          <Box
            component="button"
            type="button"
            onClick={handleOptionOpen}
            sx={{
              width: "36px",
              height: "36px",

              p: 0,

              border: 0,
              borderRadius: "50%",

              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              backgroundColor: isOptionOpen ? "#ECECEC" : "transparent",

              color: "#333",

              cursor: "pointer",

              transition: "background-color 0.15s ease",

              "&:hover": {
                backgroundColor: "#ECECEC",
              },
            }}
          >
            <HiDotsHorizontal size={19} />
          </Box>
        </Tooltip>

        <Menu
          anchorEl={anchorEl}
          open={isOptionOpen}
          onClose={handleOptionClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          slotProps={{
            paper: {
              sx: {
                mt: "5px",

                minWidth: "120px",

                borderRadius: "10px",

                border: "1px solid #EEEEEE",

                boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
              },
            },
          }}
          MenuListProps={{
            sx: {
              py: "4px",
            },
          }}
        >
          <MenuItem
            onClick={handleDelete}
            sx={{
              minHeight: "40px",

              mx: "4px",
              px: "12px",

              gap: "9px",

              borderRadius: "7px",

              fontSize: "13px",

              "&:hover": {
                backgroundColor: "#F5F5F5",
              },
            }}
          >
            <FiTrash2 size={16} />
            삭제
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default SortablePlaylistItemCard;
