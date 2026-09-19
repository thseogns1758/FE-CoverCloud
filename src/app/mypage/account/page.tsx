"use client";
import React, { useEffect, useRef } from "react";

import theme from "../../../app/lib/theme";
import PostBasicButton from "@/components/PostBasicButton";
import Modal from "@/components/modal/Modal";
import { useAuthStore } from "@/app/store/useAuthStore";
import { useAuthMeQuery } from "@/app/api/auth/authMe";
import { getProfileImage } from "@/app/utils/profileImage";
import { changeAccount, fetchImageUrl } from "@/app/api/auth/changeAccount";
import { logout } from "@/app/api/auth/logout";
import { useRouter } from "next/navigation";

import {
  Box,
  TextField,
  Button,
  Avatar,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { TbCirclePlus } from "react-icons/tb";
import { FaRegTrashAlt } from "react-icons/fa";
import { useSnackbarStore } from "@/app/store/useSnackbar";

import Login from "@/components/auth/Login";
import Loading from "@/app/main/loading";
import { refreshAccessToken } from "@/app/api/auth/refresh";
import { useModalStore } from "@/app/store/useModalStore";
import { deletedAccount } from "@/app/api/mypage/deletedAccount";

const AccountPage = () => {
  const router = useRouter();

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isLogin = useAuthStore((state) => state.isLogin);
  const openLoginModal = useModalStore((state) => state.openLoginModal);
  const [openNickNameModal, setOpenNickNameModal] = React.useState(false);
  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] =
    React.useState(false);
  const [deleteAccountAgreementModal, setDeleteAccountAgreementModal] =
    React.useState(false);
  const [openImageRemoveModal, setOpenImageRemoveModal] = React.useState(false);

  const [openImageConfirmModal, setOpenImageConfirmModal] =
    React.useState(false);

  const [tempAvatar, setTempAvatar] = React.useState<string | null>(null);
  const [prevAvatar, setPrevAvatar] = React.useState<string>("");

  const [isImageChanging, setIsImageChanging] = React.useState(false);

  const [avatar, setAvatar] = React.useState<string>("");
  const [originalNickName, setOriginalNickName] = React.useState<string>("");
  const [newNickName, setNewNickName] = React.useState<string>("");
  const [email, setEmail] = React.useState<string>("");
  const [accessedSNS, setAccessedSNS] = React.useState<string>("");

  const accessToken = useAuthStore((state) => state.accessToken);
  const { data, isLoading } = useAuthMeQuery();
  const [isHydrated, setIsHydrated] = React.useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);
  const accountSx = {
    "& .MuiInputBase-input": {
      padding: "12px 20px",
    },
    "&.MuiFormControl-root": {
      flex: 1,
    },
    "& .MuiOutlinedInput-root": {
      backgroundColor: theme.palette.gray.secondary,
      borderRadius: "15px",
      border: "none",
      height: isMobile ? "40px" : "48px",
    },
  };
  const hasImage = typeof avatar === "string" && avatar.length > 0;
  const handleImageChange = async (file: File) => {
    if (!isLogin || !accessToken) {
      openLoginModal();
      useSnackbarStore
        .getState()
        .show("로그인 후 프로필 이미지를 변경할 수 있습니다.", "error");
      return;
    }
    setOpenImageConfirmModal(true);
    try {
      const result = await fetchImageUrl(file);

      if (result) {
        const tempAvatarUrl = `https://storage.googleapis.com/covercloud-bucket/${result}`;

        setTempAvatar(tempAvatarUrl);
        setAvatar(tempAvatarUrl);
      }
    } catch {
      useSnackbarStore.getState().show("이미지 변경에 실패했습니다.", "error");
    }
  };
  const handleRemoveImage = async () => {
    if (!isLogin || !accessToken) {
      openLoginModal();
      useSnackbarStore
        .getState()
        .show("로그인 후 프로필 이미지를 삭제할 수 있습니다.", "error");
      return;
    }
    try {
      const result = await changeAccount(undefined, "");

      if (result.data.success) {
        setAvatar("");
        setPrevAvatar("");

        useSnackbarStore.getState().show("이미지가 삭제되었습니다.", "success");
      }
    } catch {
      useSnackbarStore.getState().show("이미지 삭제에 실패했습니다.", "error");
    }
    // refreshAccessToken();
    setOpenImageRemoveModal(false);
  };

  const changedNickNameHandler = async () => {
    if (!isLogin || !accessToken) {
      openLoginModal();
      useSnackbarStore
        .getState()
        .show("로그인 후 닉네임을 변경할 수 있습니다.", "error");
      return;
    }
    try {
      const result = await changeAccount(newNickName, undefined);

      if (result.data.success) {
        setOriginalNickName(newNickName);
        setNewNickName("");

        useSnackbarStore.getState().show("닉네임이 변경되었습니다.", "success");
      }
    } catch {
      useSnackbarStore.getState().show("닉네임 변경에 실패했습니다.", "error");
    }
    // refreshAccessToken();
    setOpenNickNameModal(false);
  };

  const openDeleteAccountModalHandler = () => {
    setIsDeleteAccountModalOpen(true);
  };
  const deleteAccountHandler = async () => {
    if (!isLogin || !accessToken) {
      openLoginModal();
      useSnackbarStore
        .getState()
        .show("로그인 후 계정을 삭제할 수 있습니다.", "error");
      return;
    }
    await deletedAccount();
    setDeleteAccountAgreementModal(false);
    setIsDeleteAccountModalOpen(false);
    router.push("/");
  };
  const logoutHandler = async () => {
    // TODO: 로그아웃 API 호출
    if (!isLogin || !accessToken) {
      useSnackbarStore.getState().show("이미 로그아웃 되었습니다.", "error");
      return;
    }
    await logout(accessToken);
    useSnackbarStore.getState().show("로그아웃되었습니다.", "success");
    router.push("/");
  };
  const changedImageHandler = async () => {
    if (!isLogin || !accessToken) {
      openLoginModal();
      useSnackbarStore
        .getState()
        .show("로그인 후 프로필 이미지를 변경할 수 있습니다.", "error");
      return;
    }
    if (!tempAvatar) return;

    try {
      setIsImageChanging(true);

      const result = await changeAccount(undefined, tempAvatar);

      if (result.data.success) {
        setAvatar(tempAvatar);
        setPrevAvatar(tempAvatar);
        setTempAvatar(null);

        useSnackbarStore
          .getState()
          .show("프로필 이미지가 변경되었습니다.", "success");
      } else {
        throw new Error("change failed");
      }
    } catch (e) {
      useSnackbarStore
        .getState()
        .show("프로필 이미지 변경에 실패했습니다.", "error");
    }
    setIsImageChanging(false);

    setOpenImageConfirmModal(false);
    // refreshAccessToken();
  };

  useEffect(() => {
    if (!data || data.success === false) return;
    const avatar = getProfileImage(data?.data.profileImage);
    setAvatar(avatar);
    setPrevAvatar(avatar);
    setOriginalNickName(data.data.nickname);
    setAccessedSNS(data.data.provider);
    setEmail(data.data.email);
  }, [data]);

  if (!isHydrated || isLoading) return <Loading />;
  if (data?.success === false || !isLogin) return <Login />;
  return (
    <Box
      className="flex flex-col gap-4"
      sx={{ width: isMobile ? "100%" : "70%", mx: "auto" }}
    >
      <Box
        sx={{ fontSize: 24, fontWeight: "bold", mb: 4, textAlign: "center" }}
      >
        내 계정 설정
      </Box>

      <Box className="flex flex-col gap-1 items-center justify-center">
        {/* Avatar 영역 */}
        <Box sx={{ position: "relative", width: 200, height: 200 }}>
          <Avatar
            sx={{ width: 200, height: 200 }}
            src={hasImage ? avatar : undefined}
          />

          {/* 업로드 오버레이 */}
          <Box
            className="absolute inset-0 flex items-center justify-center"
            sx={{
              padding: "10px",
              borderRadius: "50%",
              backgroundColor: "rgba(108,98,98,0.2)",
              backdropFilter: "blur(6px)",
              cursor: "pointer",
              opacity: hasImage ? 0 : 1,
              transition: "opacity 0.2s ease",
              "&:hover": { opacity: 1 },
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            <Box
              className="flex items-center justify-center"
              sx={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                border: `2px solid ${theme.palette.common.white}`,
                backgroundColor: "rgba(0,0,0,0.2)",
              }}
            >
              <TbCirclePlus size={70} color="#fff" />
            </Box>
          </Box>

          {/* File Input */}
          <input
            ref={fileInputRef}
            type="file"
            hidden
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;

              const reader = new FileReader();
              reader.onload = () => {
                handleImageChange(file);
              };
              reader.readAsDataURL(file);
            }}
          />
        </Box>

        <Button
          onClick={() => setOpenImageRemoveModal(true)}
          size="large"
          sx={{
            alignSelf: "center",
            gap: 0.5,
            color: theme.palette.common.black,
            fontSize: "18px",
          }}
        >
          <FaRegTrashAlt />
          <span style={{ marginLeft: "4px" }}>이미지 삭제</span>
        </Button>
      </Box>

      {/* 닉네임 */}
      <Box className="flex flex-col gap-1">
        <Typography variant="h6" sx={{ minWidth: 80 }}>
          닉네임
        </Typography>
        <Box className="flex gap-4 items-center">
          <TextField
            value={originalNickName}
            onChange={(e) => setNewNickName(e.target.value)}
            placeholder="닉네임"
            disabled
            sx={accountSx}
          />

          <Box className="flex items-center">
            <PostBasicButton
              onClick={() => setOpenNickNameModal(true)}
              backgroundColor={theme.palette.common.black}
              color={theme.palette.common.white}
              hoverBGColor={theme.palette.gray.secondary}
              hoverColor={theme.palette.common.black}
              sxStyle={{
                minWidth: isMobile ? "64px" : "126px",
                flex: 1,
              }}
              postClass={` ${isMobile ? "S4" : "B1"}`}
            >
              변경
            </PostBasicButton>
          </Box>
        </Box>
      </Box>
      {/* 이메일 */}

      {accessedSNS !== "KAKAO" && (
        <Box className="flex flex-col gap-1">
          <Typography variant="h6" sx={{ minWidth: 80 }}>
            이메일
          </Typography>
          <TextField
            value={email}
            placeholder="이메일"
            fullWidth
            disabled
            sx={accountSx}
          />
        </Box>
      )}
      {/* SNS */}
      <Box className="flex flex-col gap-1">
        <Typography variant="h6" sx={{ minWidth: 80 }}>
          SNS
        </Typography>
        <TextField
          value={accessedSNS}
          onChange={(e) => setAccessedSNS(e.target.value)}
          placeholder="SNS"
          fullWidth
          disabled
          sx={accountSx}
        />
      </Box>
      {/* 계정관리 */}
      <Box className="flex flex-col gap-1">
        <Typography variant="h6" sx={{ minWidth: 80 }}>
          계정관리
        </Typography>
        <Box
          className="flex flex-col justify-center items-center"
          sx={{ gap: "12px" }}
        >
          <PostBasicButton
            backgroundColor={theme.palette.common.black}
            color={theme.palette.common.white}
            hoverBGColor={theme.palette.gray.secondary}
            hoverColor={theme.palette.common.black}
            postRadius="50px"
            onClick={logoutHandler}
            sxStyle={{
              marginBottom: "24px",
              fontSize: 20,
            }}
          >
            계정 로그아웃
          </PostBasicButton>
          <Box className="flex items-center gap-2 B1">
            <Box className="B1">
              {isMobile ? (
                <>
                  회원 탈퇴가 필요하다면 <br />
                  ‘계정 삭제’를 눌러주세요.
                </>
              ) : (
                <>회원 탈퇴가 필요하다면 ‘계정 삭제’를 눌러주세요.</>
              )}
            </Box>
            <Button
              onClick={openDeleteAccountModalHandler}
              sx={{
                textDecoration: "underline",

                color: theme.palette.common.black,
                "&:hover": {
                  backgroundColor: "transparent",
                },
              }}
            >
              <Box sx={{ flex: "1 0 auto", fontSize: 20 }}>계정삭제</Box>
            </Button>
          </Box>
        </Box>
      </Box>
      {/* 닉네임수정모달 */}
      <Modal
        isOpen={openNickNameModal}
        onClose={() => setOpenNickNameModal(false)}
      >
        <Box
          className="flex flex-col gap-4 items-center"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            width: "100%",
            height: "449px",
            borderRadius: "8px",
            padding: isMobile ? "30px" : "50px",
          }}
        >
          <Box className="H1">닉네임 변경</Box>
          <Box className="S2" sx={{ width: "100%" }}>
            현재 닉네임
          </Box>
          <TextField
            value={originalNickName}
            onChange={(e) => setOriginalNickName(e.target.value)}
            placeholder="현재 닉네임"
            fullWidth
            sx={accountSx}
            disabled
          />
          <Box className="S2" sx={{ width: "100%" }}>
            새 닉네임
          </Box>
          <TextField
            value={newNickName}
            onChange={(e) => setNewNickName(e.target.value)}
            placeholder="새 닉네임"
            fullWidth
            sx={accountSx}
          />
          <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
            <PostBasicButton
              onClick={changedNickNameHandler}
              backgroundColor={theme.palette.orange.primary}
              color={theme.palette.common.white}
              hoverBGColor={theme.palette.orange.secondary}
              hoverColor={theme.palette.common.black}
              sxStyle={{
                fontWeight: "bold",
              }}
            >
              닉네임 변경하기
            </PostBasicButton>
          </Box>
        </Box>
      </Modal>
      {/* 삭제모달 */}
      <Modal
        isOpen={isDeleteAccountModalOpen}
        onClose={() => setIsDeleteAccountModalOpen(false)}
      >
        <Box sx={{ p: 2 }}>
          <Box
            className="flex flex-col gap-4 items-center"
            sx={{ width: "80%", margin: "auto" }}
          >
            <Box className="H1" sx={{ pt: "42px" }}>
              계정 삭제
            </Box>
            <Box
              className=""
              sx={{
                width: "100%",
                backgroundColor: theme.palette.gray.secondary,
                borderRadius: "15px",
                minHeight: "140px",
                maxHeight: "409px",
                padding: "20px",
                overflowY: "scroll",
              }}
            >
              <Box>
                <Box className="flex flex-col gap-5">
                  {/* 1. 삭제되지 않는 데이터 */}
                  <Box>
                    <Typography
                      className="B1"
                      sx={{ fontWeight: "bold", mb: 1 }}
                    >
                      1. 삭제되지 않는 데이터
                    </Typography>
                    <Box
                      sx={{
                        pl: 2,
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                      }}
                    >
                      <Box>
                        <Typography className="B2">• SNS 연동 정보</Typography>
                        <Typography
                          className="S3"
                          sx={{ pl: 2, color: "gray" }}
                        >
                          - 연동된 SNS 유형 정보 (카카오톡, 네이버)
                        </Typography>
                        <Typography
                          className="S3"
                          sx={{ pl: 2, color: "gray" }}
                        >
                          - 사용자 식별 정보는 삭제됩니다.
                        </Typography>
                      </Box>
                      <Box>
                        <Typography className="B2">• 신고 데이터</Typography>
                        <Typography
                          className="S3"
                          sx={{ pl: 2, color: "gray" }}
                        >
                          - 신고자의 정보 삭제
                        </Typography>
                        <Typography
                          className="S3"
                          sx={{ pl: 2, color: "gray" }}
                        >
                          - 신고 유형, 신고 일자 등은 보관
                        </Typography>
                      </Box>
                      <Box>
                        <Typography className="B2">• 계정 이력</Typography>
                        <Typography
                          className="S3"
                          sx={{ pl: 2, color: "gray" }}
                        >
                          - 로그 기록: 가입일, 최근 접속일, 탈퇴일
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* 2. 보관되는 데이터 */}
                  <Box>
                    <Typography
                      className="B1"
                      sx={{ fontWeight: "bold", mb: 1 }}
                    >
                      2. 보관되는 데이터 (Soft Delete)
                    </Typography>
                    <Box sx={{ pl: 2 }}>
                      <Typography className="B2">
                        • 이메일: 탈퇴일로부터 30일간 보관 후 자동 삭제
                      </Typography>
                    </Box>
                  </Box>

                  {/* 3. 삭제되는 데이터 */}
                  <Box>
                    <Typography
                      className="B1"
                      sx={{ fontWeight: "bold", mb: 1 }}
                    >
                      3. 삭제되는 데이터
                    </Typography>
                    <Box
                      sx={{
                        pl: 2,
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                      }}
                    >
                      <Box>
                        <Typography className="B2">• 사용자 정보</Typography>
                        <Typography
                          className="S3"
                          sx={{ pl: 2, color: "gray" }}
                        >
                          - 프로필 사진, 닉네임
                        </Typography>
                        <Typography
                          className="S3"
                          sx={{ pl: 2, color: "gray" }}
                        >
                          - 삭제 후 서비스 내 표기: "정보가 없는 사용자"
                        </Typography>
                        <Typography
                          className="S3"
                          sx={{ pl: 2, color: "gray" }}
                        >
                          - 이메일 (30일 후 삭제)
                        </Typography>
                      </Box>
                      <Box>
                        <Typography className="B2">
                          • 사용자 활동 내역
                        </Typography>
                        <Typography
                          className="S3"
                          sx={{ pl: 2, color: "gray" }}
                        >
                          - 작성한 게시물, 좋아요한 게시물
                        </Typography>
                        <Typography
                          className="S3"
                          sx={{ pl: 2, color: "gray" }}
                        >
                          - 댓글 작성한 게시물, 작성한 댓글
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
            <Box className="text-center" sx={{ mt: "20px", mb: "14px" }}>
              위 안내사항을 모두 확인하였으며,
              <br /> 이에 동의 후 계정 삭제를 진행합니다.
            </Box>
            <Box sx={{ mt: 2, display: "flex", gap: 1, mb: "60px" }}>
              <PostBasicButton
                onClick={() => setDeleteAccountAgreementModal(true)}
                backgroundColor={theme.palette.common.black}
                color={theme.palette.common.white}
                hoverBGColor={theme.palette.gray.secondary}
                hoverColor={theme.palette.common.black}
                postRadius="50px"
                postClass="H1"
                sxStyle={{
                  padding: "12px 38px",
                }}
              >
                계정 탈퇴하기
              </PostBasicButton>
            </Box>
          </Box>
        </Box>
      </Modal>
      <Modal
        isOpen={openImageRemoveModal}
        onClose={() => setOpenImageRemoveModal(false)}
      >
        <Box className="flex flex-col gap-4 items-center" sx={{ p: 3 }}>
          <Box className="H1">프로필 이미지 삭제</Box>

          <Box className="B1 text-center">이미지를 삭제하시겠습니까?</Box>

          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
            <Button
              onClick={handleRemoveImage}
              variant="contained"
              disabled={isImageChanging}
            >
              {isImageChanging ? "삭제 중..." : "삭제"}
            </Button>

            <Button
              onClick={() => {
                setOpenImageRemoveModal(false);
              }}
              variant="outlined"
            >
              취소
            </Button>
          </Box>
        </Box>
      </Modal>
      <Modal
        isOpen={openImageConfirmModal}
        onClose={() => {
          setAvatar(prevAvatar);
          setTempAvatar(null);
          setOpenImageConfirmModal(false);
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        }}
      >
        <Box className="flex flex-col gap-4 items-center" sx={{ p: 3 }}>
          <Box className="H1">프로필 이미지 변경</Box>

          <Avatar
            src={tempAvatar || undefined}
            sx={{ width: 160, height: 160 }}
          />

          <Box className="B1 text-center">
            해당 이미지로 프로필을 변경하시겠습니까?
          </Box>

          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
            <Button
              onClick={changedImageHandler}
              variant="contained"
              disabled={isImageChanging}
            >
              {isImageChanging ? "변경 중..." : "변경"}
            </Button>

            <Button
              onClick={() => {
                setAvatar(prevAvatar);
                setTempAvatar(null);
                setOpenImageConfirmModal(false);
                if (fileInputRef.current) {
                  fileInputRef.current.value = "";
                }
              }}
              variant="outlined"
            >
              취소
            </Button>
          </Box>
        </Box>
      </Modal>
      <Modal
        isOpen={deleteAccountAgreementModal}
        onClose={() => setDeleteAccountAgreementModal(false)}
      >
        <Box className="flex flex-col gap-4 items-center" sx={{ p: 3 }}>
          <Box className="H1">계정 탈퇴</Box>

          <Box className="B1 text-center">정말 계정을 탈퇴하시겠습니까?</Box>

          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
            <Button
              onClick={deleteAccountHandler}
              variant="contained"
              disabled={isImageChanging}
            >
              {isImageChanging ? "삭제 중..." : "삭제"}
            </Button>

            <Button
              onClick={() => {
                setDeleteAccountAgreementModal(false);
              }}
              variant="outlined"
            >
              취소
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default AccountPage;
