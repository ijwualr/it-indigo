window.addEventListener("load", () => {
    const loader = document.getElementById("loading-screen");

    // Optional delay so the animation is visible
    setTimeout(() => {
        loader.classList.add("fade-out");
    }, 300);
});
