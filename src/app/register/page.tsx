import { RegisterPageView } from "@/features/auth";
import { registerAction } from "@/features/auth/actions/session";
import { getCurrentUser } from "@/features/auth/actions/auth";
import { redirect } from "next/navigation";

export default async function RegisterPage() {
  const user = await getCurrentUser();
  if (user) {
    redirect("/diary");
  }

  return <RegisterPageView submit={registerAction} />;
}
