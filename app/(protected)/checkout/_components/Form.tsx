"use client";

import { useRouter } from "next/navigation";
import { PATHS } from "@/app/_config/routes";
import { FormSubmit } from "./formSubmit";

export default function CreditCardForm() {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const cardNumber = formData.get("cardNumber") as string;
    const expireDate = formData.get("expireDate") as string;
    const cvc = formData.get("cvc") as string;

    if (!cardNumber || !expireDate || !cvc) {
      alert("Please fill in all the fields.");
      return;
    }

    if (cardNumber.toString().length !== 16) {
      alert("Invalid card number format.");
      return;
    }

    if (cvc.toString().length !== 3) {
      alert("Invalid CVC format.");
      return;
    }

    if (
      expireDate.toString().length !== 5 ||
      !expireDate.toString().includes("/")
    ) {
      alert("Invalid expire date format.");
      return;
    }

    const [month, year] = expireDate.toString().split("/");
    const inputMonth = parseInt(month, 10);
    const inputYear = parseInt(year, 10);

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear() % 100;

    if (inputMonth < 1 || inputMonth > 12) {
      alert("Invalid expire date format.");
      return;
    }

    if (
      inputYear < currentYear ||
      (inputYear === currentYear && inputMonth < currentMonth)
    ) {
      alert("Your card was expired.");
      return;
    }

    handleDatabase();
  };

  const handleDatabase = async () => {
    try {
      const res = await FormSubmit();

      if (res && res.success) {
        alert("Success: " + res.message);
        router.push(PATHS.LIBRARY);
      }

      if (res && !res.success) {
        alert("Error: " + res.message);
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-900 p-4 rounded flex flex-col gap-6"
    >
      <p className="text-gray-300 font-bold text-xl underline underline-offset-8">
        Credit Card
      </p>
      <div className="px-1 text-sm">
        <div>
          <label htmlFor="cardNumber" className="block mb-1">
            Card Number
          </label>
          <input
            type="text"
            placeholder="1234 5678 9012 3456"
            className="w-full p-2 border border-gray-700 bg-gray-800 rounded outline-none"
            id="cardNumber"
            name="cardNumber"
          />
        </div>
        <div className="flex flex-row gap-4 flex-wrap">
          <div className="flex flex-col flex-1">
            <label htmlFor="expireDate" className="block mb-1 mt-4">
              Expire Date
            </label>
            <input
              type="text"
              placeholder="MM/YY"
              className="w-full p-2 border border-gray-700 bg-gray-800 rounded outline-none"
              id="expireDate"
              name="expireDate"
            />
          </div>

          <div className="flex flex-col flex-1">
            <label htmlFor="cvc" className="block mb-1 mt-4">
              CVC
            </label>
            <input
              type="text"
              placeholder="XXX"
              className="w-full p-2 border border-gray-700 bg-gray-800 rounded outline-none"
              id="cvc"
              name="cvc"
            />
          </div>
        </div>
      </div>
      <button className="mt-2 bg-blue-700 w-full p-1.5 rounded" type="submit">
        Pay
      </button>
    </form>
  );
}
