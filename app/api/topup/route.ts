import { NextResponse } from "next/server";
import Stripe from "stripe";
import { auth } from "@/lib/actions/auth";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-01-28.clover",
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orbs, price } = body;

    const nextauthSession = await auth();

    if (!nextauthSession || !nextauthSession.user || !nextauthSession.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate inputs
    if (typeof orbs !== "number" || isNaN(orbs) || orbs <= 0) {
      return NextResponse.json(
        { error: "Invalid orbs amount", details: `Received: ${orbs}` },
        { status: 400 },
      );
    }

    if (typeof price !== "number" || isNaN(price) || price <= 0) {
      return NextResponse.json(
        { error: "Invalid price", details: `Received: ${price}` },
        { status: 400 },
      );
    }

    const origin = req.headers.get("origin") || "http://localhost:3000";

    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "fpx", "grabpay", "alipay"],
      line_items: [
        {
          price_data: {
            currency: "myr",
            product_data: {
              name: `${orbs} Orbs Top-up`,
              description: `Purchase ${orbs} Orbs for your Game Portal account`,
            },
            unit_amount: Math.round(price * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/profile/top_up/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/profile/top_up?canceled=true`,
      metadata: {
        userId: nextauthSession.user.id,
        orbs: orbs.toString(),
        price: price.toString(),
        type: "TOP_UP",
      },
    });

    return NextResponse.json({ url: stripeSession.url });
  } catch (error) {
    console.error("Top-up checkout error:", error);
    return NextResponse.json(
      {
        error: "Error creating checkout session",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
