import { Candidate, Donation } from '@/types';

const S3_BASE_URL = process.env.NEXT_PUBLIC_S3_BASE_URL || 'https://know-your-leaders.s3.amazonaws.com';

export async function fetchCandidates(): Promise<Candidate[]> {
  try {
    const response = await fetch(`${S3_BASE_URL}/candidates.json`, {
      next: { revalidate: 3600 }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch candidates');
    }
    
    const data = await response.json();
    return processCandidateData(data);
  } catch (error) {
    console.error('Error fetching candidates:', error);
    return getMockCandidates();
  }
}

export async function fetchDonations(candidateId: string): Promise<Donation[]> {
  try {
    const response = await fetch(`${S3_BASE_URL}/donations/${candidateId}.json`, {
      next: { revalidate: 3600 }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch donations');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching donations:', error);
    return [];
  }
}

function processCandidateData(rawData: any[]): Candidate[] {
  return rawData
    .filter(candidate => candidate.id && candidate.name)
    .map(candidate => ({
      id: candidate.id,
      name: candidate.name,
      party: candidate.party || 'OTHER',
      state: candidate.state || 'US',
      office: candidate.office || 'President',
      electionCycles: candidate.electionCycles || '2024',
      status: candidate.status || 'Active'
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function getMockCandidates(): Candidate[] {
  return [
    {
      id: 'P00000001',
      name: 'Demo Candidate 1',
      party: 'DEMOCRATIC PARTY',
      state: 'US',
      office: 'President',
      electionCycles: '2024',
      status: 'Active'
    },
    {
      id: 'P00000002',
      name: 'Demo Candidate 2',
      party: 'REPUBLICAN PARTY',
      state: 'US',
      office: 'President',
      electionCycles: '2024',
      status: 'Active'
    },
    {
      id: 'P00000003',
      name: 'Demo Candidate 3',
      party: 'LIBERTARIAN PARTY',
      state: 'US',
      office: 'President',
      electionCycles: '2024',
      status: 'Active'
    },
    {
      id: 'P00000004',
      name: 'Demo Candidate 4',
      party: 'GREEN PARTY',
      state: 'US',
      office: 'President',
      electionCycles: '2024',
      status: 'Active'
    }
  ];
}