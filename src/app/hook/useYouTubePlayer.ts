import { useEffect } from "react";

export function useYouTubePlayer({
  iframeRef,
  videoId,
  onEnded,
}: {
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
  videoId: string;
  onEnded: () => void;
}) {
  useEffect(() => {
    if (!videoId || !iframeRef.current) return;

    // 모든 메시지 다 찍어보기
    const handleMessage = (e: MessageEvent) => {
      if (e.origin !== "https://www.youtube.com") return;
      try {
        const data = JSON.parse(e.data);
        if (data.info?.playerState === 0) {
          console.log("영상 종료!");
          onEnded();
        }
      } catch {}
    };

    const requestListening = () => {
      console.log("listening 요청 보냄");
      iframeRef.current?.contentWindow?.postMessage(
        JSON.stringify({ event: "listening" }),
        "*",
      );
    };

    window.addEventListener("message", handleMessage);
    iframeRef.current.addEventListener("load", requestListening);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [videoId, onEnded, iframeRef]);
}
