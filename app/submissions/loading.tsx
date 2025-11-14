export default function AllSubmissionsLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-2">
            <div className="h-4 w-48 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-8 w-64 bg-gray-200 animate-pulse rounded"></div>
          </div>
          <div className="flex gap-2">
            <div className="h-10 w-32 bg-gray-200 animate-pulse rounded-lg"></div>
          </div>
        </div>

        {/* Tabs Skeleton */}
        <div className="flex gap-4 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-10 w-24 bg-gray-200 animate-pulse rounded-lg"
            ></div>
          ))}
        </div>

        {/* Submissions Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="h-6 w-3/4 bg-gray-200 animate-pulse rounded mb-3"></div>
                  <div className="h-4 w-32 bg-gray-200 animate-pulse rounded"></div>
                </div>
                <div className="h-12 w-12 bg-gray-200 animate-pulse rounded-lg"></div>
              </div>
              <div className="space-y-2 mt-4">
                <div className="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
                <div className="h-4 w-5/6 bg-gray-200 animate-pulse rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
