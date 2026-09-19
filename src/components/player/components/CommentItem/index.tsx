import React, { useEffect } from "react";
import {
  Avatar,
  Box,
  Button,
  FormControl,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";
import { CommentListData } from "../CommentSection/type";
import { FaComment, FaHeart, FaRegComment, FaRegHeart } from "react-icons/fa";
import { FaArrowTurnUp } from "react-icons/fa6";
import CommentInput from "../CommentInput";
import theme from "@/app/lib/theme";
import OptionButton from "@/components/OptionButton";
import {
  useCommentLikeMutation,
  useDeleteCommentMutation,
  useUpdateCommentMutation,
} from "@/app/api/cover/comment";
import { useAuthStore } from "@/app/store/useAuthStore";
import { useSnackbarStore } from "@/app/store/useSnackbar";

import { useModalStore } from "@/app/store/useModalStore";
import { useFormatCreatedAt } from "@/app/utils/formetCreatedAt";
import { reportComment } from "@/app/api/cover/reportPost";

interface CommentItemProps extends CommentListData {
  depth?: number; // 뎁스 정보 추가
  onReplySubmit?: (data: string, id: number) => void;
  openCmmentInput?: boolean;
  openCommentInputHandler?: (id: number) => void;
  currentUserId: number;
  userProfileImage: string;
}
const DEFAULT_IMAGE = "/asset/image/default-image.png";

const CommentItem = ({
  currentUserId,
  commentId,
  coverId,
  userId,
  content,
  parentCommentId,
  likeCount,
  isLiked,
  createdAt,
  nickname,
  profileImageUrl,
  replies,
  depth = 0,
  onReplySubmit,
  openCmmentInput,
  openCommentInputHandler,
  userProfileImage,
}: CommentItemProps) => {
  const deleteCommentMutation = useDeleteCommentMutation();
  const updateCommentMutation = useUpdateCommentMutation();
  const accessToken = useAuthStore((state) => state.accessToken);
  const isLogin = useAuthStore((state) => state.isLogin);
  const openLoginModal = useModalStore((state) => state.openLoginModal);
  const [isImageLoading, setIsImageLoading] = React.useState(true);
  const [isCommentEdit, setIsCommentEdit] = React.useState(false);
  const [editContent, setEditContent] = React.useState(content);
  const [imageSrc, setImageSrc] = React.useState(
    profileImageUrl || DEFAULT_IMAGE,
  );
  const size = Math.max(48 - depth * 12, 24);

  const likeComment = useCommentLikeMutation();
  const likeCommentHandler = async () => {
    if (!isLogin || !accessToken) {
      openLoginModal();
      useSnackbarStore
        .getState()
        .show("로그인 후 좋아요를 할 수 있습니다.", "error");
      return;
    }

    likeComment.mutate({
      commentId,
      coverId,
      accessToken,
    });
  };

  const deleteCommentHandler = () => {
    if (!isLogin || !accessToken) {
      openLoginModal();
      useSnackbarStore
        .getState()
        .show("로그인 후 댓글을 삭제할 수 있습니다.", "error");
      return;
    }
    deleteCommentMutation.mutate(
      {
        commentId,
        accessToken,
        coverId,
      },
      {
        onSuccess: () => {
          // TODO: 댓글 삭제 성공 시 처리
          useSnackbarStore.getState().show("댓글이 삭제되었습니다.", "success");
        },
        onError: (error) => {
          // TODO: 댓글 삭제 실패 시 처리
          useSnackbarStore.getState().show("댓글삭제에 실패했습니다.", "error");
        },
      },
    );
  };

  const cancleEditHabler = () => {
    setIsCommentEdit(false);

    setEditContent(content);
  };

  const commentEditHandler = () => {
    const normalizedComment = editContent.trim();
    if (!normalizedComment) return;
    if (normalizedComment === content) {
      return;
    }
    if (!isLogin || !accessToken) {
      openLoginModal();
      useSnackbarStore
        .getState()
        .show("로그인 후 댓글을 수정할 수 있습니다.", "error");
      return;
    }
    updateCommentMutation.mutate(
      {
        commentId,
        content: normalizedComment,
        accessToken,
        coverId,
      },
      {
        onSuccess: () => {
          // TODO: 댓글 수정 성공 시 처리
          setIsCommentEdit(false);
          useSnackbarStore.getState().show("댓글이 수정돠었습니다.", "success");
        },
        onError: (error) => {
          // TODO: 댓글 수정 실패 시 처리
          setIsCommentEdit(false);
          useSnackbarStore.getState().show("댓글수정에 실패했습니다.", "error");
        },
      },
    );
  };
  const reportCommentHandler = async () => {
    if (!isLogin || !accessToken) {
      openLoginModal();
      useSnackbarStore
        .getState()
        .show("로그인 후 댓글을 신고할 수 있습니다.", "error");
      return;
    }
    const result = await reportComment(commentId);
  };
  useEffect(() => {
    if (profileImageUrl) {
      setImageSrc(profileImageUrl);
      setIsImageLoading(true); // 새 이미지가 오면 로딩 상태 초기화
    } else {
      setImageSrc(DEFAULT_IMAGE);
      setIsImageLoading(false);
    }
  }, [profileImageUrl]);

  return (
    <Box className={`mb-2`} ml={depth * 2}>
      <Box className="flex gap-2 items-start flex-col">
        <Box className="flex justify-between w-full">
          <Box className="flex gap-2 " sx={{ flex: 1 }}>
            {depth > 0 && (
              <Box>
                <Box className="rotate-90 transform mt-3">
                  <FaArrowTurnUp size={16} />
                </Box>
              </Box>
            )}
            <Box
              className="relative flex-shrink-0 rounded-full overflow-hidden"
              width={size}
              height={size}
            >
              {/* 1. 로딩 중일 때만 스켈레톤 표시 */}
              {/* {isImageLoading && (
                <Skeleton
                  variant="circular"
                  width="100%"
                  height="100%"
                  animation="wave"
                  sx={{ position: "absolute", inset: 0, zIndex: 1 }}
                />
              )} */}

              {/* 2. imageSrc가 있을 때만 Next.js Image 렌더링 */}
              {/* {imageSrc && (
                <Image
                  src={imageSrc}
                  alt={`${nickname}의 프로필 이미지`}
                  fill
                  sizes={`${size}px`}
                  className="object-cover"
                  // 이미지 로딩 전까지 투명도 0으로 숨김 (스켈레톤을 보여주기 위해)
                  style={{
                    opacity: isImageLoading ? 0 : 1,
                    transition: "opacity 0.2s ease",
                  }}
                  onLoad={() => setIsImageLoading(false)}
                  onError={() => {
                    setImageSrc(DEFAULT_IMAGE); // 로드 실패 시 기본 이미지로 교체
                    setIsImageLoading(false);
                  }}
                />
              )} */}
              <Avatar sx={{ width: size, height: size }} src={imageSrc} />
            </Box>
            <Box sx={{ width: "100%" }}>
              <Box>
                <Box className="flex items-center gap-2">
                  <Box fontWeight="bold">{nickname || "익명"}</Box>
                  <Box
                    sx={{ fontSize: "12px", color: theme.palette.gray.primary }}
                  >
                    {useFormatCreatedAt(createdAt)}
                  </Box>
                </Box>
                <Box>
                  {isCommentEdit ? (
                    <FormControl sx={{ width: "100%" }}>
                      <TextField
                        fullWidth
                        multiline
                        variant="standard"
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                      />
                      <Box className="flex justify-end gap-2">
                        <Button onClick={cancleEditHabler}>취소</Button>
                        <Button
                          disabled={
                            !editContent.trim() || editContent === content
                          }
                          onClick={commentEditHandler}
                        >
                          저장
                        </Button>
                      </Box>
                    </FormControl>
                  ) : (
                    <Typography sx={{ whiteSpace: "pre-line" }}>
                      {content}
                    </Typography>
                  )}
                </Box>
              </Box>

              <Box className="flex  gap-2 mt-1">
                <Button
                  className="flex items-center gap-1 cursor-pointer"
                  sx={{
                    "&:hover": {
                      backgroundColor: theme.palette.gray.secondary,
                    },
                  }}
                  onClick={() => likeCommentHandler()}
                >
                  {isLiked ? <FaHeart /> : <FaRegHeart />}
                  {likeCount}
                </Button>

                {depth < 1 && (
                  <Button
                    className="flex items-center gap-1 cursor-pointer"
                    sx={{
                      "&:hover": {
                        backgroundColor: theme.palette.gray.secondary,
                      },
                    }}
                    onClick={() => openCommentInputHandler?.(commentId)} // 클릭 시 토글
                  >
                    {openCmmentInput ? <FaComment /> : <FaRegComment />}{" "}
                    {replies.length}
                  </Button>
                )}
              </Box>
            </Box>
          </Box>
          <OptionButton
            colIcon
            isLogin={userId === currentUserId}
            openDeleteModal={deleteCommentHandler}
            navigateToEdit={() => setIsCommentEdit(true)}
            openReportModal={reportCommentHandler}
          />
        </Box>
        {/* 대댓글 */}
        {openCmmentInput && (
          <Box className="mt-2 w-full">
            <CommentInput
              userProfileImage={userProfileImage}
              onSubmit={(data) => onReplySubmit?.(data, commentId)}
              depth={depth + 1}
              id={coverId}
              parentId={commentId}
            />
          </Box>
        )}
        {replies.length > 0 &&
          replies.map((reply) => (
            <Box className="w-full" key={reply.commentId}>
              <CommentItem
                key={reply.commentId}
                {...reply}
                depth={depth + 1}
                currentUserId={currentUserId}
                userProfileImage={userProfileImage}
              />
            </Box>
          ))}
      </Box>
    </Box>
  );
};

export default CommentItem;
