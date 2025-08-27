// Mobile Navigation Component
class MobileNavigation {
    constructor() {
        this.isOpen = false;
        this.init();
    }

    init() {
        // Create mobile navigation HTML
        this.createMobileNav();
        
        // Add event listeners
        this.addEventListeners();
        
        // Handle resize events
        window.addEventListener('resize', () => this.handleResize());
    }

    createMobileNav() {
        const nav = document.querySelector('.nav-gradient');
        if (!nav) return;

        // Create mobile menu button
        const mobileMenuBtn = document.createElement('button');
        mobileMenuBtn.className = 'md:hidden flex items-center p-2 text-white hover:bg-white/20 rounded-lg transition-colors';
        mobileMenuBtn.innerHTML = `
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
        `;
        mobileMenuBtn.id = 'mobileMenuBtn';

        // Create mobile menu container
        const mobileMenu = document.createElement('div');
        mobileMenu.className = 'md:hidden fixed inset-0 bg-black/50 z-50 hidden';
        mobileMenu.id = 'mobileMenu';
        mobileMenu.innerHTML = `
            <div class="bg-white h-full w-80 max-w-full shadow-xl transform transition-transform duration-300 ease-in-out">
                <div class="flex items-center justify-between p-4 border-b">
                    <h3 class="text-lg font-semibold text-gray-900">Menu</h3>
                    <button id="closeMobileMenu" class="p-2 text-gray-500 hover:text-gray-700">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
                <div class="p-4 space-y-2" id="mobileMenuItems">
                    <!-- Menu items will be populated here -->
                </div>
            </div>
        `;

        // Insert mobile menu button
        const navContainer = nav.querySelector('.max-w-7xl');
        if (navContainer) {
            const flexContainer = navContainer.querySelector('.flex');
            if (flexContainer) {
                flexContainer.appendChild(mobileMenuBtn);
            }
        }

        // Insert mobile menu
        document.body.appendChild(mobileMenu);

        // Populate mobile menu items
        this.populateMobileMenu();
    }

    populateMobileMenu() {
        const mobileMenuItems = document.getElementById('mobileMenuItems');
        if (!mobileMenuItems) return;

        const navLinks = document.querySelectorAll('.nav-link');
        const menuItems = [];

        navLinks.forEach(link => {
            const icon = link.querySelector('i')?.cloneNode(true);
            const text = link.querySelector('span')?.textContent || link.textContent.trim();
            const href = link.getAttribute('href');

            if (icon && text && href) {
                menuItems.push({
                    icon: icon.outerHTML,
                    text: text,
                    href: href
                });
            }
        });

        // Add additional mobile-specific items
        menuItems.push(
            { icon: '<i data-lucide="user-plus" class="w-5 h-5"></i>', text: 'Sign Up', href: 'register.html' }
        );

        // Render menu items
        mobileMenuItems.innerHTML = menuItems.map(item => `
            <a href="${item.href}" class="flex items-center space-x-3 p-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                ${item.icon}
                <span class="font-medium">${item.text}</span>
            </a>
        `).join('');

        // Initialize Lucide icons in mobile menu
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }

    addEventListeners() {
        // Mobile menu toggle
        document.addEventListener('click', (e) => {
            if (e.target.closest('#mobileMenuBtn')) {
                this.toggleMobileMenu();
            }
            if (e.target.closest('#closeMobileMenu')) {
                this.closeMobileMenu();
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            const mobileMenu = document.getElementById('mobileMenu');
            if (mobileMenu && !mobileMenu.contains(e.target) && !e.target.closest('#mobileMenuBtn')) {
                this.closeMobileMenu();
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeMobileMenu();
            }
        });
    }

    toggleMobileMenu() {
        const mobileMenu = document.getElementById('mobileMenu');
        if (!mobileMenu) return;

        if (this.isOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }

    openMobileMenu() {
        const mobileMenu = document.getElementById('mobileMenu');
        if (!mobileMenu) return;

        mobileMenu.classList.remove('hidden');
        this.isOpen = true;
        document.body.style.overflow = 'hidden';
    }

    closeMobileMenu() {
        const mobileMenu = document.getElementById('mobileMenu');
        if (!mobileMenu) return;

        mobileMenu.classList.add('hidden');
        this.isOpen = false;
        document.body.style.overflow = '';
    }

    handleResize() {
        if (window.innerWidth >= 768 && this.isOpen) {
            this.closeMobileMenu();
        }
    }
}

// Initialize mobile navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MobileNavigation();
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MobileNavigation;
}
