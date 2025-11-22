// know-your-leader/utils/constants.js
window.AppConstants = {
    // S3 Configuration
    S3_CONFIG: {
        BUCKET_BASE_URL: 'https://know-your-leader-data.s3.amazonaws.com',
        CANDIDATES_ENDPOINT: '/candidates.json',
        DONATIONS_ENDPOINT: '/donations'
    },
    
    // App Configuration
    APP_CONFIG: {
        DEBOUNCE_DELAY: 300,
        ITEMS_PER_PAGE: 50,
        MAX_SEARCH_RESULTS: 200
    },
    
    // Party Colors for UI
    PARTY_COLORS: {
        'DEMOCRATIC PARTY': '#1c64f2',
        'REPUBLICAN PARTY': '#e02424',
        'LIBERTARIAN PARTY': '#f59e0b',
        'GREEN PARTY': '#10b981',
        'INDEPENDENT': '#8b5cf6',
        'OTHER': '#6b7280'
    },
    
    // Election Cycles
    ELECTION_CYCLES: ['2024', '2020', '2016', '2012'],
    
    // States
    US_STATES: [
        'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
        'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
        'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
        'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
        'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
    ]
};