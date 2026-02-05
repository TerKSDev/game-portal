"use client";

import { useState } from "react";
import { unblockUser } from "@/lib/actions/friend";
import Image from "next/image";
import { FaBan, FaUnlock } from "react-icons/fa";

interface BlockedUser {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
}

interface BlockedUsersProps {
  blockedUsers: BlockedUser[];
  onUpdate?: () => void | Promise<void>;
}

export default function BlockedUsers({
  blockedUsers,
  onUpdate,
}: BlockedUsersProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [localBlockedUsers, setLocalBlockedUsers] = useState(blockedUsers);

  const handleUnblock = async (userId: string) => {
    if (!confirm("Are you sure you want to unblock this user?")) return;

    setLoading(userId);
    try {
      await unblockUser(userId);
      // Remove from local state immediately
      const updated = localBlockedUsers.filter((u) => u.id !== userId);
      setLocalBlockedUsers(updated);
      await onUpdate?.();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to unblock user");
    } finally {
      setLoading(null);
    }
  };

  if (localBlockedUsers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-60 gap-6">
        <FaBan size={42} className="text-gray-600" />
        <div className="text-center">
          <p className="text-gray-400 text-xl">No blocked users</p>
          <p className="text-gray-500 text-sm mt-1">
            Users you block will appear here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {localBlockedUsers.map((user) => (
        <div
          key={user.id}
          className="group bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-gray-600 transition-all duration-300"
        >
          <div className="flex items-center gap-4">
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name || "User"}
                width={48}
                height={48}
                className="rounded-full ring-2 ring-gray-700 opacity-50 grayscale"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center ring-2 ring-gray-600 opacity-50">
                <span className="text-lg font-bold text-gray-400">
                  {user.name?.[0]?.toUpperCase() || "?"}
                </span>
              </div>
            )}

            <div>
              <h4 className="font-semibold text-gray-500">
                {user.name || "Unnamed"}
              </h4>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>
          </div>

          <button
            onClick={() => handleUnblock(user.id)}
            disabled={loading === user.id}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-400 border border-blue-500/30 rounded-lg hover:bg-blue-500/20 hover:border-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            <FaUnlock size={14} />
            {loading === user.id ? "Unblocking..." : "Unblock"}
          </button>
        </div>
      ))}
    </div>
  );
}
