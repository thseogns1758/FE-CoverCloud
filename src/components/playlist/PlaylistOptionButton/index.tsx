import React, { useEffect, useRef } from "react";
import { Box } from "@mui/material";
import { HiDotsHorizontal, HiDotsVertical } from "react-icons/hi";
import { FiEdit3, FiTrash2 } from "react-icons/fi";

interface PlaylistOptionButtonProps {
  isLogin: boolean;
  onClick: () => void;
  openDeleteModal: () => void;
  navigateToEdit: () => void;
  colIcon?: boolean;
  isCenter?: boolean;
}

const PlaylistOptionButton = ({
  isLogin,
  onClick,
  openDeleteModal,
  navigateToEdit,
  colIcon = false,
  isCenter = false,
}: PlaylistOptionButtonProps) => {
  const [isOptionOpen, setIsOptionOpen] = React.useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setIsOptionOpen(false);
      }
    };

    if (isOptionOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOptionOpen]);

  return (
    <Box
      ref={wrapperRef}
      sx={{
        position: "relative",
        display: "flex",
        alignItems: isCenter ? "center" : "flex-start",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      {/* ... 버튼 */}
      <Box
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();

          onClick();
          setIsOptionOpen((prev) => !prev);
        }}
        sx={{
          width: "34px",
          height: "34px",
          borderRadius: "50%",

          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          cursor: "pointer",

          backgroundColor: "transparent",

          transition: "background-color 0.15s ease",

          "&:hover": {
            backgroundColor: "#E5E5E5",
          },
        }}
      >
        {colIcon ? (
          <HiDotsVertical size={21} />
        ) : (
          <HiDotsHorizontal size={21} />
        )}
      </Box>

      {/* 옵션 메뉴 */}
      {isOptionOpen && isLogin && (
        <Box
          sx={{
            position: "absolute",
            top: "40px",
            right: 0,

            width: "94px",
            backgroundColor: "#fff",

            borderRadius: "12px",
            overflow: "hidden",

            boxShadow: "0px 6px 20px rgba(0, 0, 0, 0.15)",

            zIndex: 100,
            py: "4px",
          }}
        >
          <Box
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();

              navigateToEdit();
              setIsOptionOpen(false);
            }}
            sx={{
              height: "44px",

              display: "flex",
              alignItems: "center",

              gap: "14px",
              px: "16px",

              fontSize: "13px",
              cursor: "pointer",

              "&:hover": {
                backgroundColor: "#F5F5F5",
              },
            }}
          >
            <FiEdit3 size={18} />
            수정
          </Box>

          <Box
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();

              openDeleteModal();
              setIsOptionOpen(false);
            }}
            sx={{
              height: "44px",

              display: "flex",
              alignItems: "center",

              gap: "14px",
              px: "16px",

              fontSize: "13px",
              cursor: "pointer",

              "&:hover": {
                backgroundColor: "#F5F5F5",
              },
            }}
          >
            <FiTrash2 size={18} />
            삭제
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default PlaylistOptionButton;
