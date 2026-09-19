  "use client";

  import React, { useRef, useCallback, useMemo } from "react";
  import { MediaPlatform } from "@/app/utils/youtube";
  import { useYouTubePlayer } from "@/app/hook/useYouTubePlayer";
  import { useSoundCloudPlayer } from "@/app/hook/useSoundCloudPlayer";

  type VideoPlayerProps = {
    videoId: string;
    videoType: MediaPlatform;
    videoData: any;
    onVideoEnded?: () => void;
    getAspectRatio: (videoData: any) => string;
    autoPlay?: boolean;
  };

  const VideoPlayer = ({
    videoId,
    videoType,
    videoData,
    onVideoEnded,
    getAspectRatio,
    autoPlay = false,
  }: VideoPlayerProps) => {
    const ytIframeRef = useRef<HTMLIFrameElement | null>(null);
    const scIframeRef = useRef<HTMLIFrameElement | null>(null);

    const handleEnded = useCallback(() => {
      onVideoEnded?.();
    }, [onVideoEnded]);

    const ytSrc = useMemo(() => {
      
      if (!videoId || videoType !== "youtube") return null;

      const url = new URL(videoId);

      url.searchParams.set("enablejsapi", "1");
      url.searchParams.set("playsinline", "1");

      if (typeof window !== "undefined") {
        url.searchParams.set("origin", window.location.origin);
      }

      if (autoPlay) {
        url.searchParams.set("autoplay", "1");

        // 자동재생이 계속 막히면 켜기
        // url.searchParams.set("mute", "1");
      } else {
        url.searchParams.delete("autoplay");
        url.searchParams.delete("mute");
      }

      return url.toString();
    }, [videoId, videoType, autoPlay]);

    const scSrc = useMemo(() => {
      if (!videoId || videoType !== "soundcloud") return null;

      const url = new URL(videoId);

      url.searchParams.set("enable_api", "true");

      if (autoPlay) {
        url.searchParams.set("auto_play", "true");
      } else {
        url.searchParams.delete("auto_play");
      }

      return url.toString();
    }, [videoId, videoType, autoPlay]);

    useYouTubePlayer({
      iframeRef: ytIframeRef,
      videoId: videoType === "youtube" ? videoId : "",
      onEnded: handleEnded,
    });

    useSoundCloudPlayer({
      iframeRef: scIframeRef,
      onEnded: handleEnded,
    });

    if (videoType === "youtube") {
      if (!ytSrc) return null;

      return (
        <iframe
          ref={ytIframeRef}
          src={ytSrc}
          width="100%"
          height="auto"
          style={{
            aspectRatio: getAspectRatio(videoData),
            borderRadius: "12px",
            border: "none",
          }}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      );
    }

    if (videoType === "soundcloud") {
      if (!scSrc) return null;

      return (
        <iframe
          ref={scIframeRef}
          src={scSrc}
          width="100%"
          height="200px"
          style={{
            borderRadius: "12px",
            border: "none",
          }}
          allow="autoplay"
          allowFullScreen
        />
      );
    }
    if (videoType === "tiktok") {
      if (!videoId) return null;
    
      return (
        <iframe
          src={videoId}
          width="100%"
          height="700"
          style={{
            borderRadius: "12px",
            border: "none",
          }}
          allow="autoplay; encrypted-media; fullscreen"
          allowFullScreen
        />
      );
    }
    if (!videoId) return null;

    return (
      <iframe
        src={videoId}
        width="100%"
        height="auto"
        style={{
          aspectRatio: getAspectRatio(videoData),
          borderRadius: "12px",
          border: "none",
        }}
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
      />
    );
  };

  export default VideoPlayer;
