"use client";

import { FaEdit, FaSave } from "react-icons/fa";
import Image from "next/image";
import React, { useState } from "react";
import UpdateProfile from "./updateProfile";
import { useRouter } from "next/navigation";
import { GiCancel } from "react-icons/gi";
import { PATHS } from "@/app/_config/routes";
import AvatarPlaceholder from "@/app/components/AvatarPlaceholder";
import {
  handleSignOut,
  handleDeleteAccount,
} from "./_components/buttonOnClick";
import { GoTriangleDown, GoTriangleUp } from "react-icons/go";
import { FaGhost } from "react-icons/fa";
import { IoIosWarning } from "react-icons/io";
import { handleChangeStatus } from "./_components/buttonOnClick";
import Link from "next/link";

// Helper function to format date consistently on client
function formatDate(dateString: string | undefined): string {
  if (!dateString) return "Unknown";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

interface ProfileProps {
  userData: {
    name?: string | null | undefined;
    image?: string | null | undefined;
    userStatus: string | undefined;
    createdAt: string | undefined;
    email?: string | null | undefined;
    orbs?: number | undefined;
    uid?: string | null | undefined;
  };
  libraryData: {
    id: string;
    name: string;
    image: string;
    gameId: number;
    purchasedAt: Date;
  }[];
  friendsData: {
    id: string;
    uid: string | null;
    name: string | null;
    image: string | null;
    userStatus: string;
  }[];
  totalFriends: number;
}

export default function ProfileForm({
  userData,
  libraryData,
  friendsData,
  totalFriends,
}: ProfileProps) {
  const router = useRouter();

  const [isEditMode, setIsEditMode] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(
    userData?.userStatus || "Online",
  );
  const [editStatusOpen, setEditStatusOpen] = useState(false);

  const [name, setName] = useState(userData?.name || "");
  const [email, setEmail] = useState(userData?.email || "");
  const [image, setImage] = useState(userData?.image || "");

  const [fileToUpload, setFileToUpload] = useState<File | null>(null);

  const handleSave = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (isEditMode) {
      try {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);

        if (fileToUpload) {
          formData.append("image", fileToUpload);
        }

        const res = await UpdateProfile(formData);
        await new Promise((resolve) => setTimeout(resolve, 500));

        if (res.success) {
          alert("Profile Updated Successfully !");
        }
      } catch (error) {
        console.log(error);
        alert("Something Went Wrong !");
      } finally {
        router.refresh();
        setIsEditMode(false);
      }
    } else {
      setIsEditMode(true);
    }
  };

  const onLogoutClick = async () => {
    try {
      await handleSignOut();
      window.location.href = PATHS.STORE;
    } catch (error) {
      console.log(error);
    }
  };

  const onDeleteClick = async () => {
    const confirmDelete = confirm(
      "Are you sure you want to delete your account? This action cannot be undone.",
    );
    if (!confirmDelete) return;
    try {
      await handleDeleteAccount();
      window.location.href = PATHS.STORE;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-1 flex-col w-full max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl sm:text-5xl font-black text-zinc-200">
          My Profile
        </h1>
        <p className="text-zinc-500 mt-2 text-sm sm:text-base">
          Manage your account and settings
        </p>
      </div>
      <div className="flex flex-row flex-wrap gap-6 max-lg:flex-col">
        <div className="flex flex-2 flex-col gap-6">
          <div className="flex flex-col sm:flex-row bg-zinc-900/50 backdrop-blur-md border border-zinc-800/80 p-6 rounded-2xl shadow-2xl h-fit gap-6 relative overflow-visible">
            <div className="relative group mx-auto sm:mx-0">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl overflow-hidden border-2 border-zinc-700/50 shadow-lg">
                {image ? (
                  <Image
                    src={image}
                    alt="Avatar"
                    width={160}
                    height={160}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <AvatarPlaceholder name={name} size={160} />
                )}
              </div>
              <div
                className={`absolute inset-0 flex items-center justify-center bg-black/70 rounded-2xl transition-opacity ${
                  isEditMode ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
              >
                <p className="text-sm font-medium text-white">Upload Image</p>
              </div>
              <input
                type="file"
                accept="image/*"
                className={`absolute inset-0 w-full h-full opacity-0 cursor-pointer ${
                  !isEditMode && "pointer-events-none"
                }`}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const previewUrl = URL.createObjectURL(file);
                    setImage(previewUrl);
                    setFileToUpload(file);
                  }
                }}
              />
            </div>
            <div className="flex flex-col sm:flex-row w-full gap-4 sm:gap-x-6 justify-between">
              <div className="flex flex-col gap-y-4 justify-between h-full flex-1">
                <div className={`flex flex-col ${isEditMode && "gap-y-2"}`}>
                  <input
                    className={`w-full text-xl sm:text-2xl font-bold outline-none rounded-xl px-3 transition-all text-zinc-200 ${
                      isEditMode
                        ? "bg-zinc-800/50 border border-zinc-700 focus:border-zinc-600 focus:bg-zinc-800 py-2"
                        : "bg-transparent border-transparent py-1 pb-0"
                    }`}
                    type="text"
                    required
                    disabled={!isEditMode}
                    placeholder="Account Name..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  {(userData?.email || isEditMode) && (
                    <input
                      className={`w-full text-sm text-zinc-400 outline-none rounded-xl px-3 transition-all ${
                        isEditMode
                          ? "bg-zinc-800/50 border border-zinc-700 focus:border-zinc-600 focus:bg-zinc-800 py-2"
                          : "bg-transparent border-transparent py-1"
                      }`}
                      type="text"
                      disabled={!isEditMode}
                      placeholder="Email..."
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  )}
                </div>
                <div className="flex flex-col gap-1 px-3">
                  <p className="text-sm text-zinc-400">
                    Joined: {formatDate(userData?.createdAt)}
                  </p>
                  {userData?.uid && (
                    <p className="text-sm text-zinc-400">
                      UID:{" "}
                      <span className="text-zinc-300 font-mono">
                        {userData.uid}
                      </span>
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-col sm:justify-between gap-4 items-start sm:items-end h-full w-full sm:w-auto">
                <div className="relative w-full sm:w-auto z-9999">
                  <button
                    className="flex flex-row items-center gap-x-2 rounded-full bg-zinc-800/50 border border-zinc-700/50 px-4 py-2 w-full sm:w-auto justify-between sm:justify-start"
                    onClick={() => setEditStatusOpen(!editStatusOpen)}
                  >
                    <div className="flex flex-row items-center pl-0">
                      <div
                        className={`w-2.5 h-2.5 rounded-full animate-pulse
                      ${currentStatus === "Online" ? "bg-green-400 flex" : "hidden"}`}
                      ></div>

                      {currentStatus === "Do_Not_Disturb" && (
                        <IoIosWarning
                          color="#FF5555"
                          size={14}
                          className="animate-pulse"
                        />
                      )}

                      {currentStatus === "Invisible" && (
                        <FaGhost
                          color="#CCCCCC"
                          size={14}
                          className="animate-pulse"
                        />
                      )}
                    </div>

                    <p className="text-sm font-medium">
                      {currentStatus.replaceAll("_", " ")}
                    </p>

                    {!editStatusOpen ? <GoTriangleDown /> : <GoTriangleUp />}
                  </button>

                  {editStatusOpen && (
                    <div className="mt-2 bg-zinc-800/95 backdrop-blur-md border border-zinc-700 rounded-xl shadow-2xl w-full sm:w-40 absolute z-9999">
                      {["Online", "Do_Not_Disturb", "Invisible"].map(
                        (status) => (
                          <button
                            key={status}
                            onClick={async () => {
                              setCurrentStatus(status);
                              setEditStatusOpen(false);
                              await handleChangeStatus(status);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-zinc-700 first:rounded-t-xl last:rounded-b-xl transition-colors flex items-center gap-x-2 text-white z-9999"
                          >
                            {status.replaceAll("_", " ")}
                          </button>
                        ),
                      )}
                    </div>
                  )}
                </div>

                <div className="flex flex-row gap-3 items-center w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setIsEditMode(false)}
                    className={`flex flex-row items-center justify-center gap-x-2 bg-zinc-700 hover:bg-zinc-600 border border-zinc-600 px-4 py-2 rounded-xl transition-all flex-1 sm:flex-initial ${
                      isEditMode ? "flex" : "hidden"
                    }`}
                  >
                    <GiCancel />
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    className={`flex flex-row items-center justify-center gap-x-2 px-4 py-2 rounded-xl font-bold transition-all duration-300 flex-1 sm:flex-initial ${
                      isEditMode
                        ? "bg-zinc-700 hover:bg-zinc-600 border border-zinc-600"
                        : "bg-zinc-800 hover:bg-zinc-700 border border-zinc-700/80"
                    }`}
                  >
                    {isEditMode ? <FaSave /> : <FaEdit />}
                    {isEditMode ? "Save" : "Edit"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Friends Section */}
          <div className="flex flex-col bg-zinc-900/50 backdrop-blur-md border border-zinc-800/80 p-6 rounded-2xl shadow-2xl gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-zinc-200">
                Friends {totalFriends > 0 && `(${totalFriends})`}
              </h2>
              {totalFriends > 0 && (
                <Link
                  href={PATHS.FRIEND}
                  className="text-sm text-zinc-400 hover:text-zinc-300 transition-colors font-medium"
                >
                  View All →
                </Link>
              )}
            </div>
            {friendsData.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {friendsData.map((friend) => (
                  <div
                    key={friend.id}
                    onClick={() =>
                      friend.uid && router.push(`/profile/${friend.uid}`)
                    }
                    className={`flex flex-col items-center gap-2 bg-zinc-800/50 rounded-xl p-3 border border-zinc-700/50 transition-all duration-300 ${
                      friend.uid
                        ? "hover:border-zinc-600 hover:bg-zinc-700/50 cursor-pointer"
                        : "opacity-70"
                    }`}
                  >
                    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-zinc-700">
                      {friend.image ? (
                        <Image
                          src={friend.image}
                          alt={friend.name || "Friend"}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-zinc-700 flex items-center justify-center">
                          <span className="text-white font-bold text-lg">
                            {friend.name?.[0]?.toUpperCase() || "?"}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-center gap-1 min-w-0 w-full">
                      <p className="text-xs font-medium text-zinc-200 truncate w-full text-center">
                        {friend.name || "Unknown"}
                      </p>
                      <div className="flex items-center gap-1">
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${
                            friend.userStatus === "Online"
                              ? "bg-green-400 animate-pulse"
                              : friend.userStatus === "Do_Not_Disturb"
                                ? "bg-red-400"
                                : "bg-zinc-500"
                          }`}
                        />
                        <span className="text-[10px] text-zinc-400">
                          {friend.userStatus === "Do_Not_Disturb"
                            ? "DND"
                            : friend.userStatus}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 gap-2">
                <p className="text-zinc-400 text-sm">No friends yet</p>
                <Link
                  href={PATHS.FRIEND}
                  className="text-zinc-300 hover:text-zinc-200 text-sm transition-colors font-medium"
                >
                  Find Friends →
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-6 flex-1">
          <div className="flex flex-col bg-zinc-900/50 backdrop-blur-md border border-zinc-800/80 rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-linear-to-r from-yellow-600/20 to-orange-600/20 border-b border-zinc-800 p-6">
              <h2 className="text-lg font-bold bg-linear-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                My Orbs
              </h2>
            </div>
            <div className="flex flex-col items-center justify-center p-6 gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-linear-to-r from-yellow-400 to-orange-400 shadow-lg shadow-yellow-500/50 animate-pulse"></div>
                <p className="text-3xl sm:text-4xl font-bold bg-linear-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                  {userData.orbs?.toLocaleString() || 0}
                </p>
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-linear-to-r from-yellow-400 to-orange-400 shadow-lg shadow-yellow-500/50 animate-pulse"></div>
              </div>
              <div className="flex flex-row gap-3 w-full">
                <button
                  onClick={() => router.push(PATHS.HISTORY)}
                  className="flex-1 flex items-center justify-center gap-2 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-4 py-2.5 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-blue-500/50"
                >
                  <span className="text-sm">History</span>
                </button>
                <button
                  onClick={() => router.push(PATHS.TOP_UP)}
                  className="flex-1 flex items-center justify-center gap-2 bg-linear-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white px-4 py-2.5 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-yellow-500/50"
                >
                  <span className="text-sm">Top Up</span>
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col bg-zinc-900/50 backdrop-blur-md border border-zinc-800/80 p-6 rounded-2xl shadow-2xl gap-4">
            <h2 className="text-lg font-bold text-zinc-200">
              Recently Purchased
            </h2>
            {libraryData.length > 0 ? (
              <div className="flex flex-col gap-3">
                {libraryData.slice(0, 3).map((item) => (
                  <Link
                    href={`${PATHS.DETAILS}/${item.gameId}`}
                    key={item.id}
                    className="flex flex-row items-center gap-3 bg-zinc-800/50 rounded-xl p-3 border border-zinc-700/50 hover:border-zinc-600/50 transition-all group"
                  >
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-zinc-700 border border-zinc-600">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex flex-col flex-1 min-w-0 gap-1.5">
                      <p className="text-sm font-medium text-zinc-200 truncate group-hover:text-zinc-100 transition-colors">
                        {item.name}
                      </p>
                      <p className="text-[10px] text-zinc-400">
                        Purchased on:{" "}
                        {formatDate(item.purchasedAt.toISOString())}
                      </p>
                    </div>
                  </Link>
                ))}
                {libraryData.length > 3 && (
                  <p className="text-xs text-zinc-400 text-center mt-2">
                    +{libraryData.length - 3} more items
                  </p>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center py-8">
                <p className="text-zinc-400 text-sm">No purchases yet</p>
              </div>
            )}
          </div>

          <div className="flex flex-col w-full max-lg:flex-row gap-4">
            <form action={onLogoutClick} className="flex flex-1">
              <button
                type="submit"
                className="bg-linear-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white w-full py-3 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-red-500/50"
              >
                Logout
              </button>
            </form>

            <form action={onDeleteClick} className="flex flex-1">
              <button
                type="submit"
                className="border-2 border-red-500/50 hover:bg-red-600 hover:border-red-600 text-white w-full py-3 rounded-xl font-bold transition-all duration-300"
              >
                Delete Account
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
