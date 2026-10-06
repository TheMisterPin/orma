import { LoginPageView } from "@/features/auth";
import { loginAction } from "@/features/auth/actions/session";
import { getCurrentUser } from "@/features/auth/actions/auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) {
    redirect("/diary");
  }

  return <LoginPageView submit={loginAction} />;
}
