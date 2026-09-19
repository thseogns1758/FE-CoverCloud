"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "@mui/material";

import PlayerViewer from "@/components/player/PlayerViewer";
import ConfirmModal from "@/components/player/components/ConfirmModal";

import theme from "@/app/lib/theme";
import { MediaUrlResult } from "@/app/utils/youtube";

import { usePlaylistDetailQuery } from "@/app/api/mypage/playlist/playlist";
import { useReadingPost } from "@/app/api/cover/post";

import { PlaylistItem } from "@/app/mypage/playlist/components/playlistTypes";
import { usePlayerActions } from "@/app/hook/usePlayerActions";
import { useSearchParamUpdater } from "@/app/hook/useSearchParamsUpdater";

type PlaylistPlayerClientProps = {
  playlistId: string;
};

/**
 * Fisher-Yates Shuffle
 *
 * 원본 배열은 건드리지 않고
 * 복사본만 랜덤 순서로 변경
 */
const shuffleArray = <T,>(items: T[]): T[] => {
  if (items.length <= 1) {
    return [...items];
  }

  const shuffled = [...items];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // 셔플 결과가 원래 순서와 완전히 같으면
  // 앞의 두 개를 바꿔서 최소한 순서가 달라지게 함
  const isSameOrder = shuffled.every((item, index) => item === items[index]);

  if (isSameOrder) {
    [shuffled[0], shuffled[1]] = [shuffled[1], shuffled[0]];
  }

  return shuffled;
};

