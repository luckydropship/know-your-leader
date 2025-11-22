'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import StatsSection from '@/components/StatsSection';
import SearchBox from '@/components/SearchBox';
import CandidatesList from '@/components/CandidatesList';
import CandidateModal from '@/components/CandidateModal';
import { Candidate } from '@/types';
import { fetchCandidates } from '@/lib/api';
import { filterCandidates, groupCandidatesByParty, calculateStats } from '@/lib/dataService';

export default function Home() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCandidates();
  }, []);

  const loadCandidates = async () => {
    try {
      setIsLoading(true);
      const data = await fetchCandidates();
      setCandidates(data);
      setFilteredCandidates(data);
    } catch (err) {
      setError('Failed to load candidates. Please try again.');
      console.error('Error loading candidates:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    const filtered = filterCandidates(candidates, query);
    setFilteredCandidates(filtered);
  };

  const handleCandidateClick = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
  };

  const handleCloseModal = () => {
    setSelectedCandidate(null);
  };

  const stats = calculateStats(filteredCandidates);
  const partyGroups = groupCandidatesByParty(filteredCandidates);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-700 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl p-8 text-center shadow-xl">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Something Went Wrong</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={loadCandidates}
              className="px-6 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-700 p-4">
      <div className="max-w-7xl mx-auto">
        <Header />
        <StatsSection stats={stats} />
        <SearchBox onSearch={handleSearch} />
        
        {isLoading ? (
          <div className="text-center py-16">
            <div className="inline-block w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            <p className="text-white text-xl mt-4">Loading candidate data...</p>
          </div>
        ) : (
          <CandidatesList
            partyGroups={partyGroups}
            onCandidateClick={handleCandidateClick}
          />
        )}

        {selectedCandidate && (
          <CandidateModal
            candidate={selectedCandidate}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </div>
  );
}