// Navigation specific JavaScript for EduCRM

// Navigation state management
let navigationState = {
    currentPage: 'dashboard',
    breadcrumbs: [],
    history: []
};

// Initialize navigation on page load
document.addEventListener('DOMContentLoaded', function() {
    initializePageNavigation();
    setupBreadcrumbs();
    handleBackButton();
});

function initializePageNavigation() {
    // Get current page from URL
    const currentPath = window.location.pathname;
    const fileName = currentPath.split('/').pop();
    
    // Update active navigation based on current file
    updateActiveNavigationFromFile(fileName);
    
    // Setup role switching
    setupRoleSwitching();
}

function updateActiveNavigationFromFile(fileName) {
    const fileToPageMap = {
        'index.html': 'dashboard',
        'tvts-dashboard.html': 'my-day',
        'leads.html': 'leads',
        'discovery.html': 'discovery',
        'calendar.html': 'calendar',
        'pipeline.html': 'sales-pipeline',
        'proposals.html': 'proposals',
        'sales-manager.html': 'dashboard',
        'team-management.html': 'team-management',
        'reports.html': 'reports-analytics',
        'marketing.html': 'marketing-dashboard',
        'campaigns.html': 'campaigns',
        'nurturing.html': 'nurturing'
    };
    
    const pageId = fileToPageMap[fileName] || 'dashboard';
    navigationState.currentPage = pageId;
    
    // Update active nav item
    updateActiveNavItem(pageId);
}

function updateActiveNavItem(pageId) {
    // Remove active state from all nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('bg-blue-50', 'text-blue-700');
        item.classList.add('text-gray-700');
    });
    
    // Find and activate current nav item
    const activeItem = document.querySelector(`[data-page="${pageId}"]`) || 
                      document.querySelector(`[href*="${pageId}"]`) ||
                      document.querySelector('.nav-item'); // fallback to first item
    
    if (activeItem) {
        activeItem.classList.add('bg-blue-50', 'text-blue-700');
        activeItem.classList.remove('text-gray-700');
    }
}

function setupRoleSwitching() {
    const roleSwitch = document.getElementById('roleSwitch');
    if (!roleSwitch) return;
    
    // Set current role based on current page
    const currentFile = window.location.pathname.split('/').pop();
    const role = determineRoleFromFile(currentFile);
    
    if (role) {
        roleSwitch.value = role;
        currentRole = role;
        updateNavigationVisibility(role);
    }
    
    roleSwitch.addEventListener('change', function() {
        const newRole = this.value;
        navigateToRoleDashboard(newRole);
    });
}

function determineRoleFromFile(fileName) {
    const roleMap = {
        'marketing.html': 'marketing',
        'campaigns.html': 'marketing',
        'nurturing.html': 'marketing',
        'tvts-dashboard.html': 'sales',
        'leads.html': 'sales',
        'discovery.html': 'sales',
        'calendar.html': 'sales',
        'pipeline.html': 'sales',
        'proposals.html': 'sales',
        'sales-manager.html': 'sales-manager',
        'team-management.html': 'sales-manager',
        'reports.html': 'sales-manager',
        'academic.html': 'academic',
        'accounting.html': 'accounting'
    };
    
    return roleMap[fileName] || 'sales';
}

function updateNavigationVisibility(role) {
    // Hide all role navigation sections
    document.querySelectorAll('.role-nav').forEach(nav => {
        nav.classList.add('hidden');
    });
    
    // Show navigation for current role
    const activeNav = document.getElementById(`${role}-nav`);
    if (activeNav) {
        activeNav.classList.remove('hidden');
    }
}

function navigateToRoleDashboard(role) {
    const dashboardUrls = {
        'marketing': 'marketing.html',
        'sales': 'tvts-dashboard.html',
        'sales-manager': 'sales-manager.html',
        'academic': 'academic.html',
        'accounting': 'accounting.html'
    };
    
    const url = dashboardUrls[role];
    if (url && url !== window.location.pathname.split('/').pop()) {
        // Add to history
        navigationState.history.push(window.location.href);
        
        // Navigate to new role dashboard
        window.location.href = url;
    }
}

function setupBreadcrumbs() {
    const breadcrumbContainer = document.getElementById('breadcrumbs');
    if (!breadcrumbContainer) return;
    
    const currentPath = window.location.pathname;
    const fileName = currentPath.split('/').pop();
    
    // Generate breadcrumbs based on current page
    const breadcrumbs = generateBreadcrumbs(fileName);
    renderBreadcrumbs(breadcrumbs, breadcrumbContainer);
}

