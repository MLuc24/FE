// Shared JavaScript functionality for EduCRM Application

// Global variables
let currentRole = 'sales';
let sidebarCollapsed = false;
let aiPanelExpanded = false;

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeSidebar();
    initializeAIPanel();
    showToast('Welcome to EduCRM! Select your role to get started.', 'info');
});

// Navigation functions
function initializeNavigation() {
    const roleSwitch = document.getElementById('roleSwitch');
    const navItems = document.querySelectorAll('.nav-item');
    
    if (roleSwitch) {
        roleSwitch.addEventListener('change', function() {
            currentRole = this.value;
            updateNavigation();
        });
    }

    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href !== '#') {
                // Allow normal navigation for actual links
                return;
            }
            
            e.preventDefault();
            const page = this.dataset.page;
            if (page) {
                showPage(page);
                updateActiveNav(this);
            }
        });
    });
}

function updateNavigation() {
    const roleNavs = document.querySelectorAll('.role-nav');
    roleNavs.forEach(nav => nav.classList.add('hidden'));
    
    const activeNav = document.getElementById(`${currentRole}-nav`);
    if (activeNav) {
        activeNav.classList.remove('hidden');
    }
    
    // Update main content based on role
    updateMainContent();
}

function updateMainContent() {
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;
    
    const roleDescriptions = {
        'marketing': {
            title: 'Marketing Dashboard',
            description: 'Manage campaigns, lead generation, and nurturing workflows',
            color: 'from-purple-500 to-pink-600'
        },
        'sales': {
            title: 'Sales Dashboard',
            description: 'Manage leads, discovery sessions, and sales pipeline',
            color: 'from-blue-500 to-indigo-600'
        },
        'sales-manager': {
            title: 'Sales Management Dashboard',
            description: 'Team analytics, performance tracking, and sales strategy',
            color: 'from-green-500 to-emerald-600'
        },
        'academic': {
            title: 'Academic Dashboard',
            description: 'Student management and academic planning',
            color: 'from-indigo-500 to-purple-600'
        },
        'accounting': {
            title: 'Financial Dashboard',
            description: 'Revenue tracking, billing, and financial reports',
            color: 'from-emerald-500 to-teal-600'
        }
    };
    
    const roleInfo = roleDescriptions[currentRole];
    if (roleInfo) {
        const welcomeSection = mainContent.querySelector('.bg-gradient-to-r');
        if (welcomeSection) {
            welcomeSection.className = `bg-gradient-to-r ${roleInfo.color} rounded-lg p-6 text-white mb-6`;
            welcomeSection.querySelector('h1').textContent = roleInfo.title;
            welcomeSection.querySelector('p').textContent = roleInfo.description;
        }
    }
}

function navigateToRole(role) {
    const roleUrls = {
        'marketing': 'marketing.html',
        'sales': 'tvts-dashboard.html',
        'sales-manager': 'sales-manager.html',
        'academic': 'academic.html',
        'accounting': 'accounting.html'
    };
    
    const url = roleUrls[role];
    if (url) {
        window.location.href = url;
    }
}

function showPage(pageId) {
    // Hide all pages
    const pages = document.querySelectorAll('.page-content');
    pages.forEach(page => page.classList.add('hidden'));
    
    // Show selected page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.remove('hidden');
    }
}

function updateActiveNav(activeItem) {
    // Remove active state from all nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('bg-blue-50', 'text-blue-700');
        item.classList.add('hover:bg-gray-100');
    });
    
    // Add active state to clicked item
    activeItem.classList.add('bg-blue-50', 'text-blue-700');
    activeItem.classList.remove('hover:bg-gray-100');
}

// Sidebar functions
function initializeSidebar() {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', function() {
            toggleSidebar();
        });
    }
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebarCollapsed = !sidebarCollapsed;
    
    if (sidebarCollapsed) {
        sidebar.classList.remove('sidebar-expanded');
        sidebar.classList.add('sidebar-collapsed');
    } else {
        sidebar.classList.remove('sidebar-collapsed');
        sidebar.classList.add('sidebar-expanded');
    }
}

// AI Panel functions
function initializeAIPanel() {
    const aiToggle = document.getElementById('aiToggle');
    const aiPanel = document.getElementById('aiPanel');
    
    if (aiToggle && aiPanel) {
        aiToggle.addEventListener('click', function() {
            toggleAIPanel();
        });
    }
}

function toggleAIPanel() {
    const aiPanel = document.getElementById('aiPanel');
    const aiText = aiPanel.querySelector('.ai-text');
    const aiContent = aiPanel.querySelector('.ai-content');
    
    aiPanelExpanded = !aiPanelExpanded;
    
    if (aiPanelExpanded) {
        aiPanel.classList.remove('ai-panel-collapsed');
        aiPanel.classList.add('ai-panel-expanded');
        aiText.classList.remove('hidden');
        aiContent.classList.remove('hidden');
    } else {
        aiPanel.classList.remove('ai-panel-expanded');
        aiPanel.classList.add('ai-panel-collapsed');
        aiText.classList.add('hidden');
        aiContent.classList.add('hidden');
    }
}

// Toast notification system
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    
    const toast = document.createElement('div');
    
    const colors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        warning: 'bg-amber-500',
        info: 'bg-blue-500'
    };
    
    toast.className = `toast ${colors[type]} text-white px-6 py-4 rounded-lg shadow-lg max-w-sm`;
    toast.innerHTML = `
        <div class="flex items-center justify-between">
            <span>${message}</span>
            <button onclick="closeToast(this)" class="ml-4 text-white hover:text-gray-200">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        </div>
    `;
    
    container.appendChild(toast);
    
    // Show toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    // Auto remove toast
    setTimeout(() => {
        closeToast(toast.querySelector('button'));
    }, 5000);
}

function closeToast(button) {
    const toast = button.closest('.toast');
    toast.classList.remove('show');
    setTimeout(() => {
        toast.remove();
    }, 300);
}

// Utility functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

function formatDate(date) {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    }).format(new Date(date));
}

function formatDateTime(date) {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(new Date(date));
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Local storage utilities
function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error('Failed to save to localStorage:', error);
    }
}

function loadFromLocalStorage(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Failed to load from localStorage:', error);
        return null;
    }
}

// Form validation utilities
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\+]?[1-9][\d]{0,15}$/;
    return re.test(phone.replace(/\s/g, ''));
}

function validateRequired(value) {
    return value && value.trim().length > 0;
}

// Export functions for use in other modules
window.EduCRM = {
    showToast,
    formatCurrency,
    formatDate,
    formatDateTime,
    debounce,
    throttle,
    saveToLocalStorage,
    loadFromLocalStorage,
    validateEmail,
    validatePhone,
    validateRequired,
    navigateToRole,
    toggleSidebar,
    toggleAIPanel
};