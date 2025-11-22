// know-your-leader/services/dataService.js
window.DataService = {
    /**
     * Group candidates by political party
     * @param {Array} candidates - Array of candidate objects
     * @returns {Object} Candidates grouped by party
     */
    groupCandidatesByParty(candidates) {
        if (!Array.isArray(candidates)) {
            console.warn('Invalid candidates array provided to groupCandidatesByParty');
            return {};
        }
        
        return candidates.reduce((groups, candidate) => {
            const party = candidate.party || 'OTHER';
            const partyKey = party.toUpperCase();
            
            if (!groups[partyKey]) {
                groups[partyKey] = [];
            }
            
            groups[partyKey].push(candidate);
            return groups;
        }, {});
    },
    
    /**
     * Filter candidates based on search query
     * @param {Array} candidates - Array of candidate objects
     * @param {string} query - Search query
     * @returns {Array} Filtered candidates
     */
    filterCandidates(candidates, query) {
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
    },
    
    /**
     * Sort candidates by name
     * @param {Array} candidates - Array of candidate objects
     * @returns {Array} Sorted candidates
     */
    sortCandidatesByName(candidates) {
        return [...candidates].sort((a, b) => {
            const nameA = a.name?.toLowerCase() || '';
            const nameB = b.name?.toLowerCase() || '';
            return nameA.localeCompare(nameB);
        });
    },
    
    /**
     * Calculate statistics from candidates data
     * @param {Array} candidates - Array of candidate objects
     * @returns {Object} Statistics object
     */
    calculateStats(candidates) {
        if (!Array.isArray(candidates)) {
            return { totalCandidates: 0, totalParties: 0 };
        }
        
        const parties = new Set();
        const states = new Set();
        
        candidates.forEach(candidate => {
            if (candidate.party) parties.add(candidate.party);
            if (candidate.state) states.add(candidate.state);
        });
        
        return {
            totalCandidates: candidates.length,
            totalParties: parties.size,
            totalStates: states.size
        };
    },
    
    /**
     * Validate candidate data structure
     * @param {Object} candidate - Candidate object
     * @returns {boolean} Whether candidate is valid
     */
    isValidCandidate(candidate) {
        return candidate && 
               typeof candidate === 'object' &&
               candidate.id &&
               candidate.name;
    },
    
    /**
     * Process and clean candidate data from S3
     * @param {Array} rawCandidates - Raw candidate data from S3
     * @returns {Array} Cleaned candidate data
     */
    processCandidateData(rawCandidates) {
        if (!Array.isArray(rawCandidates)) {
            console.error('Invalid candidate data format');
            return [];
        }
        
        return rawCandidates
            .filter(candidate => this.isValidCandidate(candidate))
            .map(candidate => ({
                id: candidate.id,
                name: candidate.name,
                party: candidate.party || 'OTHER',
                state: candidate.state || 'US',
                office: candidate.office || 'President',
                electionCycles: candidate.electionCycles || '2024',
                status: candidate.status || 'Active'
            }));
    }
};