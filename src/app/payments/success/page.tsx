export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-rose-50/40">
      <div className="w-full max-w-md bg-white border border-rose-100 rounded-2xl p-8 shadow-lg text-center">
        <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-8 h-8 text-rose-500"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
        <p className="text-text-500 mb-6">
          Your payment has been received and your booking is now confirmed.
        </p>
        <div className="space-y-2">
          <a
            href="/"
            className="inline-block px-6 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition"
          >
            Go to Dashboard
          </a>
          <a
            href="/dashboard/customer/overview"
            className="inline-block px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
          >
            View Booking
          </a>
        </div>
      </div>
    </div>
  );
}