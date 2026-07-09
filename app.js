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
            if (section.activeTimerId) {
                console.log("Success! Clearing timer ID:", section.activeTimerId);  //  Developer code. Must be deleted once the test is completed.
                clearInterval(section.activeTimerId);
            }
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
    sectionElement.activeTimerId = setInterval(nextSlide, 7000);
}

// ==========================================
// 3.1 CORE INITIALIZATION & APP ROUTING
// ==========================================

function renderProducts(gridClassName, arrayToUse) {
    // 1. Find the target container grid
    const targetGrid = document.querySelector(gridClassName);
    // Guard clause safety check!
    if (!targetGrid) return;

    // 2. Create an empty bucket string to hold all our cards
    let allCardsHTML = "";

    // 3. Loop through each item
    arrayToUse.forEach((product) => {
        // SAFETY GUARD: If the product name is empty or missing, skip it completely!
        if (!product.name || product.name === "") {
            // This acts like a 'skip' command for this specific loop iteration
            return;
        }

        // Use += to ADD each new card string to our bucket variable
        allCardsHTML += `
            <div class="product-card-item">
                <img src="${product.image}" alt="${product.name}" class="product-card-img" />
                <h3 class="product-card-heading">${product.name}</h3>
                <p class="product-card-description">${product.description}</p>
                <p class="product-card-price">£${product.price}</p>
                <button class="product-card-button" type="button" data-test="...">Add to basket</button>
            </div>
        `;
    });
    
    // 4. Dump the whole bucket of cards into the webpage grid at once!
    targetGrid.innerHTML = allCardsHTML;
}

// ==========================================
// 3.2 Next Action Step for Function Definition
// ==========================================

