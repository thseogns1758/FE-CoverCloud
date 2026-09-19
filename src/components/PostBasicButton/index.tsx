import theme from "@/app/lib/theme";
import { Box, Button } from "@mui/material";

const PostBasicButton = ({
  children,
  onClick,
  color,
  backgroundColor,
  hoverBGColor,
  hoverColor,
  sxStyle,
  postRadius = "15px",
  postClass = "",
  icon = null,
}: {
  children: string | React.ReactNode;
  onClick: () => void;
  color?: string;
  backgroundColor?: string;
  hoverBGColor?: string;
  hoverColor?: string;
  postRadius?: string;
  sxStyle?: React.CSSProperties;
  postClass?: string;
  icon?: React.ReactNode;
}) => {
  return (
    <Button
      sx={{
        padding: "8px 28px",
        borderRadius: postRadius,
        backgroundColor: backgroundColor,
        color: color,
        "&:hover": {
          backgroundColor: hoverBGColor,
          color: hoverColor,
        },
        ...sxStyle,
      }}
      onClick={onClick}
    >
      {icon && <Box>{icon}</Box>}
      <Box className={postClass}>{children}</Box>
    </Button>
  );
};

export default PostBasicButton;
