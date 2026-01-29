"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PATHS } from "@/app/_config/routes";
import Link from "next/link";
import { TiTick, TiCancel } from "react-icons/ti";

import { HandlePaymentSuccess } from "./success";

export default function PaymentSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [countdown, setCountdown] = useState(3);
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const paidWithOrbs = searchParams.get("paid_with_orbs") === "true";
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    const processPayment = async () => {
      // If paid with Orbs, skip payment processing
      if (paidWithOrbs) {
        setIsProcessing(false);
        return;
      }

      try {
        const result = await HandlePaymentSuccess(sessionId);

        if (!result) {
          setError("Please log in to continue");
          setIsProcessing(false);
          return;
        }

        if (!result.success) {
          setError(result.message || "Failed to process payment");
          setIsProcessing(false);
          return;
        }

        setIsProcessing(false);
      } catch (err) {
        setError("An unexpected error occurred");
        setIsProcessing(false);
      }
    };

    processPayment();
  }, [paidWithOrbs, sessionId]);

  useEffect(() => {
    if (isProcessing || error) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isProcessing, error]);

  useEffect(() => {
    if (!isProcessing && !error && countdown === 0) {
      router.push(PATHS.LIBRARY);
    }
  }, [countdown, isProcessing, error, router]);

  if (isProcessing) {
    return (
      <div className="fixed top-0 right-0 w-screen min-h-screen inset-0 flex flex-col items-center justify-center flex-1 pt-32 px-4 sm:px-6 lg:px-8 pb-12 z-100 bg-gray-950">
        <div className="max-w-2xl mx-auto w-full">
          <div className="flex flex-col items-center justify-center min-h-100 gap-8">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
            <p className="text-gray-300 text-lg">Processing your payment...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed top-0 right-0 w-screen min-h-screen inset-0 flex flex-col flex-1 px-4 sm:px-6 lg:px-8 z-100 bg-gray-950">
        <div className="max-w-2xl mx-auto w-full m-auto">
          <div className="flex flex-col items-center justify-center min-h-100">
            <div className="text-center space-y-6 bg-gray-900/80 backdrop-blur-md border border-gray-700/50 p-8 rounded-xl shadow-2xl min-w-lg">
              <div className="flex justify-center">
                <TiCancel className="text-red-500" size={80} />
              </div>
              <div>
                <p className="text-red-500 text-2xl font-bold mb-1">
                  Payment Failed
                </p>
                <p className="text-gray-300">{error}</p>
              </div>
              <Link
                href={PATHS.CART}
                className="inline-block bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 px-8 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-blue-500/50"
              >
                Back to Cart
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-0 right-0 w-screen min-h-screen inset-0 flex flex-col flex-1 px-4 sm:px-6 lg:px-8 z-100 bg-gray-950">
      <div className="max-w-2xl mx-auto w-full m-auto">
        <div className="flex flex-col items-center justify-center min-h-100">
          <div className="text-center space-y-6 bg-gray-900/80 backdrop-blur-md border border-gray-700/50 p-8 rounded-xl shadow-2xl min-w-lg">
            <div className="flex justify-center">
              <TiTick className="text-green-500" size={80} />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2 bg-linear-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                Payment Successful!
              </h1>
              <p className="text-gray-300 text-lg">Thanks for your purchase!</p>
            </div>
            <p className="text-gray-400">
              Redirecting to library in{" "}
              <span className="text-blue-400 font-semibold">{countdown}</span>{" "}
              seconds...
            </p>
            <Link
              href={PATHS.LIBRARY}
              className="inline-block bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 px-8 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-blue-500/50"
            >
              Go to Library
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
