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

interface ProfileProps {
  userData: {
    name?: string | null | undefined;
    image?: string | null | undefined;
    userStatus: string | undefined;
    createdAt: string | undefined;
    email?: string | null | undefined;
    orbs?: number | undefined;
  };
  libraryData: {
    id: string;
    name: string;
    image: string;
    gameId: number;
    purchasedAt: Date;
  }[];
}

export default function ProfileForm({ userData, libraryData }: ProfileProps) {
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
    <div className="flex flex-1 flex-col w-full max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
        My Profile
      </h1>
      <div className="flex flex-row flex-wrap gap-6 max-lg:flex-col">
        <div className="flex flex-2 flex-row bg-gray-900/80 backdrop-blur-md border border-gray-700/50 p-6 rounded-xl shadow-2xl h-fit gap-6">
          <div className="relative group">
            <div className="w-40 h-40 rounded-xl overflow-hidden border-2 border-gray-700/50 shadow-lg">
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
              className={`absolute inset-0 flex items-center justify-center bg-black/70 rounded-xl transition-opacity ${
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
          <div className="flex flex-row w-full gap-x-6 justify-between">
            <div className="flex flex-col gap-y-4 justify-between h-full flex-1">
              <div className={`flex flex-col ${isEditMode && "gap-y-2"}`}>
                <input
                  className={`w-full text-2xl font-bold outline-none rounded-lg px-3 transition-all ${
                    isEditMode
                      ? "bg-gray-800/50 border border-gray-700 focus:border-blue-500 focus:bg-gray-800 py-2"
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
                    className={`w-full text-sm text-gray-400 outline-none rounded-lg px-3 transition-all ${
                      isEditMode
                        ? "bg-gray-800/50 border border-gray-700 focus:border-blue-500 focus:bg-gray-800 py-2"
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
              <p className="text-sm text-gray-400 px-3">
                Joined: {userData?.createdAt}
              </p>
            </div>
            <div className="flex flex-col justify-between gap-4 items-end h-full">
              <div className="relative">
                <button
                  className="flex flex-row items-center gap-x-2 rounded-full bg-gray-800/50 border border-gray-700/50 px-4 py-2"
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
                  <div className="mt-2 bg-gray-800/95 border border-gray-700 rounded-lg shadow-lg w-40 absolute z-10">
                    {["Online", "Do_Not_Disturb", "Invisible"].map((status) => (
                      <button
                        key={status}
                        onClick={async () => {
                          setCurrentStatus(status);
                          setEditStatusOpen(false);
                          await handleChangeStatus(status);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-700 rounded-t-lg last:rounded-b-lg transition-colors flex items-center gap-x-2 text-white"
                      >
                        {status.replaceAll("_", " ")}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-row gap-3 items-center">
                <button
                  type="button"
                  onClick={() => setIsEditMode(false)}
                  className={`flex flex-row items-center gap-x-2 bg-gray-700 hover:bg-gray-600 border border-gray-600 px-4 py-2 rounded-lg transition-all ${
                    isEditMode ? "flex" : "hidden"
                  }`}
                >
                  <GiCancel />
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className={`flex flex-row items-center gap-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    isEditMode
                      ? "bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 shadow-lg hover:shadow-green-500/50"
                      : "bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 shadow-lg hover:shadow-blue-500/50"
                  }`}
                >
                  {isEditMode ? <FaSave /> : <FaEdit />}
                  {isEditMode ? "Save" : "Edit"}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6 flex-1">
          <div className="flex flex-col bg-gray-900/80 backdrop-blur-md border border-gray-700/50 rounded-xl shadow-2xl overflow-hidden">
            <div className="bg-linear-to-r from-yellow-600/20 to-orange-600/20 border-b border-gray-700/50 p-5">
              <h2 className="text-lg font-semibold bg-linear-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                My Orbs
              </h2>
            </div>
            <div className="flex flex-col items-center justify-center p-6 gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-linear-to-r from-yellow-400 to-orange-400 shadow-lg shadow-yellow-500/50 animate-pulse"></div>
                <p className="text-4xl font-bold bg-linear-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                  {userData.orbs?.toLocaleString() || 0}
                </p>
                <div className="w-3 h-3 rounded-full bg-linear-to-r from-yellow-400 to-orange-400 shadow-lg shadow-yellow-500/50 animate-pulse"></div>
              </div>
              <div className="flex flex-row gap-3 w-full">
                <button className="flex-1 flex items-center justify-center gap-2 bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-4 py-2.5 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-blue-500/50">
                  <span className="text-sm">History</span>
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 bg-linear-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white px-4 py-2.5 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-yellow-500/50">
                  <span className="text-sm">Top Up</span>
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col bg-gray-900/80 backdrop-blur-md border border-gray-700/50 p-5 rounded-xl shadow-2xl gap-4">
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
                        Purchased on:{" "}
                        {new Date(item.purchasedAt).toLocaleDateString()}
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
                <p className="text-gray-400 text-sm">No items in cart</p>
              </div>
            )}
          </div>

          <div className="flex flex-col w-full max-lg:flex-row gap-4">
            <form action={onLogoutClick} className="flex flex-1">
              <button
                type="submit"
                className="bg-linear-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white w-full py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-red-500/50"
              >
                Logout
              </button>
            </form>

            <form action={onDeleteClick} className="flex flex-1">
              <button
                type="submit"
                className="border-2 border-red-500/50 hover:bg-red-600 hover:border-red-600 text-white w-full py-3 rounded-lg font-semibold transition-all duration-300"
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
