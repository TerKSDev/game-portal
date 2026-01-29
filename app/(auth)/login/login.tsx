"use server";

import { PATHS } from "@/app/_config/routes";
import { signIn } from "@/lib/actions/auth";
import { AuthError } from "next-auth";
import { FaGoogle } from "react-icons/fa";

export type LoginState =
  | {
      error?: string;
      success?: boolean;
      username?: string;
    }
  | undefined;

export async function login(
  prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!username || !password) {
    return { error: "All fields are required.", username };
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
          return { error: "Invalid account name or password.", username };
        default:
          return {
            error: "An error occurred during login.",
            username,
          };
      }
    }
    throw error;
  }
}

export async function signInWithGoogle() {
  await signIn("google", { redirectTo: PATHS.STORE });
}
