import { auth } from "@/lib/actions/auth";
import { redirect } from "next/navigation";
import { PATHS } from "@/app/_config/routes";
import prisma from "@/lib/prisma";
import UserProfileView from "@/app/(protected)/profile/_components/UserProfileView";

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

    // Check friendship status
    const friendship = await prisma.friendship.findFirst({
      where: {
        OR: [
          { user_id: session.user.id, friend_id: userData.id },
          { user_id: userData.id, friend_id: session.user.id },
        ],
      },
    });

    // Get user's game library (LibraryItem has cached game data)
    const library = await prisma.libraryItem.findMany({
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
    });

    // Get mutual friends
    const mutualFriends = await prisma.$queryRaw<
      Array<{
        id: string;
        uid: string | null;
        name: string | null;
        image: string | null;
        userStatus: string;
      }>
    >`
      SELECT DISTINCT u.id, u.uid, u.name, u.image, u."userStatus"
      FROM "User" u
      WHERE u.id IN (
        SELECT CASE 
          WHEN f1."user_id" = ${session.user.id} THEN f1."friend_id"
          ELSE f1."user_id"
        END AS friend_id
        FROM "Friendship" f1
        WHERE f1.status = 'Accepted'
          AND (f1."user_id" = ${session.user.id} OR f1."friend_id" = ${session.user.id})
      )
      AND u.id IN (
        SELECT CASE 
          WHEN f2."user_id" = ${userData.id} THEN f2."friend_id"
          ELSE f2."user_id"
        END AS friend_id
        FROM "Friendship" f2
        WHERE f2.status = 'Accepted'
          AND (f2."user_id" = ${userData.id} OR f2."friend_id" = ${userData.id})
      )
      LIMIT 6
    `;

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
          createdAt: userData.createdAt.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
          }),
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
