// know-your-leader/components/CandidateCard/CandidateCard.js
class CandidateCard {
    constructor(candidateData, options = {}) {
        this.candidate = candidateData;
        this.options = {
            showPartyColor: true,
            interactive: true,
            compact: false,
            ...options
        };
        
        this.onClick = null;
        this.element = null;
    }
    
    render() {
        const cardElement = document.createElement(this.options.interactive ? 'button' : 'div');
        cardElement.className = this.getClassNames();
        cardElement.innerHTML = this.getTemplate();
        
        if (this.options.interactive) {
            cardElement.addEventListener('click', () => this.handleClick());
            cardElement.setAttribute('role', 'button');
            cardElement.setAttribute('tabindex', '0');
            cardElement.setAttribute('aria-label', `View details for ${this.candidate.name}`);
            
            // Add keyboard support
            cardElement.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.handleClick();
                }
            });
        }
        
        this.element = cardElement;
        return cardElement;
    }
    
    getClassNames() {
        const classes = ['candidate-card'];
        
        if (this.options.compact) {
            classes.push('candidate-card--compact');
        }
        
        if (this.options.showPartyColor) {
            const partyClass = this.getPartyClass();
            if (partyClass) {
                classes.push(partyClass);
            }
        }
        
        return classes.join(' ');
    }
    
    getPartyClass() {
        if (!this.candidate.party) return '';
        
        const party = this.candidate.party.toUpperCase().replace(/\s+/g, '-');
        return `candidate-card--${party}`;
    }
    
    getTemplate() {
        const { candidate } = this;
        
        return `
            <div class="candidate-card__content">
                <div class="candidate-card__header">
                    <h3 class="candidate-name">${this.escapeHtml(candidate.name)}</h3>
                    ${this.getPartyBadge()}
                </div>
                
                <div class="candidate-card__details">
                    <div class="candidate-info">
                        <span class="candidate-info__icon">📍</span>
                        <span class="candidate-info__text">${candidate.state || 'US'}</span>
                    </div>
                    
                    <div class="candidate-info">
                        <span class="candidate-info__icon">🗳️</span>
                        <span class="candidate-info__text">${candidate.office || 'President'}</span>
                    </div>
                    
                    <div class="candidate-info">
                        <span class="candidate-info__icon">📅</span>
                        <span class="candidate-info__text">${candidate.electionCycles || '2024'}</span>
                    </div>
                </div>
                
                <div class="candidate-card__footer">
                    <div class="candidate-id">ID: ${candidate.id}</div>
                    ${this.getStatusBadge()}
                </div>
            </div>
            
            ${this.options.interactive ? `
                <div class="candidate-card__hover">
                    <span>View Details →</span>
                </div>
            ` : ''}
        `;
    }
    
    getPartyBadge() {
        if (!this.candidate.party) return '';
        
        const partyColor = window.AppConstants.PARTY_COLORS[this.candidate.party.toUpperCase()] || '#6b7280';
        
        return `
            <div class="party-badge" style="--party-color: ${partyColor}">
                ${this.candidate.party}
            </div>
        `;
    }
    
    getStatusBadge() {
        if (!this.candidate.status) return '';
        
        const status = this.candidate.status.toLowerCase();
        const statusClass = `status-badge status-badge--${status}`;
        const statusText = window.Formatters.capitalizeWords(status);
        
        return `<div class="${statusClass}">${statusText}</div>`;
    }
    
    handleClick() {
        if (this.onClick && typeof this.onClick === 'function') {
            this.onClick(this.candidate);
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
    
    update(candidateData) {
        this.candidate = { ...this.candidate, ...candidateData };
        if (this.element) {
            const newElement = this.render();
            this.element.replaceWith(newElement);
            this.element = newElement;
        }
    }
    
    highlight(searchTerm) {
        if (!this.element || !searchTerm) return;
        
        const nameElement = this.element.querySelector('.candidate-name');
        if (nameElement) {
            const name = this.candidate.name;
            const regex = new RegExp(`(${this.escapeRegex(searchTerm)})`, 'gi');
            const highlighted = name.replace(regex, '<mark>$1</mark>');
            nameElement.innerHTML = highlighted;
        }
    }
    
    escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    
    destroy() {
        if (this.element) {
            this.element.removeEventListener('click', this.handleClick);
            this.element.remove();
            this.element = null;
        }
        this.onClick = null;
    }
}

// Export for global access
window.CandidateCard = CandidateCard;