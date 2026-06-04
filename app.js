"use strict";           // Forces the browser to run your code strictly, throwing errors for bad practices.

// HEADER



// This grabs all your category navigation links
const navLinks = document.querySelectorAll('.nav-links-item');
const sections = document.querySelectorAll('main section');

// Loops through every navigation link button one by one
navLinks.forEach(link => {
    // Adds an event listener that waits for the user to click that link
    link.addEventListener('click', (event) => {
        // Prevents the default browser action (stops the page from jumping or reloading)
        event.preventDefault();

        //  Step A: Loops through all 4 store sections and adds the 'hidden' class to conceal them
        sections.forEach(section => {
            section.classList.add('hidden');
        });
        
        // Step B: Find the target section ID from the clicked link's href attribute (e.g., "#grocery") and saves it
        // (e.g., if href is "#grocery", targetId becomes "#grocery")
        // This grabs the "#grocery" or "#household" from the link
        const targetSectionId = link.getAttribute('href'); 
        
        // Step C: Open the chosen curtain (find that section and remove 'hidden'). Uses that ID to find the matching section element in your HTML.
        const targetSection = document.querySelector(targetSectionId);
        //  If it successfully finds that section, it removes 'hidden' to make it visible
        if (targetSection) {
            targetSection.classList.remove('hidden');
        }
        
    });
});


// Animated Slider

// Run all initialization logic safely inside a self-contained layout function. Defines the function meant to build and rotate a promotional image slider.
function renderPromoSlider() {
    // Tries to find the active section container using 'categoryName'
    const activeSection = document.getElementById(categoryName) || document.getElementById('all-products');

    // Finds the product grid container inside the active section.
    const gridContainer = activeSection.querySelector('.product-grid');

    // Grabs the slider blueprint from the HTML <template> tag.
    const template = document.getElementById('animated-slider-template');

    // Structural guard safety check: if either container or template is missing, stop running completely.
    if (!gridContainer || !template) return;

    // 1. Clear out placeholder text content & grab a clean template copy. Erases everything inside the gridContainer to make it empty.
    gridContainer.innerHTML = '';
    // Creates a fresh, digital clone of the slider template blueprint.
    const templateClone = template.content.cloneNode(true);

    // 2. Inject the clean slider clone node directly into the gridContainer page layout.
    gridContainer.appendChild(templateClone);

    // 3. Select target slide items ONLY after they are living inside the live DOM canvas. Finds all individual slides inside the slider just created.
    const slides = gridContainer.querySelectorAll('.slide');
    // Starts the counter at index 0 (the first slide).
    let current = 0;

    // Internal navigation logic engine
    function showSlide(index) {
        // Removes the 'active' visibility class from all slides
        slides.forEach((slide) => {
            slide.classList.remove('active');
        });

        // Grabs the specific slide matching our current index number.
        const currentSlide = slides[index];
        // Guard clause in case the slide does not exist.
        if (!currentSlide) return;

        // Makes the single active slide visible.
        currentSlide.classList.add('active');

        // Finds the text caption layer on the slide.
        const caption = currentSlide.querySelector('.caption');
        if (!caption) return;

        // Extracts the CSS animation class (like 'zoom-in' or 'slide-left').
        const animClass = caption.classList[1];
        if (animClass) {
            caption.classList.remove(animClass);
            // Force reflow. Clean browser engine reflow trigger. Without it, the entry animations (zoom-in, slide-left, etc.) would only play once when the page first loads, remaining static on later loops.
            void caption.offsetWidth;
            // Re-triggers the animation from scratch
            caption.classList.add(animClass);
        }
    }

    // Inner function: calculates the next slide number, wrapping back around to 0 at the end.
    function nextSlide() {
        current = (current + 1) % slides.length;
        showSlide(current);
    }

    // Sets a repeating smoothly timer that fires the 'nextSlide' function every 7000 milliseconds (7 seconds) safely.
    setInterval(nextSlide, 7000);
}

// Tells the browser: "As soon as the HTML structure finishes loading, run the slider function".
document.addEventListener('DOMContentLoaded', renderPromoSlider);

// A placeholder function designed to load specific store views when called.
function loadStoreSection(categoryName) {
    // Calls the slider function.
    renderPromoSlider();

    const heading = document.getElementById('all-products-heading');
    if (heading) {
        // Changes heading text dynamically.
        heading.textContent = `${categoryName} Products`;
    }

    // Triggers the product card grid renderer.
    renderPromoGrid(categoryName);
}



//  Footer Year Date. Finds the <span> with ID 'year' in the footer and sets it to the current calendar year.
document.getElementById("year").textContent = new Date().getFullYear();







targetSection.querySelector('.slider-placeholder');















































































