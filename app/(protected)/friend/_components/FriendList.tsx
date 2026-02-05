"use client";

import { useState } from "react";
import { removeFriend, blockUser } from "@/lib/actions/friend";
import { UserStatus } from "@/app/generated/prisma/enums";
import Image from "next/image";
import { FaUserMinus, FaBan, FaUserFriends } from "react-icons/fa";
import { useRouter } from "next/navigation";

interface Friend {
  id: string;
  uid: string | null;
  name: string | null;
  email: string | null;
  image: string | null;
  userStatus: UserStatus;
}

interface FriendListProps {
  friends: Friend[];
  searchQuery: string;
  onUpdate?: () => void | Promise<void>;
}

export default function FriendList({
  friends,
  searchQuery,
  onUpdate,
}: FriendListProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [localFriends, setLocalFriends] = useState(friends);

  const filteredFriends = localFriends.filter(
    (friend) =>
      friend.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      friend.email?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleRemoveFriend = async (friendId: string) => {
    if (!confirm("Are you sure you want to remove this friend?")) return;

    setLoading(friendId);
    try {
      await removeFriend(friendId);
      // Remove from local state immediately
      const updated = localFriends.filter((f) => f.id !== friendId);
      setLocalFriends(updated);
      await onUpdate?.();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to remove friend");
    } finally {
      setLoading(null);
    }
  };

  const handleBlockUser = async (userId: string) => {
    if (
      !confirm(
        "Are you sure you want to block this user? This will also remove them from your friends list.",
      )
    )
      return;

    setLoading(userId);
    try {
      await blockUser(userId);
      // Remove from local state immediately
      const updated = localFriends.filter((f) => f.id !== userId);
      setLocalFriends(updated);
      await onUpdate?.();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to block user");
    } finally {
      setLoading(null);
    }
  };

  const getStatusColor = (status: UserStatus) => {
    switch (status) {
      case "Online":
        return "bg-green-500 shadow-green-500/50";
      case "Offline":
        return "bg-gray-500";
      case "Do_Not_Disturb":
        return "bg-red-500 shadow-red-500/50";
      case "Invisible":
        return "bg-gray-400";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: UserStatus) => {
    switch (status) {
      case "Online":
        return "Online";
      case "Offline":
        return "Offline";
      case "Do_Not_Disturb":
        return "Do Not Disturb";
      case "Invisible":
        return "Invisible";
      default:
        return "Offline";
    }
  };

  if (filteredFriends.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-60 gap-6">
        <FaUserFriends size={42} className="text-gray-600" />
        <div className="text-center">
          <p className="text-gray-400 text-xl">
            {searchQuery ? "No friends found" : "No friends yet"}
          </p>
          <p className="text-gray-500 text-sm mt-1">
            {searchQuery
              ? "Try a different search term"
              : "Start adding friends to connect!"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {filteredFriends.map((friend) => (
        <div
          key={friend.id}
          className="group bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300"
        >
          <div 
            className={`flex items-center gap-4 ${friend.uid ? 'cursor-pointer' : ''}`}
            onClick={() => friend.uid && router.push(`/profile/${friend.uid}`)}
          >
            <div className="relative">
              {friend.image ? (
                <Image
                  src={friend.image}
                  alt={friend.name || "User"}
                  width={56}
                  height={56}
                  className="rounded-full ring-2 ring-gray-700 group-hover:ring-blue-500/50 transition-all duration-300"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-linear-to-br from-blue-600 to-purple-600 flex items-center justify-center ring-2 ring-gray-700 group-hover:ring-blue-500/50 transition-all duration-300">
                  <span className="text-xl font-bold text-white">
                    {friend.name?.[0]?.toUpperCase() || "?"}
                  </span>
                </div>
              )}
              <div
                className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-gray-800 shadow-lg ${getStatusColor(
                  friend.userStatus,
                )}`}
                title={getStatusText(friend.userStatus)}
              />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-white truncate group-hover:text-blue-400 transition-colors">
                {friend.name || "Unnamed"}
              </h3>
              <p className="text-sm text-gray-500 truncate">{friend.email}</p>
              <p
                className={`text-xs mt-1 ${
                  friend.userStatus === "Online"
                    ? "text-green-400"
                    : "text-gray-500"
                }`}
              >
                {getStatusText(friend.userStatus)}
              </p>
            </div>
          </div>

          <div className="flex gap-2 mt-4 pt-4 border-t border-gray-700/50">
            <button
              onClick={() => handleRemoveFriend(friend.id)}
              disabled={loading === friend.id}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-500/10 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/20 hover:border-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-sm"
            >
              <FaUserMinus size={14} />
              {loading === friend.id ? "..." : "Remove"}
            </button>
            <button
              onClick={() => handleBlockUser(friend.id)}
              disabled={loading === friend.id}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-700/50 text-gray-400 border border-gray-600/50 rounded-lg hover:bg-gray-600/50 hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-sm"
            >
              <FaBan size={14} />
              Block
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
