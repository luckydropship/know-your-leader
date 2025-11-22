// know-your-leader/components/PartySection/PartySection.js
class PartySection {
    constructor(partyName, candidates, options = {}) {
        this.partyName = partyName;
        this.candidates = candidates || [];
        this.options = {
            collapsible: false,
            initiallyCollapsed: false,
            showCount: true,
            ...options
        };
        
        this.isCollapsed = this.options.initiallyCollapsed;
        this.onCandidateClick = null;
        this.element = null;
        this.candidateCards = [];
    }
    
    render() {
        const sectionElement = document.createElement('div');
        sectionElement.className = this.getClassNames();
        sectionElement.innerHTML = this.getTemplate();
        
        this.element = sectionElement;
        this.renderCandidates();
        this.bindEvents();
        
        return sectionElement;
    }
    
    getClassNames() {
        const classes = ['party-section'];
        
        if (this.options.collapsible) {
            classes.push('party-section--collapsible');
        }
        
        if (this.isCollapsed) {
            classes.push('party-section--collapsed');
        }
        
        // Add party-specific class for styling
        const partyClass = this.partyName.toLowerCase().replace(/\s+/g, '-');
        classes.push(`party-section--${partyClass}`);
        
        return classes.join(' ');
    }
    
    getTemplate() {
        const candidateCount = this.candidates.length;
        const countText = this.options.showCount ? ` (${candidateCount} candidate${candidateCount !== 1 ? 's' : ''})` : '';
        
        return `
            <div class="party-section__header">
                <h2 class="party-title">
                    ${this.escapeHtml(this.partyName)}${countText}
                </h2>
                ${this.getCollapseButton()}
            </div>
            <div class="party-section__content">
                <div class="candidates-grid" id="candidatesGrid-${this.getPartyId()}">
                    <!-- Candidate cards will be rendered here -->
                </div>
            </div>
        `;
    }
    
    getCollapseButton() {
        if (!this.options.collapsible) return '';
        
        const icon = this.isCollapsed ? '▶' : '▼';
        const label = this.isCollapsed ? 'Expand' : 'Collapse';
        
        return `
            <button class="collapse-toggle" aria-label="${label} section">
                <span class="collapse-icon">${icon}</span>
            </button>
        `;
    }
    
    getPartyId() {
        return this.partyName.toLowerCase().replace(/\s+/g, '-');
    }
    
    renderCandidates() {
        const gridElement = this.element.querySelector(`#candidatesGrid-${this.getPartyId()}`);
        if (!gridElement) return;
        
        // Clear existing cards
        this.candidateCards.forEach(card => card.destroy());
        this.candidateCards = [];
        
        gridElement.innerHTML = '';
        
        if (this.candidates.length === 0) {
            gridElement.innerHTML = this.getEmptyState();
            return;
        }
        
        this.candidates.forEach(candidate => {
            const card = new window.CandidateCard(candidate, {
                interactive: true,
                showPartyColor: false // Party color is handled by the section
            });
            
            card.onClick = (candidateData) => {
                if (this.onCandidateClick) {
                    this.onCandidateClick(candidateData);
                }
            };
            
            const cardElement = card.render();
            gridElement.appendChild(cardElement);
            this.candidateCards.push(card);
        });
    }
    
    getEmptyState() {
        return `
            <div class="empty-candidates">
                <p>No candidates found for ${this.partyName}</p>
            </div>
        `;
    }
    
    bindEvents() {
        if (this.options.collapsible) {
            const toggleButton = this.element.querySelector('.collapse-toggle');
            if (toggleButton) {
                toggleButton.addEventListener('click', () => this.toggleCollapse());
            }
        }
    }
    
    toggleCollapse() {
        this.isCollapsed = !this.isCollapsed;
        
        if (this.element) {
            if (this.isCollapsed) {
                this.element.classList.add('party-section--collapsed');
            } else {
                this.element.classList.remove('party-section--collapsed');
            }
            
            // Update collapse button icon
            const iconElement = this.element.querySelector('.collapse-icon');
            if (iconElement) {
                iconElement.textContent = this.isCollapsed ? '▶' : '▼';
            }
            
            // Update ARIA label
            const buttonElement = this.element.querySelector('.collapse-toggle');
            if (buttonElement) {
                const label = this.isCollapsed ? 'Expand' : 'Collapse';
                buttonElement.setAttribute('aria-label', `${label} section`);
            }
        }
    }
    
    updateCandidates(newCandidates) {
        this.candidates = newCandidates || [];
        
        if (this.element) {
            // Update count in title
            const titleElement = this.element.querySelector('.party-title');
            if (titleElement && this.options.showCount) {
                const countText = ` (${this.candidates.length} candidate${this.candidates.length !== 1 ? 's' : ''})`;
                titleElement.innerHTML = `${this.escapeHtml(this.partyName)}${countText}`;
            }
            
            // Re-render candidates
            this.renderCandidates();
        }
    }
    
    filterCandidates(searchTerm) {
        if (!searchTerm) {
            // Show all candidates when no search term
            this.candidateCards.forEach(card => {
                card.element.style.display = 'block';
            });
            return;
        }
        
        let visibleCount = 0;
        
        this.candidateCards.forEach(card => {
            const candidate = card.candidate;
            const matches = 
                candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (candidate.party && candidate.party.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (candidate.state && candidate.state.toLowerCase().includes(searchTerm.toLowerCase())) ||
                candidate.id.toLowerCase().includes(searchTerm.toLowerCase());
            
            if (matches) {
                card.element.style.display = 'block';
                card.highlight(searchTerm);
                visibleCount++;
            } else {
                card.element.style.display = 'none';
            }
        });
        
        // Update section visibility
        if (this.element) {
            if (visibleCount === 0) {
                this.element.style.display = 'none';
            } else {
                this.element.style.display = 'block';
                
                // Update count in title
                const titleElement = this.element.querySelector('.party-title');
                if (titleElement && this.options.showCount) {
                    const countText = ` (${visibleCount} candidate${visibleCount !== 1 ? 's' : ''})`;
                    titleElement.innerHTML = `${this.escapeHtml(this.partyName)}${countText}`;
                }
            }
        }
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
    
    destroy() {
        this.candidateCards.forEach(card => card.destroy());
        this.candidateCards = [];
        
        if (this.element) {
            this.element.remove();
            this.element = null;
        }
        
        this.onCandidateClick = null;
    }
}

// Export for global access
window.PartySection = PartySection;