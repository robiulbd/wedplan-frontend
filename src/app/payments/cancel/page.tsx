export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-rose-50/40">
      <div className="w-full max-w-md bg-white border border-rose-100 rounded-2xl p-8 shadow-lg text-center">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-8 h-8 text-red-500"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M18 6L7 12h3v6H5v-6H2v2h20v-2h-3.5l4.3-12A2 2 0 0 0 18 6zM7 12h5v5H7v-5zm5 0h2v3h-2v-3zm3.5-2c-.97 0-1.84.38-2.5.96L16 7l1.4 5H14.5z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Cancelled</h1>
        <p className="text-text-500 mb-6">
          Your payment was not completed. You can try again or go back to your booking.
        </p>
        <div className="space-y-2">
          <a
            href="/dashboard/customer/overview"
            className="inline-block px-6 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition"
          >
            Try Again
          </a>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
          >
            Go to Home
          </a>
        </div>
      </div>
    </div>
  );
}