export type PostData = {
  contents: contentData[];
  isFirst: boolean;
  isLast: boolean;
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
};

export type contentData = {
  commentCount: number;
  coverArtist: string;
  coverGenre: string;
  coverId?: number;
  coverTitle: string;
  createdAt: string;
  likeCount: number;
  link: string;
  musicId: number;
  tags?: string[];
  userId: number;
  viewCount?: number;
};

export type Genre = {
  title: string;
  value: string;
  label: string;
};
