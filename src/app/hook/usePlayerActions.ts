"use client";

import React from "react";
import { useRouter } from "next/navigation";

import { fetchLike, fetchUnlike } from "@/app/api/cover/like";
import { deletePost } from "@/app/api/cover/post";
import { reportPost } from "@/app/api/cover/reportPost";
import { fetchAuthMeWithCookie } from "@/app/api/auth/authMe";

import { useAuthStore } from "@/app/store/useAuthStore";
import { useModalStore } from "@/app/store/useModalStore";
import { useSnackbarStore } from "@/app/store/useSnackbar";

type UsePlayerActionsParams = {
  coverId: string | number;
  initialIsLiked?: boolean;
  initialLikeCount?: number;

  editHref?: string;
  afterDeleteHref?: string;

  onDeleteModalClose?: () => void;
  onReportModalClose?: () => void;
};

export const usePlayerActions = ({
  coverId,
  initialIsLiked = false,
  initialLikeCount = 0,
  editHref,
  afterDeleteHref = "/",
  onDeleteModalClose,
  onReportModalClose,
}: UsePlayerActionsParams) => {
  const router = useRouter();

  const accessToken = useAuthStore((state) => state.accessToken);
  const isLogin = useAuthStore((state) => state.isLogin);
  const openLoginModal = useModalStore((state) => state.openLoginModal);

  const [isLiked, setIsLiked] = React.useState(initialIsLiked);
  const [likeCount, setLikeCount] = React.useState(initialLikeCount);
  const [isLikeLoading, setIsLikeLoading] = React.useState(false);

  React.useEffect(() => {
    setIsLiked(initialIsLiked);
    setLikeCount(initialLikeCount);
  }, [initialIsLiked, initialLikeCount, coverId]);

  const checkAuthenticated = async (message: string) => {
    const isAuthenticated = await fetchAuthMeWithCookie(accessToken);

    if (!isAuthenticated.success) {
      openLoginModal();
      useSnackbarStore.getState().show(message, "error");
      return false;
    }

    return true;
  };

  const navigateToEdit = async () => {
    const isAuthenticated =
      await checkAuthenticated("로그인 후 수정할 수 있습니다.");

    if (!isAuthenticated) return;

    if (editHref) {
      router.push(editHref);
      return;
    }

    router.push(`/post/${coverId}/edit`);
  };

  const reportHandler = async () => {
    const isAuthenticated =
      await checkAuthenticated("로그인 후 신고할 수 있습니다.");

    if (!isAuthenticated) {
      onReportModalClose?.();
      return;
    }

    try {
      const reportResult = await reportPost(String(coverId));

      if (reportResult.data.success) {
        useSnackbarStore.getState().show("신고가 접수되었습니다.", "success");
      } else {
        useSnackbarStore.getState().show("신고 실패", "error");
      }
    } catch {
      useSnackbarStore.getState().show("신고 실패", "error");
    } finally {
      onReportModalClose?.();
    }
  };

  const deleteHandler = async () => {
    const isAuthenticated =
      await checkAuthenticated("로그인 후 삭제할 수 있습니다.");

    if (!isAuthenticated) {
      onDeleteModalClose?.();
      return;
    }

    try {
      const deleteResult = await deletePost(String(coverId));

      if (deleteResult.success) {
        useSnackbarStore.getState().show("삭제가 완료되었습니다.", "success");
        router.push(afterDeleteHref);
      } else {
        useSnackbarStore.getState().show("삭제 실패", "error");
      }
    } catch {
      useSnackbarStore.getState().show("삭제 실패", "error");
    } finally {
      onDeleteModalClose?.();
    }
  };

  const likeToggleHandler = async () => {
    if (!isLogin || !accessToken) {
      openLoginModal();

      useSnackbarStore
        .getState()
        .show("로그인 후 좋아요를 할 수 있습니다.", "error");

      return;
    }

    if (isLikeLoading) return;

    setIsLikeLoading(true);

    try {
      if (isLiked) {
        const unlikeResult = await fetchUnlike(String(coverId));

        if (!unlikeResult.success) {
          useSnackbarStore
            .getState()
            .show("좋아요 취소에 실패했습니다.", "error");
          return;
        }

        setIsLiked(false);
        setLikeCount((prev) => Math.max(prev - 1, 0));
        useSnackbarStore.getState().show("좋아요가 취소되었습니다.", "success");
      } else {
        const likeResult = await fetchLike(String(coverId));

        if (!likeResult.success) {
          useSnackbarStore.getState().show("좋아요에 실패했습니다.", "error");
          return;
        }

        setIsLiked(true);
        setLikeCount((prev) => prev + 1);
        useSnackbarStore.getState().show("좋아요가 추가되었습니다.", "success");
      }
    } finally {
      setIsLikeLoading(false);
    }
  };
  const goBack = () => {
    router.back();
  };

  return {
    isLiked,
    likeCount,
    isLikeLoading,
    navigateToEdit,
    reportHandler,
    deleteHandler,
    likeToggleHandler,
    goBack,
  };
};
