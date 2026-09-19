// 미디어 타입 정의
export type MediaPlatform = "youtube" | "tiktok" | "soundcloud" | null;

// 반환 타입 정의
export interface MediaUrlResult {
  platform: MediaPlatform;
  id: string | null;
  isValid: boolean;
  originalUrl: string;
  embedUrl?: string;
}

/**
 * YouTube, TikTok, SoundCloud URL을 감지하고 처리하는 통합 함수
 * @param url - 검증할 URL
 * @returns MediaUrlResult 객체
 */

export const detectAndValidateMediaUrl = (url: string): MediaUrlResult => {
  if (!url || typeof url !== "string") {
    return {
      platform: null,
      id: null,
      isValid: false,
      originalUrl: url || "",
    };
  }

  // YouTube 패턴
  const youtubePatterns = [
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^?]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^?]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([^?]+)/,
  ];

  // TikTok 패턴
  const tiktokPatterns = [
    {
      type: "full",
      regex: /(?:https?:\/\/)?(?:www\.)?tiktok\.com\/@[\w.-]+\/video\/(\d+)/,
    },
    {
      type: "share", // vm.tiktok.com 같은 공유용 단축 URL
      regex: /(?:https?:\/\/)?(?:vm|vt)\.tiktok\.com\/([A-Za-z0-9]+)/,
    },
  ];
  // SoundCloud 패턴
  const soundcloudPatterns = [
    {
      type: "full",
      regex: /(?:https?:\/\/)?(?:www\.)?soundcloud\.com\/([\w-]+)\/([\w-]+)/,
    },
    {
      type: "share", // 공유용 단축 URL
      regex:
        /(?:https?:\/\/)?(?:soundcloud\.app\.goo\.gl|on\.soundcloud\.com)\/([A-Za-z0-9]+)/,
    },
  ];
  // YouTube 검증
  for (const pattern of youtubePatterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return {
        platform: "youtube",
        id: match[1],
        isValid: true,
        originalUrl: url,
        embedUrl: `https://www.youtube.com/embed/${match[1]}`,
      };
    }
  }

  // TikTok 검증
  for (const pattern of tiktokPatterns) {
    const match = url.match(pattern.regex);
    if (match && match[1]) {
      return {
        platform: "tiktok",
        // full 타입이면 바로 ID로 쓰고, share 타입이면 일단 추출한 코드를 넣음
        id: match[1],
        isValid: true,
        originalUrl: url,
        // share URL인 경우 임시 ID이므로 embedUrl을 바로 만들지 않거나 처리 필요
        embedUrl:
          pattern.type === "full"
            ? `https://www.tiktok.com/player/v1/${match[1]}`
            : undefined,
      };
    }
  }

  // SoundCloud 검증
  // SoundCloud 검증
  for (const pattern of soundcloudPatterns) {
    const match = url.match(pattern.regex);
    if (match) {
      if (pattern.type === "full") {
        const id = `${match[1]}/${match[2]}`;

        return {
          platform: "soundcloud",
          id,
          isValid: true,
          originalUrl: url,
          embedUrl: `https://w.soundcloud.com/player/?url=https://soundcloud.com/${id}`,
        };
      }

      // 공유 URL인 경우 → 일단 ID 없이 반환
      return {
        platform: "soundcloud",
        id: match[1], // 단축코드
        isValid: true,
        originalUrl: url,
        embedUrl: undefined,
      };
    }
  }

  // 일치하는 패턴이 없을 경우
  return {
    platform: null,
    id: null,
    isValid: false,
    originalUrl: url,
  };
};

/**
 * 기존 YouTube 전용 함수 (하위 호환성 유지)
 */
export const getYoutubeVideoId = (url: string): string | null => {
  const result = detectAndValidateMediaUrl(url);
  return result.platform === "youtube" ? result.id : null;
};

/**
 * TikTok 비디오 ID 추출
 */
export const getTiktokVideoId = (url: string): string | null => {
  const result = detectAndValidateMediaUrl(url);
  return result.platform === "tiktok" ? result.id : null;
};

/**
 * SoundCloud 트랙 ID 추출
 */
export const getSoundcloudTrackId = (url: string): string | null => {
  const result = detectAndValidateMediaUrl(url);
  return result.platform === "soundcloud" ? result.id : null;
};