function generateBreadcrumbs(fileName) {
    const breadcrumbMap = {
        'index.html': [
            { text: 'Home', url: 'index.html' }
        ],
        'tvts-dashboard.html': [
            { text: 'Home', url: 'index.html' },
            { text: 'Sales Dashboard', url: 'tvts-dashboard.html' }
        ],
        'leads.html': [
            { text: 'Home', url: 'index.html' },
            { text: 'Sales', url: 'tvts-dashboard.html' },
            { text: 'Leads', url: 'leads.html' }
        ],
        'discovery.html': [
            { text: 'Home', url: 'index.html' },
            { text: 'Sales', url: 'tvts-dashboard.html' },
            { text: 'Discovery', url: 'discovery.html' }
        ],
        'sales-manager.html': [
            { text: 'Home', url: 'index.html' },
            { text: 'Sales Manager Dashboard', url: 'sales-manager.html' }
        ],
        'marketing.html': [
            { text: 'Home', url: 'index.html' },
            { text: 'Marketing Dashboard', url: 'marketing.html' }
        ]
    };
    
    return breadcrumbMap[fileName] || [{ text: 'Home', url: 'index.html' }];
}

function renderBreadcrumbs(breadcrumbs, container) {
    const breadcrumbHTML = breadcrumbs.map((item, index) => {
        const isLast = index === breadcrumbs.length - 1;
        
        if (isLast) {
            return `<span class="text-gray-500">${item.text}</span>`;
        } else {
            return `
                <a href="${item.url}" class="text-blue-600 hover:text-blue-800">
                    ${item.text}
                </a>
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
            `;
        }
    }).join('');
    
    container.innerHTML = breadcrumbHTML;
}

function handleBackButton() {
    window.addEventListener('popstate', function(event) {
        // Handle browser back button
        if (event.state) {
            // Restore previous state if available
            navigationState = { ...navigationState, ...event.state };
        }
        
        // Update navigation to reflect current page
        const fileName = window.location.pathname.split('/').pop();
        updateActiveNavigationFromFile(fileName);
    });
}

// Navigation utility functions
function goBack() {
    if (navigationState.history.length > 0) {
        const previousUrl = navigationState.history.pop();
        window.location.href = previousUrl;
    } else {
        window.history.back();
    }
}

function goHome() {
    window.location.href = 'index.html';
}

function navigateToPage(url, addToHistory = true) {
    if (addToHistory) {
        navigationState.history.push(window.location.href);
    }
    
    window.location.href = url;
}

// Quick navigation shortcuts
function quickNavigate(destination) {
    const quickLinks = {
        'leads': 'leads.html',
        'discovery': 'discovery.html',
        'calendar': 'calendar.html',
        'pipeline': 'pipeline.html',
        'proposals': 'proposals.html',
        'reports': 'reports.html',
        'dashboard': determineDashboardUrl(),
        'settings': 'settings.html'
    };
    
    const url = quickLinks[destination];
    if (url) {
        navigateToPage(url);
    }
}

function determineDashboardUrl() {
    const role = currentRole || 'sales';
    const dashboardUrls = {
        'marketing': 'marketing.html',
        'sales': 'tvts-dashboard.html',
        'sales-manager': 'sales-manager.html',
        'academic': 'academic.html',
        'accounting': 'accounting.html'
    };
    
    return dashboardUrls[role] || 'tvts-dashboard.html';
}

// Search navigation
function initializeSearch() {
    const searchInput = document.querySelector('input[placeholder*="Search"]');
    if (!searchInput) return;
    
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch(this.value);
        }
    });
    
    // Add search icon click handler
    const searchIcon = searchInput.parentElement.querySelector('svg');
    if (searchIcon) {
        searchIcon.addEventListener('click', function() {
            performSearch(searchInput.value);
        });
    }
}

function performSearch(query) {
    if (!query.trim()) return;
    
    // Navigate to search results or filter current page
    const currentFile = window.location.pathname.split('/').pop();
    
    if (currentFile === 'leads.html') {
        // Filter leads
        filterLeads(query);
    } else if (currentFile === 'pipeline.html') {
        // Filter pipeline
        filterPipeline(query);
    } else {
        // Navigate to general search
        navigateToPage(`search.html?q=${encodeURIComponent(query)}`);
    }
}

// Initialize search on page load
document.addEventListener('DOMContentLoaded', initializeSearch);

// Export navigation functions
window.Navigation = {
    goBack,
    goHome,
    navigateToPage,
    quickNavigate,
    performSearch,
    updateActiveNavItem,
    generateBreadcrumbs
};