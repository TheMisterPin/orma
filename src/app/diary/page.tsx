import { redirect } from "next/navigation";
import { DiaryHomeView } from "@/features/diary";
import { getCurrentUser } from "@/features/auth/actions/auth";
import { logoutAction } from "@/features/auth/actions/session";

export default async function DiaryPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  return (
    <DiaryHomeView userName={user.name} userEmail={user.email} logout={logoutAction} />
  );
}
