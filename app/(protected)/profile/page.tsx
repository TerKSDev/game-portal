import { auth } from "@/lib/actions/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

import { PATHS } from "@/app/_config/routes";
import ProfileForm from "./ProfileForm";
import { id } from "zod/locales";
import { userAgent } from "next/server";

export const metadata = {
  title: "Profile",
  description: "Manage your Game Portal account settings and preferences.",
};

export const dynamic = "force-dynamic";

export default async function Profile() {
  const session = await auth();

  if (!session) {
    redirect(PATHS.LOGIN);
  }

  // Parallel queries for better performance
  const [user, library, friendships, totalFriends] = await Promise.all([
    prisma.user.findFirst({
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
        uid: true,
      },
    }),
    prisma.libraryItem.findMany({
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
      take: 50, // Limit to improve performance
    }),
    prisma.friendship.findMany({
      where: {
        user_id: session?.user?.id,
        status: "Accepted",
      },
      take: 6,
      select: {
        friend_id: true,
      },
    }),
    prisma.friendship.count({
      where: {
        user_id: session?.user?.id,
        status: "Accepted",
      },
    }),
  ]);

  const friendIds = friendships.map((f) => f.friend_id);
  const friends =
    friendIds.length > 0
      ? await prisma.user.findMany({
          where: {
            id: {
              in: friendIds,
            },
          },
          select: {
            id: true,
            uid: true,
            name: true,
            image: true,
            userStatus: true,
          },
        })
      : [];

  const date = user?.createdAt
    ? new Date(user.createdAt).toISOString()
    : undefined;
  const status = user?.userStatus?.toString();

  const data = {
    ...user,
    createdAt: date,
    userStatus: status,
  };

  return (
    <main className="flex flex-1 w-full min-h-screen justify-center px-4 sm:px-6 lg:px-8 py-8">
      <ProfileForm
        key={user?.name}
        userData={data}
        libraryData={library}
        friendsData={friends}
        totalFriends={totalFriends}
      />
    </main>
  );
}
