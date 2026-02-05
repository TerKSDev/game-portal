"use server";

import { auth } from "@/lib/actions/auth";
import prisma from "@/lib/prisma";
import { FriendshipStatus } from "@/app/generated/prisma/enums";
import { revalidatePath } from "next/cache";

// Get all friends of the current user
export async function getFriends() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  const friendships = await prisma.friendship.findMany({
    where: {
      user_id: session.user.id,
      status: FriendshipStatus.Accepted,
    },
    include: {
      user: false,
    },
  });

  // Get friend details
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
      email: true,
      image: true,
      userStatus: true,
    },
  });

  return friends;
}

// Get pending friend requests
export async function getPendingRequests() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  const requests = await prisma.friendship.findMany({
    where: {
      friend_id: session.user.id,
      status: FriendshipStatus.Pending,
    },
  });

  const userIds = requests.map((r) => r.user_id);
  const users = await prisma.user.findMany({
    where: {
      id: {
        in: userIds,
      },
    },
    select: {
      id: true,
      uid: true,
      name: true,
      email: true,
      image: true,
    },
  });

  return users.map((user) => ({
    ...user,
    requestId: requests.find((r) => r.user_id === user.id)?.id,
  }));
}

// Search users by name or UID
export async function searchUsers(query: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  const currentUserId = session.user.id;

  if (!query || query.trim().length < 2) {
    return [];
  }

  // Get users who are already friends or blocked by current user
  const existingRelations = await prisma.friendship.findMany({
    where: {
      user_id: currentUserId,
    },
    select: {
      friend_id: true,
      status: true,
    },
  });

  // Get users who blocked the current user
  const blockedByOthers = await prisma.friendship.findMany({
    where: {
      friend_id: currentUserId,
      status: FriendshipStatus.Blocked,
    },
    select: {
      user_id: true,
    },
  });

  const excludedIds = existingRelations.map((r) => r.friend_id);
  const blockedByIds = blockedByOthers.map((r) => r.user_id);
  excludedIds.push(currentUserId); // Exclude self
  excludedIds.push(...blockedByIds); // Exclude users who blocked us

  // Search by name OR uid
  const users = await prisma.user.findMany({
    where: {
      AND: [
        {
          id: {
            notIn: excludedIds,
          },
        },
        {
          OR: [
            {
              name: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              uid: {
                contains: query,
                mode: "insensitive",
              },
            },
          ],
        },
      ],
    },
    select: {
      id: true,
      uid: true,
      name: true,
      email: true,
      image: true,
    },
    take: 10,
  });

  // Get mutual friends count for each user
  const usersWithMutualFriends = await Promise.all(
    users.map(async (user) => {
      const mutualFriendsCount = await getMutualFriendsCount(
        currentUserId,
        user.id,
      );

      let mutualFriends: any[] = [];
      if (mutualFriendsCount > 0) {
        mutualFriends = await getMutualFriends(currentUserId, user.id, 3);
      }

      return {
        ...user,
        mutualFriendsCount,
        mutualFriends,
      };
    }),
  );

  return usersWithMutualFriends;
}

// Get mutual friends count
export async function getMutualFriendsCount(
  userId1: string,
  userId2: string,
): Promise<number> {
  const mutualFriends = await prisma.$queryRaw<Array<{ count: bigint }>>` 
    SELECT COUNT(DISTINCT u.id) as count
    FROM "User" u
    WHERE u.id IN (
      SELECT CASE 
        WHEN f1."user_id" = ${userId1} THEN f1."friend_id"
        ELSE f1."user_id"
      END AS friend_id
      FROM "Friendship" f1
      WHERE f1.status = 'Accepted'
        AND (f1."user_id" = ${userId1} OR f1."friend_id" = ${userId1})
    )
    AND u.id IN (
      SELECT CASE 
        WHEN f2."user_id" = ${userId2} THEN f2."friend_id"
        ELSE f2."user_id"
      END AS friend_id
      FROM "Friendship" f2
      WHERE f2.status = 'Accepted'
        AND (f2."user_id" = ${userId2} OR f2."friend_id" = ${userId2})
    )
  `;

  return Number(mutualFriends[0]?.count || 0);
}

// Get mutual friends details
export async function getMutualFriends(
  userId1: string,
  userId2: string,
  limit: number = 3,
) {
  const mutualFriends = await prisma.$queryRaw<
    Array<{
      id: string;
      uid: string | null;
      name: string | null;
      image: string | null;
    }>
  >`
    SELECT DISTINCT u.id, u.uid, u.name, u.image
    FROM "User" u
    WHERE u.id IN (
      SELECT CASE 
        WHEN f1."user_id" = ${userId1} THEN f1."friend_id"
        ELSE f1."user_id"
      END AS friend_id
      FROM "Friendship" f1
      WHERE f1.status = 'Accepted'
        AND (f1."user_id" = ${userId1} OR f1."friend_id" = ${userId1})
    )
    AND u.id IN (
      SELECT CASE 
        WHEN f2."user_id" = ${userId2} THEN f2."friend_id"
        ELSE f2."user_id"
      END AS friend_id
      FROM "Friendship" f2
      WHERE f2.status = 'Accepted'
        AND (f2."user_id" = ${userId2} OR f2."friend_id" = ${userId2})
    )
    LIMIT ${limit}
  `;

  return mutualFriends;
}

