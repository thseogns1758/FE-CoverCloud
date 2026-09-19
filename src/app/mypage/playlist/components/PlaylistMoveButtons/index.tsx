"use client";

import React from "react";
import { Box, Button } from "@mui/material";
import { MoveDirection } from "../playlistTypes";

type PlaylistMoveButtonsProps = {
  // onMove: (direction: MoveDirection) => void;
  onDelete: () => void;
};

const PlaylistMoveButtons = ({
  // onMove,
  onDelete,
}: PlaylistMoveButtonsProps) => {
  const handleMove = (
    e: React.MouseEvent<HTMLButtonElement>,
    direction: MoveDirection,
  ) => {
    e.stopPropagation();
    // onMove(direction);
  };

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onDelete();
  };

  return (
    <Box className="flex shrink-0 items-center gap-1">
      {/* <Button
        size="small"
        variant="outlined"
        onClick={(e) => handleMove(e, "top")}
      >
        맨 위
      </Button>

      <Button
        size="small"
        variant="outlined"
        onClick={(e) => handleMove(e, "up")}
      >
        ↑
      </Button>

      <Button
        size="small"
        variant="outlined"
        onClick={(e) => handleMove(e, "down")}
      >
        ↓
      </Button>

      <Button
        size="small"
        variant="outlined"
        onClick={(e) => handleMove(e, "bottom")}
      >
        맨 아래
      </Button> */}

      <Button
        size="small"
        variant="outlined"
        color="error"
        onClick={handleDelete}
      >
        삭제
      </Button>
    </Box>
  );
};

export default PlaylistMoveButtons;
