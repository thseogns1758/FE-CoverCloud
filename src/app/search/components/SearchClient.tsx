"use client";

import React from "react";
import Box from "@mui/material/Box";
import {
  Button,
  CircularProgress,
  Grid,
  MenuItem,
  Pagination,
  Select,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useRouter } from "next/navigation";

import PostCard from "@/components/PostCard";
import InfoMessage from "@/components/InfoMessage";
import { contentData } from "@/app/main/type";
import { useSearchQuery } from "@/app/api/search/search";
import TuneIcon from "@mui/icons-material/Tune";
import AccessTimeSharpIcon from "@mui/icons-material/AccessTimeSharp";
import FavoriteBorderSharpIcon from "@mui/icons-material/FavoriteBorderSharp";
import { fetchAuthMeWithCookie } from "@/app/api/auth/authMe";
import { useSnackbarStore } from "@/app/store/useSnackbar";
import { useModalStore } from "@/app/store/useModalStore";
import { useAuthStore } from "@/app/store/useAuthStore";
import { useSearchParamUpdater } from "@/app/hook/useSearchParamsUpdater";

type SearchType = "title" | "tags";

interface SearchTab {
  title: string;
  searchType: SearchType;
}

const searchTabs: SearchTab[] = [
  { title: "제목", searchType: "title" },
  { title: "태그", searchType: "tags" },
];

type SortType = "LATEST" | "POPULAR";

const sortOptions: { label: string; value: SortType }[] = [
  { label: "최신순", value: "LATEST" },
  { label: "인기순", value: "POPULAR" },
];

export const dynamic = "force-dynamic";

