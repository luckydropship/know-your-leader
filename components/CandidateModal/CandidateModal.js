// know-your-leader/components/CandidateModal/CandidateModal.js
class CandidateModal {
    constructor(containerId, options = {}) {
        this.containerId = containerId;
        this.options = {
            animationDuration: 300,
            closeOnOverlayClick: true,
            closeOnEscape: true,
            ...options
        };
        
        this.isOpen = false;
        this.currentCandidate = null;
        this.onClose = null;
        this.container = null;
        this.modalElement = null;
        
        this.init();
    }
    
    init() {
        this.render();
        this.bindEvents();
    }
    
    render() {
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error(`Container with id '${this.containerId}' not found`);
            return;
        }
        
        container.innerHTML = this.getTemplate();
        this.container = container;
        this.modalElement = container.querySelector('.modal');
    }
    
    getTemplate() {
        return `
            <div class="modal" id="candidateModal" aria-hidden="true" role="dialog" aria-modal="true">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2 id="modalCandidateName">Candidate Details</h2>
                        <button class="close" id="closeModal" aria-label="Close modal">
                            &times;
                        </button>
                    </div>
                    
                    <div class="modal-body">
                        <div class="candidate-overview">
                            <div class="candidate-details" id="candidateDetails">
                                <!-- Candidate details will be populated here -->
                            </div>
                            
                            <div class="candidate-summary" id="candidateSummary">
                                <!-- Summary stats will be populated here -->
                            </div>
                        </div>
                        
                        <div class="donations-section">
                            <div class="section-header">
                                <h3>Campaign Donations</h3>
                                <div class="donation-stats" id="donationStats"></div>
                            </div>
                            
                            <div class="loading-state" id="donationsLoading">
                                <div class="spinner"></div>
                                <p>Loading donation data...</p>
                            </div>
                            
                            <div id="donationsList" class="donations-list"></div>
                            
                            <div class="no-donations" id="noDonations" style="display: none;">
                                <p>No donation data available for this candidate.</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="modal-footer">
                        <button class="btn btn-secondary" id="closeButton">Close</button>
                        <button class="btn btn-primary" id="viewFullReport" style="display: none;">
                            View Full Report
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    bindEvents() {
        // Close button events
        const closeButton = this.modalElement.querySelector('#closeModal');
        const closeBtn = this.modalElement.querySelector('#closeButton');
        
        if (closeButton) {
            closeButton.addEventListener('click', () => this.close());
        }
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }
        
        // Overlay click
        if (this.options.closeOnOverlayClick) {
            this.modalElement.addEventListener('click', (e) => {
                if (e.target === this.modalElement) {
                    this.close();
                }
            });
        }
        
        // Escape key
        if (this.options.closeOnEscape) {
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isOpen) {
                    this.close();
                }
            });
        }
        
        // Trap focus inside modal
        this.modalElement.addEventListener('keydown', (e) => {
            if (e.key === 'Tab' && this.isOpen) {
                this.trapFocus(e);
            }
        });
    }
    
    trapFocus(e) {
        const focusableElements = this.modalElement.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                lastElement.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === lastElement) {
                firstElement.focus();
                e.preventDefault();
            }
        }
    }
    
    async open(candidateData) {
        if (!candidateData) {
            console.error('No candidate data provided');
            return;
        }
        
        this.currentCandidate = candidateData;
        this.isOpen = true;
        
        this.updateModalContent(candidateData);
        this.show();
        
        // Load donation data
        await this.loadDonationData(candidateData.id);
        
        // Set focus to modal
        this.modalElement.focus();
    }
    
    close() {
        this.isOpen = false;
        this.hide();
        this.currentCandidate = null;
        
        if (this.onClose && typeof this.onClose === 'function') {
            this.onClose();
        }
    }
    
    show() {
        if (this.modalElement) {
            this.modalElement.style.display = 'block';
            this.modalElement.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            
            // Add animation class
            setTimeout(() => {
                this.modalElement.classList.add('modal--visible');
            }, 10);
        }
    }
    
    hide() {
        if (this.modalElement) {
            this.modalElement.classList.remove('modal--visible');
            
            setTimeout(() => {
                this.modalElement.style.display = 'none';
                this.modalElement.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = 'auto';
            }, this.options.animationDuration);
        }
    }
    
    updateModalContent(candidate) {
        // Update candidate name
        const nameElement = this.modalElement.querySelector('#modalCandidateName');
        if (nameElement) {
            nameElement.textContent = candidate.name;
        }
        
        // Update candidate details
        const detailsElement = this.modalElement.querySelector('#candidateDetails');
        if (detailsElement) {
            detailsElement.innerHTML = this.getCandidateDetailsHTML(candidate);
        }
        
        // Update candidate summary
        const summaryElement = this.modalElement.querySelector('#candidateSummary');
        if (summaryElement) {
            summaryElement.innerHTML = this.getCandidateSummaryHTML(candidate);
        }
    }
    
    getCandidateDetailsHTML(candidate) {
        return `
            <div class="detail-item">
                <span class="detail-label">Party Affiliation</span>
                <span class="detail-value">${candidate.party || 'N/A'}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Home State</span>
                <span class="detail-value">${candidate.state || 'N/A'}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Election Cycles</span>
                <span class="detail-value">${candidate.electionCycles || '2024'}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Candidate ID</span>
                <span class="detail-value">${candidate.id || 'N/A'}</span>
            </div>
            ${candidate.office ? `
                <div class="detail-item">
                    <span class="detail-label">Office</span>
                    <span class="detail-value">${candidate.office}</span>
                </div>
            ` : ''}
            ${candidate.status ? `
                <div class="detail-item">
                    <span class="detail-label">Status</span>
                    <span class="detail-value status-${candidate.status.toLowerCase()}">
                        ${window.Formatters.capitalizeWords(candidate.status)}
                    </span>
                </div>
            ` : ''}
        `;
    }
    
    getCandidateSummaryHTML(candidate) {
        // This would be populated with actual summary data
        // For now, we'll show placeholder content
        return `
            <div class="summary-item">
                <span class="summary-label">Campaign Status</span>
                <span class="summary-value">Active</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Data Last Updated</span>
                <span class="summary-value">${window.Formatters.formatDate(new Date().toISOString())}</span>
            </div>
        `;
    }
    
    async loadDonationData(candidateId) {
        const loadingElement = this.modalElement.querySelector('#donationsLoading');
        const donationsList = this.modalElement.querySelector('#donationsList');
        const noDonationsElement = this.modalElement.querySelector('#noDonations');
        const donationStatsElement = this.modalElement.querySelector('#donationStats');
        
        // Show loading state
        loadingElement.style.display = 'flex';
        donationsList.style.display = 'none';
        noDonationsElement.style.display = 'none';
        donationStatsElement.innerHTML = '';
        
        try {
            const donations = await window.S3Service.getCandidateDonations(candidateId);
            
            // Hide loading
            loadingElement.style.display = 'none';
            
            if (donations && donations.length > 0) {
                this.displayDonations(donations);
                this.updateDonationStats(donations);
                donationsList.style.display = 'block';
            } else {
                noDonationsElement.style.display = 'block';
            }
            
        } catch (error) {
            console.error('Error loading donation data:', error);
            loadingElement.style.display = 'none';
            noDonationsElement.innerHTML = `
                <p>Unable to load donation data at this time.</p>
                <button class="btn btn-outline" onclick="window.candidateModal.loadDonationData('${candidateId}')">
                    Try Again
                </button>
            `;
            noDonationsElement.style.display = 'block';
        }
    }
    
    displayDonations(donations) {
        const donationsList = this.modalElement.querySelector('#donationsList');
        
        const donationsHTML = donations.map(donation => `
            <div class="donation-item">
                <div class="donation-header">
                    <span class="donation-amount">${window.Formatters.formatCurrency(donation.amount)}</span>
                    <span class="donation-date">${window.Formatters.formatDate(donation.date)}</span>
                </div>
                <div class="donation-details">
                    <span class="donor-name">${donation.donorName || 'Anonymous'}</span>
                    <span class="donation-type">${donation.type || 'Individual'}</span>
                </div>
                ${donation.employer ? `
                    <div class="donation-employer">
                        <strong>Employer:</strong> ${donation.employer}
                        ${donation.occupation ? ` | <strong>Occupation:</strong> ${donation.occupation}` : ''}
                    </div>
                ` : ''}
                ${donation.donorCity ? `
                    <div class="donor-location">
                        ${donation.donorCity}${donation.donorState ? `, ${donation.donorState}` : ''}
                    </div>
                ` : ''}
            </div>
        `).join('');
        
        donationsList.innerHTML = donationsHTML;
    }
    
    updateDonationStats(donations) {
        const donationStatsElement = this.modalElement.querySelector('#donationStats');
        
        const totalDonations = donations.length;
        const totalAmount = donations.reduce((sum, donation) => sum + (donation.amount || 0), 0);
        const averageDonation = totalAmount / totalDonations;
        const maxDonation = Math.max(...donations.map(d => d.amount || 0));
        
        donationStatsElement.innerHTML = `
            <div class="stat">
                <span class="stat-value">${window.Formatters.formatCurrency(totalAmount)}</span>
                <span class="stat-label">Total Raised</span>
            </div>
            <div class="stat">
                <span class="stat-value">${totalDonations}</span>
                <span class="stat-label">Total Donations</span>
            </div>
            <div class="stat">
                <span class="stat-value">${window.Formatters.formatCurrency(averageDonation)}</span>
                <span class="stat-label">Average Donation</span>
            </div>
        `;
    }
    
    destroy() {
        if (this.modalElement) {
            this.modalElement.remove();
            this.modalElement = null;
        }
        this.container = null;
        this.onClose = null;
    }
}

// Export for global access
window.CandidateModal = CandidateModal;

// Initialize global modal instance
window.candidateModal = new CandidateModal('candidateModalRoot');