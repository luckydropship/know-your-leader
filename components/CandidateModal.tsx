'use client';

import { useEffect, useState } from 'react';
import { Candidate, Donation } from '@/types';
import { fetchDonations } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/formatters';

interface CandidateModalProps {
  candidate: Candidate;
  onClose: () => void;
}

export default function CandidateModal({ candidate, onClose }: CandidateModalProps) {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDonations = async () => {
      setIsLoading(true);
      const data = await fetchDonations(candidate.id);
      setDonations(data);
      setIsLoading(false);
    };
    
    loadDonations();
    
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [candidate.id]);

  const totalAmount = donations.reduce((sum, d) => sum + d.amount, 0);
  const avgDonation = donations.length > 0 ? totalAmount / donations.length : 0;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl modal-enter">
        <div className="sticky top-0 bg-gradient-to-br from-gray-50 to-white p-6 border-b border-gray-200 flex justify-between items-center z-10">
          <h2 className="text-3xl font-bold text-gray-900">{candidate.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-900 text-3xl font-bold w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 pb-8 border-b border-gray-200">
            <div>
              <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Party</div>
              <div className="text-lg text-gray-900">{candidate.party}</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">State</div>
              <div className="text-lg text-gray-900">{candidate.state}</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Office</div>
              <div className="text-lg text-gray-900">{candidate.office}</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Election Cycle</div>
              <div className="text-lg text-gray-900">{candidate.electionCycles}</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Status</div>
              <div className="text-lg text-gray-900">{candidate.status}</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Candidate ID</div>
              <div className="text-lg text-gray-900 font-mono">{candidate.id}</div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Campaign Donations</h3>
              {donations.length > 0 && (
                <div className="flex gap-4 text-sm">
                  <div className="text-center">
                    <div className="font-bold text-blue-900">{formatCurrency(totalAmount)}</div>
                    <div className="text-gray-500">Total Raised</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-blue-900">{donations.length}</div>
                    <div className="text-gray-500">Donations</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-blue-900">{formatCurrency(avgDonation)}</div>
                    <div className="text-gray-500">Average</div>
                  </div>
                </div>
              )}
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-12 h-12 border-4 border-blue-900 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-600">Loading donation data...</p>
              </div>
            ) : donations.length > 0 ? (
              <div className="space-y-4">
                {donations.map((donation, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-900 hover:bg-gray-100 transition">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xl font-bold text-blue-900">{formatCurrency(donation.amount)}</span>
                      <span className="text-sm text-gray-500">{formatDate(donation.date)}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-900">{donation.donorName || 'Anonymous'}</span>
                      <span className="px-3 py-1 bg-blue-900 text-white text-xs rounded-full font-medium">
                        {donation.type}
                      </span>
                    </div>
                    {donation.employer && (
                      <div className="text-sm text-gray-600 italic">
                        <strong>Employer:</strong> {donation.employer}
                        {donation.occupation && ` | ${donation.occupation}`}
                      </div>
                    )}
                    {donation.donorCity && (
                      <div className="text-sm text-gray-500 mt-1">
                        {donation.donorCity}{donation.donorState ? `, ${donation.donorState}` : ''}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <div className="text-5xl mb-4">💰</div>
                <p>No donation data available for this candidate.</p>
              </div>
            )}
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}