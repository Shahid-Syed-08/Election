// Enhanced Navigation Functions
function navigateTo(page) {
    // Show loading state
    const appContent = document.getElementById('appContent');
    if (appContent) {
        appContent.innerHTML = `
            <div class="min-h-[400px] flex items-center justify-center">
                <div class="text-center">
                    <div class="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p class="text-gray-600">Loading ${page.replace('-', ' ')}...</p>
                </div>
            </div>
        `;
    }
    
    // Navigate to page
    window.location.href = page;
}

// Add click handlers to all feature cards
document.addEventListener('DOMContentLoaded', function() {
    // Add click handlers to feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', function() {
            const page = this.getAttribute('data-page');
            if (page) {
                navigateTo(page);
            }
        });
    });

    // Initialize lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Update clock
    function updateClock() {
        const now = new Date();
        const timeElement = document.getElementById('currentTime');
        if (timeElement) {
            timeElement.textContent = now.toLocaleString('en-IN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            });
        }
    }
    setInterval(updateClock, 1000);
    updateClock();
});