// Get suggested friends (random users)
export async function getSuggestedFriends() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  const currentUserId = session.user.id;

  // Get users who are already friends or blocked by current user
  const existingRelations = await prisma.friendship.findMany({
    where: {
      user_id: currentUserId,
    },
    select: {
      friend_id: true,
      status: true,
    },
  });

  // Get users who blocked the current user
  const blockedByOthers = await prisma.friendship.findMany({
    where: {
      friend_id: currentUserId,
      status: FriendshipStatus.Blocked,
    },
    select: {
      user_id: true,
    },
  });

  const excludedIds = existingRelations.map((r) => r.friend_id);
  const blockedByIds = blockedByOthers.map((r) => r.user_id);
  excludedIds.push(currentUserId); // Exclude self
  excludedIds.push(...blockedByIds); // Exclude users who blocked us

  // Get random users
  const users = await prisma.user.findMany({
    where: {
      id: {
        notIn: excludedIds,
      },
    },
    select: {
      id: true,
      uid: true,
      name: true,
      email: true,
      image: true,
    },
    take: 6,
  });

  // Get mutual friends count for each user
  const usersWithMutualFriends = await Promise.all(
    users.map(async (user) => {
      const mutualFriendsCount = await getMutualFriendsCount(
        currentUserId,
        user.id,
      );

      let mutualFriends: any[] = [];
      if (mutualFriendsCount > 0) {
        mutualFriends = await getMutualFriends(currentUserId, user.id, 3);
      }

      return {
        ...user,
        mutualFriendsCount,
        mutualFriends,
      };
    }),
  );

  return usersWithMutualFriends;
}

// Send friend request
export async function sendFriendRequest(friendId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  if (session.user.id === friendId) {
    throw new Error("Cannot add yourself as a friend");
  }

  // Check if relationship already exists
  const existing = await prisma.friendship.findFirst({
    where: {
      OR: [
        { user_id: session.user.id, friend_id: friendId },
        { user_id: friendId, friend_id: session.user.id },
      ],
    },
  });

  if (existing) {
    if (existing.status === FriendshipStatus.Blocked) {
      throw new Error("Cannot send friend request");
    }
    if (existing.status === FriendshipStatus.Pending) {
      // If the existing request is from the other user to us, accept it automatically
      if (
        existing.user_id === friendId &&
        existing.friend_id === session.user.id
      ) {
        // Accept the existing request
        await prisma.friendship.update({
          where: { id: existing.id },
          data: { status: FriendshipStatus.Accepted },
        });

        // Create reverse relationship
        await prisma.friendship.create({
          data: {
            user_id: session.user.id,
            friend_id: friendId,
            status: FriendshipStatus.Accepted,
          },
        });

        revalidatePath("/friend");
        return { success: true, message: "Friend request accepted" };
      }
      // Otherwise, it's our own pending request
      throw new Error("Friend request already sent");
    }
    if (existing.status === FriendshipStatus.Accepted) {
      throw new Error("Already friends");
    }
  }

  await prisma.friendship.create({
    data: {
      user_id: session.user.id,
      friend_id: friendId,
      status: FriendshipStatus.Pending,
    },
  });

  revalidatePath("/friend");
  return { success: true };
}

// Accept friend request
export async function acceptFriendRequest(requestId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  const request = await prisma.friendship.findUnique({
    where: { id: requestId },
  });

  if (!request || request.friend_id !== session.user.id) {
    throw new Error("Request not found or no permission");
  }

  await prisma.friendship.update({
    where: { id: requestId },
    data: { status: FriendshipStatus.Accepted },
  });

  // Create reverse relationship
  await prisma.friendship.create({
    data: {
      user_id: session.user.id,
      friend_id: request.user_id,
      status: FriendshipStatus.Accepted,
    },
  });

  revalidatePath("/friend");
  return { success: true };
}

// Decline friend request
export async function declineFriendRequest(requestId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  const request = await prisma.friendship.findUnique({
    where: { id: requestId },
  });

  if (!request || request.friend_id !== session.user.id) {
    throw new Error("Request not found or no permission");
  }

  await prisma.friendship.delete({
    where: { id: requestId },
  });

  revalidatePath("/friend");
  return { success: true };
}

// Remove friend
export async function removeFriend(friendId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  await prisma.friendship.deleteMany({
    where: {
      OR: [
        { user_id: session.user.id, friend_id: friendId },
        { user_id: friendId, friend_id: session.user.id },
      ],
    },
  });

  revalidatePath("/friend");
  return { success: true };
}

// Block user
export async function blockUser(userId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  // Delete all existing relationships
  await prisma.friendship.deleteMany({
    where: {
      OR: [
        { user_id: session.user.id, friend_id: userId },
        { user_id: userId, friend_id: session.user.id },
      ],
    },
  });

  // Create block record
  await prisma.friendship.create({
    data: {
      user_id: session.user.id,
      friend_id: userId,
      status: FriendshipStatus.Blocked,
    },
  });

  revalidatePath("/friend");
  return { success: true };
}

// Unblock user
export async function unblockUser(userId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  await prisma.friendship.deleteMany({
    where: {
      user_id: session.user.id,
      friend_id: userId,
      status: FriendshipStatus.Blocked,
    },
  });

  revalidatePath("/friend");
  return { success: true };
}

// Get blocked users
export async function getBlockedUsers() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  const blocked = await prisma.friendship.findMany({
    where: {
      user_id: session.user.id,
      status: FriendshipStatus.Blocked,
    },
  });

  const userIds = blocked.map((b) => b.friend_id);
  const users = await prisma.user.findMany({
    where: {
      id: {
        in: userIds,
      },
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
    },
  });

  return users;
}
