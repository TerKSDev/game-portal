"use client";

import { useRouter } from "next/navigation";
import { PATHS } from "@/app/_config/routes";
import Image from "next/image";
import { FormSubmit } from "./formSubmit";

interface EWalletButtonProps {
  provider: {
    name: string;
    image: string;
  };
}

export function EWalletButton({ provider }: EWalletButtonProps) {
  const router = useRouter();

  const handleClick = async () => {
    const isConfirmed = window.confirm(`Proceed to pay with ${provider.name}?`);

    if (isConfirmed) {
      const res = await FormSubmit();

      if (res && res.success) {
        alert("Payment successful!");
        router.push(`${PATHS.LIBRARY}`);
      } else {
        alert(`Payment failed: ${res?.message}`);
      }
    }
  };

  return (
    <button
      onClick={handleClick}
      className="flex flex-col items-center gap-2 p-2 border border-gray-700 bg-gray-600 rounded hover:bg-gray-800 transition w-full text-center"
    >
      <div className="p-4 relative rounded w-12 h-12">
        <Image
          src={provider.image}
          alt={provider.name}
          fill
          className="object-cover rounded"
        />
      </div>
      <p>{provider.name}</p>
    </button>
  );
}
