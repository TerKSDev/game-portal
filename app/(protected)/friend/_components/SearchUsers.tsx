"use client";

import { useState, useEffect } from "react";
import {
  searchUsers,
  sendFriendRequest,
  getSuggestedFriends,
} from "@/lib/actions/friend";
import Image from "next/image";
import { FaSearch, FaUserPlus, FaUserFriends } from "react-icons/fa";

interface User {
  id: string;
  uid: string | null;
  name: string | null;
  email: string | null;
  image: string | null;
  mutualFriendsCount?: number;
  mutualFriends?: MutualFriend[];
}

interface MutualFriend {
  id: string;
  uid: string | null;
  name: string | null;
  image: string | null;
}

interface SearchUsersProps {
  onUpdate?: () => void | Promise<void>;
}

export default function SearchUsers({ onUpdate }: SearchUsersProps = {}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<User[]>([]);
  const [suggestions, setSuggestions] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(true);
  const [sending, setSending] = useState<string | null>(null);

  useEffect(() => {
    loadSuggestions();
  }, []);

  const loadSuggestions = async () => {
    setLoadingSuggestions(true);
    try {
      const users = await getSuggestedFriends();
      setSuggestions(users);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const handleSearch = async (searchQuery: string) => {
    setQuery(searchQuery);

    if (searchQuery.trim().length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const users = await searchUsers(searchQuery);
      setResults(users);
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Search failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSendRequest = async (userId: string) => {
    setSending(userId);
    try {
      const result = await sendFriendRequest(userId);
      if (result.message === "Friend request accepted") {
        alert("You both sent friend requests! Now you are friends!");
      } else {
        alert("Friend request sent!");
      }
      setResults(results.filter((user) => user.id !== userId));
      setSuggestions(suggestions.filter((user) => user.id !== userId));
      await onUpdate?.();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to send request");
    } finally {
      setSending(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="relative">
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search by username or UID..."
          className="w-full pl-11 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white placeholder-gray-500 transition-all duration-300 outline-none"
        />
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-400 animate-pulse">Searching...</div>
        </div>
      )}

      {!loading && query.trim().length >= 2 && results.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <FaSearch size={32} className="text-gray-600" />
          <p className="text-gray-500">No users found matching "{query}"</p>
        </div>
      )}

      {!loading && query.trim().length < 2 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-300 mb-4">
            Suggested Friends
          </h3>
          {loadingSuggestions ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-gray-400 animate-pulse">
                Loading suggestions...
              </div>
            </div>
          ) : suggestions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {suggestions.map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  sending={sending}
                  onSendRequest={handleSendRequest}
                  showUid={false}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <FaUserPlus size={32} className="text-gray-600" />
              <p className="text-gray-500">No suggestions available</p>
            </div>
          )}
        </div>
      )}

      {results.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-300 mb-4">
            Search Results
          </h3>
          <div className="space-y-3">
            {results.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                sending={sending}
                onSendRequest={handleSendRequest}
                showFullButton
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function UserCard({
  user,
  sending,
  onSendRequest,
  showFullButton = false,
  showUid = true,
  showMutual = true,
}: {
  user: User;
  sending: string | null;
  onSendRequest: (userId: string) => void;
  showFullButton?: boolean;
  showUid?: boolean;
  showMutual?: boolean;
}) {
  const hasMutualFriends =
    user.mutualFriendsCount && user.mutualFriendsCount > 0;
  const mutualFriends = user.mutualFriends || [];

  return (
    <div className="group bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 flex-1 min-w-0">
          {user.image ? (
            <Image
              src={user.image}
              alt={user.name || "User"}
              width={48}
              height={48}
              className="rounded-full ring-2 ring-gray-700 group-hover:ring-blue-500/50 transition-all duration-300 flex-shrink-0"
            />
          ) : (
            <div className="w-12 h-12 flex-shrink-0 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center ring-2 ring-gray-700 group-hover:ring-blue-500/50 transition-all duration-300">
              <span className="text-lg font-bold text-white">
                {user.name?.[0]?.toUpperCase() || "?"}
              </span>
            </div>
          )}

          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-white group-hover:text-blue-400 transition-colors truncate">
              {user.name || "Unnamed"}
            </h4>
            {showUid && user.uid && (
              <p className="text-xs text-gray-400 font-mono mt-0.5">
                UID: {user.uid}
              </p>
            )}

            {showMutual && hasMutualFriends && mutualFriends.length > 0 && (
              <div className="mt-2 flex items-center gap-1.5">
                <FaUserFriends
                  size={12}
                  className="text-blue-400 flex-shrink-0"
                />
                <p className="text-xs text-gray-400">
                  {mutualFriends[0]?.name || "Someone"}
                  {user.mutualFriendsCount && user.mutualFriendsCount > 1 && (
                    <span>
                      {" "}
                      and {user.mutualFriendsCount - 1} other
                      {user.mutualFriendsCount - 1 === 1 ? "" : "s"}
                    </span>
                  )}
                </p>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={() => onSendRequest(user.id)}
          disabled={sending === user.id}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-blue-500/30 flex-shrink-0"
        >
          <FaUserPlus size={14} />
          <span className={showFullButton ? "" : "hidden sm:inline"}>
            {sending === user.id
              ? showFullButton
                ? "Sending..."
                : "..."
              : showFullButton
                ? "Add Friend"
                : "Add"}
          </span>
        </button>
      </div>
    </div>
  );
}
