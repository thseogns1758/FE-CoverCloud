"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
} from "@mui/material";
import PostBasicButton from "@/components/PostBasicButton";
import theme from "@/app/lib/theme";

export type CreatePlaylistPayload = {
  name: string;
};

type CreatePlaylistButtonProps = {
  onCreate: (name: string) => void | Promise<void>;
  buttonText?: string;
};

const CreatePlaylistButton = ({
  onCreate,
  buttonText = "신규 플레이리스트",
  icon = null,
}: CreatePlaylistButtonProps & { icon?: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openModal = () => {
    setOpen(true);
  };

  const closeModal = () => {
    if (isSubmitting) return;

    setOpen(false);
    setTitle("");
    setDescription("");
  };

  const createPlaylist = async () => {
    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    if (!trimmedTitle) return;

    try {
      setIsSubmitting(true);

      await onCreate(trimmedTitle);

      closeModal();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box mt={2}>
      <PostBasicButton
        onClick={openModal}
        icon={icon}
        postRadius="50px"
        backgroundColor={theme.palette.common.black}
        sxStyle={{
          color: theme.palette.common.white,
          fontSize: "20px",
          display: "flex",
          alignItems: "center",
        }}
      >
        {buttonText}
      </PostBasicButton>

      <Dialog open={open} onClose={closeModal} fullWidth maxWidth="xs">
        <DialogTitle>플레이리스트 만들기</DialogTitle>

        <DialogContent onKeyDown={(e) => e.stopPropagation()}>
          <Box className="flex flex-col gap-4 pt-2">
            <Box>
              <Typography variant="body2" className="mb-1">
                플레이리스트 이름
              </Typography>

              <TextField
                fullWidth
                size="small"
                placeholder="예: 출근길에 듣는 커버곡"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                inputProps={{ maxLength: 30 }}
              />

              <Typography
                variant="caption"
                className="mt-1 block text-right text-gray-500"
              >
                {title.length}/30
              </Typography>
            </Box>

            {/* <Box>
              <Typography variant="body2" className="mb-1">
                설명
              </Typography>

              <TextField
                fullWidth
                multiline
                minRows={3}
                size="small"
                placeholder="플레이리스트 설명을 입력하세요."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                inputProps={{ maxLength: 100 }}
              />

              <Typography
                variant="caption"
                className="mt-1 block text-right text-gray-500"
              >
                {description.length}/100
              </Typography>
            </Box> */}
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={closeModal} disabled={isSubmitting}>
            취소
          </Button>

          <Button
            variant="contained"
            onClick={createPlaylist}
            disabled={!title.trim() || isSubmitting}
          >
            {isSubmitting ? "생성 중..." : "생성"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CreatePlaylistButton;
