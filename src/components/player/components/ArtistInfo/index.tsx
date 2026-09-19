import React from "react";
import { Box } from "@mui/material";
import ArtistProfile from "../../../../app/post/components/ArtistProfile";
import { ArtistProfileMobileProps } from "../../../../app/post/components/ArtistProfile/type";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import theme from "@/app/lib/theme";

const ArtistInfo = ({
  coverArtist = "아티스트",
  songTitle = "노래제목",
  coverUrl = "",
  isMobile = false,
}: ArtistProfileMobileProps) => {
  const [isArtistInfoOpen, setIsArtistInfoOpen] = React.useState(false);
  const openArtistInfoHandler = () => {
    setIsArtistInfoOpen((prev) => !prev);
  };
  return (
    <section style={{ marginBottom: "20px" }}>
      {isMobile ? (
        <Box>
          <Box
            className=" flex"
            onClick={openArtistInfoHandler}
            sx={{ margin: "8px" }}
          >
            <Box>원곡정보 보기</Box>
            <Box>
              {isArtistInfoOpen ? (
                <KeyboardArrowUpIcon />
              ) : (
                <KeyboardArrowDownIcon />
              )}
            </Box>
          </Box>
          <Box
            className={`
              overflow-hidden transition-all duration-300
              ${
                isArtistInfoOpen
                  ? "max-h-[500px] opacity-100"
                  : "max-h-0 opacity-0"
              }

       
            `}
            sx={{
              backgroundColor: theme.palette.gray.tertiary,
              borderRadius: "20px",
            }}
          >
            <ArtistProfile
              coverArtist={coverArtist}
              songTitle={songTitle}
              coverUrl={coverUrl}
            />
          </Box>
        </Box>
      ) : (
        <ArtistProfile
          coverArtist={coverArtist}
          songTitle={songTitle}
          coverUrl={coverUrl}
          isSearch
        />
      )}
    </section>
  );
};

export default ArtistInfo;
