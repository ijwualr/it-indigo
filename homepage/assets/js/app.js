document.addEventListener("DOMContentLoaded", function() {
    // Get the loading screen element
    const loadingScreen = document.querySelector('.transition-container');
    
    // Check if the loading screen is visible
    if (loadingScreen) {
        // Initially show the loading screen
        loadingScreen.classList.add('show');

        // Set a timeout to simulate a loading delay
        setTimeout(function() {
            loadingScreen.classList.remove('show');
        }, 3000); // Adjust the delay as needed

        // Detect when the user navigates back
        window.onpageshow = function(event) {
            if (event.persisted) {
                // When coming back to the page (cached page load), hide the loading screen
                loadingScreen.classList.remove('show');
            }
        };

        // Handle back button on mobile
        window.onpopstate = function() {
            // Hide the loading screen
            loadingScreen.classList.remove('show');
        };
    }
});
