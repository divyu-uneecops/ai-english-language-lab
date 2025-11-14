import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 bg-gradient-to-br from-slate-50 via-white to-orange-50 py-24">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-orange-100">
        <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
      </div>
      <div className="space-y-2 text-center">
        <p className="text-lg font-semibold text-gray-800">
          Preparing your AI learning experience
        </p>
      </div>
    </div>
  );
}
