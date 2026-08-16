"use client";

import { useMutation } from "@tanstack/react-query";

import { claimOwnership } from "@/lib/api/transfer";

export function useClaimOwnership() {
  return useMutation({
    mutationFn: (token: string) => claimOwnership(token),
  });
}
