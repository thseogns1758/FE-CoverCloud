// hooks/useSoundCloudPlayer.ts
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    SC: any;
  }
}

export function useSoundCloudPlayer({
  iframeRef,
  onEnded,
}: {
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
  onEnded: () => void;
}) {
  const widgetRef = useRef<any>(null);

  useEffect(() => {
    const loadApi = () => {
      return new Promise<void>((resolve) => {
        if (window.SC?.Widget) {
          resolve();
          return;
        }
        const script = document.createElement("script");
        script.src = "https://w.soundcloud.com/player/api.js";
        script.onload = () => resolve();
        document.head.appendChild(script);
      });
    };

    loadApi().then(() => {
      if (!iframeRef.current) return;

      const widget = window.SC.Widget(iframeRef.current);
      widgetRef.current = widget;

      widget.bind(window.SC.Widget.Events.FINISH, () => {
        onEnded();
      });
    });

    return () => {
      // SC Widget API에는 별도 destroy가 없음
      widgetRef.current = null;
    };
  }, [iframeRef, onEnded]);

  return widgetRef;
}
