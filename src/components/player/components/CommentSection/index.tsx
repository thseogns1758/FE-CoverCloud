"use client";
import React, { useEffect } from "react";
import { CommentListData } from "./type";
import { Box, Typography } from "@mui/material";
import CommentItem from "../CommentItem";
import CommentInput from "../CommentInput";
import { useCommentListQuery } from "@/app/api/cover/comment";

interface CommentFormInput {
  comment: string;
}

const CommentSection = ({
  id,
  currentUserId,
  userProfileImage,
}: {
  id: number;
  currentUserId: number;
  userProfileImage: string;
}) => {
  const [commentsData, setCommentsData] = React.useState<CommentListData[]>([]);
  const [totalCommentCount, setTotalCommentCount] = React.useState(0);

  const { data: commentList } = useCommentListQuery(id);

  useEffect(() => {
    if (!commentList?.data) {
      setCommentsData([]);
      return;
    }
    const comments = commentList.data.map((comment: CommentListData) => ({
      coverId: comment.coverId,
      commentId: comment.commentId,
      userId: comment.userId,
      createdAt: new Date().toISOString(), // 서버에서 없으면 임시
      parentCommentId: comment.parentCommentId ?? null,
      content: comment.content,
      replies: comment.replies ?? [],
      likeCount: comment.likeCount,
      isLiked: comment.isLiked,
      nickname: comment.nickname,
      profileImageUrl: comment.profileImageUrl,
    }));
    setCommentsData(comments);
    setTotalCommentCount(commentList.data.length);
  }, [commentList]);

  const conmmentSubmitHandler = (data: string) => {};
  const [selectedCommentId, setSelectedCommentId] = React.useState<
    number | null
  >(null);

  const openCommentInputHandler = (id: number) => {
    setSelectedCommentId(selectedCommentId === id ? null : id);
  };
  const replySubmitHandler = (data: string, parentId: number) => {};

  return (
    <section>
      <Box className="H2">댓글 {totalCommentCount}</Box>

      <Box>
        <CommentInput
          onSubmit={conmmentSubmitHandler}
          id={id}
          userProfileImage={userProfileImage}
        />
        <Box className="mt-2">
          {commentsData.length > 0
            ? commentsData.map((comment: CommentListData) => (
                <CommentItem
                  key={comment.commentId}
                  {...comment}
                  currentUserId={currentUserId}
                  onReplySubmit={(data) =>
                    replySubmitHandler(data, comment.commentId)
                  }
                  openCommentInputHandler={openCommentInputHandler}
                  openCmmentInput={selectedCommentId === comment.commentId}
                  userProfileImage={userProfileImage}
                />
              ))
            : null}
        </Box>
      </Box>
    </section>
  );
};

export default CommentSection;
