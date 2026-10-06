import Link from "next/link";
import { buttonVariants } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";

export function LandingPageView() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(61,90,54,0.12),transparent_45%),radial-gradient(circle_at_80%_0%,rgba(122,92,64,0.14),transparent_40%),linear-gradient(180deg,#f3eadc_0%,#ebe1d0_55%,#e4d7c3_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22160%22 height=%22160%22 viewBox=%220 0 160 160%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%222%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22160%22 height=%22160%22 filter=%22url(%23n)%22 opacity=%220.35%22/%3E%3C/svg%3E')]"
      />

      <div className="relative mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center gap-10 px-6 py-20">
        <p className="font-heading text-5xl font-semibold tracking-tight text-primary sm:text-7xl">
          Orma
        </p>
        <div className="max-w-xl space-y-4">
          <h1 className="font-heading text-3xl leading-tight text-foreground sm:text-4xl">
            A personal diary from the photos you already took.
          </h1>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Orma reconstructs a day from place and time evidence — and shows you why a memory
            exists instead of inventing details.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/login" className={cn(buttonVariants({ size: "lg" }))}>
            Log in
          </Link>
          <Link
            href="/register"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
          >
            Create account
          </Link>
        </div>
      </div>
    </main>
  );
}
