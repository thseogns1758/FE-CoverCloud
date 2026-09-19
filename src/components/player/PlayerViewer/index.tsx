"use client";

import React from "react";
import {
  Box,
  Button,
  Skeleton,
  SwipeableDrawer,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";

import {
  detectAndValidateMediaUrl,
  MediaPlatform,
  MediaUrlResult,
  resolveMediaUrl,
} from "@/app/utils/youtube";
import theme from "@/app/lib/theme";

import VideoPlayer from "@/components/player/components/VideoPlayer";
import PlayLikeCount from "@/components/player/components/PlayLikeCount";
import ArtistInfo from "@/components/player/components/ArtistInfo";
import CommentSection from "@/components/player/components/CommentSection";
import PopularVideos from "@/components/player/components/PopularVideos";
import AddPlaylistButton from "@/components/playlist/AddPlaylistButton";
import OptionButton from "@/components/OptionButton";
import { PlayerViewerProps } from "../playerTypes";
import { useAuthMeQuery } from "@/app/api/auth/authMe";
import PlaylistVideos from "../components/PlaylistVideos";

const genres = [
  { title: "K-POP", value: "K_POP" },
  { title: "J-POP", value: "J_POP" },
  { title: "POP", value: "POP" },
  { title: "기타", value: "OTHER" },
];

const PlayerViewer = ({
  data,
  userProfileImage = "",
  isMobile,
  isLikedLoading = false,
  isVideolistLoading = false,
  playListItems = [],
  playlistId,
  isPlaylistPlayer = false,

  showComments = true,
  showAddPlaylistButton = true,
  showOptions = true,
  showPopularVideos = true,
  showLikeCount = true,

  onBack,
  onLikeToggle,
  onVideoEnded,
  onEdit,
  onDelete,
  onReport,

  getAspectRatio,
}: PlayerViewerProps) => {
  const router = useRouter();
  const [isCommentOpen, setIsCommentOpen] = React.useState(false);
  const [videoData, setVideoData] = React.useState<MediaUrlResult>({
    platform: null,
    id: null,
    isValid: false,
    originalUrl: "",
  });

  const userInfo = useAuthMeQuery();
  const loginUserId = userInfo.data?.data?.userId ?? null;
  const isOwner = loginUserId === data.userId;

  React.useEffect(() => {
    let isMounted = true;

    const resolveVideoData = async () => {
      if (!data.link) {
        setVideoData({
          platform: null,
          id: null,
          isValid: false,
          originalUrl: "",
        });
        return;
      }

      const resolved = await resolveMediaUrl(data.link);

      if (!isMounted) return;

      setVideoData(resolved);
    };

    resolveVideoData();

    return () => {
      isMounted = false;
    };
  }, [data.link]);
  return (
    <Box className="main-wrapper">
      <Box className="post-content">
        {isMobile && (
          <Box
            className="flex justify-between"
            sx={{
              my: "20px",
              mx: "10px",
            }}
          >
            <Box className="flex items-center justify-center" onClick={onBack}>
              <IoIosArrowBack size={24} />
            </Box>

            {showOptions && (
              <OptionButton
                isLogin={isOwner}
                openDeleteModal={onDelete}
                navigateToEdit={onEdit}
                openReportModal={onReport}
              />
            )}
          </Box>
        )}

        <Box sx={{ marginBottom: "12px" }}>
          {videoData.embedUrl ? (
            <VideoPlayer
              videoId={videoData.embedUrl}
              videoType={videoData.platform as MediaPlatform}
              videoData={videoData}
              onVideoEnded={onVideoEnded}
              getAspectRatio={getAspectRatio}
              autoPlay={isPlaylistPlayer}
            />
          ) : (
            <Skeleton
              variant="rounded"
              width="100%"
              sx={{
                aspectRatio: getAspectRatio(videoData),
                borderRadius: "12px",
                height: videoData?.platform === "soundcloud" ? "200px" : "auto",
              }}
              animation="wave"
            />
          )}
        </Box>

        <Box>
          <Box className="flex justify-between items-center">
            <h1 className="H1 mb-1">{data.coverTitle}</h1>

            {!isMobile && (
              <Box className="flex gap-4">
                {showLikeCount && (
                  <PlayLikeCount
                    viewCount={data.viewCount}
                    likeCount={data.likeCount ?? 0}
                    isLiked={data.isLiked ?? false}
                    isLoading={isLikedLoading}
                    isMobile={isMobile}
                    onLikeToggle={onLikeToggle}
                  />
                )}

                {showOptions && (
                  <OptionButton
                    isLogin={isOwner}
                    openDeleteModal={onDelete}
                    navigateToEdit={onEdit}
                    openReportModal={onReport}
                    isCenter
                  />
                )}
              </Box>
            )}
          </Box>

          <Box className="flex B1 mb-2">
            <Box>커버 아티스트： </Box>
            <Box sx={{ fontWeight: "bold" }}>{data.coverArtist}</Box>
          </Box>

          {data.createdAt && (
            <Box className="flex C2 mb-4">
              <Box>{data.createdAt} 작성</Box>
            </Box>
          )}

          <Box
            className="flex gap-2 items-center min-w-0"
            sx={{ marginBottom: "20px", flexWrap: "wrap" }}
          >
            <Box className="flex-shrink-0 S3">
              {genres.find((g) => g.value === data.coverGenre)?.title || "기타"}
            </Box>

            <Box className="w-[1px] h-4 bg-black flex-shrink-0" />

            <Box
              className="flex flex-1"
              sx={{
                fontSize: "16px",
                fontWeight: "bold",
                color: theme.palette.purple.primary,
                flexWrap: "wrap",
              }}
            >
              {data.tags?.map((tag) => (
                <Box
                  key={tag}
                  className="mr-2"
                  sx={{ cursor: "pointer", "&:hover": { opacity: 0.7 } }}
                  onClick={() =>
                    router.push(
                      `/search?q=${encodeURIComponent(tag)}&searchType=tags`,
                    )
                  }
                >
                  #{tag}
                </Box>
              ))}
            </Box>
          </Box>

          {isMobile && showLikeCount && (
            <Box className="mb-5">
              <PlayLikeCount
                viewCount={data.viewCount}
                likeCount={data.likeCount ?? 0}
                isLiked={data.isLiked ?? false}
                isLoading={isLikedLoading}
                isMobile={isMobile}
                onLikeToggle={onLikeToggle}
              />
            </Box>
          )}

          <ArtistInfo
            coverArtist={data.originalArtist || "정보없음"}
            songTitle={data.originalTitle || "정보없음"}
            coverUrl={data.originalCoverImageUrl || ""}
            isMobile={isMobile}
          />

          {showAddPlaylistButton && <AddPlaylistButton coverId={data.id} />}

          {showComments && isMobile && (
            <Box
              onClick={() => setIsCommentOpen(true)}
              sx={{
                p: 2,
                bgcolor: theme.palette.gray.secondary,
                borderRadius: "8px",
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Box className="B1">댓글 보기</Box>
              <Typography sx={{ color: theme.palette.gray.primary }} />
            </Box>
          )}

          {showComments && !isMobile && (
            <CommentSection
              id={data.id}
              currentUserId={loginUserId}
              userProfileImage={userProfileImage}
            />
          )}
        </Box>
      </Box>
      {/* 여기서 Popular 리스트 컴포넌트 보여줄지 아니면 플레이리스트 컴포넌트 보여줄지 결정 */}

      <Box className="sidebar-content">
        {showPopularVideos ? (
          <PopularVideos isViewer={!isMobile} currentCoverId={data.id} />
        ) : (
          <PlaylistVideos
            isViewer={!isMobile}
            playlistId={playlistId || 0}
            data={playListItems || []}
            isVideolistLoading={isVideolistLoading}
          />
        )}
      </Box>

      {showComments && isMobile && (
        <SwipeableDrawer
          anchor="bottom"
          open={isCommentOpen}
          onClose={() => setIsCommentOpen(false)}
          onOpen={() => setIsCommentOpen(true)}
          PaperProps={{
            sx: {
              height: "75dvh",
              borderTopLeftRadius: "20px",
              borderTopRightRadius: "20px",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 2,
              borderBottom: "1px solid #eee",
            }}
          >
            <Typography variant="h6" fontWeight={700}>
              댓글
            </Typography>

            <Button onClick={() => setIsCommentOpen(false)}>
              <IoCloseSharp size={32} />
            </Button>
          </Box>

          <Box sx={{ flexGrow: 1, overflowY: "auto", p: 2 }}>
            <CommentSection
              id={data.id}
              currentUserId={loginUserId}
              userProfileImage={userProfileImage}
            />
          </Box>
        </SwipeableDrawer>
      )}
    </Box>
  );
};

export default PlayerViewer;
