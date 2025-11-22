// know-your-leader/app.js
class KnowYourLeaderApp {
    constructor() {
        this.candidates = [];
        this.filteredCandidates = [];
        this.partyGroups = {};
        this.components = {};
        this.isLoading = false;
        
        // DOM Elements
        this.domElements = {
            statsSection: document.getElementById('statsSection'),
            searchBoxContainer: document.getElementById('searchBoxContainer'),
            candidatesContainer: document.getElementById('candidatesContainer'),
            loadingIndicator: document.getElementById('loadingIndicator')
        };
        
        this.init();
    }
    
    async init() {
        try {
            this.showLoading();
            this.initializeComponents();
            await this.loadData();
            this.render();
            this.bindGlobalEvents();
            
            console.log('Know Your Leader app initialized successfully');
        } catch (error) {
            console.error('Failed to initialize app:', error);
            this.showError('Failed to initialize application. Please refresh the page.');
        } finally {
            this.hideLoading();
        }
    }
    
    initializeComponents() {
        // Initialize Search Box
        this.components.searchBox = new window.SearchBox('searchBoxContainer', {
            placeholder: '🔍 Search candidates by name, party, state, or ID...',
            debounceDelay: window.AppConstants.APP_CONFIG.DEBOUNCE_DELAY
        });
        
        this.components.searchBox.onSearch = (query) => {
            this.handleSearch(query);
        };
        
        // Initialize Candidate Modal (already initialized globally)
        this.components.modal = window.candidateModal;
        this.components.modal.onClose = () => {
            // Focus management after modal closes
            setTimeout(() => {
                this.components.searchBox.focus();
            }, 100);
        };
        
        // Initialize party sections map
        this.components.partySections = new Map();
    }
    
    async loadData() {
        this.isLoading = true;
        
        try {
            // Load candidates from S3
            this.candidates = await window.S3Service.fetchCandidates();
            
            // Process and sort candidates
            this.candidates = window.DataService.sortCandidatesByName(this.candidates);
            this.filteredCandidates = [...this.candidates];
            
            // Group by party
            this.partyGroups = window.DataService.groupCandidatesByParty(this.candidates);
            
            console.log(`Loaded ${this.candidates.length} candidates across ${Object.keys(this.partyGroups).length} parties`);
            
        } catch (error) {
            console.error('Error loading data:', error);
            throw error;
        } finally {
            this.isLoading = false;
        }
    }
    
    render() {
        this.renderStats();
        this.renderCandidates();
    }
    
    renderStats() {
        const stats = window.DataService.calculateStats(this.candidates);
        
        this.domElements.statsSection.innerHTML = `
            <div class="stats-grid">
                <div class="stat-item">
                    <h3 id="totalCandidates">${window.Formatters.formatNumber(stats.totalCandidates)}</h3>
                    <p>Total Candidates</p>
                </div>
                <div class="stat-item">
                    <h3 id="totalParties">${window.Formatters.formatNumber(stats.totalParties)}</h3>
                    <p>Political Parties</p>
                </div>
                <div class="stat-item">
                    <h3 id="totalStates">${window.Formatters.formatNumber(stats.totalStates)}</h3>
                    <p>States Represented</p>
                </div>
                <div class="stat-item">
                    <h3>2024</h3>
                    <p>Current Election Cycle</p>
                </div>
            </div>
        `;
    }
    
    renderCandidates(candidates = this.filteredCandidates) {
        // Clear existing content
        this.domElements.candidatesContainer.innerHTML = '';
        this.components.partySections.clear();
        
        if (candidates.length === 0) {
            this.showEmptyState();
            return;
        }
        
        // Regroup candidates
        const partyGroups = window.DataService.groupCandidatesByParty(candidates);
        
        // Sort parties by candidate count (descending)
        const sortedParties = Object.entries(partyGroups)
            .sort(([, a], [, b]) => b.length - a.length);
        
        // Render each party section
        sortedParties.forEach(([partyName, partyCandidates]) => {
            const partySection = new window.PartySection(partyName, partyCandidates, {
                collapsible: true,
                showCount: true,
                initiallyCollapsed: false
            });
            
            partySection.onCandidateClick = (candidate) => {
                this.handleCandidateClick(candidate);
            };
            
            const sectionElement = partySection.render();
            this.domElements.candidatesContainer.appendChild(sectionElement);
            
            // Store reference for later filtering
            this.components.partySections.set(partyName, partySection);
        });
    }
    
