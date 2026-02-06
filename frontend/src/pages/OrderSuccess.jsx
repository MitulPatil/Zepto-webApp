import { Link, useParams } from 'react-router-dom';

const OrderSuccess = () => {
  const { orderId } = useParams();

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-4 rounded-full bg-emerald-100 p-4">
        <svg className="h-10 w-10 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h1 className="text-3xl font-extrabold text-slate-900">Order Confirmed</h1>
      <p className="mt-2 max-w-md text-slate-600">Your order has been placed successfully and is now being processed.</p>

      <div className="mt-6 w-full max-w-md rounded-xl border border-slate-200 bg-white p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Order ID</p>
        <p className="mt-2 break-all font-mono text-base font-bold text-slate-900">{orderId}</p>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link to="/" className="rounded-lg bg-teal-700 px-5 py-2.5 font-semibold text-white hover:bg-teal-800">
          Continue Shopping
        </Link>
        <Link to="/profile" className="rounded-lg border border-slate-300 px-5 py-2.5 font-semibold text-slate-700 hover:bg-slate-50">
          View Orders
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
