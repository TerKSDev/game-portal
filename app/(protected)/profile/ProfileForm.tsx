"use client";

import { FaEdit, FaSave } from "react-icons/fa";
import Image from "next/image";
import React, { useState } from "react";
import UpdateProfile from "./updateProfile";
import { useRouter } from "next/navigation";
import { GiCancel } from "react-icons/gi";
import { PATHS } from "@/app/_config/routes";
import {
  handleSignOut,
  handleDeleteAccount,
} from "./_components/buttonOnClick";

interface ProfileProps {
  userData: {
    name?: string | null | undefined;
    image?: string | null | undefined;
    userStatus: string | undefined;
    createdAt: string | undefined;
    email?: string | null | undefined;
  };
}

export default function ProfileForm(userData: ProfileProps) {
  const router = useRouter();

  const [isEditMode, setIsEditMode] = useState(false);

  const [name, setName] = useState(userData?.userData?.name || "");
  const [email, setEmail] = useState(userData?.userData?.email || "");
  const [image, setImage] = useState(userData?.userData?.image || "");

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
    <div className="flex flex-1 flex-col mt-24 p-10 font-mono">
      <div className="flex flex-row flex-wrap gap-5 max-lg:flex-col">
        <div className="flex flex-2 flex-row bg-gray-900 p-5 rounded-md border-2 border-gray-600 h-fit">
          <div className="relative">
            <Image
              src={
                image ||
                "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png?20200919003010"
              }
              alt="Avatar"
              width={150}
              height={150}
              className="bg-gray-300 rounded-lg"
            />
            <p
              className={`absolute top-0 left-0 text-xs w-full h-full flex items-center justify-center bg-black opacity-50 rounded font-bold ${!isEditMode && "hidden"}`}
            >
              Upload Image
            </p>
            <input
              type="file"
              accept="image/*"
              className={`absolute top-0 left-0 w-full h-full text-transparent cursor-pointer ${!isEditMode && "hidden"}`}
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
          <div className="flex flex-row w-full gap-x-8 justify-between ml-5">
            <div className="flex flex-col gap-y-1 justify-between h-full">
              <div className={`flex flex-col ${isEditMode && "gap-y-1"}`}>
                <input
                  className="py-0.5 w-full text-3xl focus:border-white outline-none rounded-md px-2 not-disabled:bg-gray-950 not-disabled:border not-disabled:border-gray-400"
                  type="text"
                  required
                  disabled={!isEditMode}
                  placeholder="Account Name..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                {(userData.userData?.email || isEditMode) && (
                  <input
                    className="py-0.5 w-full text-sm text-gray-300 focus:border-white outline-none rounded-sm px-2 not-disabled:bg-gray-950 not-disabled:border not-disabled:border-gray-400"
                    type="text"
                    disabled={!isEditMode}
                    placeholder="Email..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                )}
              </div>
              <p className="text-sm text-gray-300 px-2">
                Join At: {userData.userData?.createdAt}
              </p>
            </div>
            <div className="flex flex-col justify-between gap-x-2 items-center h-full font-bold">
              <div className="flex flex-row self-end items-center gap-x-2 rounded-full bg-gray-950 px-3 p-1 border">
                {userData.userData?.userStatus === "Online" && (
                  <div className="w-2.5 h-2.5 bg-green-600 border rounded-full"></div>
                )}
                <p className="text-sm">{userData.userData?.userStatus}</p>
              </div>
              <div className="flex flex-row gap-x-4 items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsEditMode(false)}
                  className={`flex-row items-center gap-x-2 font-normal bg-black px-3.5 p-1.5 border rounded-md hover:bg-gray-700 ${isEditMode ? "flex" : "hidden"}`}
                >
                  <GiCancel />
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className={`flex flex-row items-center gap-x-2 font-normal bg-black px-3.5 p-1.5 border rounded-md hover:bg-gray-700 ${isEditMode && "bg-green-800 hover:bg-green-900"}`}
                >
                  {isEditMode ? <FaSave /> : <FaEdit />}
                  {isEditMode ? "Save" : "Edit"}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-8 flex-1">
          <div className="flex bg-gray-900 p-4 rounded-md border-2 border-gray-600">
            <h1 className="">Game Playing</h1>
          </div>

          <div className="flex flex-col w-full max-lg:flex-row gap-4">
            <form action={onLogoutClick} className="flex flex-1">
              <button
                type="submit"
                className="bg-red-700 hover:bg-red-800 text-white w-full p-1.5 rounded-md"
              >
                Logout
              </button>
            </form>

            <form action={onDeleteClick} className="flex flex-1">
              <button
                type="submit"
                className="border hover:bg-red-500 text-white w-full p-1.5 rounded-md"
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