    handleSearch(query) {
        if (!query || !query.trim()) {
            // Reset to show all candidates
            this.filteredCandidates = [...this.candidates];
            this.renderCandidates();
            return;
        }
        
        const searchTerm = query.toLowerCase().trim();
        
        // Filter candidates
        this.filteredCandidates = window.DataService.filterCandidates(this.candidates, searchTerm);
        
        if (this.filteredCandidates.length === 0) {
            this.showNoResultsState(searchTerm);
        } else {
            this.renderCandidates(this.filteredCandidates);
            
            // Update stats to show filtered results
            this.updateFilteredStats();
        }
    }
    
    updateFilteredStats() {
        const filteredStats = window.DataService.calculateStats(this.filteredCandidates);
        const totalStats = window.DataService.calculateStats(this.candidates);
        
        // Update the stats display to show filtered results
        const totalCandidatesElement = document.getElementById('totalCandidates');
        const totalPartiesElement = document.getElementById('totalParties');
        const totalStatesElement = document.getElementById('totalStates');
        
        if (totalCandidatesElement) {
            totalCandidatesElement.textContent = window.Formatters.formatNumber(filteredStats.totalCandidates);
            if (filteredStats.totalCandidates !== totalStats.totalCandidates) {
                totalCandidatesElement.style.color = 'var(--brand-primary)';
                totalCandidatesElement.title = `Filtered from ${totalStats.totalCandidates} total candidates`;
            }
        }
        
        if (totalPartiesElement) {
            totalPartiesElement.textContent = window.Formatters.formatNumber(filteredStats.totalParties);
            if (filteredStats.totalParties !== totalStats.totalParties) {
                totalPartiesElement.style.color = 'var(--brand-primary)';
            }
        }
        
        if (totalStatesElement) {
            totalStatesElement.textContent = window.Formatters.formatNumber(filteredStats.totalStates);
            if (filteredStats.totalStates !== totalStats.totalStates) {
                totalStatesElement.style.color = 'var(--brand-primary)';
            }
        }
    }
    
    handleCandidateClick(candidate) {
        console.log('Candidate clicked:', candidate.name);
        
        // Show loading state in modal
        this.components.modal.open(candidate);
        
        // Analytics event (optional)
        this.trackEvent('candidate_view', {
            candidate_id: candidate.id,
            candidate_name: candidate.name,
            party: candidate.party
        });
    }
    
    showLoading() {
        if (this.domElements.loadingIndicator) {
            this.domElements.loadingIndicator.style.display = 'flex';
        }
        
        if (this.domElements.candidatesContainer) {
            this.domElements.candidatesContainer.style.opacity = '0.5';
            this.domElements.candidatesContainer.style.pointerEvents = 'none';
        }
    }
    
    hideLoading() {
        if (this.domElements.loadingIndicator) {
            this.domElements.loadingIndicator.style.display = 'none';
        }
        
        if (this.domElements.candidatesContainer) {
            this.domElements.candidatesContainer.style.opacity = '1';
            this.domElements.candidatesContainer.style.pointerEvents = 'auto';
        }
    }
    
    showEmptyState() {
        this.domElements.candidatesContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-state__icon">🇺🇸</div>
                <h3>No Candidates Found</h3>
                <p>There are no presidential candidates in the database.</p>
                <button class="btn btn-primary" onclick="app.refreshData()">
                    Refresh Data
                </button>
            </div>
        `;
    }
    
    showNoResultsState(searchTerm) {
        this.domElements.candidatesContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-state__icon">🔍</div>
                <h3>No Matching Candidates</h3>
                <p>No candidates found for "<strong>${this.escapeHtml(searchTerm)}</strong>"</p>
                <div class="empty-state__actions">
                    <button class="btn btn-secondary" onclick="app.components.searchBox.clear()">
                        Clear Search
                    </button>
                    <button class="btn btn-primary" onclick="app.refreshData()">
                        Refresh Data
                    </button>
                </div>
            </div>
        `;
    }
    
    showError(message) {
        this.domElements.candidatesContainer.innerHTML = `
            <div class="empty-state error-state">
                <div class="empty-state__icon">⚠️</div>
                <h3>Something Went Wrong</h3>
                <p>${message}</p>
                <div class="empty-state__actions">
                    <button class="btn btn-primary" onclick="app.init()">
                        Try Again
                    </button>
                    <button class="btn btn-secondary" onclick="app.useOfflineData()">
                        Use Demo Data
                    </button>
                </div>
            </div>
        `;
    }
    
    async refreshData() {
        try {
            this.showLoading();
            await this.loadData();
            this.render();
            this.components.searchBox.clear();
        } catch (error) {
            console.error('Error refreshing data:', error);
            this.showError('Failed to refresh data. Please try again.');
        } finally {
            this.hideLoading();
        }
    }
    
