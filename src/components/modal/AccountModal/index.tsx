"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Box, Typography } from "@mui/material";

import { FiSettings } from "react-icons/fi";
import { LuFolderClock } from "react-icons/lu";
import { RiPlayList2Line } from "react-icons/ri";
import { IoCloseSharp } from "react-icons/io5";

const AccountModal = ({
  openAccountModalHandler,
}: {
  openAccountModalHandler: () => void;
}) => {
  const pathname = usePathname();

  const menuItems = [
    {
      label: "내 계정 설정",
      href: "/mypage/account",
      icon: FiSettings,
      active: pathname.startsWith("/mypage/account"),
    },
    {
      label: "내 플레이리스트",
      href: "/mypage/playlist",
      icon: RiPlayList2Line,
      active: pathname.startsWith("/mypage/playlist"),
    },
    {
      label: "내 활동 내역",
      href: "/mypage/activity",
      icon: LuFolderClock,
      active: pathname.startsWith("/mypage/activity"),
    },
  ];

  return (
    <Box
      onClick={openAccountModalHandler}
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 21,
      }}
    >
      <Box
        onClick={(e) => e.stopPropagation()}
        sx={{
          position: "absolute",

          top: "88px",
          right: {
            xs: "16px",
            sm: "24px",
          },

          width: {
            xs: "calc(100% - 32px)",
            sm: "320px",
          },

          maxWidth: "320px",

          backgroundColor: "#fff",

          border: "1px solid #EEEEEE",
          borderRadius: "16px",

          boxShadow: "0 10px 35px rgba(0, 0, 0, 0.12)",

          overflow: "hidden",

          zIndex: 22,
        }}
      >
        {/* =========================
            HEADER
        ========================= */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",

            px: "20px",
            pt: "18px",
            pb: "14px",
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: "18px",
                fontWeight: 700,
                color: "#181818",
              }}
            >
              마이 페이지
            </Typography>

            <Typography
              sx={{
                mt: "2px",
                fontSize: "11px",
                color: "#999",
              }}
            >
              계정과 활동을 관리할 수 있어요.
            </Typography>
          </Box>

          <Box
            component="button"
            type="button"
            onClick={openAccountModalHandler}
            aria-label="마이페이지 메뉴 닫기"
            sx={{
              width: "34px",
              height: "34px",

              p: 0,

              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              flexShrink: 0,

              border: 0,
              borderRadius: "50%",

              backgroundColor: "transparent",

              color: "#555",

              cursor: "pointer",

              transition: "background-color 0.15s ease",

              "&:hover": {
                backgroundColor: "#F2F2F2",
              },
            }}
          >
            <IoCloseSharp size={21} />
          </Box>
        </Box>

        {/* =========================
            MENU
        ========================= */}
        <Box
          sx={{
            px: "10px",
            pb: "10px",
          }}
        >
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={openAccountModalHandler}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <Box
                  sx={{
                    minHeight: "54px",

                    px: "12px",
                    py: "8px",

                    display: "flex",
                    alignItems: "center",

                    gap: "12px",

                    borderRadius: "10px",

                    backgroundColor: item.active ? "#F3F3F3" : "transparent",

                    cursor: "pointer",

                    transition: "background-color 0.15s ease",

                    "&:hover": {
                      backgroundColor: item.active ? "#EEEEEE" : "#F7F7F7",
                    },
                  }}
                >
                  {/* ICON */}
                  <Box
                    sx={{
                      width: "36px",
                      height: "36px",

                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",

                      flexShrink: 0,

                      borderRadius: "9px",

                      backgroundColor: item.active ? "#181818" : "#F2F2F2",

                      color: item.active ? "#fff" : "#555",

                      transition: "all 0.15s ease",
                    }}
                  >
                    <Icon size={19} />
                  </Box>

                  {/* LABEL */}
                  <Typography
                    sx={{
                      fontSize: "14px",

                      fontWeight: item.active ? 700 : 500,

                      color: item.active ? "#181818" : "#444",
                    }}
                  >
                    {item.label}
                  </Typography>
                </Box>
              </Link>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};

export default AccountModal;