export default function SearchClient() {
  const theme = useTheme();
  const router = useRouter();
  const { searchParams, updateParams, getNumberParam } =
    useSearchParamUpdater();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { openLoginModal } = useModalStore();
  const accessToken = useAuthStore((state) => state.accessToken);

  /* =========================
     URL → 상태 파싱
  ========================= */
  const query = searchParams.get("q") ?? "";

  const page = Math.max(1, getNumberParam("page", 1));

  const sortParam = searchParams.get("sort");

  const sortBy: SortType = sortOptions.some(
    (option) => option.value === sortParam,
  )
    ? (sortParam as SortType)
    : "LATEST";

  const searchTypeParam = searchParams.get("searchType");

  const searchType: SearchType = searchTabs.some(
    (tab) => tab.searchType === searchTypeParam,
  )
    ? (searchTypeParam as SearchType)
    : "title";

  const selectedTab =
    searchTabs.find((tab) => tab.searchType === searchType) ?? searchTabs[0];

  /* =========================
     검색
  ========================= */
  const { data, isLoading } = useSearchQuery({
    type: searchType,
    keyword: query,
    page: page - 1,
    size: 18,
    sortBy,
  });

  /* =========================
     핸들러
  ========================= */
  const handleTabChange = (tab: SearchTab) => {
    if (tab.searchType === searchType && page === 1) return;

    updateParams({
      searchType: tab.searchType,
      page: 1,
    });
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    if (value === page) return;

    updateParams({
      page: value,
    });

    window.scrollTo({ top: 0, behavior: "auto" });
  };

  const handleSortChange = (value: SortType) => {
    if (value === sortBy && page === 1) return;

    updateParams({
      sort: value,
      page: 1,
    });
  };

  const handleRecommendClick = async () => {
    const isAuthenticated = await fetchAuthMeWithCookie(accessToken);

    if (!isAuthenticated.success) {
      openLoginModal();
      useSnackbarStore
        .getState()
        .show("로그인 후 추천할 수 있습니다.", "error");
      return;
    }

    router.push("/post/create");
  };

  /* =========================
     스타일
  ========================= */
  const tabSx = (active: boolean) => ({
    color: active ? theme.palette.common.black : theme.palette.gray.primary,
    borderRadius: "10px",
    minWidth: "60px",
    minHeight: "32px",
    fontSize: "20px",
    "&:hover": {
      backgroundColor: theme.palette.gray.secondary,
    },
  });

  if (isLoading) {
    return (
      <Box
        className="mt-8"
        sx={{
          minHeight: "60vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress
          size={64}
          sx={{ color: theme.palette.orange.primary }}
        />
      </Box>
    );
  }

  return (
    <Box>
      {/* 탭 */}
      <Box className="flex items-center mb-4">
        {searchTabs.map((tab) => (
          <Button
            key={tab.searchType}
            onClick={() => handleTabChange(tab)}
            sx={tabSx(selectedTab.searchType === tab.searchType)}
          >
            {tab.title}
          </Button>
        ))}
      </Box>

      <Box
        className={`flex justify-between ${isMobile ? "flex-col gap-2" : ""}`}
        sx={{ mb: "44px", pl: "8px" }}
      >
        <Typography
          variant="h5"
          sx={{ display: "flex", flexWrap: "wrap", alignItems: "baseline" }}
        >
          <span
            style={{ display: "flex", maxWidth: "100%", marginRight: "8px" }}
          >
            <span>{'"'}</span>
            <strong
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {query}
            </strong>
            <span>{'"'}</span>
          </span>
          <span>{searchType === "title" ? "제목" : "태그"} 검색 결과</span>
        </Typography>

        <Box className="flex justify-end xs:w-full" sx={{ minWidth: 120 }}>
          <Select
            size="small"
            renderValue={(value) => (
              <Box
                sx={{
                  fontWeight: 700,
                  mr: "8px",
                  p: "0px 5px",
                }}
              >
                {value === "LATEST" ? "최신순" : "인기순"}
              </Box>
            )}
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value as SortType)}
            IconComponent={TuneIcon}
            sx={{
              fontSize: "14px",

              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#ddd",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#aaa",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#aaa",
              },
              "&.Mui-focused .MuiSelect-icon": {
                color: "#4f4f4fff",
              },
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  "& .MuiMenuItem-root": {
                    fontSize: "14px",
                  },

                  "& .MuiMenuItem-root:hover": {
                    backgroundColor: "#f0f0f0",
                  },

                  "& .MuiMenuItem-root.Mui-selected": {
                    backgroundColor: "transparent !important",
                    color: "#000",
                    fontWeight: 700,
                  },

                  "& .MuiMenuItem-root.Mui-selected:hover": {
                    backgroundColor: "#f0f0f0",
                  },
                },
              },
            }}
          >
            <MenuItem value="LATEST">
              <AccessTimeSharpIcon
                fontSize="small"
                sx={{ marginRight: "8px" }}
              />
              <Box>최신순</Box>
            </MenuItem>

            <MenuItem value="POPULAR">
              <FavoriteBorderSharpIcon
                fontSize="small"
                sx={{ marginRight: "8px" }}
              />
              <Box>인기순</Box>
            </MenuItem>
          </Select>
        </Box>
      </Box>

      {!data?.data.content.length ? (
        <InfoMessage
          subMessage={query ? `"${query}"` : ""}
          message="검색 결과가 없습니다.\n새로운 곡을 추천하시겠어요?"
          buttonText="곡 추천하기"
          onClick={handleRecommendClick}
        />
      ) : (
        <React.Fragment>
          {/* 리스트 */}
          <Grid container spacing={2}>
            {data.data.content.map((post: contentData) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={post.coverId}>
                <PostCard {...post} />
              </Grid>
            ))}
          </Grid>

          {/* 페이지네이션 */}
          <Box className="mt-8 flex justify-center">
            <Pagination
              count={data.data.totalPages}
              page={page}
              onChange={handlePageChange}
              hidePrevButton={page === 1}
              hideNextButton={page === data.data.totalPages}
              sx={{ "& .MuiPagination-ul": { flexWrap: "nowrap" } }}
            />
          </Box>
        </React.Fragment>
      )}
    </Box>
  );
}
