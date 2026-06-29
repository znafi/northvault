import { Suspense } from "react";
import { OrderSuccessClient } from "./OrderSuccessClient";

export const metadata = {
  title: "Order Confirmed!",
};

export default function OrderSuccessPage() {
  return (
    <Suspense>
      <OrderSuccessClient />
    </Suspense>
  );
}
