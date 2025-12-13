export const SkeletonUserCard = () => (
  <div className="p-6 h-full flex flex-col items-center text-center rounded-2xl bg-white/60 backdrop-blur-xl shadow-lg animate-pulse">
    {/* Avatar */}
    <div className="w-24 h-24 rounded-full bg-gray-300 mb-4" />

    {/* Name */}
    <div className="w-32 h-5 bg-gray-300 rounded mb-2" />

    {/* Role badge */}
    <div className="w-24 h-6 bg-gray-200 rounded-full mb-4" />

    {/* Divider */}
    <div className="w-full h-px bg-gray-200 my-3" />

    {/* Rating + Location */}
    <div className="flex gap-6">
      <div className="w-12 h-4 bg-gray-300 rounded" />
      <div className="w-20 h-4 bg-gray-300 rounded" />
    </div>
  </div>
);
