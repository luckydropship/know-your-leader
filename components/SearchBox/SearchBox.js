// know-your-leader/components/SearchBox/SearchBox.js
class SearchBox {
    constructor(containerId, options = {}) {
        this.containerId = containerId;
        this.options = {
            placeholder: '🔍 Search candidates by name, party, or state...',
            debounceDelay: 300,
            ...options
        };
        
        this.onSearch = null;
        this.container = null;
        this.inputElement = null;
        
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
        this.inputElement = container.querySelector('.search-input');
    }
    
    getTemplate() {
        return `
            <div class="search-box">
                <input 
                    type="text" 
                    class="search-input" 
                    placeholder="${this.options.placeholder}"
                    aria-label="Search candidates"
                >
                <div class="search-info" id="searchInfo"></div>
            </div>
        `;
    }
    
    bindEvents() {
        if (!this.inputElement) return;
        
        const debouncedSearch = window.DebounceUtils.debounce(
            (query) => this.handleSearch(query),
            this.options.debounceDelay
        );
        
        this.inputElement.addEventListener('input', (e) => {
            debouncedSearch(e.target.value);
        });
        
        // Clear search on Escape key
        this.inputElement.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.clear();
            }
        });
    }
    
    handleSearch(query) {
        if (this.onSearch && typeof this.onSearch === 'function') {
            this.onSearch(query);
        }
        
        this.updateSearchInfo(query);
    }
    
    updateSearchInfo(query) {
        const searchInfo = this.container.querySelector('#searchInfo');
        if (!searchInfo) return;
        
        if (query && query.trim()) {
            searchInfo.innerHTML = `
                <div class="search-info-content">
                    <span>Searching for: "${query}"</span>
                    <button class="clear-search" onclick="window.searchBoxComponent.clear()">
                        Clear
                    </button>
                </div>
            `;
            searchInfo.style.display = 'block';
        } else {
            searchInfo.style.display = 'none';
        }
    }
    
    clear() {
        if (this.inputElement) {
            this.inputElement.value = '';
            this.inputElement.focus();
        }
        
        const searchInfo = this.container.querySelector('#searchInfo');
        if (searchInfo) {
            searchInfo.style.display = 'none';
        }
        
        if (this.onSearch) {
            this.onSearch('');
        }
    }
    
    focus() {
        if (this.inputElement) {
            this.inputElement.focus();
        }
    }
    
    setPlaceholder(placeholder) {
        this.options.placeholder = placeholder;
        if (this.inputElement) {
            this.inputElement.placeholder = placeholder;
        }
    }
    
    destroy() {
        if (this.inputElement) {
            this.inputElement.removeEventListener('input', this.handleSearch);
            this.inputElement = null;
        }
        this.container = null;
        this.onSearch = null;
    }
}

// Export for global access
window.SearchBox = SearchBox;