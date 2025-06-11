export default function Loading() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="text-lg font-black uppercase text-gray-600">
          Loading Farcaster Market...
        </div>
        <div className="mt-2 w-16 h-1 bg-gray-300 rounded overflow-hidden mx-auto">
          <div className="w-full h-full bg-gradient-to-r from-purple-600 to-blue-600 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
} 