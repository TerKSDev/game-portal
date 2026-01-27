"use server";

import { PATHS } from "@/app/_config/routes";
import { signIn } from "@/lib/actions/auth";
import { AuthError } from "next-auth";
import { FaGoogle } from "react-icons/fa";

export type LoginState =
  | {
      error?: string;
      success?: boolean;
    }
  | undefined;

export async function login(
  prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!username || !password) {
    return { error: "All fields are required." };
  }

  try {
    await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid account name or password." };
        default:
          return {
            error: "An error occurred during login.",
          };
      }
    }
    throw error;
  }
}

export async function signInWithGoogle() {
  await signIn("google", { redirectTo: PATHS.STORE });
}
