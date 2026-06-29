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

  const stripeKey = process.env.STRIPE_SECRET_KEY;

  // Demo mode — no Stripe key
  if (!stripeKey) {
    const orderId = generateOrderId();
    return NextResponse.json({
      mode: "demo",
      orderId,
      redirectUrl: `/order/success?orderId=${orderId}&demo=1&email=${encodeURIComponent(email)}&total=${total.toFixed(2)}`,
    });
  }

  // Stripe Checkout
  try {
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(stripeKey, { apiVersion: "2026-06-24.dahlia" });

    const lineItems = lines.map((l) => ({
      price_data: {
        currency: "cad",
        product_data: {
          name: l.printing
            ? `${l.name} (${l.size}) — Print: ${l.printing.name} #${l.printing.number}`
            : `${l.name} (${l.size})`,
          metadata: { jerseyId: l.jerseyId, size: l.size },
        },
        unit_amount: Math.round(
          (l.unitPrice + (l.printing?.fee ?? 0)) * 100
        ),
      },
      quantity: l.qty,
    }));

    if (shippingCost > 0) {
      lineItems.push({
        price_data: {
          currency: "cad",
          product_data: { name: `Shipping (${shippingMethod})`, metadata: { jerseyId: "", size: "" as import("@/lib/types").Size } },
          unit_amount: Math.round(shippingCost * 100),
        },
        quantity: 1,
      });
    }

    if (discount > 0) {
      lineItems.push({
        price_data: {
          currency: "cad",
          product_data: {
            name: `Discount (${promoCode})`,
            metadata: { jerseyId: "", size: "" as import("@/lib/types").Size },
          },
          unit_amount: -Math.round(discount * 100),
        },
        quantity: 1,
      });
    }

    const origin = req.headers.get("origin") ?? "http://localhost:3000";
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      customer_email: email,
      success_url: `${origin}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout`,
      metadata: { promoCode: promoCode ?? "" },
    });

    return NextResponse.json({ mode: "stripe", redirectUrl: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Stripe error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
