import { Candidate, Donation } from '@/types';

const S3_BASE_URL = process.env.NEXT_PUBLIC_S3_BASE_URL || 'https://know-your-leaders.s3.us-east-1.amazonaws.com';

export async function fetchCandidates(): Promise<Candidate[]> {
  // Debug logging
  console.log('Environment check:');
  console.log('- NEXT_PUBLIC_S3_BASE_URL:', process.env.NEXT_PUBLIC_S3_BASE_URL);
  console.log('- S3_BASE_URL:', S3_BASE_URL);
  console.log('- All env vars:', Object.keys(process.env).filter(key => key.startsWith('NEXT_PUBLIC_')));
  
  try {
    console.log('Fetching candidates from:', `${S3_BASE_URL}/candidates/2024/P/candidates.json`);
    
    const response = await fetch(`${S3_BASE_URL}/candidates/2024/P/candidates.json`, {
      next: { revalidate: 3600 },
      headers: {
        'Accept': 'application/json',
      }
    });
    
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      console.error('Failed to fetch candidates:', response.status, response.statusText);
      throw new Error(`Failed to fetch candidates: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Fetched candidates data:', data);
    
    const processed = processCandidateData(data);
    console.log('Processed candidates:', processed.length);
    
    return processed;
  } catch (error) {
    console.error('Error fetching candidates:', error);
    console.log('Using mock data instead');
    return getMockCandidates();
  }
}

export async function fetchDonations(candidateId: string): Promise<Donation[]> {
  try {
    const response = await fetch(`${S3_BASE_URL}/donations/${candidateId}.json`, {
      next: { revalidate: 3600 },
      headers: {
        'Accept': 'application/json',
      }
    });
    
    if (!response.ok) {
      console.warn(`No donations found for candidate ${candidateId}`);
      return [];
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching donations:', error);
    return [];
  }
}

function processCandidateData(rawData: any[]): Candidate[] {
  if (!Array.isArray(rawData)) {
    console.error('Invalid data format - expected array, got:', typeof rawData);
    return [];
  }

  return rawData
    .filter(candidate => {
      const isValid = candidate.id && candidate.name;
      if (!isValid) {
        console.warn('Skipping invalid candidate:', candidate);
      }
      return isValid;
    })
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
  console.log('Generating mock candidates');
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
    },
    {
      id: 'P00000005',
      name: 'Demo Candidate 5',
      party: 'INDEPENDENT',
      state: 'US',
      office: 'President',
      electionCycles: '2024',
      status: 'Active'
    }
  ];
}