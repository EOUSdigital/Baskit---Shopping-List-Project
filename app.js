"use strict";           // Forces the browser to run your code strictly, throwing errors for bad practices.

// ==========================================
// 1. HEADER & NAVIGATION SYSTEM
// ==========================================

//  Grabs all HTML elements with the class 'nav-links-item' (the menu buttons)
const navLinks = document.querySelectorAll('.nav-links-item');
//  Grabs all <section> elements living inside your <main> container
const sections = document.querySelectorAll('main section');

//  Loops through every navigation link button one by one
navLinks.forEach(link => {
    link.addEventListener('click', (event) => {
        //  Prevents the default browser action (stops the page from jumping or reloading)
        event.preventDefault();

        //  Step 1: Loops through all store sections and adds the 'hidden' class to conceal them.
        sections.forEach(section => {
            section.classList.add('hidden');
        });
        
        // Step 2: Find the target section ID from the clicked link's href attribute (e.g., "#grocery")
        const targetSectionId = link.getAttribute('href'); 
        const targetSection = document.querySelector(targetSectionId);
        
        // Step 3: Open the chosen section and trigger its slider engine dynamically!
        if (targetSection) {
            targetSection.classList.remove('hidden');
            
            // ADDED: Initialize the promo slider for this tab if it isn't running yet!
            renderPromoSlider(targetSection);
        }
    });
});


// ==========================================
// 2. ANIMATED SLIDER ENGINE
// ==========================================

function renderPromoSlider(sectionElement) {
    // Safety check: If no section element was provided to the function, exit out early.
    if (!sectionElement) return;

    // Target the slider placeholder element specifically, NOT the product grid.
    const placeholder = sectionElement.querySelector('.slider-placeholder');
    const template = document.getElementById('animated-slider-template');

    // Structural guard safety check: if either container or template is missing, stop running completely.
    if (!placeholder || !template) return;

    // ADDED SAFEGUARD: If a slider is already rendered inside this section, stop here!
    // This prevents duplicate intervals from stacking up if a user clicks the same link twice.
    if (placeholder.querySelector('.animated-slider')) return;

    // Clear out placeholder text content & grab a clean template copy.
    placeholder.innerHTML = '';
    const templateClone = template.content.cloneNode(true);

    // Inject the clean slider clone node directly into the page layout placeholder.
    placeholder.appendChild(templateClone);

    // Select target slide items inside this specific placeholder canvas.
    const slides = placeholder.querySelectorAll('.slide');
    let current = 0;

    // Internal navigation logic engine. Takes an index number and activates that specific slide image.
    function showSlide(index) {
        // Removes the 'active' visibility class from all slides
        slides.forEach((slide) => {
            slide.classList.remove('active');
        });

        // Grabs the specific slide matching our current index number.
        const currentSlide = slides[index];
        if (!currentSlide) return;

        // Makes the single active slide visible. The modern CSS rules handle nested captions automatically!
        currentSlide.classList.add('active');
    }

    // Calculates the next slide number, wrapping back around to 0 at the end.
    function nextSlide() {
        current = (current + 1) % slides.length;
        showSlide(current);
    }

    // Rotates smoothly every 7 seconds safely
    setInterval(nextSlide, 7000);
}

// ==========================================
// 3. CORE INITIALIZATION & APP ROUTING
// ==========================================

// Fire slider engine once the landing page DOM nodes are loaded safely!
document.addEventListener('DOMContentLoaded', () => {
    // Find our main landing page section container (#all-products)
    const initialSection = document.getElementById('all-products');
    renderPromoSlider(initialSection);
});

// A placeholder function designed to load specific store views when called.
function loadStoreSection(categoryName) {
    const currentSection = document.getElementById(categoryName);
    renderPromoSlider(currentSection);

    const heading = document.getElementById('all-products-heading');
    if (heading) {
        heading.textContent = `${categoryName} Products`;
    }

    renderPromoGrid(categoryName);
}

// ==========================================
// 4. FOOTER COMPONENT
// ==========================================

// Finds the <span> with ID 'year' in the footer and sets it to the current calendar year.
document.getElementById("year").textContent = new Date().getFullYear();














