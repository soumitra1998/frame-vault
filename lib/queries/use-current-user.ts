"use client";

import { useQuery } from "@tanstack/react-query";

import { getCurrentUser, getUserById } from "@/lib/api/user";
import { queryKeys } from "./keys";

export function useCurrentUser() {
  return useQuery({
    queryKey: queryKeys.currentUser,
    queryFn: getCurrentUser,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCurrentUserId() {
  const { data } = useCurrentUser();
  return data?.frmvusrPk;
}

export function useUserById(userId: number) {
  return useQuery({
    queryKey: queryKeys.userById(userId),
    queryFn: () => getUserById(userId),
    enabled: !!userId,
  });
}
