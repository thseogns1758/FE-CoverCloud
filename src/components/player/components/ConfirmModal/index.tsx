"use client";

import { Box, Button, Typography } from "@mui/material";
import Modal from "@/components/modal/Modal";

type ConfirmModalProps = {
  isOpen: boolean;
  title: string;
  description: React.ReactNode;
  confirmText: string;
  confirmColor?: "primary" | "error" | "success" | "warning";
  onClose: () => void;
  onConfirm: () => void;
};

const ConfirmModal = ({
  isOpen,
  title,
  description,
  confirmText,
  confirmColor = "primary",
  onClose,
  onConfirm,
}: ConfirmModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Box
        className="flex flex-col items-center"
        sx={{
          width: "100%",
          bgcolor: "#fff",
          borderRadius: "12px",
          p: "40px",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700, mb: "8px" }}>
          {title}
        </Typography>

        <Typography
          sx={{
            fontSize: "20px",
            color: "#666",
            mb: "24px",
            textAlign: "center",
          }}
        >
          {description}
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "16px",
            width: "100%",
          }}
        >
          <Button variant="outlined" onClick={onClose}>
            취소
          </Button>

          <Button variant="contained" color={confirmColor} onClick={onConfirm}>
            {confirmText}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ConfirmModal;
