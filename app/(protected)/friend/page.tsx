"use client";

import { useState, useEffect } from "react";
import FriendList from "./_components/FriendList";
import SearchUsers from "./_components/SearchUsers";
import PendingRequests from "./_components/PendingRequests";
import BlockedUsers from "./_components/BlockedUsers";
import {
  getFriends,
  getPendingRequests,
  getBlockedUsers,
} from "@/lib/actions/friend";
import { FaUserFriends, FaSearch, FaBan, FaUserPlus } from "react-icons/fa";

export default function FriendPage() {
  const [activeTab, setActiveTab] = useState<
    "friends" | "search" | "requests" | "blocked"
  >("friends");
  const [friends, setFriends] = useState<any[]>([]);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [blockedUsers, setBlockedUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [friendsData, requestsData, blockedData] = await Promise.all([
        getFriends(),
        getPendingRequests(),
        getBlockedUsers(),
      ]);
      setFriends(friendsData);
      setPendingRequests(requestsData);
      setBlockedUsers(blockedData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-screen">
        <div className="text-xl text-gray-400 animate-pulse">Loading...</div>
      </div>
    );
  }

  const tabs = [
    {
      id: "friends" as const,
      label: "My Friends",
      count: friends.length,
      icon: FaUserFriends,
    },
    {
      id: "requests" as const,
      label: "Requests",
      count: pendingRequests.length,
      icon: FaUserPlus,
      showBadge: pendingRequests.length > 0,
    },
    {
      id: "search" as const,
      label: "Find Friends",
      icon: FaSearch,
    },
    {
      id: "blocked" as const,
      label: "Blocked",
      count: blockedUsers.length,
      icon: FaBan,
    },
  ];

  return (
    <main className="py-8 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-6xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Friends
          </h1>
          <p className="text-zinc-400 mt-2">
            Manage your friends and connections
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 sm:gap-3 mb-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all duration-300 ${
                  isActive
                    ? "bg-blue-600/20 text-blue-400 border border-blue-500/50 shadow-lg shadow-blue-500/20"
                    : "bg-zinc-800/50 text-zinc-400 border border-zinc-700/50 hover:bg-zinc-700/50 hover:text-zinc-200 hover:border-zinc-600"
                }`}
              >
                <Icon size={16} />
                <span className="hidden sm:inline">{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span
                    className={`px-2 py-0.5 text-xs rounded-full ${
                      isActive
                        ? "bg-blue-500/30 text-blue-300"
                        : "bg-zinc-700 text-zinc-400"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
                {tab.showBadge && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                )}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="animate-fade-in">
          {activeTab === "friends" && (
            <div className="space-y-4">
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search my friends..."
                  className="w-full pl-11 pr-4 py-3 bg-zinc-800/50 border border-zinc-700/50 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white placeholder-zinc-500 transition-all duration-300 outline-none"
                />
              </div>
              <FriendList
                friends={friends}
                searchQuery={searchQuery}
                onUpdate={loadData}
              />
            </div>
          )}

          {activeTab === "search" && <SearchUsers onUpdate={loadData} />}

          {activeTab === "requests" && (
            <PendingRequests requests={pendingRequests} onUpdate={loadData} />
          )}

          {activeTab === "blocked" && (
            <BlockedUsers blockedUsers={blockedUsers} onUpdate={loadData} />
          )}
        </div>
      </div>
    </main>
  );
}
