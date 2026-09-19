import React, { useRef } from "react";
import { Box, ClickAwayListener, Popper } from "@mui/material";
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

  const buttonRef = useRef<HTMLDivElement>(null);

  const handleClose = () => {
    setIsOptionOpen(false);
  };

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <Box
        sx={{
          position: "relative",
          display: "flex",
          alignItems: isCenter ? "center" : "flex-start",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {/* 점 3개 버튼 */}
        <Box
          ref={buttonRef}
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
        <Popper
          open={isOptionOpen && isLogin}
          anchorEl={buttonRef.current}
          placement="bottom-end"
          sx={{
            zIndex: 1500,
          }}
          modifiers={[
            {
              name: "offset",
              options: {
                offset: [0, 6],
              },
            },
          ]}
        >
          <Box
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            sx={{
              width: "94px",

              backgroundColor: "#fff",

              borderRadius: "12px",
              overflow: "hidden",

              boxShadow: "0px 6px 20px rgba(0, 0, 0, 0.15)",

              py: "4px",
            }}
          >
            {/* 수정 */}
            <Box
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();

                navigateToEdit();
                handleClose();
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

            {/* 삭제 */}
            <Box
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();

                openDeleteModal();
                handleClose();
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
        </Popper>
      </Box>
    </ClickAwayListener>
  );
};

export default PlaylistOptionButton;
