// src/utils/searchParams.ts

import { ReadonlyURLSearchParams } from "next/navigation";

export type SearchParamValue = string | number | boolean | null | undefined;

export const createUpdatedSearchParams = (
  currentSearchParams: URLSearchParams | ReadonlyURLSearchParams,
  params: Record<string, SearchParamValue>,
) => {
  const nextParams = new URLSearchParams(currentSearchParams.toString());

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      nextParams.delete(key);
      return;
    }

    nextParams.set(key, String(value));
  });

  return nextParams;
};
