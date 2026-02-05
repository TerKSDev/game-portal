import { auth } from "@/lib/actions/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

import { PATHS } from "@/app/_config/routes";
import ProfileForm from "./ProfileForm";
import Header from "@/app/components/Header";
import { id } from "zod/locales";
import { userAgent } from "next/server";

export const metadata = {
  title: "Profile",
  description: "Manage your Game Portal account settings and preferences.",
};

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
      uid: true,
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

  // Get friends (limited to 6)
  const friendships = await prisma.friendship.findMany({
    where: {
      user_id: session?.user?.id,
      status: "Accepted",
    },
    take: 6,
    select: {
      friend_id: true,
    },
  });

  const friendIds = friendships.map((f) => f.friend_id);
  const friends = await prisma.user.findMany({
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
  });

  // Get total friend count
  const totalFriends = await prisma.friendship.count({
    where: {
      user_id: session?.user?.id,
      status: "Accepted",
    },
  });

  const date = user?.createdAt?.toLocaleDateString().toString();
  const status = user?.userStatus?.toString();

  const data = {
    ...user,
    createdAt: date,
    userStatus: status,
  };

  return (
    <div className="flex flex-1 pt-24 sm:pt-32 px-2 sm:px-4 lg:px-8 pb-8 sm:pb-12 min-h-screen">
      <ProfileForm
        key={user?.name}
        userData={data}
        libraryData={library}
        friendsData={friends}
        totalFriends={totalFriends}
      />
    </div>
  );
}
