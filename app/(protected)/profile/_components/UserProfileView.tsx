"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PATHS } from "@/app/_config/routes";
import AvatarPlaceholder from "@/app/components/AvatarPlaceholder";
import { GoTriangleDown } from "react-icons/go";
import { FaGhost, FaUserFriends } from "react-icons/fa";
import { IoIosWarning } from "react-icons/io";

// Helper function to format date consistently on client
function formatDate(dateString: string | Date): string {
  const date =
    typeof dateString === "string" ? new Date(dateString) : dateString;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

interface UserProfileViewProps {
  userData: {
    id: string;
    uid: string | null;
    name: string | null;
    image: string | null;
    userStatus: string;
    createdAt: string;
  };
  libraryData: {
    id: string;
    name: string;
    image: string;
    gameId: number;
    purchasedAt: Date;
  }[];
  mutualFriends: {
    id: string;
    uid: string | null;
    name: string | null;
    image: string | null;
    userStatus: string;
  }[];
  isFriend: boolean;
  currentUserId: string;
}

export default function UserProfileView({
  userData,
  libraryData,
  mutualFriends,
  isFriend,
}: UserProfileViewProps) {
  const router = useRouter();

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "Online":
        return (
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse"></div>
            <span>Online</span>
          </div>
        );
      case "Do_Not_Disturb":
        return (
          <div className="flex items-center gap-2">
            <IoIosWarning color="#FF5555" size={14} className="animate-pulse" />
            <span>Do Not Disturb</span>
          </div>
        );
      case "Invisible":
        return (
          <div className="flex items-center gap-2">
            <FaGhost color="#CCCCCC" size={14} className="animate-pulse" />
            <span>Invisible</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-gray-500"></div>
            <span>Offline</span>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-1 flex-col w-full max-w-6xl mx-auto pt-20 sm:pt-24 lg:pt-32 px-3 sm:px-4 lg:px-8 pb-8 sm:pb-12">
      <div className="flex items-center gap-3 mb-4 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          User Profile
        </h1>
      </div>

      <div className="flex flex-row flex-wrap gap-4 sm:gap-6 max-lg:flex-col">
        <div className="flex flex-2 flex-col gap-6">
          {/* User Profile Card */}
          <div className="flex flex-col sm:flex-row bg-gray-900/80 backdrop-blur-md border border-gray-700/50 p-4 sm:p-6 rounded-xl shadow-2xl h-fit gap-4 sm:gap-6">
            <div className="relative mx-auto sm:mx-0">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-xl overflow-hidden border-2 border-gray-700/50 shadow-lg">
                {userData.image ? (
                  <Image
                    src={userData.image}
                    alt="Avatar"
                    width={160}
                    height={160}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <AvatarPlaceholder
                    name={userData.name || "User"}
                    size={160}
                  />
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row w-full gap-4 sm:gap-x-6 justify-between">
              <div className="flex flex-col gap-y-4 justify-between h-full flex-1">
                <div className="flex flex-col">
                  <h2 className="w-full text-xl sm:text-2xl font-bold px-3 pb-0">
                    {userData.name || "Unknown User"}
                  </h2>
                </div>

                <div className="flex flex-col gap-1 px-3">
                  <p className="text-sm text-gray-400">
                    Joined: {formatDate(userData.createdAt)}
                  </p>
                  {userData.uid && (
                    <p className="text-sm text-gray-400">
                      UID:{" "}
                      <span className="text-blue-400 font-mono">
                        {userData.uid}
                      </span>
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:justify-between gap-4 items-start sm:items-end h-full w-full sm:w-auto">
                <div className="w-full sm:w-auto">
                  <div className="flex flex-row items-center gap-x-2 rounded-full bg-gray-800/50 border border-gray-700/50 px-4 py-2 w-full sm:w-auto justify-between sm:justify-start">
                    {getStatusDisplay(userData.userStatus)}
                  </div>
                </div>

                {!isFriend && (
                  <div className="text-sm text-gray-400 italic px-4 py-2">
                    Not in your friends list
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mutual Friends Section */}
          {mutualFriends.length > 0 && (
            <div className="flex flex-col bg-gray-900/80 backdrop-blur-md border border-gray-700/50 p-4 sm:p-5 rounded-xl shadow-2xl gap-3 sm:gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-blue-400">
                  Mutual Friends ({mutualFriends.length})
                </h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {mutualFriends.map((friend) => (
                  <div
                    key={friend.id}
                    onClick={() =>
                      friend.uid && router.push(`/profile/${friend.uid}`)
                    }
                    className={`flex flex-col items-center gap-2 bg-gray-800/50 rounded-lg p-3 border border-gray-700/50 transition-all duration-300 ${
                      friend.uid
                        ? "hover:border-blue-500/50 hover:bg-gray-700/50 cursor-pointer"
                        : "opacity-70"
                    }`}
                  >
                    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-700">
                      {friend.image ? (
                        <Image
                          src={friend.image}
                          alt={friend.name || "Friend"}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-linear-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                          <span className="text-white font-bold text-lg">
                            {friend.name?.[0]?.toUpperCase() || "?"}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-center gap-1 min-w-0 w-full">
                      <p className="text-xs font-medium text-gray-200 truncate w-full text-center">
                        {friend.name || "Unknown"}
                      </p>
                      <div className="flex items-center gap-1">
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${
                            friend.userStatus === "Online"
                              ? "bg-green-400 animate-pulse"
                              : friend.userStatus === "Do_Not_Disturb"
                                ? "bg-red-400"
                                : "bg-gray-500"
                          }`}
                        />
                        <span className="text-[10px] text-gray-400">
                          {friend.userStatus === "Do_Not_Disturb"
                            ? "DND"
                            : friend.userStatus}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-6 flex-1">
          {/* Game Library Section */}
          <div className="flex flex-col bg-gray-900/80 backdrop-blur-md border border-gray-700/50 p-4 sm:p-5 rounded-xl shadow-2xl gap-3 sm:gap-4">
            <h2 className="text-lg font-semibold text-blue-400">
              Recently Purchased
            </h2>
            {libraryData.length > 0 ? (
              <div className="flex flex-col gap-3">
                {libraryData.slice(0, 3).map((item) => (
                  <Link
                    href={`${PATHS.DETAILS}/${item.gameId}`}
                    key={item.id}
                    className="flex flex-row items-center gap-3 bg-gray-800/50 rounded-lg p-3 border border-gray-700/50 hover:border-gray-600/50 transition-colors"
                  >
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-gray-700">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-col flex-1 min-w-0 gap-1.5">
                      <p className="text-sm font-medium text-gray-200 truncate">
                        {item.name}
                      </p>
                      <p className="text-[10px] text-gray-400">
                        Purchased on: {formatDate(item.purchasedAt)}
                      </p>
                    </div>
                  </Link>
                ))}
                {libraryData.length > 3 && (
                  <p className="text-xs text-gray-400 text-center mt-2">
                    +{libraryData.length - 3} more items
                  </p>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center py-8">
                <p className="text-gray-400 text-sm">No purchases yet</p>
              </div>
            )}
          </div>

          {/* Back to Friends Button */}
          <button
            onClick={() => router.push(PATHS.FRIEND)}
            className="flex items-center justify-center gap-2 bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-4 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-blue-500/50"
          >
            <FaUserFriends />
            Back to Friends
          </button>
        </div>
      </div>
    </div>
  );
}
