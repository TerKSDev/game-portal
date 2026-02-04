import { redirect } from "next/navigation";
import { auth } from "@/lib/actions/auth";
import Stripe from "stripe";
import prisma from "@/lib/prisma";
import TopUpSuccess from "./TopUpSuccess";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-01-28.clover",
});

export const metadata = {
  title: "Top-up Successful",
  description: "Your top-up has been processed successfully.",
};

export default async function TopUpSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    redirect("/login");
  }

  const params = await searchParams;
  const sessionId = params.session_id;

  if (!sessionId) {
    redirect("/profile/top_up");
  }

  try {
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);

    if (checkoutSession.payment_status !== "paid") {
      redirect("/profile/top_up?payment=failed");
    }

    const userId = checkoutSession.metadata?.userId;
    const orbs = parseInt(checkoutSession.metadata?.orbs || "0");
    const price = parseFloat(checkoutSession.metadata?.price || "0");

    if (!userId || !orbs || userId !== session.user.id) {
      redirect("/profile/top_up?payment=error");
    }

    // Check if already processed
    const existingTransaction = await prisma.transaction.findFirst({
      where: {
        userId: userId,
        stripeSessionId: sessionId,
      },
    });

    if (!existingTransaction) {
      // Update user orbs
      await prisma.user.update({
        where: { id: userId },
        data: {
          orbs: {
            increment: orbs,
          },
        },
      });

      // Create transaction record
      await prisma.transaction.create({
        data: {
          userId: userId,
          amount: orbs,
          cashAmount: price,
          type: "Top_Up",
          status: "COMPLETED",
          stripeSessionId: sessionId,
          description: `Top-up: ${orbs.toLocaleString()} Orbs`,
        },
      });
    }

    const updatedUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { orbs: true },
    });

    return (
      <div className="flex flex-1 pt-32 px-4 sm:px-6 lg:px-8 pb-12 min-h-screen">
        <div className="max-w-3xl mx-auto w-full">
          <TopUpSuccess
            orbsAdded={orbs}
            currentBalance={updatedUser?.orbs || 0}
          />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Top-up success page error:", error);
    redirect("/profile/top_up?payment=error");
  }
}
