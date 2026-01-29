import { Link, useParams } from 'react-router-dom';

const OrderSuccess = () => {
  const { orderId } = useParams();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 text-center">
      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-fade-in">
        <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      
      <h1 className="text-4xl font-black text-gray-900 mb-2">Order Placed!</h1>
      <p className="text-gray-500 mb-8 max-w-md mx-auto">
        Thank you for your order. We've received it and will begin processing it right away.
      </p>

      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 max-w-sm w-full mb-8">
        <div className="text-gray-500 text-sm mb-1 uppercase tracking-wider font-semibold">Order ID</div>
        <div className="text-xl font-mono font-bold text-purple-900 break-all">{orderId}</div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          to="/"
          className="px-8 py-3 rounded-full bg-purple-900 text-white font-bold hover:bg-purple-800 transition-all shadow-lg hover:shadow-xl"
        >
          Continue Shopping
        </Link>
        <Link
          to="/profile"
          className="px-8 py-3 rounded-full bg-white text-gray-700 font-bold border-2 border-gray-200 hover:border-purple-200 hover:bg-purple-50 hover:text-purple-900 transition-all"
        >
          View Order
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;