// Fire slider engine once the landing page DOM nodes are loaded safely!
document.addEventListener('DOMContentLoaded', () => {
    // Find our main landing page section container (#all-products)
    const initialSection = document.getElementById('all-products');
    renderPromoSlider(initialSection);



    // 1. Cut out 11 items from each warehouse list
    const grocerySlice = grocery.slice(0, 11);
    const householdSlice = household.slice(0, 11);
    const stationerySlice = stationery.slice(0, 11);

    // 2. Use .concat() to chain them together into a single master array of 33 items!
    const landingPageProducts = grocerySlice.concat(householdSlice, stationerySlice);

    // 3. Mix them up completely!
    const shuffledLandingProducts = shuffleArray(landingPageProducts);

    // Call 1: Run the recipe using '.flash-deals' as the target class
    renderProducts('.flash-deals', shuffledLandingProducts);
    
    // Call 2: Run the exact same recipe, but target '.custom-solutions' this time!
    renderProducts('.custom-solutions', shuffledLandingProducts);

    // 🚀 These sections should be checked before moving to a new section
    renderProducts('.just-for-you', shuffledLandingProducts);
    renderProducts('.essential-collection', shuffledLandingProducts);
    renderProducts('.new-arrivals', shuffledLandingProducts);
    renderProducts('.seasonal-content', shuffledLandingProducts);
    // 🚀 These sections should be checked before moving to a new section

    const frontPageGrocery = grocery.slice(0, 11);
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
// 3.3 Shuffling All 33 Items Cleanly
// ==========================================

// To randomize an array in JavaScript, developers use an algorithm to mix up the item positions. For a beginner, one of the easiest ways to shuffle a copy of an array is using a tool called .sort() combined with a random number generator (Math.random()).
// A reusable utility function that takes ANY array and returns it mixed up
function shuffleArray(array) {
    // .sort() rearranges items based on a true/false condition. 
    // Math.random() - 0.5 randomly gives a positive or negative number, causing a chaotic shuffle!
    return array.sort(() => Math.random() - 0.5);
}

// ==========================================
// 4. Array of objects containing product information
// ==========================================

const grocery = [
    { id: 1, name: "Fresh Organic Apples", price: 2.99, image: "../images/Grocery/Fresh-Organic-Apples-1627321463.jpg", "description": "Crisp, nutrient-dense fruits grown strictly adhering to natural farming methods.", category: "grocery" },
    { id: 2, name: "Velvet Classic Quilted Toilet Tissue 24 Rolls", price: 8.50, image: "../images/Grocery/Velvet_Classic_Quilted_Toilet_Tissue_24_Rolls_AC_SL1024_.jpg", "description": "The Classic Quilted Velvet white toilet rolls give you a luxurious feeling of softness with its unique quilted pattern.", category: "grocery" },
    { id: 3, name: "Pepsi Max Cherry No Sugar Cola Cans 24 x 330ml", price: 12.00, image: "../images/Grocery/Pepsi_Max_Cherry_No_Sugar_AC_SL1000_.jpg", "description": "MAXIMUM CHERRY, NO SUGAR a bold fizzy drink with a refreshing Cherry twist; Zero Sugar, Zero Carbs", category: "grocery" },
    { id: 4, name: "Lurpak Slightly Salted Spreadable Blend of Butter and Rapeseed Oil 400 g", price: 3.00, image: "../images/Grocery/Lurpak_Slightly_Salted_Spreadable_Blend_of_Butter_and_Rapeseed_Oil_400_g_515C8XZh5GL._AC_SL1000_.jpg", "description": "Slightly salted spreadable is made from natural ingredients. We start our recipe with butter made from 100% fresh milk.", category: "grocery" },
    { id: 5, name: "Iceland 12 Large Free Range Eggs", price: 3.30, image: "../images/Grocery/Free_Range_Eggs_5135UaVeh9L._AC_SL1200_.jpg", "description": "Free Range Eggs", category: "grocery" },
    { id: 6, name: "Semi-Skimmed Milk 2 litres 2l (Chilled)", price: 1.65, image: "../images/Grocery/Pasteurised_homogenised_milk_51YxlpPuKUL._AC_SL1200_.jpg", "description": "Pasteurised homogenised. Starndardised semi skimmed milk", category: "grocery" },
    { id: 7, name: "", price: 0.00, image: "", "description": "", category: "grocery" },
    { id: 8, name: "", price: 0.00, image: "", "description": "", category: "grocery" },
    { id: 9, name: "", price: 0.00, image: "", "description": "", category: "grocery" },
    { id: 10, name: "", price: 0.00, image: "", "description": "", category: "grocery" },
    { id: 11, name: "", price: 0.00, image: "", "description": "", category: "grocery" },
    { id: 12, name: "", price: 0.00, image: "", "description": "", category: "grocery" },
    { id: 13, name: "", price: 0.00, image: "", "description": "", category: "grocery" },
    { id: 14, name: "", price: 0.00, image: "", "description": "", category: "grocery" },
    { id: 15, name: "", price: 0.00, image: "", "description": "", category: "grocery" },
    { id: 16, name: "", price: 0.00, image: "", "description": "", category: "grocery" },
    { id: 17, name: "", price: 0.00, image: "", "description": "", category: "grocery" },
    { id: 18, name: "", price: 0.00, image: "", "description": "", category: "grocery" },
    { id: 19, name: "", price: 0.00, image: "", "description": "", category: "grocery" },
    { id: 20, name: "", price: 0.00, image: "", "description": "", category: "grocery" },
    { id: 21, name: "", price: 0.00, image: "", "description": "", category: "grocery" },
    { id: 22, name: "", price: 0.00, image: "", "description": "", category: "grocery" },
    { id: 23, name: "", price: 0.00, image: "", "description": "", category: "grocery" },
    { id: 24, name: "", price: 0.00, image: "", "description": "", category: "grocery" },
    { id: 25, name: "", price: 0.00, image: "", "description": "", category: "grocery" },
    { id: 26, name: "", price: 0.00, image: "", "description": "", category: "grocery" },
    { id: 27, name: "", price: 0.00, image: "", "description": "", category: "grocery" },
    { id: 28, name: "", price: 0.00, image: "", "description": "", category: "grocery" },
    { id: 29, name: "", price: 0.00, image: "", "description": "", category: "grocery" },
    { id: 30, name: "", price: 0.00, image: "", "description": "", category: "grocery" },
    { id: 31, name: "", price: 0.00, image: "", "description": "", category: "grocery" },
]

const household = [
    { id: 3, name: "Dishwasher Tablets", price: 8.49, image: "../images/Household/Dishwasher-Tablets-700467.png", "description": "Compact, pre-measured blocks of concentrated detergent formulated to clean crockery, remove grease, and eliminate food stains in a single wash cycle.", category: "household" },
    { id: 2, name: "", price: 0.00, image: "", "description": "", category: "household" },
    { id: 3, name: "", price: 0.00, image: "", "description": "", category: "household" },
    { id: 4, name: "", price: 0.00, image: "", "description": "", category: "household" },
    { id: 5, name: "", price: 0.00, image: "", "description": "", category: "household" },
    { id: 6, name: "", price: 0.00, image: "", "description": "", category: "household" },
    { id: 7, name: "", price: 0.00, image: "", "description": "", category: "household" },
    { id: 8, name: "", price: 0.00, image: "", "description": "", category: "household" },
    { id: 9, name: "", price: 0.00, image: "", "description": "", category: "household" },
    { id: 10, name: "", price: 0.00, image: "", "description": "", category: "household" },
    { id: 11, name: "", price: 0.00, image: "", "description": "", category: "household" },
    { id: 12, name: "", price: 0.00, image: "", "description": "", category: "household" },
    { id: 13, name: "", price: 0.00, image: "", "description": "", category: "household" },
    { id: 14, name: "", price: 0.00, image: "", "description": "", category: "household" },
    { id: 15, name: "", price: 0.00, image: "", "description": "", category: "household" },
    { id: 16, name: "", price: 0.00, image: "", "description": "", category: "household" },
    { id: 17, name: "", price: 0.00, image: "", "description": "", category: "household" },
    { id: 18, name: "", price: 0.00, image: "", "description": "", category: "household" },
    { id: 19, name: "", price: 0.00, image: "", "description": "", category: "household" },
    { id: 20, name: "", price: 0.00, image: "", "description": "", category: "household" },
    { id: 21, name: "", price: 0.00, image: "", "description": "", category: "household" },
    { id: 22, name: "", price: 0.00, image: "", "description": "", category: "household" },
    { id: 23, name: "", price: 0.00, image: "", "description": "", category: "household" },
    { id: 24, name: "", price: 0.00, image: "", "description": "", category: "household" },
    { id: 25, name: "", price: 0.00, image: "", "description": "", category: "household" },
    { id: 26, name: "", price: 0.00, image: "", "description": "", category: "household" },
    { id: 27, name: "", price: 0.00, image: "", "description": "", category: "household" },
    { id: 28, name: "", price: 0.00, image: "", "description": "", category: "household" },
    { id: 29, name: "", price: 0.00, image: "", "description": "", category: "household" },
    { id: 30, name: "", price: 0.00, image: "", "description": "", category: "household" },
    { id: 31, name: "", price: 0.00, image: "", "description": "", category: "household" },
]

const stationery = [
    { id: 2, name: "A4 Notebook", price: 4.50, image: "../images/Stationery/A4-Notebook-89410080.png", "description": "A comprehensive guide filled with useful resources, illustrations, and clear examples for learning.", category: "stationery" },
    { id: 2, name: "", price: 0.00, image: "", "description": "", category: "stationery" },
    { id: 3, name: "", price: 0.00, image: "", "description": "", category: "stationery" },
    { id: 4, name: "", price: 0.00, image: "", "description": "", category: "stationery" },
    { id: 5, name: "", price: 0.00, image: "", "description": "", category: "stationery" },
    { id: 6, name: "", price: 0.00, image: "", "description": "", category: "stationery" },
    { id: 7, name: "", price: 0.00, image: "", "description": "", category: "stationery" },
    { id: 8, name: "", price: 0.00, image: "", "description": "", category: "stationery" },
    { id: 9, name: "", price: 0.00, image: "", "description": "", category: "stationery" },
    { id: 10, name: "", price: 0.00, image: "", "description": "", category: "stationery" },
    { id: 11, name: "", price: 0.00, image: "", "description": "", category: "stationery" },
    { id: 12, name: "", price: 0.00, image: "", "description": "", category: "stationery" },
    { id: 13, name: "", price: 0.00, image: "", "description": "", category: "stationery" },
    { id: 14, name: "", price: 0.00, image: "", "description": "", category: "stationery" },
    { id: 15, name: "", price: 0.00, image: "", "description": "", category: "stationery" },
    { id: 16, name: "", price: 0.00, image: "", "description": "", category: "stationery" },
    { id: 17, name: "", price: 0.00, image: "", "description": "", category: "stationery" },
    { id: 18, name: "", price: 0.00, image: "", "description": "", category: "stationery" },
    { id: 19, name: "", price: 0.00, image: "", "description": "", category: "stationery" },
    { id: 20, name: "", price: 0.00, image: "", "description": "", category: "stationery" },
    { id: 21, name: "", price: 0.00, image: "", "description": "", category: "stationery" },
    { id: 22, name: "", price: 0.00, image: "", "description": "", category: "stationery" },
    { id: 23, name: "", price: 0.00, image: "", "description": "", category: "stationery" },
    { id: 24, name: "", price: 0.00, image: "", "description": "", category: "stationery" },
    { id: 25, name: "", price: 0.00, image: "", "description": "", category: "stationery" },
    { id: 26, name: "", price: 0.00, image: "", "description": "", category: "stationery" },
    { id: 27, name: "", price: 0.00, image: "", "description": "", category: "stationery" },
    { id: 28, name: "", price: 0.00, image: "", "description": "", category: "stationery" },
    { id: 29, name: "", price: 0.00, image: "", "description": "", category: "stationery" },
    { id: 30, name: "", price: 0.00, image: "", "description": "", category: "stationery" },
    { id: 31, name: "", price: 0.00, image: "", "description": "", category: "stationery" },
]

// ==========================================
// 5. FOOTER COMPONENT
// ==========================================

// Finds the <span> with ID 'year' in the footer and sets it to the current calendar year.
document.getElementById("year").textContent = new Date().getFullYear();




