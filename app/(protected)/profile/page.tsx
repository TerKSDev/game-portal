import { auth } from "@/lib/actions/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

import { PATHS } from "@/app/_config/routes";
import ProfileForm from "./ProfileForm";
import Header from "@/app/components/Header";
import { id } from "zod/locales";
import { userAgent } from "next/server";

export default async function Profile() {
  const session = await auth();

  if (!session) {
    redirect(PATHS.LOGIN);
  }

  const user = await prisma.user.findFirst({
    where: {
      id: session?.user?.id,
    },
    select: {
      name: true,
      image: true,
      userStatus: true,
      createdAt: true,
      email: true,
      orbs: true,
    },
  });

  const library = await prisma.libraryItem.findMany({
    where: {
      userId: session?.user?.id,
    },
    select: {
      id: true,
      name: true,
      image: true,
      gameId: true,
      purchasedAt: true,
    },
    orderBy: { purchasedAt: "desc" },
  });

  const date = user?.createdAt?.toLocaleDateString().toString();
  const status = user?.userStatus?.toString();

  const data = {
    ...user,
    createdAt: date,
    userStatus: status,
  };

  return (
    <div className="flex flex-1 pt-32 px-4 sm:px-6 lg:px-8 pb-12 min-h-screen">
      <ProfileForm key={user?.name} userData={data} libraryData={library} />
    </div>
  );
}
