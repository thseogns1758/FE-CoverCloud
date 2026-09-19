"use client";

import { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import PostCard from "../../../../components/PostCard";
import Box from "@mui/material/Box";
import Pagination from "@mui/material/Pagination";
import { useRouter } from "next/navigation";
import { Button, CircularProgress, useMediaQuery } from "@mui/material";
import {
  CoverListPageResponse,
  usePopularCoverListQuery,
} from "../../../../app/api/cover/list";
import { contentData, Genre } from "../../../../app/main/type";
import { useTheme } from "@mui/material/styles";
import InfoMessage from "@/components/InfoMessage";
import { Period } from "@/app/api/cover/list";
import MainBanner from "../MainBanner";
import { useSearchParamUpdater } from "@/app/hook/useSearchParamsUpdater";

type PopularTab = {
  title: string;
  period: Period;
};

const popularTabs: PopularTab[] = [
  { title: "전체", period: "ALL" },
  { title: "월간", period: "MONTHLY" },
  { title: "주간", period: "WEEKLY" },
  { title: "일간", period: "DAILY" },
];

const genreTabs: Genre[] = [
  { title: "K-POP", value: "K_POP", label: "kpop" },
  { title: "J-POP", value: "J_POP", label: "jpop" },
  { title: "POP", value: "POP", label: "pop" },
  { title: "기타", value: "OTHER", label: "OTHER" },
];

const MainComponent = ({
  initialData,
}: {
  initialData?: CoverListPageResponse;
}) => {
  const theme = useTheme();
  const router = useRouter();

  const { searchParams, updateParams } = useSearchParamUpdater();

  /* =========================
      URL → 상태 (UI 기준)
    ========================= */
  const pageParam = Number(searchParams.get("page") ?? 1);
  const page = Number.isNaN(pageParam) ? 1 : Math.max(1, pageParam);

  const periodParam = searchParams.get("period");
  const period = popularTabs.some((tab) => tab.period === periodParam)
    ? (periodParam as Period)
    : "ALL";
  const genreValues = searchParams.get("genres")
    ? searchParams.get("genres")!.split(",")
    : [];

  const selectedGenres = genreTabs.filter((g) => genreValues.includes(g.value));

  /* =========================
      API 호출 (0부터)
    ========================= */
  const {
    data: queryData,
    isLoading,
    isFetching,
  } = usePopularCoverListQuery({
    page: page - 1,
    size: 18,
    period,
    genres: selectedGenres.map((g) => g.value),
    initialData,
  });

  const data = queryData ?? initialData;

  const [isTabChanging, setIsTabChanging] = useState(false);

  useEffect(() => {
    if (!isFetching) setIsTabChanging(false);
  }, [isFetching]);

  const isDisabled = isTabChanging || isFetching;

  /* =========================
      핸들러
    ========================= */
  const handlePageChange = (_: any, value: number) => {
    setIsTabChanging(true);

    updateParams({
      page: value,
    });

    window.scrollTo({ top: 0, behavior: "auto" });
  };

  const popularTabChangeHandler = (tab: PopularTab) => {
    setIsTabChanging(true);

    updateParams({
      period: tab.period,
      page: 1,
    });
  };

  const genreTabChangeHandler = (genre: Genre) => {
    setIsTabChanging(true);

    const current = new Set(genreValues);

    current.has(genre.value)
      ? current.delete(genre.value)
      : current.add(genre.value);

    updateParams({
      genres: Array.from(current).join(","),
      page: 1,
    });
  };

  /* =========================
      스타일
    ========================= */
  const popularTabSx = (active: boolean) => ({
    color: active ? theme.palette.common.black : theme.palette.gray.primary,
    borderRadius: "10px",
    minWidth: "60px",
    minHeight: "32px",
    fontSize: "20px",

    "@media (hover: hover) and (pointer: fine)": {
      "&:hover": {
        backgroundColor: theme.palette.gray.secondary,
      },
    },
  });

  const genreTabSx = (selected: boolean) => ({
    color: selected ? theme.palette.common.white : theme.palette.common.black,
    backgroundColor: selected
      ? theme.palette.genre.primary
      : theme.palette.gray.secondary,
    borderRadius: "20px",
    minWidth: "72px",
    minHeight: "32px",
    padding: "0 12px",
    fontSize: "14px",

    "@media (hover: hover) and (pointer: fine)": {
      "&:hover": {
        backgroundColor: theme.palette.genre.secondary,
      },
    },
  });

  /* =========================
      렌더링
    ========================= */
  return (
    <div>
      <Box sx={{ mb: 4 }}>
        <MainBanner />
      </Box>
      {/* 인기 탭 */}

      <Box className="flex items-center mb-4">
        {popularTabs.map((tab) => (
          <Button
            key={tab.period}
            onClick={() => popularTabChangeHandler(tab)}
            sx={{
              ...popularTabSx(tab.period === period),
              ...(isDisabled && { pointerEvents: "none" }),
            }}
          >
            <Box className="S1">{tab.title}</Box>
          </Button>
        ))}
      </Box>

      {/* 장르 탭 */}
      <Box className="flex flex-wrap gap-2 mb-4">
        {genreTabs.map((tab) => (
          <Button
            key={tab.value}
            onClick={() => genreTabChangeHandler(tab)}
            sx={{
              ...genreTabSx(genreValues.includes(tab.value)),
              ...(isDisabled && { pointerEvents: "none" }),
            }}
          >
            <Box className="S3">{tab.title}</Box>
          </Button>
        ))}
      </Box>

      {/* 리스트 */}
      {data?.content.length ? (
        <>
          <Grid container spacing={2}>
            {data.content.map((post: contentData) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={post.coverId}>
                <PostCard {...post} />
              </Grid>
            ))}
          </Grid>

          <Box className="mt-8 flex justify-center">
            <Pagination
              count={data.totalPages}
              page={page}
              onChange={handlePageChange}
              hidePrevButton={page === 1}
              hideNextButton={page === data.totalPages}
              sx={{ "& .MuiPagination-ul": { flexWrap: "nowrap" } }}
            />
          </Box>
        </>
      ) : isLoading ? (
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
      ) : (
        <InfoMessage message="게시글이 없습니다." />
      )}
    </div>
  );
};

export default MainComponent;
