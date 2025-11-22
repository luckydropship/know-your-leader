import { Stats } from '@/types';
import { formatNumber } from '@/lib/formatters';

interface StatsSectionProps {
  stats: Stats;
}

export default function StatsSection({ stats }: StatsSectionProps) {
  return (
    <section className="bg-white rounded-xl p-8 mb-8 shadow-xl">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="text-center">
          <h3 className="text-5xl font-bold text-blue-900 mb-2">
            {formatNumber(stats.totalCandidates)}
          </h3>
          <p className="text-gray-600 font-medium">Total Candidates</p>
        </div>
        <div className="text-center">
          <h3 className="text-5xl font-bold text-blue-900 mb-2">
            {formatNumber(stats.totalParties)}
          </h3>
          <p className="text-gray-600 font-medium">Political Parties</p>
        </div>
        <div className="text-center">
          <h3 className="text-5xl font-bold text-blue-900 mb-2">
            {formatNumber(stats.totalStates)}
          </h3>
          <p className="text-gray-600 font-medium">States Represented</p>
        </div>
        <div className="text-center">
          <h3 className="text-5xl font-bold text-blue-900 mb-2">2024</h3>
          <p className="text-gray-600 font-medium">Current Election Cycle</p>
        </div>
      </div>
    </section>
  );
}