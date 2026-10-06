"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

export function useDiaryHome(logout: () => Promise<void>) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function onLogout() {
    startTransition(async () => {
      await logout();
      router.push("/");
      router.refresh();
    });
  }

  function onCreateMemory() {
    // Slice 2 will open the create-memory modal.
  }

  return { isPending, onLogout, onCreateMemory };
}
