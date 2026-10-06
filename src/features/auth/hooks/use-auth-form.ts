"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { AuthFormState } from "../types/auth";

type AuthActionResult = { error?: string; ok?: boolean };

export function useAuthForm(submit: (formData: FormData) => Promise<AuthActionResult>) {
  const router = useRouter();
  const [state, setState] = useState<AuthFormState>({});
  const [isPending, startTransition] = useTransition();

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setState({});
    startTransition(async () => {
      const result = await submit(formData);
      if (result.error) {
        setState({ error: result.error });
        return;
      }
      setState({ success: true });
      router.push("/diary");
      router.refresh();
    });
  }

  return { state, isPending, onSubmit };
}
