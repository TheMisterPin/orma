"use client";

import { Button } from "@/shared/ui/button";
import type { DiaryHomeProps } from "../../types/diary";
import { useDiaryHome } from "../../hooks/use-diary-home";

type Props = DiaryHomeProps & {
  logout: () => Promise<void>;
};

export function DiaryHomeView({ userName, userEmail, logout }: Props) {
  const { isPending, onLogout, onCreateMemory } = useDiaryHome(logout);
  const greeting = userName?.trim() || userEmail;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-10 px-6 py-12">
      <header className="flex items-start justify-between gap-4 border-b border-border/70 pb-6">
        <div className="space-y-1">
          <p className="font-heading text-3xl font-semibold tracking-tight text-primary">Orma</p>
          <p className="text-sm text-muted-foreground">Your personal diary · {greeting}</p>
        </div>
        <Button variant="ghost" onClick={onLogout} disabled={isPending}>
          {isPending ? "Signing out…" : "Log out"}
        </Button>
      </header>

      <section className="flex flex-1 flex-col items-start justify-center gap-5 py-16">
        <h1 className="font-heading text-3xl text-foreground">No memories yet</h1>
        <p className="max-w-md text-muted-foreground">
          Start with one photo. Orma will read the place and time it can find, then help you write
          a short diary entry you can check and edit.
        </p>
        <Button size="lg" onClick={onCreateMemory}>
          Create a memory from an image
        </Button>
      </section>
    </main>
  );
}
