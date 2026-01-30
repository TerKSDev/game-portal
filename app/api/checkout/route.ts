import { NextResponse } from "next/server";
import Stripe from "stripe";
import { auth } from "@/lib/actions/auth";
import prisma from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-01-28.clover",
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { totalPrice, orbsUsed = 0 } = body;

    console.log(
      "Received checkout request with totalPrice:",
      totalPrice,
      "orbsUsed:",
      orbsUsed,
    );

    const nextauthSession = await auth();

    if (!nextauthSession || !nextauthSession.user || !nextauthSession.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate totalPrice
    if (
      typeof totalPrice !== "number" ||
      isNaN(totalPrice) ||
      totalPrice <= 0
    ) {
      console.error("Invalid totalPrice:", totalPrice);
      return NextResponse.json(
        { error: "Invalid total price", details: `Received: ${totalPrice}` },
        { status: 400 },
      );
    }

    // Verify user has enough Orbs if they want to use them
    if (orbsUsed > 0) {
      const user = await prisma.user.findUnique({
        where: { id: nextauthSession.user.id },
        select: { orbs: true },
      });

      if (!user || user.orbs < orbsUsed) {
        return NextResponse.json(
          {
            error: "Insufficient Orbs",
            details: `You need ${orbsUsed} Orbs but only have ${user?.orbs || 0}`,
          },
          { status: 400 },
        );
      }
    }

    const origin = req.headers.get("origin") || "http://localhost:3000";

    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "fpx", "grabpay", "alipay"],
      line_items: [
        {
          price_data: {
            currency: "myr",
            product_data: {
              name: "Game Purchase",
            },
            unit_amount: Math.round(totalPrice * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/cart/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart?canceled=true`,
      metadata: {
        userId: nextauthSession.user.id,
        orbsUsed: orbsUsed.toString(),
      },
    });

    console.log("Stripe session created successfully:", stripeSession.id);
    return NextResponse.json({ url: stripeSession.url });
  } catch (error) {
    console.error("Checkout error details:", error);
    return NextResponse.json(
      {
        error: "Error creating checkout session",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
