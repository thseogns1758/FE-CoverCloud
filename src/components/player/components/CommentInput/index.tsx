"use client";
import React from "react";
import { Avatar, Box, Button, TextField } from "@mui/material";
import theme from "@/app/lib/theme";
import { useCreateCommentMutation } from "@/app/api/cover/comment";
import { useAuthStore } from "@/app/store/useAuthStore";
import { useSnackbarStore } from "@/app/store/useSnackbar";
import { useModalStore } from "@/app/store/useModalStore";
const DEFAULT_IMAGE = "/asset/image/default-image.png";
interface CommentInputProps {
  onSubmit: (data: string) => void;
  depth?: number;
  id: number;
  parentId?: number | null;
  userProfileImage: string;
}

const CommentInput = ({
  onSubmit,
  depth = 0,
  id,
  parentId,
  userProfileImage,
}: CommentInputProps) => {
  const accessToken = useAuthStore((state) => state.accessToken);

  const [comment, setComment] = React.useState("");
  const [isImageLoading, setIsImageLoading] = React.useState(true);
  const [imageSrc, setImageSrc] = React.useState(userProfileImage);

  const isLogin = useAuthStore((state) => state.isLogin);
  const createMutation = useCreateCommentMutation();

  const openLoginModal = useModalStore((state) => state.openLoginModal);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const normalizedComment = comment.trim();
    if (!normalizedComment) return;
    if (!isLogin || !accessToken) {
      openLoginModal();
      useSnackbarStore
        .getState()
        .show("로그인 후 댓글을 작성할 수 있습니다.", "error");
      return;
    }

    onSubmit(normalizedComment);
    setComment("");
    if (parentId) {
      createMutation.mutate(
        {
          comment: normalizedComment,
          coverId: id,
          parentCommentId: parentId,
          accessToken,
        },
        {
          onSuccess: () => {
            useSnackbarStore
              .getState()
              .show("댓글이 등록되었습니다.", "success");
          },
          onError: () => {
            useSnackbarStore
              .getState()
              .show("댓글등록에 실패했습니다.", "error");
          },
        },
      );
    } else {
      createMutation.mutate(
        { comment: normalizedComment, coverId: id, accessToken },
        {
          onSuccess: () => {
            useSnackbarStore
              .getState()
              .show("댓글이 등록되었습니다.", "success");
          },
          onError: () => {
            useSnackbarStore
              .getState()
              .show("댓글등록에 실패했습니다.", "error");
          },
        },
      );
    }
  };

  const userAvatarImageUrl = "";
  const userName = "";
  React.useEffect(() => {
    if (!userProfileImage) {
      // setImageSrc(DEFAULT_IMAGE);
    } else {
      setImageSrc(userProfileImage);
    }
  }, [userProfileImage]);
  return (
    <Box>
      <Box
        className={`flex justify-end items-center gap-2 ${
          depth > 0 ? "ml-[32px]" : ""
        }`}
        component="form"
        onSubmit={(e) => handleSubmit(e)}
        mb={2}
      >
        <Box className="relative w-[36px] h-[36px] flex-shrink-0 rounded-full overflow-hidden">
          {/* {(isImageLoading || !imageSrc) && (
            <Skeleton
              variant="rectangular"
              width="100%"
              height="100%"
              animation="wave"
              sx={{ position: "absolute", inset: 0, zIndex: 1 }}
            />
          )} */}
          <Avatar sx={{ width: 36, height: 36 }} src={imageSrc} />
          {/* Image: 소스가 있을 때만 렌더링 */}
          {/* {imageSrc && (
            <Image
              src={imageSrc}
              alt={`프로필 이미지`}
              fill
              sizes="(max-width: 768px) 48px, 52px"
              className="object-cover"
              style={{
                opacity: isImageLoading ? 0 : 1,
                transition: "opacity 0.3s ease",
              }}
              onLoad={() => setIsImageLoading(false)}
              onError={() => {
                // setImageSrc(DEFAULT_IMAGE);
                setIsImageLoading(false);
              }}
            />
          )} */}
          {/* {isImageLoading || userAvatarImageUrl ? (
            <Skeleton
              variant="rectangular"
              width="100%"
              height="100%"
              className="absolute inset-0"
            />
          ) : (
            <Image
              src={userAvatarImageUrl}
              alt={userName}
              fill
              sizes="(max-width: 768px) 48px, 52px"
              style={{ objectFit: "cover", borderRadius: 4 }}
              onLoad={() => setIsImageLoading(false)}
              onError={() => setIsImageLoading(false)}
            />
          )} */}
        </Box>
        <TextField
          label="댓글을 입력하세요"
          fullWidth
          multiline
          variant="standard"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <Button
          type="submit"
          sx={{
            mt: 1,
            backgroundColor: theme.palette.common.black,
            color: "white",
            borderRadius: "20px",
            "&:disabled": {
              backgroundColor: theme.palette.gray.primary,
              color: "white",
            },
            "&:hover": {
              backgroundColor: theme.palette.gray.fourth,
            },
          }}
          disabled={!comment.trim()}
        >
          <Box className="S3">작성</Box>
        </Button>
      </Box>
    </Box>
  );
};

export default CommentInput;
