import { NextResponse } from "next/server";
import { logoutUser } from "@/features/auth/actions/auth";

export async function POST() {
  await logoutUser();
  return NextResponse.json({ ok: true });
}
