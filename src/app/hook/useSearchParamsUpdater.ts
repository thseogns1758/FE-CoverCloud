// src/hooks/useSearchParamUpdater.ts

"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  createUpdatedSearchParams,
  type SearchParamValue,
} from "@/app/utils/searchPrams";

export const useSearchParamUpdater = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateParams = (
    params: Record<string, SearchParamValue>,
    options?: {
      replace?: boolean;
      scroll?: boolean;
    },
  ) => {
    const nextParams = createUpdatedSearchParams(searchParams, params);

    const queryString = nextParams.toString();

    const nextUrl = queryString ? `${pathname}?${queryString}` : pathname;

    if (options?.replace) {
      router.replace(nextUrl, {
        scroll: options.scroll ?? false,
      });
      return;
    }

    router.push(nextUrl, {
      scroll: options?.scroll ?? false,
    });
  };

  const getParam = (key: string, defaultValue = "") => {
    return searchParams.get(key) ?? defaultValue;
  };

  const getNumberParam = (key: string, defaultValue = 1) => {
    const value = searchParams.get(key);

    if (value === null) {
      return defaultValue;
    }

    const numberValue = Number(value);

    return Number.isNaN(numberValue) ? defaultValue : numberValue;
  };

  return {
    searchParams,
    updateParams,
    getParam,
    getNumberParam,
  };
};