    useOfflineData() {
        // Use mock data for offline demonstration
        this.candidates = window.S3Service.getMockCandidates();
        this.filteredCandidates = [...this.candidates];
        this.partyGroups = window.DataService.groupCandidatesByParty(this.candidates);
        
        this.render();
        this.components.searchBox.clear();
        
        console.log('Using offline demo data');
    }
    
    bindGlobalEvents() {
        // Window resize handling
        window.addEventListener('resize', window.DebounceUtils.debounce(() => {
            this.handleResize();
        }, 250));
        
        // Online/offline detection
        window.addEventListener('online', () => {
            this.handleOnlineStatusChange(true);
        });
        
        window.addEventListener('offline', () => {
            this.handleOnlineStatusChange(false);
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });
    }
    
    handleResize() {
        // Add any responsive behavior here
        console.log('Window resized - updating layout if needed');
    }
    
    handleOnlineStatusChange(isOnline) {
        const statusElement = document.createElement('div');
        statusElement.className = `network-status ${isOnline ? 'network-online' : 'network-offline'}`;
        statusElement.innerHTML = `
            <span>${isOnline ? '✅ Online' : '⚠️ Offline'}</span>
        `;
        
        // Remove existing status
        const existingStatus = document.querySelector('.network-status');
        if (existingStatus) {
            existingStatus.remove();
        }
        
        document.body.appendChild(statusElement);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            statusElement.remove();
        }, 3000);
        
        if (isOnline) {
            console.log('Back online - data should be fresh');
        } else {
            console.warn('Offline - using cached data');
        }
    }
    
    handleKeyboardShortcuts(e) {
        // Ctrl/Cmd + K to focus search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            this.components.searchBox.focus();
        }
        
        // Forward slash to focus search
        if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
            const activeElement = document.activeElement;
            if (!activeElement || (activeElement.tagName !== 'INPUT' && activeElement.tagName !== 'TEXTAREA')) {
                e.preventDefault();
                this.components.searchBox.focus();
            }
        }
    }
    
    trackEvent(eventName, properties = {}) {
        // Simple analytics tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, properties);
        }
        
        console.log(`Analytics: ${eventName}`, properties);
    }
    
    escapeHtml(unsafe) {
        if (!unsafe) return '';
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
    
    // Public API methods
    getCandidates() {
        return [...this.candidates];
    }
    
    getCandidateById(candidateId) {
        return this.candidates.find(candidate => candidate.id === candidateId);
    }
    
    searchCandidates(query) {
        this.components.searchBox.clear();
        this.components.searchBox.inputElement.value = query;
        this.handleSearch(query);
    }
    
    // Cleanup method
    destroy() {
        // Clean up components
        Object.values(this.components).forEach(component => {
            if (component && typeof component.destroy === 'function') {
                component.destroy();
            }
        });
        
        // Remove event listeners
        window.removeEventListener('resize', this.handleResize);
        window.removeEventListener('online', this.handleOnlineStatusChange);
        window.removeEventListener('offline', this.handleOnlineStatusChange);
        document.removeEventListener('keydown', this.handleKeyboardShortcuts);
        
        console.log('Know Your Leader app destroyed');
    }
}

// CSS for network status
const networkStatusCSS = `
    .network-status {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 10px 16px;
        border-radius: 8px;
        font-weight: 600;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideInRight 0.3s ease-out;
    }
    
    .network-online {
        background: #10b981;
        color: white;
    }
    
    .network-offline {
        background: #f59e0b;
        color: white;
    }
    
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .empty-state__icon {
        font-size: 4rem;
        margin-bottom: 1rem;
    }
    
    .empty-state__actions {
        display: flex;
        gap: 12px;
        margin-top: 20px;
        justify-content: center;
        flex-wrap: wrap;
    }
    
    .error-state {
        border-left: 4px solid var(--error);
    }
    
    .btn {
        padding: 10px 20px;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.2s ease;
    }
    
    .btn-primary {
        background: var(--brand-primary);
        color: white;
    }
    
    .btn-primary:hover {
        background: var(--primary-blue);
        transform: translateY(-1px);
    }
    
    .btn-secondary {
        background: var(--gray-100);
        color: var(--text-dark);
        border: 1px solid var(--border-color);
    }
    
    .btn-secondary:hover {
        background: var(--gray-200);
    }
    
    .btn-outline {
        background: transparent;
        color: var(--brand-primary);
        border: 1px solid var(--brand-primary);
    }
`;

// Add network status CSS to document
const styleSheet = document.createElement('style');
styleSheet.textContent = networkStatusCSS;
document.head.appendChild(styleSheet);

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new KnowYourLeaderApp();
});

// Export for module systems (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = KnowYourLeaderApp;
}