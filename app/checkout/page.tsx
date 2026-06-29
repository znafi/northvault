import { Suspense } from "react";
import { CheckoutClient } from "./CheckoutClient";

export const metadata = {
  title: "Checkout",
  description: "Complete your World Cup 2026 jersey order.",
};

export default function CheckoutPage() {
  return (
    <Suspense>
      <CheckoutClient />
    </Suspense>
  );
}
