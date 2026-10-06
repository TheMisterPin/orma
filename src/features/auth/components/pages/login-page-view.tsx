import Link from "next/link";
import { LoginForm } from "../forms/login-form";

type Props = {
  submit: (formData: FormData) => Promise<{ error?: string; ok?: boolean }>;
};

export function LoginPageView({ submit }: Props) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center gap-8 px-6 py-16">
      <div className="space-y-2 text-center">
        <Link href="/" className="font-heading text-3xl font-semibold tracking-tight text-primary">
          Orma
        </Link>
        <p className="text-muted-foreground">Sign in to your personal diary.</p>
      </div>
      <LoginForm submit={submit} />
    </main>
  );
}
