"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import { FaRegHeart } from "react-icons/fa";

import "./PostCard.module.css";
import { contentData } from "../../app/main/type";
import {
  detectAndValidateMediaUrl,
  getMediaThumbnail,
} from "../../app/utils/youtube";
import PlaylistOptionButton from "../playlist/PlaylistOptionButton";
import { Typography } from "@mui/material";
import { FiPlus } from "react-icons/fi";

const DEFAULT_IMAGE = "/asset/image/default-image.png";

const genres = [
  { title: "K-POP", value: "K_POP" },
  { title: "J-POP", value: "J_POP" },
  { title: "POP", value: "POP" },
  { title: "기타", value: "OTHER" },
];

type PostCardProps = contentData & {
  isViewer?: boolean;
  playlistId?: number;
  playlistItemId?: number;
  isPlaylistPlayer?: boolean;
  thumbnailUrl?: string;
  playlistItemCount?: number;
  playListOptionButtonClickHandler?: () => void;
  openDeleteModal?: () => void;
  navigateToEdit?: () => void;
};

const PostCard: React.FC<PostCardProps> = ({
  coverGenre,
  coverId,
  coverTitle,
  likeCount,
  link,
  tags,
  isViewer = false,
  playlistId,
  playlistItemId,
  isPlaylistPlayer = false,
  thumbnailUrl,
  playlistItemCount,
  playListOptionButtonClickHandler,
  openDeleteModal,
  navigateToEdit,
}) => {
  const theme = useTheme();
  const router = useRouter();

  const videoId = React.useMemo(() => {
    return detectAndValidateMediaUrl(link);
  }, [link]);

  const hasPlaylistId = playlistId !== undefined && playlistId !== null;
  const hasPlaylistItemId =
    playlistItemId !== undefined && playlistItemId !== null;

  const isPlaylistManageCard =
    hasPlaylistId && Boolean(openDeleteModal) && Boolean(navigateToEdit);

  const href =
    isPlaylistPlayer && hasPlaylistId && hasPlaylistItemId
      ? `/mypage/playlist/${playlistId}/play?itemId=${playlistItemId}`
      : hasPlaylistId
        ? `/mypage/playlist/${playlistId}`
        : `/post/${coverId}/view`;

  const [imageSrc, setImageSrc] = useState(thumbnailUrl ?? "");
  const [loading, setLoading] = useState(!thumbnailUrl);

  const handleNavigate = () => {
    router.push(href);
  };
  React.useEffect(() => {
    let isMounted = true;

    const fetchThumbnail = async () => {
      if (!imageSrc) {
        setLoading(true);
      }

      try {
        if (thumbnailUrl) {
          if (!isMounted) return;

          setImageSrc(thumbnailUrl);
          setLoading(false);
          return;
        }

        if ((!videoId && !hasPlaylistId) || (hasPlaylistId && !link)) {
          if (!isMounted) return;

          setImageSrc(DEFAULT_IMAGE);
          setLoading(false);
          return;
        }

        const thumbnail = await getMediaThumbnail(videoId);

        if (!isMounted) return;

        setImageSrc(thumbnail ?? DEFAULT_IMAGE);
        setLoading(false);
      } catch (error) {
        console.error("Thumbnail fetch failed:", error);

        if (!isMounted) return;

        setImageSrc(DEFAULT_IMAGE);
        setLoading(false);
      }
    };

    fetchThumbnail();

    return () => {
      isMounted = false;
    };
  }, [videoId, playlistId, thumbnailUrl, link]);
  const cardContent = (
    <Box
      className={isViewer ? "flex" : "flex-col"}
      sx={{
        flex: 1,
        padding: isViewer ? "0px" : "12px 20px 14px 20px",
        borderRadius: "12px",

        cursor: isPlaylistManageCard ? "default" : "pointer",

        "&:hover": {
          backgroundColor: isPlaylistManageCard
            ? "transparent"
            : theme.palette.gray.tertiary,
        },
      }}
    >
      <Box
        className={`relative flex-shrink-0 ${
          isViewer ? "w-[148px] h-[107px]" : "w-full aspect-video"
        }`}
      >
        {(loading || !imageSrc) && (
          <Skeleton
            variant="rectangular"
            width="100%"
            height="100%"
            animation="wave"
            sx={{ position: "absolute", inset: 0, zIndex: 1 }}
          />
        )}

        {imageSrc && (
          <Image
            src={imageSrc}
            alt={coverTitle || "Post Image"}
            fill
            sizes={isViewer ? "148px" : "(max-width: 768px) 100vw, 33vw"}
            className="object-cover"
            style={{
              opacity: loading ? 0 : 1,
              transition: "opacity 0.2s ease",
            }}
            onLoad={() => setLoading(false)}
            onError={() => {
              setImageSrc(DEFAULT_IMAGE);
              setLoading(false);
            }}
          />
        )}
        {/* 플레이리스트 곡 개수 */}
        {isPlaylistManageCard && playlistItemCount !== undefined && (
          <Box
            sx={{
              position: "absolute",
              right: "12px",
              bottom: "12px",
              zIndex: 2,

              display: "flex",
              alignItems: "center",
              gap: "7px",

              height: "32px",
              px: "11px",

              borderRadius: "6px",
              backgroundColor: "rgba(40, 40, 40, 0.78)",
              color: "#fff",

              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            <Box
              component="span"
              sx={{
                fontSize: "24px",
                lineHeight: 1,
                fontWeight: 300,
              }}
            >
              <FiPlus size={20} />
            </Box>
            <Typography>{playlistItemCount}</Typography>
          </Box>
        )}
      </Box>

      <Box
        className="flex flex-col flex-1 min-w-0"
        sx={{
          marginTop: isViewer ? "8px" : "20px",
          marginBottom: isViewer ? "10px" : "0",
          marginLeft: isViewer ? "16px" : "0",
          gap: "8px",
        }}
      >
        <Box className="flex justify-between items-center">
          {coverTitle && (
            <Box
              component="h3"
              sx={{
                fontSize: "20px",
                fontWeight: 600,

                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",

                minWidth: 0,
                flex: 1,
              }}
            >
              {coverTitle}
            </Box>
          )}

          {!isViewer && !hasPlaylistId && (
            <Box className="flex items-center gap-1">
              <FaRegHeart />
              <Box className="S4">{likeCount}</Box>
            </Box>
          )}

          {isPlaylistManageCard &&
            playListOptionButtonClickHandler &&
            openDeleteModal &&
            navigateToEdit && (
              <PlaylistOptionButton
                onClick={playListOptionButtonClickHandler}
                isLogin={true}
                openDeleteModal={openDeleteModal}
                navigateToEdit={navigateToEdit}
              />
            )}
        </Box>

        {isPlaylistManageCard && (
          <Box
            onClick={(e) => {
              e.stopPropagation();
              handleNavigate();
            }}
            sx={{
              width: "fit-content",

              display: "flex",
              alignItems: "center",
              gap: "6px",

              fontSize: "12px",
              color: "#555",

              cursor: "pointer",

              "&:hover": {
                color: "#000",
              },
            }}
          >
            <span>전체 재생목록 보기</span>

            <Box
              component="span"
              sx={{
                fontSize: "18px",
                lineHeight: 1,
                transform: "translateY(-1px)",
              }}
            >
              ›
            </Box>
          </Box>
        )}

        <Box className="flex gap-2 items-center overflow-hidden min-w-0">
          {!isPlaylistManageCard && (
            <Box className="flex gap-2 items-center overflow-hidden min-w-0">
              <Box className="flex-shrink-0 S4">
                {genres.find((g) => g.value === coverGenre)?.title || "기타"}
              </Box>

              <Box className="w-[1px] h-4 bg-black flex-shrink-0" />

              <Box
                className="overflow-hidden text-ellipsis whitespace-nowrap min-w-0 flex-1 S4"
                sx={{
                  color: theme.palette.genre.primary,
                }}
              >
                {tags?.map((tag) => (
                  <span key={tag} className="text-xs mr-2">
                    #{tag}
                  </span>
                ))}
              </Box>
            </Box>
          )}

          <Box
            className="overflow-hidden text-ellipsis whitespace-nowrap min-w-0 flex-1 S4"
            sx={{
              color: theme.palette.genre.primary,
            }}
          >
            {tags?.map((tag) => (
              <span key={tag} className="text-xs mr-2">
                #{tag}
              </span>
            ))}
          </Box>
        </Box>

        {isViewer && !hasPlaylistId && (
          <Box className="flex items-center gap-1">
            <FaRegHeart />
            <Box className="S4">{likeCount}</Box>
          </Box>
        )}
      </Box>
    </Box>
  );

  if (isPlaylistManageCard) {
    return cardContent;
  }

  return (
    <Link href={href} style={{ flex: 1 }}>
      {cardContent}
    </Link>
  );
};

export default PostCard;
