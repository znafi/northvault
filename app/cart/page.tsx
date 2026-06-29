import { Suspense } from "react";
import { CartPageClient } from "./CartPageClient";

export const metadata = {
  title: "Your Cart",
  description: "Review your World Cup 2026 jersey order before checkout.",
};

export default function CartPage() {
  return (
    <Suspense>
      <CartPageClient />
    </Suspense>
  );
}
