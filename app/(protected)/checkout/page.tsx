import { EWalletButton } from "./_components/Button";
import CreditCardForm from "./_components/Form";

interface PaymentProps {}

export default async function Checkout() {
  const eWallets = [
    {
      name: "PayPal",
      image: "/paymentMethods/paypal.jpg",
    },
    {
      name: "TNG",
      image: "/paymentMethods/tng.jpg",
    },
    {
      name: "ShopeePay",
      image: "/paymentMethods/shopee-pay.webp",
    },
    {
      name: "GrabPay",
      image: "/paymentMethods/grab-pay.webp",
    },
  ];

  return (
    <div className="mt-25 pt-8 px-16 font-mono gap-4 flex flex-col max-w-4xl mx-auto">
      <p className="text-lg">Please select your payment method:</p>
      <div className="bg-gray-900 p-4 rounded flex flex-col gap-4 mb-4">
        <p className="text-gray-300 font-bold text-xl underline underline-offset-8">
          E-Wallet
        </p>
        <div className="flex flex-row gap-4 text-sm px-2">
          {eWallets.map((provider) => (
            <EWalletButton key={ provider.name } provider={provider} />
          ))}
        </div>
      </div>

      <CreditCardForm />
    </div>
  );
}
