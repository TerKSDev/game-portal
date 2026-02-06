import { auth } from "@/lib/actions/auth";
import { redirect } from "next/navigation";
import { PATHS } from "@/app/_config/routes";
import prisma from "@/lib/prisma";
import UserProfileView from "@/app/(protected)/profile/_components/UserProfileView";

export const dynamic = "force-dynamic";

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ uid: string }>;
}) {
  const session = await auth();

  if (!session || !session.user?.id) {
    redirect(PATHS.LOGIN);
  }

  // Await params in Next.js 15+
  const { uid } = await params;

  try {
    // Fetch user data by uid
    const userData = await prisma.user.findUnique({
      where: { uid },
      select: {
        id: true,
        uid: true,
        name: true,
        image: true,
        userStatus: true,
        createdAt: true,
      },
    });

    if (!userData) {
      redirect(PATHS.FRIEND);
    }

    // If viewing own profile, redirect to main profile page
    if (userData.id === session.user.id) {
      redirect(PATHS.PROFILE);
    }

    // Parallel queries for better performance
    const [friendship, library] = await Promise.all([
      prisma.friendship.findFirst({
        where: {
          OR: [
            { user_id: session.user.id, friend_id: userData.id },
            { user_id: userData.id, friend_id: session.user.id },
          ],
        },
      }),
      prisma.libraryItem.findMany({
        where: { userId: userData.id },
        select: {
          id: true,
          name: true,
          image: true,
          gameId: true,
          purchasedAt: true,
        },
        orderBy: { purchasedAt: "desc" },
        take: 6,
      }),
    ]);

    // Get mutual friends - optimized query
    const [userFriendships, targetUserFriendships] = await Promise.all([
      prisma.friendship.findMany({
        where: {
          user_id: session.user.id,
          status: "Accepted",
        },
        select: { friend_id: true },
      }),
      prisma.friendship.findMany({
        where: {
          user_id: userData.id,
          status: "Accepted",
        },
        select: { friend_id: true },
      }),
    ]);

    const userFriendIds = new Set(userFriendships.map((f) => f.friend_id));
    const targetFriendIds = new Set(
      targetUserFriendships.map((f) => f.friend_id),
    );

    // Find intersection
    const mutualFriendIds = Array.from(userFriendIds)
      .filter((id) => targetFriendIds.has(id))
      .slice(0, 6);

    const mutualFriends =
      mutualFriendIds.length > 0
        ? await prisma.user.findMany({
            where: {
              id: { in: mutualFriendIds },
            },
            select: {
              id: true,
              uid: true,
              name: true,
              image: true,
              userStatus: true,
            },
            take: 6,
          })
        : [];

    const libraryData = library.map((item) => ({
      id: item.id,
      name: item.name,
      image: item.image,
      gameId: item.gameId,
      purchasedAt: item.purchasedAt,
    }));

    return (
      <UserProfileView
        userData={{
          id: userData.id,
          uid: userData.uid,
          name: userData.name,
          image: userData.image,
          userStatus: userData.userStatus,
          createdAt: userData.createdAt.toISOString(),
        }}
        libraryData={libraryData}
        mutualFriends={mutualFriends}
        isFriend={friendship?.status === "Accepted"}
        currentUserId={session.user.id}
      />
    );
  } catch (error) {
    console.error("Error fetching user profile:", error);
    console.error("UID param:", uid);

    // Log more details about the error
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }

    redirect(PATHS.FRIEND);
  }
}
