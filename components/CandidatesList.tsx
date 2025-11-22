'use client';

import { Candidate, PartyGroups } from '@/types';
import CandidateCard from './CandidateCard';

interface CandidatesListProps {
  partyGroups: PartyGroups;
  onCandidateClick: (candidate: Candidate) => void;
}

export default function CandidatesList({ partyGroups, onCandidateClick }: CandidatesListProps) {
  const sortedParties = Object.entries(partyGroups).sort(([, a], [, b]) => b.length - a.length);

  if (sortedParties.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center shadow-xl">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">No Matching Candidates</h3>
        <p className="text-gray-600">Try adjusting your search query</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {sortedParties.map(([partyName, candidates]) => (
        <section key={partyName} className="bg-white rounded-xl p-8 shadow-xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 pb-4 border-b-4 border-blue-900">
            {partyName} ({candidates.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {candidates.map(candidate => (
              <CandidateCard
                key={candidate.id}
                candidate={candidate}
                onClick={() => onCandidateClick(candidate)}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}