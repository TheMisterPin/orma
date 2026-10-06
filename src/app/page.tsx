import { LandingPageView } from "@/features/landing";
import { getCurrentUser } from "@/features/auth/actions/auth";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const user = await getCurrentUser();
  if (user) {
    redirect("/diary");
  }
  return <LandingPageView />;
}
