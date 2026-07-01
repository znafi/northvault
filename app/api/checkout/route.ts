import { NextRequest, NextResponse } from "next/server";
import { CartLine } from "@/lib/types";
import { STANDARD_SHIPPING, EXPRESS_SHIPPING, FREE_SHIPPING_THRESHOLD, TAX_RATE, PROMO_CODE, PROMO_DISCOUNT } from "@/lib/data";

interface CheckoutBody {
  lines: CartLine[];
  promoCode: string | null;
  shippingMethod: "standard" | "express";
  email: string;
}

function generateOrderId(): string {
  return "NV-" + Math.random().toString(36).slice(2, 8).toUpperCase();
}

function toFormBody(params: Record<string, string>): string {
  return Object.entries(params)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join("&");
}

export async function POST(req: NextRequest) {
  const body: CheckoutBody = await req.json();
  const { lines, promoCode, shippingMethod, email } = body;

  const subtotal = lines.reduce(
    (sum, l) => sum + l.unitPrice * l.qty + (l.printing ? l.printing.fee * l.qty : 0),
    0
  );
  const discount = promoCode === PROMO_CODE ? subtotal * PROMO_DISCOUNT : 0;
  const discountedSubtotal = subtotal - discount;
  const shippingCost =
    discountedSubtotal >= FREE_SHIPPING_THRESHOLD
      ? 0
      : shippingMethod === "express"
      ? EXPRESS_SHIPPING
      : STANDARD_SHIPPING;
  const tax = discountedSubtotal * TAX_RATE;
  const total = discountedSubtotal + shippingCost + tax;
  const orderId = generateOrderId();

  const stripeKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeKey) {
    return NextResponse.json({
      mode: "demo",
      orderId,
      total,
      redirectUrl: `/order/success?orderId=${orderId}&demo=1&email=${encodeURIComponent(email)}&total=${total.toFixed(2)}`,
    });
  }

  try {
    const res = await fetch("https://api.stripe.com/v1/payment_intents", {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(stripeKey + ":").toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: toFormBody({
        amount: String(Math.round(total * 100)),
        currency: "cad",
        "automatic_payment_methods[enabled]": "true",
        receipt_email: email,
        "metadata[orderId]": orderId,
        "metadata[promoCode]": promoCode ?? "",
        "metadata[shippingMethod]": shippingMethod,
      }),
    });

    const pi = await res.json() as { client_secret?: string; error?: { message: string } };

    if (!res.ok) {
      const msg = pi.error?.message ?? `Stripe error ${res.status}`;
      console.error("Stripe error:", msg);
      return NextResponse.json({ error: msg }, { status: 500 });
    }

    return NextResponse.json({ mode: "stripe", clientSecret: pi.client_secret, orderId, total });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Checkout error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
