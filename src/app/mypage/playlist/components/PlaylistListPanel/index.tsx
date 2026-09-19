"use client";

import { Box, Typography } from "@mui/material";

import SortablePlaylistCard from "../SortablePlaylistCard";

import { Playlist } from "../playlistTypes";
type PlaylistListPanelProps = {
  playlists: Playlist[];

  selectedPlaylist: number | null;

  onSelect: (playlistId: number, playlistName: string) => void;

  openDeleteModal: (playlistId: number, playlistName: string) => void;

  navigateToEdit: (playlistId: number, playlistName: string) => void;
};

const PlaylistListPanel = ({
  playlists,
  selectedPlaylist,
  onSelect,
  openDeleteModal,
  navigateToEdit,
}: PlaylistListPanelProps) => {
  return (
    <Box component="section">
      <Typography
        sx={{
          mb: 2,
          fontSize: "18px",
          fontWeight: 600,
        }}
      >
        플레이리스트
      </Typography>

      {playlists.length === 0 ? (
        <Typography
          sx={{
            fontSize: "14px",
            color: "text.secondary",
          }}
        >
          아직 만든 플레이리스트가 없습니다.
        </Typography>
      ) : (
        <Box
          className="
            grid
            grid-cols-1
            gap-4
            sm:grid-cols-2
            lg:grid-cols-3
          "
        >
          {playlists.map((playlist) => (
            <SortablePlaylistCard
              key={playlist.playlistId}
              playlist={playlist}
              onClick={() => onSelect(playlist.playlistId, playlist.name)}
              openDeleteModal={() =>
                openDeleteModal(playlist.playlistId, playlist.name)
              }
              navigateToEdit={() =>
                navigateToEdit(playlist.playlistId, playlist.name)
              }
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default PlaylistListPanel;
