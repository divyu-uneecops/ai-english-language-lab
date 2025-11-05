export default function WritingLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-2">
            <div className="h-4 w-48 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-8 w-64 bg-gray-200 animate-pulse rounded"></div>
          </div>
          <div className="flex gap-2">
            <div className="h-10 w-40 bg-gray-200 animate-pulse rounded-lg"></div>
            <div className="h-10 w-32 bg-gray-200 animate-pulse rounded-lg"></div>
          </div>
        </div>

        {/* Topics List Skeleton */}
        <div className="h-[850px] overflow-y-auto pr-2">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-200 animate-pulse rounded-full"></div>
                    <div className="h-6 w-24 bg-gray-200 animate-pulse rounded-full"></div>
                    <div className="h-6 w-24 bg-gray-200 animate-pulse rounded-full"></div>
                  </div>
                </div>
                <div className="h-6 w-3/4 bg-gray-200 animate-pulse rounded mb-3"></div>
                <div className="space-y-2 mb-4">
                  <div className="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
                  <div className="h-4 w-5/6 bg-gray-200 animate-pulse rounded"></div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-4">
                    <div className="h-6 w-24 bg-gray-200 animate-pulse rounded-full"></div>
                    <div className="h-6 w-20 bg-gray-200 animate-pulse rounded-full"></div>
                  </div>
                  <div className="h-9 w-32 bg-gray-200 animate-pulse rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
