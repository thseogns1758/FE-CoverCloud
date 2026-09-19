"use client";

import React from "react";
import { Box, Button, CircularProgress, Grid, Pagination } from "@mui/material";
import theme from "@/app/lib/theme";
import InfoMessage from "@/components/InfoMessage";
import { useAuthStore } from "@/app/store/useAuthStore";
import { contentData } from "@/app/main/type";
import PostCard from "@/components/PostCard";
import { useRouter } from "next/navigation";
import { useMyCoverListQuery } from "@/app/api/mypage/myCoverList";
import Login from "@/components/auth/Login";
import { fetchAuthMeWithCookie, useAuthMeQuery } from "@/app/api/auth/authMe";
import { useModalStore } from "@/app/store/useModalStore";
import { useSnackbarStore } from "@/app/store/useSnackbar";
import Loading from "@/app/main/loading";
import { useSearchParamUpdater } from "@/app/hook/useSearchParamsUpdater";

export const dynamic = "force-dynamic";

type ActivityType = "recommend" | "like" | "comment";

const activityTabs: { type: ActivityType; name: string }[] = [
  { type: "recommend", name: "추천" },
  { type: "like", name: "좋아요" },
  { type: "comment", name: "댓글" },
];

export default function ActivityClient() {
  const router = useRouter();
  const { searchParams, updateParams, getNumberParam } =
    useSearchParamUpdater();

  const { openLoginModal } = useModalStore();
  const isLogin = useAuthStore((state) => state.isLogin);
  const accessToken = useAuthStore((state) => state.accessToken);

  /* =========================
     URL → 상태 파싱
  ========================= */
  const page = Math.max(1, getNumberParam("page", 1));

  const tabParam = searchParams.get("tab");

  const currentTabType: ActivityType = activityTabs.some(
    (tab) => tab.type === tabParam,
  )
    ? (tabParam as ActivityType)
    : "recommend";

  const selectedTab =
    activityTabs.find((tab) => tab.type === currentTabType) ?? activityTabs[0];

  /* =========================
     API 데이터 페칭
  ========================= */
  const { data: authMeData, isLoading: authMeLoading } = useAuthMeQuery();

  const { data, isLoading } = useMyCoverListQuery(
    accessToken,
    page - 1,
    18,
    currentTabType,
  );

  const [isHydrated, setIsHydrated] = React.useState(false);

  React.useEffect(() => {
    setIsHydrated(true);
  }, []);

  /* =========================
     핸들러
  ========================= */
  const activityTabChangeHandler = (type: ActivityType) => {
    if (type === currentTabType && page === 1) return;

    updateParams({
      tab: type,
      page: 1,
    });
  };

  const pageChangeHandler = (_: React.ChangeEvent<unknown>, value: number) => {
    if (value === page) return;

    updateParams({
      page: value,
    });

    window.scrollTo({ top: 0, behavior: "auto" });
  };

  const linkHandler = (type: string) => {
    if (type === "recommend") {
      handleRecommendClick();
    } else {
      router.push("/main");
    }
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
  console.log(authMeData);
  /* =========================
     스타일
  ========================= */
  const activityTabSx = (type: ActivityType) => ({
    color:
      type === currentTabType
        ? theme.palette.common.black
        : theme.palette.gray.primary,

    fontWeight: type === currentTabType ? 700 : 400,
  });
  if (!isHydrated || isLoading) return <Loading />;
  if (authMeData?.success === false || !isLogin) {
    return <Login />;
  }

  return (
    <Box>
      <Box className="H1" sx={{ width: "100%", textAlign: "center", mb: 4 }}>
        내 활동 내역
      </Box>

      {/* 탭 메뉴 */}
      <Box sx={{ mb: 3, display: "flex", gap: 1 }}>
        {activityTabs.map((tab) => (
          <Button
            key={tab.type}
            onClick={() => activityTabChangeHandler(tab.type)}
            sx={{
              borderRadius: "10px",
              minWidth: "60px",
              minHeight: "32px",
              padding: "0 12px",
              "&:hover": {
                backgroundColor: theme.palette.gray.secondary,
              },
            }}
          >
            <Box className="B1" sx={activityTabSx(tab.type)}>
              {tab.name}
            </Box>
          </Button>
        ))}
      </Box>

      {/* 로딩 및 리스트 영역 */}
      {isLoading || authMeLoading ? (
        <Box
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
      ) : data?.data.content.length > 0 ? (
        <>
          <Grid container spacing={2}>
            {data.data.content.map((post: contentData, idx: number) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={post.coverId || idx}>
                <PostCard {...post} />
              </Grid>
            ))}
          </Grid>

          <Box className="mt-8 flex justify-center">
            <Pagination
              count={data.data.totalPages || 1}
              page={page}
              onChange={pageChangeHandler}
              sx={{ "& .MuiPagination-ul": { flexWrap: "nowrap" } }}
            />
          </Box>
        </>
      ) : (
        <InfoMessage
          message={
            selectedTab.type === "comment"
              ? `아직 ${selectedTab.name}을 단 곡이 없습니다.\n새로운 곡을 찾아볼까요?`
              : selectedTab.type === "like"
                ? `아직 ${selectedTab.name}를 누른 곡이 없습니다.\n새로운 곡을 찾아볼까요?`
                : `아직 ${selectedTab.name}한 곡이 없습니다.\n새로운 곡을 추천하시겠어요?`
          }
          buttonText={
            selectedTab.type === "recommend" ? "곡 추천하기" : "최신글 보러가기"
          }
          onClick={() => linkHandler(selectedTab.type)}
        />
      )}
    </Box>
  );
}
