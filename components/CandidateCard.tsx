'use client';

import { Candidate } from '@/types';

interface CandidateCardProps {
  candidate: Candidate;
  onClick: () => void;
}

const partyColors: { [key: string]: string } = {
  'DEMOCRATIC PARTY': 'from-blue-600 to-blue-800',
  'REPUBLICAN PARTY': 'from-red-600 to-red-800',
  'LIBERTARIAN PARTY': 'from-yellow-600 to-orange-700',
  'GREEN PARTY': 'from-green-600 to-green-800',
  'INDEPENDENT': 'from-purple-600 to-purple-800',
  'OTHER': 'from-gray-600 to-gray-800'
};

export default function CandidateCard({ candidate, onClick }: CandidateCardProps) {
  const gradientClass = partyColors[candidate.party.toUpperCase()] || partyColors['OTHER'];

  return (
    <button
      onClick={onClick}
      className={`bg-gradient-to-br ${gradientClass} rounded-xl p-6 text-white text-left transition-all hover:-translate-y-2 hover:shadow-2xl relative overflow-hidden group`}
    >
      <div className="absolute top-0 left-0 right-0 h-1 bg-yellow-400"></div>
      
      <h3 className="text-xl font-bold mb-4 pr-4">{candidate.name}</h3>
      
      <div className="space-y-2 text-sm opacity-90">
        <div className="flex items-center gap-2">
          <span>📍</span>
          <span>{candidate.state}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>🗳️</span>
          <span>{candidate.office}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>📅</span>
          <span>{candidate.electionCycles}</span>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-white/20 text-xs opacity-70 font-mono">
        ID: {candidate.id}
      </div>
      
      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-sm font-semibold">View Details →</span>
      </div>
    </button>
  );
}