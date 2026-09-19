import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/app/store/useAuthStore";
import axios from "axios";

export const fetchAuthMeWithCookie = async (accessToken: string) => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/me`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (res && res.data) {
      useAuthStore.setState({ isLogin: true });

      return res.data;
    }

    throw new Error("No data received");
  } catch (error) {
    useAuthStore.setState({ isLogin: false });
    return {
      success: false,
      message: "로그인 정보를 확인할 수 없습니다.",
    };
  }
};
export const useAuthMeQuery = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  return useQuery({
    queryKey: ["auth-me-cookie", accessToken],
    queryFn: () => fetchAuthMeWithCookie(accessToken),
    enabled: !!accessToken,
    retry: false,
  });
};
