"use client";

import { apiRequest } from "@/lib/apiClient";

interface PayNowButtonProps {
  serviceId: string;
  price: number;
  onSuccess: (url: string) => void;
  onError: (message: string) => void;
}

interface CheckoutSessionResponse {
  sessionId: string;
  url: string;
}

export function PayNowButton({
  serviceId,
  price,
  onSuccess,
  onError,
}: PayNowButtonProps) {
  const handleClick = async () => {
    try {
      const data = await apiRequest<CheckoutSessionResponse>(
        "/stripe/create-checkout-session",
        {
          method: "POST",
          body: JSON.stringify({
            priceInCents: Math.round(price * 100),
            serviceId,
          }),
        },
      );

      if (!data?.url) {
        onError("Checkout session did not return a payment URL");
        return;
      }

      window.location.replace(data.url);
    } catch (err) {
      onError(
        err instanceof Error ? err.message : "Payment failed. Please try again.",
      );
    }
  };

  return (
    <button
      type="button"
      className="w-full py-2.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium transition cursor-pointer"
      onClick={handleClick}
    >
      Pay Now
    </button>
  );
}