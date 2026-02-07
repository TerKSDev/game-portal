"use client";

import { useState } from "react";
import {
  acceptFriendRequest,
  declineFriendRequest,
  blockUser,
} from "@/lib/actions/friend";
import Image from "next/image";
import { FaCheck, FaTimes, FaUserPlus, FaBan } from "react-icons/fa";

interface PendingRequest {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  requestId?: string;
}

interface PendingRequestsProps {
  requests: PendingRequest[];
  onUpdate?: () => void | Promise<void>;
}

export default function PendingRequests({
  requests,
  onUpdate,
}: PendingRequestsProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [localRequests, setLocalRequests] = useState(requests);

  const handleAccept = async (requestId: string) => {
    setLoading(requestId);
    try {
      await acceptFriendRequest(requestId);
      // Remove from local state immediately
      const updated = localRequests.filter((r) => r.requestId !== requestId);
      setLocalRequests(updated);
      await onUpdate?.();
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "Failed to accept request",
      );
    } finally {
      setLoading(null);
    }
  };

  const handleDecline = async (requestId: string) => {
    setLoading(requestId);
    try {
      await declineFriendRequest(requestId);
      // Remove from local state immediately
      const updated = localRequests.filter((r) => r.requestId !== requestId);
      setLocalRequests(updated);
      await onUpdate?.();
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "Failed to decline request",
      );
    } finally {
      setLoading(null);
    }
  };

  const handleBlock = async (userId: string, requestId: string) => {
    if (!confirm("Are you sure you want to block this user?")) return;

    setLoading(requestId);
    try {
      await blockUser(userId);
      // Remove from local state immediately
      const updated = localRequests.filter((r) => r.requestId !== requestId);
      setLocalRequests(updated);
      await onUpdate?.();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to block user");
    } finally {
      setLoading(null);
    }
  };

  if (localRequests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-60 gap-6">
        <FaUserPlus size={48} className="text-zinc-500" />
        <div className="text-center">
          <p className="text-zinc-300 text-xl font-semibold">
            No pending requests
          </p>
          <p className="text-zinc-500 text-sm mt-1">
            Friend requests will appear here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {localRequests.map((request) => (
        <div
          key={request.id}
          className="group bg-zinc-900/50 backdrop-blur-md border border-zinc-800/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-green-500/50 hover:shadow-lg hover:shadow-green-500/10 transition-all duration-300"
        >
          <div className="flex items-center gap-4">
            {request.image ? (
              <Image
                src={request.image}
                alt={request.name || "User"}
                width={48}
                height={48}
                className="rounded-full ring-2 ring-zinc-700 group-hover:ring-green-500/50 transition-all duration-300"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-600 to-blue-600 flex items-center justify-center ring-2 ring-zinc-700 group-hover:ring-green-500/50 transition-all duration-300">
                <span className="text-lg font-bold text-white">
                  {request.name?.[0]?.toUpperCase() || "?"}
                </span>
              </div>
            )}

            <div>
              <h4 className="font-semibold text-zinc-200 group-hover:text-green-400 transition-colors">
                {request.name || "Unnamed"}
              </h4>
              <p className="text-sm text-zinc-500">{request.email}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() =>
                request.requestId && handleAccept(request.requestId)
              }
              disabled={loading === request.requestId}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-green-500/30 font-bold"
            >
              <FaCheck size={14} />
              {loading === request.requestId ? "..." : "Accept"}
            </button>
            <button
              onClick={() =>
                request.requestId && handleDecline(request.requestId)
              }
              disabled={loading === request.requestId}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/30 rounded-xl hover:bg-red-500/20 hover:border-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-bold shadow-lg"
            >
              <FaTimes size={14} />
              Decline
            </button>
            <button
              onClick={() =>
                request.requestId && handleBlock(request.id, request.requestId)
              }
              disabled={loading === request.requestId}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-zinc-700/50 text-zinc-400 border border-zinc-600/50 rounded-xl hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-bold shadow-lg"
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
