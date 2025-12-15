import { GlassCard } from '@/components/GlassCard';

export function SkeletonDashboardPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-pulse">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 w-40 bg-gray-300 rounded" />
          <div className="h-4 w-56 bg-gray-200 rounded" />
        </div>
        <div className="h-10 w-40 bg-gray-200 rounded-xl" />
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
        {[1, 2].map((i) => (
          <GlassCard key={i} className="p-6 flex items-center gap-4">
            <div className="w-14 h-14 bg-gray-200 rounded-2xl" />
            <div className="space-y-2 flex-1">
              <div className="h-4 w-32 bg-gray-200 rounded" />
              <div className="h-6 w-20 bg-gray-300 rounded" />
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {[1, 2].map((i) => (
          <GlassCard key={i} className="p-8">
            <div className="h-5 w-40 bg-gray-300 rounded mb-6" />
            <div className="h-[300px] bg-gray-200 rounded-xl" />
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
