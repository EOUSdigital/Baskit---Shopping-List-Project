"use strict";

// HEADER



// This grabs all your category navigation links
const navLinks = document.querySelectorAll('.nav-links-item');
const sections = document.querySelectorAll('main section');

navLinks.forEach(link => {
    link.addEventListener('click', (event) => {
        // This stops the page from jumping around instantly
        event.preventDefault();

        //  Step A: Close ALL curtains (add the 'hidden' class to every section)
        sections.forEach(section => {
            section.classList.add('hidden');
        });
        
        // Step B: Find the target section ID from the clicked link's href
        // (e.g., if href is "#grocery", targetId becomes "#grocery")
        // This grabs the "#grocery" or "#household" from the link
        const targetSectionId = link.getAttribute('href'); 
        
        // Step C: Open the chosen curtain (find that section and remove 'hidden')
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            targetSection.classList.remove('hidden');
        }
        
    });
});


// Slider Animation

const slides = document.querySelectorAll('.slide');
let current = 0;

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.remove('active');
        slide.querySelector('.caption').style.opacity = 0;
    });

    const currentSlide = slides[index];
    currentSlide.classList.add('active');

    const caption = currentSlide.querySelector('.caption');
    const animClass = caption.classList[1]; 
    caption.classList.remove(animClass);
    void caption.offsetWidth; // Force reflow
    caption.classList.add(animClass);
}

function nextSlide() {
    current = (current + 1) % slides.length;
    showSlide(current);
}

setInterval(nextSlide, 4000);


//  Footer Year Date

document.getElementById("year").textContent = new Date().getFullYear();
























































































