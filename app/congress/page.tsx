'use client';

import Link from 'next/link';

export default function CongressPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-700 p-4">
      <div className="max-w-7xl mx-auto">
        <Link href="/" className="inline-block mb-4 text-white hover:text-blue-200 transition">
          ← Back to Home
        </Link>

        <div className="bg-white rounded-2xl p-8 sm:p-12 text-center shadow-xl">
          <div className="text-8xl mb-6">🏛️</div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Congress Members
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Coming Soon
          </p>
          <p className="text-gray-500 max-w-2xl mx-auto">
            This section will display information about senators and representatives, 
            including their voting records, committee assignments, sponsored legislation, 
            and biographical information.
          </p>
        </div>
      </div>
    </div>
  );
}