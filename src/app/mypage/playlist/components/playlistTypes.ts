export type MoveDirection = "up" | "down" | "top" | "bottom";

export type PlaylistItem = {
  coverArtist: string;
  coverGenre: string;
  coverId: number;
  coverTitle: string;

  itemId: number;
  likeCount: number;
  link: string;

  originalArtist: string;
  originalCoverImageUrl: string;
  originalTitle: string;
  tags?: string[];
  position: number;
};

export type Playlist = {
  playlistId: number;
  name: string;

  description?: string;
  createdAt: string;
  thumbnailUrl?: string;

  itemCount?: number;
};