// 사용 예시 및 테스트
export const exampleUsage = () => {
  const testUrls = [
    "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "https://youtu.be/dQw4w9WgXcQ",
    "https://www.youtube.com/shorts/abc123",
    "https://www.tiktok.com/@user/video/1234567890",
    "https://vm.tiktok.com/ZMeABC123",
    "https://soundcloud.com/artist-name/track-name",
    "https://www.google.com", // 잘못된 URL
  ];

  testUrls.forEach((url) => {
    const result = detectAndValidateMediaUrl(url);
    // console.log(`URL: ${url}`);
    // console.log(`Platform: ${result.platform}`);
    // console.log(`Valid: ${result.isValid}`);
    // console.log(`ID: ${result.id}`);
    // console.log(`Embed URL: ${result.embedUrl}`);
    // console.log("---");
  });
};

export const fetchTiktokDataWithApi = async (url: string) => {
  try {
    const res = await fetch(
      `https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`,
    );
    const data = await res.json();

    // data.html 안에 "<blockquote ... video/7123456789012345678 ...>" 형태의 ID가 들어있음
    const idMatch = data.html.match(/video\/(\d+)/);
    const realId = idMatch ? idMatch[1] : null;

    return {
      thumbnail: data.thumbnail_url,
      realId: realId,
      embedUrl: realId
        ? `https://www.tiktok.com/player/v1/${realId}`
        : undefined,
    };
  } catch (e) {
    console.error("TikTok 데이터 가져오기 실패", e);
    return null;
  }
};

export const fetchSoundCloudDataWithApi = async (url: string) => {
  try {
    const res = await fetch(
      `https://soundcloud.com/oembed?format=json&url=${encodeURIComponent(url)}`,
    );

    if (!res.ok) return null;
    const data = await res.json();

    // 🔥 수정된 정규식: / 또는 %2F를 모두 허용
    // (?:tracks|playlists) : tracks나 playlists를 찾음
    // (?:/|%2F) : 슬래시(/)나 인코딩된 슬래시(%2F)를 찾음
    // (\d+) : 최종 숫자 ID를 캡처
    const idMatch = data.html.match(/(?:tracks|playlists)(?:\/|%2F)(\d+)/);
    const trackId = idMatch ? idMatch[1] : null;

    return {
      thumbnail: data.thumbnail_url,
      realId: trackId,
      embedUrl: trackId
        ? `https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${trackId}`
        : undefined,
    };
  } catch (e) {
    console.error("SoundCloud 데이터 가져오기 실패", e);
    return null;
  }
};
const getYoutubeThumbnail = (videoId: string) => {
  // 기본 퀄리티
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
};

export const getMediaThumbnail = async (media: MediaUrlResult) => {
  if (!media.isValid || !media.platform) return null;

  switch (media.platform) {
    case "youtube":
      return media.id
        ? `https://img.youtube.com/vi/${media.id}/hqdefault.jpg`
        : null;
    case "tiktok":
      return await fetchTiktokDataWithApi(media.originalUrl).then((data) => {
        return data?.thumbnail || null;
      });
    case "soundcloud":
      return await fetchSoundCloudDataWithApi(media.originalUrl).then(
        (data) => {
          return data?.thumbnail || null;
        },
      );
    default:
      return null;
  }
};
/**
 * 틱톡 단축 URL까지 완벽하게 감지하여 최종 결과를 반환하는 비동기 검증 함수
 */
export const resolveMediaUrl = async (url: string): Promise<MediaUrlResult> => {
  const result = detectAndValidateMediaUrl(url);

  if (!result.isValid || !result.platform) {
    return result;
  }

  if (result.platform === "youtube") {
    return result;
  }

  if (result.platform === "tiktok") {
    if (result.embedUrl) {
      return result;
    }

    const apiData = await fetchTiktokDataWithApi(url);

    if (apiData?.realId && apiData.embedUrl) {
      return {
        ...result,
        id: apiData.realId,
        isValid: true,
        embedUrl: apiData.embedUrl,
      };
    }

    return result;
  }

  if (result.platform === "soundcloud") {
    if (result.embedUrl) {
      return result;
    }

    const apiData = await fetchSoundCloudDataWithApi(url);

    if (apiData?.realId && apiData.embedUrl) {
      return {
        ...result,
        id: apiData.realId,
        isValid: true,
        embedUrl: apiData.embedUrl,
      };
    }

    return result;
  }

  return result;
};