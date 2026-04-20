export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e17] to-[#1a1f2e] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#ff6b6b] mx-auto mb-4"></div>
        <p className="text-white text-lg">Loading...</p>
      </div>
    </div>
  );
}