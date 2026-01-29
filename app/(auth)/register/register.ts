"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function register(formData: FormData) {
  const username = formData.get("accountName") as string;
  const password = formData.get("accountPassword") as string;
  const checkPassword = formData.get("checkPassword") as string;

  if (!username || !password || !checkPassword) {
    return { error: "All fields are required.", accountName: username };
  }

  if (password !== checkPassword) {
    return { error: "Passwords do not match.", accountName: username };
  }

  try {
    const existingUser = await prisma.user.findMany({
      where: {
        name: username,
      },
    });

    if (existingUser.length > 0) {
      return {
        error: "Account with this name already exists.",
        accountName: username,
      };
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.user.create({
      data: {
        name: username,
        password: hashedPassword,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Registration Error: ", error);
    return {
      error: "An error occurred during registration.",
      accountName: username,
    };
  }
}
