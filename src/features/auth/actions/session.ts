"use server";

import { loginUser, logoutUser, registerUser } from "./auth";

export async function registerAction(formData: FormData) {
  const result = await registerUser({
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
    name: String(formData.get("name") ?? "") || undefined,
  });

  if ("error" in result && result.error) {
    return { error: result.error };
  }
  return { ok: true };
}

export async function loginAction(formData: FormData) {
  const result = await loginUser({
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  });

  if ("error" in result && result.error) {
    return { error: result.error };
  }
  return { ok: true };
}

export async function logoutAction() {
  await logoutUser();
}
