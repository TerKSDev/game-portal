"use client";
import Lottie from "lottie-react";
import loadingAnimation from "@/public/loading.json";
import Image from "next/image";

export default function Loading() {
  return (
    <div className="fixed top-0 left-0 z-50 flex items-center w-full h-screen justify-center bg-black opacity-50">
      <div className="w-50 h-50">
        <Lottie animationData={loadingAnimation} loop={true} autoplay={true} />
      </div>
    </div>
  );
}
