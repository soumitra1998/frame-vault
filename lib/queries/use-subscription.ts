"use client";

import { useQuery } from "@tanstack/react-query";

import { getStorageInfo, getSubscription } from "@/lib/api/subscription";
import { queryKeys } from "./keys";

export function useSubscription() {
  return useQuery({
    queryKey: queryKeys.subscription,
    queryFn: getSubscription,
  });
}

export function useStorageInfo() {
  return useQuery({
    queryKey: queryKeys.storageInfo,
    queryFn: getStorageInfo,
  });
}
