// export type CommentData = {
//   id: string;
//   userId: string;
//   createdAt: string;
//   updatedAt: string;
//   parentCommentId: string | null;
//   userAvatarImageUrl: string;
//   userName: string;
//   comment: string;
//   likes: number;
//   replies: CommentListData[];
// };
export type CommentListData = {
  commentId: number;
  content: string;
  coverId: number;
  userId: number;
  parentCommentId: number | null;
  replies: CommentListData[];
  likeCount: number;
  isLiked: boolean;
  createdAt: string;
  nickname: string;
  profileImageUrl: string | null;
};
