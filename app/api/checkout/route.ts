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

  const stripeKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeKey) {
    const orderId = generateOrderId();
    return NextResponse.json({
      mode: "demo",
      orderId,
      redirectUrl: `/order/success?orderId=${orderId}&demo=1&email=${encodeURIComponent(email)}&total=${total.toFixed(2)}`,
    });
  }

  try {
    const origin = req.headers.get("origin") ?? "https://www.northvault.shop";

    // Build flat form-encoded params for Stripe REST API (same as curl)
    const params: Record<string, string> = {
      mode: "payment",
      customer_email: email,
      success_url: `${origin}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout`,
      "metadata[promoCode]": promoCode ?? "",
    };

    lines.forEach((l, i) => {
      const name = l.printing
        ? `${l.name} (${l.size}) — Print: ${l.printing.name} #${l.printing.number}`
        : `${l.name} (${l.size})`;
      const amount = Math.round((l.unitPrice + (l.printing?.fee ?? 0)) * 100);
      params[`line_items[${i}][price_data][currency]`] = "cad";
      params[`line_items[${i}][price_data][product_data][name]`] = name;
      params[`line_items[${i}][price_data][unit_amount]`] = String(amount);
      params[`line_items[${i}][quantity]`] = String(l.qty);
    });

    let idx = lines.length;
    if (shippingCost > 0) {
      params[`line_items[${idx}][price_data][currency]`] = "cad";
      params[`line_items[${idx}][price_data][product_data][name]`] = `Shipping (${shippingMethod})`;
      params[`line_items[${idx}][price_data][unit_amount]`] = String(Math.round(shippingCost * 100));
      params[`line_items[${idx}][quantity]`] = "1";
      idx++;
    }

    const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(stripeKey + ":").toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: toFormBody(params),
    });

    const data = await res.json() as { url?: string; error?: { message: string } };

    if (!res.ok) {
      const msg = data.error?.message ?? `Stripe error ${res.status}`;
      console.error("Stripe API error:", msg);
      return NextResponse.json({ error: msg }, { status: 500 });
    }

    return NextResponse.json({ mode: "stripe", redirectUrl: data.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Checkout error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
