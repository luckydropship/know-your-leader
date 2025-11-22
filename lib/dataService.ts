import { Candidate, PartyGroups, Stats } from '@/types';

export function groupCandidatesByParty(candidates: Candidate[]): PartyGroups {
  return candidates.reduce((groups: PartyGroups, candidate) => {
    const party = candidate.party || 'OTHER';
    const partyKey = party.toUpperCase();
    
    if (!groups[partyKey]) {
      groups[partyKey] = [];
    }
    
    groups[partyKey].push(candidate);
    return groups;
  }, {});
}

export function filterCandidates(candidates: Candidate[], query: string): Candidate[] {
  if (!query || !query.trim()) {
    return candidates;
  }
  
  const searchTerm = query.toLowerCase().trim();
  
  return candidates.filter(candidate => {
    const nameMatch = candidate.name?.toLowerCase().includes(searchTerm);
    const partyMatch = candidate.party?.toLowerCase().includes(searchTerm);
    const stateMatch = candidate.state?.toLowerCase().includes(searchTerm);
    const idMatch = candidate.id?.toLowerCase().includes(searchTerm);
    
    return nameMatch || partyMatch || stateMatch || idMatch;
  });
}

export function calculateStats(candidates: Candidate[]): Stats {
  const parties = new Set<string>();
  const states = new Set<string>();
  
  candidates.forEach(candidate => {
    if (candidate.party) parties.add(candidate.party);
    if (candidate.state) states.add(candidate.state);
  });
  
  return {
    totalCandidates: candidates.length,
    totalParties: parties.size,
    totalStates: states.size
  };
}