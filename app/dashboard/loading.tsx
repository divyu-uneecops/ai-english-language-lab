export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="h-10 w-64 bg-gray-200 animate-pulse rounded mb-2"></div>
          <div className="h-5 w-96 bg-gray-200 animate-pulse rounded"></div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="h-6 w-32 bg-gray-200 animate-pulse rounded"></div>
                <div className="w-12 h-12 bg-gray-200 animate-pulse rounded-full"></div>
              </div>
              <div className="h-10 w-20 bg-gray-200 animate-pulse rounded mb-2"></div>
              <div className="h-4 w-40 bg-gray-200 animate-pulse rounded"></div>
            </div>
          ))}
        </div>

        {/* Practice Cards Skeleton */}
        <div className="mb-8">
          <div className="h-8 w-48 bg-gray-200 animate-pulse rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20"
              >
                <div className="w-16 h-16 bg-gray-200 animate-pulse rounded-full mb-4"></div>
                <div className="h-6 w-40 bg-gray-200 animate-pulse rounded mb-2"></div>
                <div className="h-4 w-full bg-gray-200 animate-pulse rounded mb-4"></div>
                <div className="h-10 w-full bg-gray-200 animate-pulse rounded-lg"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