const PlaylistPlayerClient = ({ playlistId }: PlaylistPlayerClientProps) => {
  const router = useRouter();

  const { searchParams, updateParams, getNumberParam } =
    useSearchParamUpdater();

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const playlistIdNum = Number(playlistId);

  /**
   * 실제 재생에 사용할 큐
   *
   * 순차재생:
   * 1 → 2 → 3
   *
   * 랜덤재생:
   * 3 → 1 → 2
   *
   * 한 번 만들어진 뒤 곡이 넘어갈 때마다
   * 다시 섞지 않음.
   */
  const [videoItems, setVideoItems] = React.useState<PlaylistItem[]>([]);

  const { data, isLoading } = usePlaylistDetailQuery(playlistIdNum);

  /**
   * 서버에서 받은 원본 플레이리스트
   */
  const serverItems = React.useMemo<PlaylistItem[]>(
    () => data?.data?.items ?? [],
    [data?.data?.items],
  );

  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);

  const [isReportModalOpen, setIsReportModalOpen] = React.useState(false);

  /**
   * URL
   *
   * sequential
   * shuffle
   */
  const mode = searchParams.get("mode") ?? "sequential";

  /**
   * /play
   * → itemIdParam null
   *
   * /play?itemId=18
   * → itemIdParam "18"
   */
  const itemIdParam = searchParams.get("itemId");

  const itemId = getNumberParam("itemId", 0);

  /**
   * ==========================================
   * 재생 Queue 생성
   * ==========================================
   *
   * 여기서 랜덤/순차를 결정한다.
   */
  React.useEffect(() => {
    if (!serverItems.length) {
      setVideoItems([]);
      return;
    }

    /**
     * position 기준으로 원래 순서 정렬
     */
    const sortedItems = [...serverItems].sort(
      (a, b) => a.position - b.position,
    );

    /**
     * 랜덤 재생
     */
    if (mode === "shuffle") {
      setVideoItems(shuffleArray(sortedItems));

      return;
    }

    /**
     * 순차 재생
     */
    setVideoItems(sortedItems);
  }, [serverItems, mode]);

  /**
   * ==========================================
   * 현재 재생 위치
   * ==========================================
   *
   * 중요:
   * 이제 server items가 아니라
   * 실제 재생 Queue인 videoItems 기준으로 찾음.
   */
  const currentIndex = React.useMemo(() => {
    if (!videoItems.length) {
      return -1;
    }

    /**
     * itemId가 없으면 Queue의 첫 곡
     *
     * sequential:
     * position 0의 곡
     *
     * shuffle:
     * 랜덤 Queue의 첫 곡
     */
    if (!itemIdParam) {
      return 0;
    }

    if (!Number.isFinite(itemId) || itemId <= 0) {
      return 0;
    }

    const foundIndex = videoItems.findIndex((item) => item.itemId === itemId);

    return foundIndex === -1 ? 0 : foundIndex;
  }, [videoItems, itemIdParam, itemId]);

  /**
   * 현재 곡
   */
  const currentItem = videoItems[currentIndex];

  /**
   * 게시글 상세조회는 coverId 사용
   */
  const currentCoverId = currentItem?.coverId ?? 0;

  const {
    data: postData,
    isLoading: isPostLoading,
    isFetching: isPostFetching,
    error: postError,
  } = useReadingPost(currentCoverId ? String(currentCoverId) : "");

  const post = postData?.data?.data;

  const getAspectRatio = (videoData: MediaUrlResult | null) => {
    if (!videoData || !videoData.platform) {
      return "16 / 9";
    }

    switch (videoData.platform) {
      case "soundcloud":
        return "100 / 20";

      default:
        return "16 / 9";
    }
  };

  /**
   * ==========================================
   * 특정 곡으로 이동
   * ==========================================
   */
  const moveToItem = (nextItemId: number) => {
    if (nextItemId === currentItem?.itemId) return;

    updateParams({
      itemId: nextItemId,
      mode,
    });
  };

  const {
    isLiked,
    likeCount,
    isLikeLoading,
    navigateToEdit,
    reportHandler,
    deleteHandler,
    likeToggleHandler,
  } = usePlayerActions({
    coverId: currentCoverId,

    initialIsLiked: post?.isLiked ?? false,

    initialLikeCount: post?.likeCount ?? 0,

    editHref: `/post/${currentCoverId}/edit`,

    afterDeleteHref: `/mypage/playlist/${playlistId}/play${
      currentItem?.itemId ? `?itemId=${currentItem.itemId}` : ""
    }`,

    onDeleteModalClose: () => setIsDeleteModalOpen(false),

    onReportModalClose: () => setIsReportModalOpen(false),
  });

  /**
   * ==========================================
   * 영상 종료 → 다음 곡
   * ==========================================
   *
   * videoItems가 실제 Queue이므로
   *
   * sequential:
   * 1 → 2 → 3
   *
   * shuffle:
   * 3 → 1 → 2
   *
   * 그대로 다음 배열 위치로 이동한다.
   */
  const handleVideoEnded = () => {
    if (!videoItems.length || currentIndex === -1 || !currentItem) return;

    if (mode === "shuffle") {
      const candidates = videoItems.filter(
        (item) => item.itemId !== currentItem.itemId,
      );

      // 곡이 1개뿐이면 다음 곡 없음
      if (candidates.length === 0) return;

      const randomIndex = Math.floor(Math.random() * candidates.length);

      const nextItem = candidates[randomIndex];

      moveToItem(nextItem.itemId);

      return;
    }

    // 순차 재생
    const nextIndex =
      currentIndex >= videoItems.length - 1 ? 0 : currentIndex + 1;

    const nextItem = videoItems[nextIndex];

    if (!nextItem) return;

    moveToItem(nextItem.itemId);
  };
  /**
   * Queue 생성 전
   */
  if (isLoading || !videoItems.length) {
    if (!isLoading && !serverItems.length) {
      return <div>플레이리스트에 재생할 곡이 없습니다.</div>;
    }

    return <div>불러오는 중...</div>;
  }

  if (!currentItem) {
    return <div>재생할 곡이 없습니다.</div>;
  }

  if (postError) {
    return <div>게시글 정보를 불러오지 못했습니다.</div>;
  }

  if (!post) {
    return <div>게시글 데이터가 없습니다.</div>;
  }

  const playerData = {
    id: post.coverId ?? currentCoverId,

    userId: post.userId ?? 0,

    link: post.link ?? "",

    coverTitle: post.coverTitle ?? "",

    coverArtist: post.coverArtist ?? "",

    originalTitle: post.originalTitle ?? "",

    originalArtist: post.originalArtist ?? "",

    originalCoverImageUrl: post.originalCoverImageUrl ?? "",

    coverGenre: post.coverGenre ?? "",

    tags: post.tags ?? [],

    createdAt: post.createdAt ?? "",

    likeCount,

    viewCount: post.viewCount ?? 0,

    isLiked,
  };

  return (
    <>
      <PlayerViewer
        data={playerData}
        playlistId={playlistIdNum}
        /*
         * 중요
         *
         * 기존 items가 아니라
         * 실제 재생 순서인 videoItems 전달
         */
        playListItems={videoItems}
        userProfileImage=""
        isMobile={isMobile}
        isLikedLoading={isLikeLoading}
        isVideolistLoading={isLoading || isPostLoading || isPostFetching}
        showComments
        showAddPlaylistButton
        showOptions
        showPopularVideos={false}
        showLikeCount
        isPlaylistPlayer
        onVideoEnded={handleVideoEnded}
        getAspectRatio={getAspectRatio}
        onBack={() => router.back()}
        onLikeToggle={likeToggleHandler}
        onEdit={navigateToEdit}
        onDelete={() => setIsDeleteModalOpen(true)}
        onReport={() => setIsReportModalOpen(true)}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="게시글 삭제"
        description={
          <>
            삭제한 게시글은 다시 복구할 수 없습니다.
            <br />
            정말 삭제하시겠습니까?
          </>
        }
        confirmText="삭제"
        confirmColor="error"
        onConfirm={deleteHandler}
      />

      <ConfirmModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        title="게시글 신고"
        description="게시글을 신고하시겠습니까?"
        confirmText="신고"
        confirmColor="error"
        onConfirm={reportHandler}
      />
    </>
  );
};

export default PlaylistPlayerClient;
