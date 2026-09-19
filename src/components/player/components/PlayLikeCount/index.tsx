"use client";

import React from "react";
import { Box, Button } from "@mui/material";
import { FaPlay } from "react-icons/fa";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { formatViewCount } from "@/app/utils/viewCount";

interface PlayLikeCountProps {
  viewCount: number;
  likeCount: number;
  isLiked: boolean;
  isLoading: boolean;
  onLikeToggle: () => void;
  isMobile: boolean;
}

const PlayLikeCount = ({
  viewCount,
  likeCount,
  isLiked,
  isLoading,
  onLikeToggle,
  isMobile,
}: PlayLikeCountProps) => {
  return (
    <Box className="flex gap-4">
      <Box className="flex gap-2 items-center">
        <FaPlay />
        <Box sx={{ fontSize: isMobile ? "16px" : "20px" }}>
          {formatViewCount(viewCount)}
        </Box>
      </Box>
      <Button
        className="flex gap-2 items-center"
        onClick={onLikeToggle}
        disabled={isLoading}
        disableRipple
        sx={{
          minWidth: "auto",
          padding: 0,
          marginRight: "15px",
          backgroundColor: "transparent",
          color: "#000",
          "&:hover": {
            backgroundColor: "transparent",
          },
          "&:active": {
            backgroundColor: "transparent",
          },
          "&.Mui-disabled": {
            color: "#000",
            opacity: 0.5,
          },
        }}
      >
        {!isLiked ? <FaRegHeart size={20} /> : <FaHeart size={20} />}
        <Box sx={{ fontSize: "20px" }}>{likeCount}</Box>
      </Button>
    </Box>
  );
};

export default PlayLikeCount;
