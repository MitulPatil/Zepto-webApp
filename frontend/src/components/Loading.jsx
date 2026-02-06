const Loading = () => {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="flex flex-col items-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-teal-700"></div>
        <p className="mt-3 text-sm font-semibold text-slate-600">Loading...</p>
      </div>
    </div>
  );
};

export default Loading;

// Skeleton loader for product cards
export const ProductSkeleton = () => {
  return (
    <div className="animate-pulse overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="h-44 bg-slate-200"></div>
      <div className="p-4">
        <div className="mb-2 h-4 rounded bg-slate-200"></div>
        <div className="mb-2 h-3 w-3/4 rounded bg-slate-200"></div>
        <div className="mb-3 h-6 w-1/2 rounded bg-slate-200"></div>
        <div className="h-9 rounded bg-slate-200"></div>
      </div>
    </div>
  );
};
