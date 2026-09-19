"use client";

import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import PlaylistMoveButtons from "../PlaylistMoveButtons";
import { MoveDirection, Playlist } from "../playlistTypes";
import PostCard from "@/components/PostCard";

type SortablePlaylistCardProps = {
  playlist: Playlist;
  onClick: () => void;
  // onDelete: () => void;
  // onMove: (direction: MoveDirection) => void;
  openDeleteModal: () => void;
  navigateToEdit: () => void;
};

const SortablePlaylistCard = ({
  playlist,
  onClick,
  // onDelete,
  // onMove,
  openDeleteModal,
  navigateToEdit,
}: SortablePlaylistCardProps) => {
  const { setNodeRef, transform, transition, isDragging } = useSortable({
    id: playlist.playlistId,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: 1,
    position: "relative",
    zIndex: isDragging ? 9999 : 1,
  };

  return (
    <Box
      ref={setNodeRef}
      style={style}
      className={`flex cursor-pointer items-center gap-3 `}
    >
      <PostCard
        commentCount={0}
        coverArtist={playlist.name}
        coverGenre={""}
        playlistId={playlist.playlistId}
        coverTitle={playlist.name}
        createdAt={playlist.createdAt}
        thumbnailUrl={playlist.thumbnailUrl || ""}
        likeCount={0}
        link=""
        musicId={0}
        tags={[]}
        userId={0}
        viewCount={0}
        playListOptionButtonClickHandler={onClick}
        openDeleteModal={openDeleteModal}
        navigateToEdit={navigateToEdit}
        playlistItemCount={playlist.itemCount}
      />
      {/* <Button
        type="button"
        size="small"
        variant="outlined"
        {...attributes}
        {...listeners}
        onClick={(e) => e.stopPropagation()}
        className="min-w-0 cursor-grab active:cursor-grabbing"
      >
        ≡
      </Button>
      <Box className="min-w-0 flex-1">
        <Typography className="truncate font-semibold">
          {playlist.name}
        </Typography>

        {playlist.description && (
            <Typography className="mt-1 truncate text-sm text-gray-500">
              {playlist.description}
            </Typography>
          )}

        <Typography className="mt-1 text-xs text-gray-400">
          {itemCount}곡
        </Typography>
        <Typography className="mt-1 text-xs text-gray-400">
          {playlist.createdAt}
        </Typography>
        <Typography className="mt-1 text-xs text-gray-400">
          {playlist.thumbnailUrl}
        </Typography>
      </Box>
      <PlaylistMoveButtons onDelete={onDelete} /> */}
    </Box>
  );
};

export default SortablePlaylistCard;
