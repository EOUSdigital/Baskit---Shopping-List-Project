"use strict";           // Forces the browser to run your code strictly, throwing errors for bad practices.

// ==========================================
// GLOBAL STATE APP REGISTRY
// ==========================================

// Stores cart items tracking: { product, quantity }
// Checks for existing storage data first; defaults to empty array if none found
let basket = JSON.parse(localStorage.getItem('baskit_cart')) || [];
let previouslyActiveSectionId = "#all-products";

//  Grabs all HTML elements with the class 'nav-links-item' (the menu buttons)
const navLinks = document.querySelectorAll('.nav-links-item');
//  Grabs all <section> elements living inside the <main> container
const sections = document.querySelectorAll('main section');

// Unified Router Utility to handle clean page swapping
function changeRouteView(targetSectionId) {
    sections.forEach(section => {
        if (section.activeTimerId) {
            clearInterval(section.activeTimerId);
        }
        section.classList.add('hidden');
    });

    const targetSection = document.querySelector(targetSectionId);
    if (targetSection) {
        targetSection.classList.remove('hidden');
        renderPromoSlider(targetSection);
        
        // Exclude temporary views from overwriting the last category section
        if (targetSectionId !== "#product-details" && targetSectionId !== "#shopping-basket") {
            previouslyActiveSectionId = targetSectionId;
        }

        // Dynamically update active states in the secondary navigation links
        navLinks.forEach(link => {
            if (link.getAttribute('href') === targetSectionId) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            } else {
                link.classList.remove('active');
                link.removeAttribute('aria-current');
            }
        });
    }
}

// ==========================================
// 1.1 HEADER NAVIGATION SYSTEM & ROUTING ENGINE
// ==========================================

//  Loops through every navigation link button one by one.
// Handle department menu link clicks
navLinks.forEach(link => {
    link.addEventListener('click', (event) => {
        event.preventDefault();
        const targetSectionId = link.getAttribute('href');
        
        const selectedCategory = link.dataset.category;
        if (selectedCategory) {
            const targetArray = productDataMap[selectedCategory];
            const targetGridClass = `.${selectedCategory}-content`;
            renderProducts(targetGridClass, targetArray);
        }
        changeRouteView(targetSectionId);
    });
});

// Handle clicking the Basket Icon in the navigation bar
const basketTrigger = document.querySelector('.basket-nav-trigger');
if (basketTrigger) {
    basketTrigger.addEventListener('click', (event) => {
        event.preventDefault();
        renderBasketView(); // Build the shopping cart elements
        changeRouteView("#shopping-basket"); // Switch to basket page
    });
}

// Handle clicking the Logo to go back home
const brandLink = document.querySelector('.brand-link');
if (brandLink) {
    brandLink.addEventListener('click', (event) => {
        event.preventDefault();
        changeRouteView("#all-products");
    });
}

// ==========================================
// 1.2 SEARCH FORM SYSTEM
// ==========================================

const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const searchCategory = document.getElementById('search-category');

if (searchForm && searchInput && searchCategory) {
    searchForm.addEventListener('submit', (event) => {
        // Stop standard form submissions & page reloads
        event.preventDefault();

        const query = searchInput.value.trim().toLowerCase();
        // 'all', 'grocery', 'household', 'stationery'
        const category = searchCategory.value;

        if (!query) return;

        // 1. Gather all searchable items
        let pool = [];
        
        if (category === 'all') {
                pool = grocery.concat(household, stationery);
            } else {
                pool = productDataMap[category] || [];
            }

        // 2. Filter products based on name or description matching
        const results = pool.filter(product => 
            product.name.toLowerCase().includes(query) || 
            product.description.toLowerCase().includes(query)
        );

        // 3. Clear and display search results on the main page dynamically!
        const mainHeading = document.getElementById('all-products-heading');
        if (mainHeading) {
            mainHeading.textContent = `Search Results for "${searchInput.value}" (${results.length} found)`;
        }

        // Temporarily hide the slider and replace Flash Deals grid with results
        const sliderPlaceholder = document.querySelector('#all-products .slider-placeholder');
        // Hide slider
        if (sliderPlaceholder) sliderPlaceholder.innerHTML = '';

        // Hide other grids so search results take center stage
        document.querySelectorAll('#all-products .product-grid').forEach(grid => {
            grid.style.display = 'none';
        });

        // Show results in the Flash Deals container as a grid
        const resultsGrid = document.querySelector('#all-products .flash-deals');
        if (resultsGrid) {
            resultsGrid.style.display = 'grid';
            renderProducts('#all-products .flash-deals', results);
        }

    changeRouteView('#all-products');
    });
}

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

    // 1. Always clear any existing interval on this section to prevent memory leaks
    if (sectionElement.activeTimerId) {
        clearInterval(sectionElement.activeTimerId);
        sectionElement.activeTimerId = null;
    }

    // Select target slide items inside this specific placeholder canvas.
    let slides = placeholder.querySelectorAll('.slide');
    let current = 0;

    // 2. Only clone and inject the template if it hasn't been rendered yet
    if (slides.length === 0) {
        placeholder.innerHTML = '';
        const templateClone = template.content.cloneNode(true);
        placeholder.appendChild(templateClone);
        slides = placeholder.querySelectorAll('.slide');
    } else {
        // If already rendered, reset to show the first slide visually
        slides.forEach((slide, idx) => {
            if (idx === 0) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            };
        });
    }

    if (slides.length === 0) return;

    // Internal navigation logic engine. Takes an index number and activates that specific slide image.
    function showSlide(index) {
        // Removes the 'active' visibility class from all slides
        slides.forEach((slide) => {
            slide.classList.remove('active');
        });

        // Grabs the specific slide matching our current index number.
        const currentSlide = slides[index];
        if (!currentSlide) {
            return;
        } else {
            // Makes the single active slide visible. The modern CSS rules handle nested captions automatically!
            currentSlide.classList.add('active');
        }
    }

    // Calculates the next slide number, wrapping back around to 0 at the end.
    function nextSlide() {
        current = (current + 1) % slides.length;
        showSlide(current);
    }

    // 3. Restart the interval timer safely. Rotates smoothly every 7 seconds safely.
    sectionElement.activeTimerId = setInterval(nextSlide, 7000);
}

// ==========================================
// 3.1 CORE INITIALIZATION & APP ROUTING
// ==========================================

// ==========================================
// DYNAMIC RENDER & BASKET ENGINE
// ==========================================

function renderProducts(gridClassName, arrayToUse) {
    const targetGrid = document.querySelector(gridClassName);
    const template = document.getElementById('product-template');
    if (!targetGrid || !template) return;

    targetGrid.innerHTML = ""; // Clear out old cards

    arrayToUse.forEach((product) => {
        if (!product.name) return;

        // 1. Clone the HTML template
        const clone = template.content.cloneNode(true);
        
        // 2. Fallback selection engine: Finds elements by generic tags if classes are missing
        const card = clone.querySelector('.product-card-item') || clone.firstElementChild;
        const img = clone.querySelector('.product-card-img') || clone.querySelector('img');
        const heading = clone.querySelector('.product-card-heading') || clone.querySelector('h1, h2, h3, h4, h5, h6');
        const desc = clone.querySelector('.product-card-description') || clone.querySelector('p');
        const priceSpan = clone.querySelector('.product-card-price span') || clone.querySelector('span');
        const button = clone.querySelector('.product-card-button') || clone.querySelector('button');

        // 3. Populate fields safely only if they exist in your template
        if (img) {
            img.src = product.image;
            img.alt = product.name;
        }
        if (heading) {
            heading.textContent = product.name;
        }
        if (desc) {
            desc.textContent = product.description;
        }
        if (priceSpan) {
            priceSpan.textContent = product.price.toFixed(2);
        }

        // 4. Setup button click handler
        if (button) {
            button.textContent = "Add to basket";
            button.addEventListener('click', (event) => {
                event.stopPropagation(); // Prevents opening the details page modal/view
                addItemToCartState(product);
            });
        }

        // 5. Setup card container click handler
        if (card) {
            card.addEventListener('click', (event) => {
                if (button && event.target === button) return;
                openProductDetailsPage(product);
            });
        }

        targetGrid.appendChild(clone);
    });
}

// Populates and shows the unique template details page
function openProductDetailsPage(product) {
    const detailSection = document.getElementById('product-details');
    const template = document.getElementById('product-details-template');
    if (!detailSection || !template) return;

    detailSection.innerHTML = "";
    const clone = template.content.cloneNode(true);

    clone.querySelector('.details-large-img').src = product.image;
    clone.querySelector('.details-large-img').alt = product.name;
    clone.querySelector('.details-title-heading').textContent = product.name;
    clone.querySelector('.details-full-description').textContent = product.description;
    clone.querySelector('.details-large-price span').textContent = product.price.toFixed(2);

    // Wire up template "Back" button
    clone.querySelector('.back-to-browsing-btn').addEventListener('click', () => {
        changeRouteView(previouslyActiveSectionId);
    });

    // Wire up template "Add to basket" button
    clone.querySelector('.details-add-to-basket-btn').addEventListener('click', () => {
        addItemToCartState(product);
    });

    detailSection.appendChild(clone);
    changeRouteView("#product-details");
}

// Memory controller: adds a product or increments quantity
function addItemToCartState(product) {
    const existingEntry = basket.find(item => item.product.id === product.id && item.product.category === product.category);
    
    if (existingEntry) {
        existingEntry.quantity += 1;
    } else {
        basket.push({ product: product, quantity: 1 });
    }
    updateGlobalCartCounters();
}

// Recalculates total items and updates indicators
function updateGlobalCartCounters() {
    const totalCount = basket.reduce((total, item) => total + item.quantity, 0);

    // Save the updated basket state to Local Storage
    localStorage.setItem('baskit_cart', JSON.stringify(basket));
    
    // Updates the navigation bar badge indicator
    const navCounter = document.getElementById('cart-total-items');
    if (navCounter) navCounter.textContent = totalCount;

    // Updates price/items labels inside the shopping basket view if visible
    const basketCountSpan = document.getElementById('total-items-count');
    const basketPriceSpan = document.getElementById('total-price-value');
    
    if (basketCountSpan) basketCountSpan.textContent = totalCount;
    if (basketPriceSpan) {
        const totalPrice = basket.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
        basketPriceSpan.textContent = totalPrice.toFixed(2);
    }
}

// Clones the basket template and populates your cart list view
function renderBasketView() {
const container = document.getElementById('dynamic-basket-container');
    const clearBtn = document.getElementById('clear-entire-basket-btn');

    // FIXED: Added missing template reference
    const template = document.getElementById('basket-template');
    
    if (!container) return;

    if (basket.length === 0) {
        container.innerHTML = `<p class="empty-cart-msg">Your shopping basket is empty.</p>`;
        if (clearBtn) clearBtn.style.display = 'none'; // Clear UI State step met
        updateGlobalCartCounters();
        return;
    }

    if (clearBtn) {
        clearBtn.style.display = 'block'; // Show control when items exist
        clearBtn.onclick = () => {
            basket = [];
            updateGlobalCartCounters();
            renderBasketView();
        };
    }

    container.innerHTML = ""; // Wipe older rendered list references
    basket.forEach(item => {
        const clone = template.content.cloneNode(true);
        
        clone.querySelector('.basket-card-img').src = item.product.image;
        clone.querySelector('.basket-card-img').alt = item.product.name;
        clone.querySelector('.basket-card-heading').textContent = item.product.name;
        clone.querySelector('.basket-card-description').textContent = item.product.description;
        clone.querySelector('.basket-card-price span').textContent = (item.product.price * item.quantity).toFixed(2);
        clone.querySelector('.basket-action-product-quantity').textContent = item.quantity;

        // Increase quantity (+) button
        clone.querySelector('.basket-action-increase').addEventListener('click', () => {
            item.quantity += 1;
            updateGlobalCartCounters();
            renderBasketView();
        });

        // Decrease quantity (-) button
        clone.querySelector('.basket-action-decrease').addEventListener('click', () => {
            item.quantity -= 1;
            if (item.quantity <= 0) {
                basket = basket.filter(bItem => bItem !== item);
            }
            updateGlobalCartCounters();
            renderBasketView();
        });

        // Delete button
        clone.querySelector('.basket-action-delete').addEventListener('click', () => {
            basket = basket.filter(bItem => bItem !== item);
            updateGlobalCartCounters();
            renderBasketView();
        });

        // Share button
        clone.querySelector('.basket-action-share').addEventListener('click', () => {
            alert(`Sharing link copied for item: ${item.product.name}!`);
        });

        container.appendChild(clone);
    });

    updateGlobalCartCounters();
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

    let currentSliceIndex = 0;

    // Call 1: Run the recipe using '.flash-deals' as the target class
    renderProducts('.flash-deals', shuffledLandingProducts.slice(currentSliceIndex, currentSliceIndex += 4));
    
    // Call 2: Run the exact same recipe, but target '.custom-solutions' this time!
    renderProducts('.custom-solutions', shuffledLandingProducts.slice(currentSliceIndex, currentSliceIndex += 5));

    // 🚀 These sections should be checked before moving to a new section
    renderProducts('.just-for-you', shuffledLandingProducts.slice(currentSliceIndex, currentSliceIndex += 8));
    renderProducts('.essential-collection', shuffledLandingProducts.slice(currentSliceIndex, currentSliceIndex += 2));
    renderProducts('.new-arrivals', shuffledLandingProducts.slice(currentSliceIndex, currentSliceIndex += 11));
    renderProducts('.seasonal-content', shuffledLandingProducts.slice(currentSliceIndex, currentSliceIndex += 3));

    const frontPageGrocery = grocery.slice(0, 11);

    // Sync visual counts with whatever was loaded out of local storage
    updateGlobalCartCounters();
});

// A placeholder function designed to load specific store views when called.
function loadStoreSection(categoryName) {
    const currentSection = document.getElementById(categoryName);
    renderPromoSlider(currentSection);

    const heading = document.getElementById('all-products-heading');
    if (heading) {
        heading.textContent = `${categoryName} Products`;
    }

    renderProducts(`.${categoryName}-content`, productDataMap[categoryName]);
}

// ==========================================
// 3.3 Shuffling All 33 Items Cleanly - Fisher-Yates (Knuth) Shuffle algorithm
// ==========================================

// To randomize an array in JavaScript, developers use an algorithm to mix up the item positions. For a beginner, one of the easiest ways to shuffle a copy of an array is using a random number generator (Math.random()).
// A reusable utility function that takes ANY array and returns it mixed up.
function shuffleArray(array) {
    // Clone the array to keep the original data pure and immutable
    const shuffled = [...array]; 
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        // Modern ES6 destructuring swap
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; 
    }
    return shuffled;
};

// ==========================================
// 4.1 Array of objects containing product information
// ==========================================

const grocery = [
    { id: 1, name: "Fresh Organic Apples", price: 2.99, image: "../images/Grocery/Fresh-Organic-Apples-1627321463.png", "description": "Crisp, nutrient-dense fruits grown strictly adhering to natural farming methods.", category: "grocery" },
    { id: 2, name: "Velvet Classic Quilted Toilet Tissue 24 Rolls", price: 8.50, image: "../images/Grocery/Velvet_Classic_Quilted_Toilet_Tissue_24_Rolls_AC_SL1024_.jpg", "description": "The Classic Quilted Velvet white toilet rolls give you a luxurious feeling of softness with its unique quilted pattern.", category: "grocery" },
    { id: 3, name: "Pepsi Max Cherry No Sugar Cola Cans 24 x 330ml", price: 12.00, image: "../images/Grocery/Pepsi_Max_Cherry_No_Sugar_AC_SL1000_.jpg", "description": "MAXIMUM CHERRY, NO SUGAR a bold fizzy drink with a refreshing Cherry twist; Zero Sugar, Zero Carbs", category: "grocery" },
    { id: 4, name: "Lurpak Slightly Salted Spreadable Blend of Butter and Rapeseed Oil 400 g", price: 3.00, image: "../images/Grocery/Lurpak_Slightly_Salted_Spreadable_Blend_of_Butter_and_Rapeseed_Oil_400_g_515C8XZh5GL._AC_SL1000_.jpg", "description": "Slightly salted spreadable is made from natural ingredients. We start our recipe with butter made from 100% fresh milk.", category: "grocery" },
    { id: 5, name: "Iceland 12 Large Free Range Eggs", price: 3.30, image: "../images/Grocery/Free_Range_Eggs_5135UaVeh9L._AC_SL1200_.jpg", "description": "Free Range Eggs", category: "grocery" },
    { id: 6, name: "Semi-Skimmed Milk 2 litres 2l (Chilled)", price: 1.65, image: "../images/Grocery/Pasteurised_homogenised_milk_51YxlpPuKUL._AC_SL1200_.jpg", "description": "Pasteurised homogenised. Starndardised semi skimmed milk", category: "grocery" },
    { id: 7, name: "AQUA Carpatica", price: 3.10, image: "../images/Grocery/AQUA_Carpatica_8142Vm7hxoL._AC_SL1500_.jpg", "description": "Pure Natural Still Mineral Water, Virtually Nitrate Free, Low Sodium, Naturally Alkaline, Natural Electrolytes, Premium Multipack 100% Recyclable, 500 ml (Pack of 6)", category: "grocery" },
    { id: 8, name: "Lavazza, Qualità Rossa", price: 16.89, image: "../images/Grocery/Lavazza_Qualità_Rossa_61nHLeVeBJL._AC_SL1500_.jpg", "description": "Coffee Beans, Arabica and Robusta, Intensity 5/10, Medium Roasting, 1 Kg", category: "grocery" },
    { id: 9, name: "nakd. Variety pack", price: 15.25, image: "../images/Grocery/nakd._Variety_pack_81RYuVcGzdL._AC_SL1500_.jpg", "description": "Raw fruit & nut bars - 100% natural ingredients - No added sugar - Vegan - Gluten free - 18 x 35g bars - 630g", category: "grocery" },
    { id: 10, name: "Filippo Berio", price: 10.20, image: "../images/Grocery/Filippo_Berio_71i3zw8KsXL._AC_SL1500_.jpg", "description": "Extra Virgin Olive Oil, 1L", category: "grocery" },
    { id: 11, name: "HANDPICK, Spearmint Tea Bags", price: 8.99, image: "../images/Grocery/HANDPICK_Spearmint_Tea_619xC4P1+6L._AC_SL1000_.jpg", "description": "Non-GMO, 100% Pure Spearmint Leaf Tea Bags Certified by Tea Board of India | Round Eco-Conscious Teabags", category: "grocery" },
    
    { id: 12, name: "Eat Wholesome Organic Apple Cider Vinegar", price: 5.50, image: "../images/Grocery/Eat_Wholesome_Organic_Apple_Cider_Vinegar_71leP8LRFNL._AC_SL1500_.jpg", "description": "Raw, Unpasteurised, Unfiltered, Award-Winning, Vegan, With The Mother, 1L Glass Bottle in Box", category: "grocery" },
    { id: 13, name: "Minton & Donello Organic Porridge Oats 1kg", price: 2.80, image: "../images/Grocery/Minton_Donello_Organic_Porridge_Oats_611dznoNQDL._AC_SL1500_.jpg", "description": "Wholesome, Creamy Oats Great for Breakfast, Baking, Smooth & Warming Bowls, and Nutritious Everyday Meals", category: "grocery" },
    { id: 14, name: "Twinings English Breakfast Loose Tea Caddy - 500g", price: 14.00, image: "../images/Grocery/Twinings_English_Breakfast_Tea_71FFA09872L._AC_SL1500_.jpg", "description": "Golden and well rounded. It's a tea with a lot of body and a light finish. Biodegradable Plant-Based Tea Bags", category: "grocery" },
    { id: 15, name: "Bulk Zero Calorie Barista Syrup, Caramel, 1 Litre", price: 5.99, image: "../images/Grocery/Bulk_Zero_Calorie_Barista_Syrup_Caramel_510j2MhKluL._AC_SL1500_.jpg", "description": "Perfect for Protein Shakes, Coffee, Tea, Desserts, Pancakes and Waffles, Vegan, No Sugar, Fat, or Calories", category: "grocery" },
    { id: 16, name: "Mutti Finely Chopped Tomatoes 400g (Pack of 6)", price: 6.60, image: "../images/Grocery/Mutti_Finely_Chopped_Tomatoes_400g_81eX+X25uhL._AC_SL1500_.jpg", "description": "Premiumness, the best tomatoes are picked when perfectly ripe, cold crushed, and processed with our patented technique to capture the flavour of just-harvested tomatoes.", category: "grocery" },
    { id: 17, name: "Koka Original Chicken Flavour Oriental Style Instant Noodles, 85 g (Pack of 5)", price: 1.88, image: "../images/Grocery/Koka_Original_Chicken_Flavour_Oriental_Style_Instant_Noodles_71mwINa7bUL._AC_SL1000_.jpg", "description": "Chicken flavour instant noodles. Perfect as a snack or meal accompaniment.", category: "grocery" },
    { id: 18, name: "Maldon - Sea Salt Flakes", price: 2.29, image: "../images/Grocery/Maldon_Sea_Salt_Flakes_71ufRA2iZHL._AC_SL1500_.jpg", "description": "Unique Pyramid Shaped Salt Flakes, Perfect for a Wide Range of Dishes, Hand-Harvested for Four Generations, 250g Box", category: "grocery" },
    { id: 19, name: "Protein Works", price: 30.59, image: "../images/Grocery/Protein_Works_717l3j1xSYL._AC_SL1500_.jpg", "description": "Protein Porridge 360 - Gold Innovation, High Protein, Low Sugar Breakfast, Added Vitamins & Minerals, Low GI Wholegrain Oats, High Fibre, Milk Chocolate, 26 Servings, 2kg", category: "grocery" },
    { id: 20, name: "Dunn's River Jamaican Jerk Seasoning, 300g", price: 2.75, image: "../images/Grocery/Dunn's_River_Jamaican_Jerk_Seasoning_61s05DTtQNL._AC_SL1000_.jpg", "description": "Hot chilli. A traditional marinade. Authentic Jamaican. Refrigerate after opening", category: "grocery" },
    { id: 21, name: "Grace Mighty Malt Orginal 330ml", price: 1.15, image: "../images/Grocery/Grace_Mighty_Malt_Orginal_330ml_61Bnwi9vrTL._AC_SL1000_.jpg", "description": "Value for money. Good product with excellent quality. Easy to use", category: "grocery" },
    { id: 22, name: "Melis Pickled Gherkins, 680g", price: 1.44, image: "../images/Grocery/Melis_Pickled_Gherkins_680g_918FTtzcTwL._AC_SL1500_.jpg", "description": "Pickled gherkins. With garlic & red peppers", category: "grocery" },
    { id: 23, name: "Spichlerz Rusiecki Premium Noble-Style Fresh Pork in Marinade, 280g", price: 2.16, image: "../images/Grocery/Spichlerz_Rusiecki_Premium_Noble_Pork_Marinade_718VisI9umL._AC_SL1500_.jpg", "description": "High protein, 84% meat content Contains onion, tomato, and a blend of spices No artificial colors, flavors or preservatives", category: "grocery" },
    { id: 24, name: "Lee Kum Kee Panda Oyster Sauce, 510g (Pack of 1)", price: 2.80, image: "../images/Grocery/Lee_Kum_Kee_Panda_Oyster_Sauce_510g_71LYLrbJs-L._SL1500_.jpg", "description": "Made with oyster extract from the finest oysters, it is the choice of Chinese chefs and the secret behind great Chinese food.", category: "grocery" },
    { id: 25, name: "Mai Thai AAA Jasmine Rice, (Pack of 1), 5kg", price: 6.40, image: "../images/Grocery/Mai_Thai_AAA_Jasmine_Rice_(Pack of 1)_5kg61KL1qucrZL._AC_SL1226_.jpg", "description": "AAA Quality Thai Fragrant Jasmine Rice. Floral Aroma. Soft , Sticky Texture", category: "grocery" },
    { id: 26, name: "Barry's Irish Breakfast Tea Bags, 250 g", price: 10.80, image: "../images/Grocery/Barry's_Irish_Breakfast_Tea_Bags_250g_51BlAuJfHFL._AC_SL1024_.jpg", "description": "Brisk refreshing taste and a bright golden colour. Ideal for anytime of the day. Lightest and most refreshing signature blend", category: "grocery" },
    { id: 27, name: "KTC Chick Peas, 400g", price: 0.52, image: "../images/Grocery/KTC_Chick_Peas_400g_61Wef4W1DQL._AC_SL1024_.jpg", "description": "Base for home made hummous. Ready to use. High inprotein and fibre", category: "grocery" },
    { id: 28, name: "Indus Paprika Powder, 100g", price: 1.05, image: "../images/Grocery/Indus_Paprika_Powder_100g_618FN8UHaUL._AC_SL1280_.jpg", "description": "Essentials Noble Sweet Paprika Powder", category: "grocery" },
    { id: 29, name: "KTC Premium Quality Edible Mustard Oil Blend, 1 Litre", price: 3.40, image: "../images/Grocery/KTC_Premium_Quality _Mustard_Oil_Blend_1Litre_51I6knk6xQL._AC_SL1000_.jpg", "description": "Mustard Seed Oil (51%), Rapeseed Oil & Antifoaming Agent (E900) (49%)", category: "grocery" },
    { id: 30, name: "Carotino Better Ghee, 1kg", price: 4.00, image: "../images/Grocery/Carotino_Better_Ghee_1kg_61R9AbzWi-L._AC_SL1000_.jpg", "description": "Finest butter taste and aroma. Tastes just like butter ghee, but is a healthier option. Around half the price of butter ghee", category: "grocery" },
    { id: 31, name: "Keeling's Oranges", price: 2.25, image: "../images/Grocery/Keeling's_Easy_Peelers_711Cf5NKDaL._AC_.jpg", "description": "Easy Peelers", category: "grocery" },
    { id: 32, name: "Black Seed Oil Organic Cold Pressed. Up to 5X Strength.", price: 16.97, image: "../images/Grocery/Black_Seed_Oil_Organic_71whufpGt2L._AC_SL1500_.jpg", "description": "Award Winning Organic Black Seed Oil - Known as Cumin, Cold Pressed Nigella Sativa, and Kalonji, 200 ml", category: "grocery" },
]

const household = [
    { id: 1, name: "Dishwasher Tablets", price: 8.49, image: "../images/Household/Dishwasher-Tablets-700467.png", "description": "Compact, pre-measured blocks of concentrated detergent formulated to clean crockery, remove grease, and eliminate food stains in a single wash cycle.", category: "household" },
    { id: 2, name: "Zoflora Midnight Blooms Multipurpose Cleaner Trigger Spray, 1 x 800ml", price: 2.00, image: "../images/Household/Zoflora_Midnight_Blooms_Multipurpose_Cleaner_Trigger_Spray_51vLxxddJ7L._AC_SL1107_.jpg", "description": "Floral Antibacterial Multi-Surface Cleaner, Pet-Friendly, Kills 99.9 Percent of Bacteria and Viruses.", category: "household" },
    { id: 3, name: "Hi-Spec 42pc 4V USB Electric Power Driver & Household Tool Kit", price: 26.34, image: "../images/Household/Hi-Spec_42pc_4V_USB_Electric_Power_Driver_818w0RIzT2L._AC_SL1500_.jpg", "description": "Cordless Power & Hand Tool Set: Includes a 4V USB rechargeable electric screwdriver and 41 hand tools for home repairs, furniture assembly, and everyday DIY tasks", category: "household" },
    { id: 4, name: "Microfibre Cleaning Cloths Pack of 50, 30 x 30 cm Ultra Absorbent Lint Free Microfibre Cloth", price: 18.31, image: "../images/Household/Microfibre_Cleaning_Cloths_Pack_91LnWTakrEL._AC_SL1500_.jpg", "description": "Streak Free Reusable Cleaning Towels With free Gloves, Multi-Purpose Washable Cloth for Kitchen, Windows", category: "household" },
    { id: 5, name: "Glade Fragranced Bathroom Gel", price: 2.00, image: "../images/Household/Glade_Fragranced_Bathroom_Gel_71jHa9sig8L._AC_SL1500_.jpg", "description": "Air Freshener and Discreet Odour Eliminator, Floral Cherries, 180g, Packaging May Vary", category: "household" },
    { id: 6, name: "SXhyf Cleaning Brush - Hard Bristle Crevice Cleaning Brush", price: 5.49, image: "../images/Household/SXhyf_Cleaning_Brush_61k5ovX8WML._AC_SL1263_.jpg", "description": "Multifunctional Gap Cleaning Scrub Brush, Grout Brush, Cleaning Products for Household Use, Home, Kitchen, Bathroom, Window, Vehicle", category: "household" },
    { id: 7, name: "Domestos Power Foam Arctic Fresh Toilet & Bathroom Cleaner Spray", price: 2.00, image: "../images/Household/Domestos_Power_Foam_Arctic_Fresh_Toilet_Bathroom_Cleaner_Spray_71cFV1rVcjL._AC_SL1500_.jpg", "description": "Domestos Power Foam Arctic Fresh Toilet & Bathroom Cleaner Spray is a toilet and bathroom cleaner that eliminates germs* in the hardest-to-reach places.", category: "household" },
    { id: 8, name: "Asdirne Scissors, Stainless Steel Blades, Soft Grip Handle, Suitable for Households,Offices and Schools, Blue/Grey, 4 pcs/Pack", price: 6.99, image: "../images/Household/Asdirne_Scissors_61JU45YdcBL._AC_SL1000_.jpg", "description": "The premium stainless steel blades with sharp cutters, can easily cut papers. The blades are securely embedded in the handle to avoid separations and handle damages.", category: "household" },
    { id: 9, name: "Elbow Grease Rubber Gloves (Medium)", price: 1.29, image: "../images/Household/Elbow_Grease_Rubber_Gloves_(Medium)_81TWpbEP1zL._AC_SL1500_.jpg", "description": "Cotton Lined, Super Strong, Non-Slip Household Cleaning Gloves", category: "household" },
    { id: 10, name: "Leebein Electric Spin Scrubber", price: 29.96, image: "../images/Household/Leebein_Electric_Spin_Scrubber_71aQbSwuNxL._AC_SL1500_.jpg", "description": "Cordless Cleaning Brush with 8 Replaceable Brush Heads, Extendable Long Handle Bathroom Cleaning Scrubber, 300/400RPM Spin Scrubber for Bathroom Kitchen Floor Tile", category: "household" },
    { id: 11, name: "Air Wick Cherry Blossom & Raspberry", price: 5.50, image: "../images/Household/Air_Wick_Cherry_Blossom_Raspberry_81rpZ5Yom8L._AC_SL1500_.jpg", "description": "Advanced Electrical Plug-in Kit 19ml, Lasts for up to 100 Days, Air Freshener", category: "household" },
    
    { id: 12, name: "UpCircle Bamboo Cotton Buds - 200 Pieces", price: 4.50, image: "../images/Household/UpCircle_Bamboo_Cotton_Buds_200_Pieces_713AzRHXYeL._AC_SL1500_.jpg", "description": "Biodegradable, Sustainable, Plastic-Free, Fully Recyclable Ear Buds - A Staple For Any Bathroom", category: "household" },
    { id: 13, name: "VTL® 60 Litre Black Plastic Swing Bin", price: 12.99, image: "../images/Household/VTL_60Litre_Black_Plastic_Swing_Bin_41zsWWR1IuL._SL1500_.jpg", "description": "Sleek black finish adds sophistication to any setting, making it suitable for kitchens, offices, bathrooms, and more.", category: "household" },
    { id: 14, name: "The Household Fortress Protocol", price: 9.99, image: "../images/Household/The_Household_Fortress_Protocol_81BLGy6sYdL._SL1500_.jpg", "description": "A Complete Preparedness Handbook for Families Facing Supply Chain Disruption, Power Outages, Economic Instability, Communication and Survival in Times of Global Crisis", category: "household" },
    { id: 15, name: "Kitchen Roll - 2 Ply Strong & Absorbent Paper Towels", price: 24.99, image: "../images/Household/Kitchen_Roll_2Ply_Strong_Absorbent_Paper_Towels_616dBYIdY2L._AC_SL1280_.jpg", "description": "100% Bamboo | Zero Wastage | 100 Sheets per Roll | Ideal for Household Cleaning, Spills & Food Prep (24 Pack)", category: "household" },
    { id: 16, name: "AKIELO+ Digital Battery Tester – Easy Read LCD Display – No Battery Required", price: 5.49, image: "../images/Household/AKIELO+_Digital_Battery_Tester_714Lr6YFoPL._SL1500_.jpg", "description": "Universal Household Battery Checker for Size AA AAA C D 9V 1.5 Cell (Batteries Not Included)", category: "household" },
    { id: 17, name: "Mould Remover Gel, 8 Fl Oz Household Mould and Mildew Remover", price: 7.99, image: "../images/Household/Mould_Remover_Gel_81gQk1WG0XL._AC_SL1500_.jpg", "description": "Household Washing Machine Cleaner for Toilet Washing Machine Seal Bathroom Kitchen Sink Tile Grout Stains", category: "household" },
    { id: 18, name: "ADHD Cleaning Planner Book with Pen", price: 5.29, image: "..//images/Household/ADHD_Cleaning_Planner_Book_with_Pen_71hVEOI1HdL._AC_SL1500_.jpg", "description": "A4 Household Cleaning Schedule Planner Colorful Cleaning List Planners, ADHD Daily Planners Adult Check List for Daily, Weekly, Monthly, Annually Organizer", category: "household" },
    { id: 19, name: "Hassett Green London Boutique Classics Black Pepper & Vetiver", price: 19.99, image: "../images/Household/Hassett_Green_London_Boutique_Classics_Black_Pepper_Vetiver_71UasULXuuL._AC_SL1500_.jpg", "description": "Reed Diffuser Duo Set - 2 x 125ml - Reduced Packaging", category: "household" },
    { id: 20, name: "SUPEER Metal Broom Closet Storage Cupboard with Magnetic Lock", price: 139.99, image: "../images/Household/SUPEER_Metal_Broom_Closet_Storage_Cupboard_with_Magnetic_Lock_715oiaoJWPL._AC_SL1500_.jpg", "description": "Sturdy Steel Cabinet for Cleaners, Cleaning Supplies, Laundry and Household Accessories | 70x30x165 cm | Black", category: "household" },
    { id: 21, name: "Price's - Household Pet Jar Candle - Odour Eliminating Candle", price: 4.00, image: "../images/Household/Price's_Household_Pet_Jar_Candle_Odour_Eliminating_Candle_61dKx638doL._AC_SL1500_.jpg", "description": "Made With Orange, Lemon & Thyme Extracts - Clean, Fresh, Quality Fragrance - Long Lasting Scent [Energy Class A]", category: "household" },
    { id: 22, name: "Russell Hobbs 2 Slice Toaster", price: 37.50, image: "../images/Household/Russell_Hobbs_2_Slice_Toaster_61iSaTYzkiL._AC_SL1500_.jpg", "description": "Brontë Stone (Extra wide slots, 6 Browning levels, Lift & Look function, Lift high feature), 980W, Frozen/Cancel/Reheat function with Indicator light", category: "household" },
    { id: 23, name: "Professional Enzyme Odour & Urine Remover 2 x 5L", price: 27.99, image: "../images/Household/Professional_Enzyme_Odour_Urine_Remover_71lPL0-fXdL._AC_SL1500_.jpg", "description": "Ultimate Stain & Odour Solution for Pet & Household - Carpet & Upholstery Cleaner", category: "household" },
    { id: 24, name: "4 x Green Household Soap 125g", price: 3.99, image: "../images/Household/Green_Household_Soap_41zwDMPyo7L._AC_.jpg", "description": "Laudry Soap Traditional Pre Wash Soap Bar", category: "household" },
    { id: 25, name: "Long Handled Dustpan and Brush, Broom and Dustpan Set", price: 16.98, image: "../images/Household/Long_Handled_Dustpan_Brush_Broom_Dustpan_Set_71zStUv3yjL._AC_SL1500_.jpg", "description": "Household Dust pan Combo with 54 Inch Handle for Indoor Outdoor Household Cleaning and Sweeping (Yellow)", category: "household" },
    { id: 26, name: "6Pcs Chandelier Lampshade, Household Modern", price: 26.19, image: "../images/Household/6Pcs_Chandelier_Lampshade_Household_Modern_51L7RA+kc2L._AC_SL1500_.jpg", "description": "E14 Clip On Fabric Lampshade Small Lamp Shade, Cream‑Coloured Droplight Wall Lamp Shade Accessory", category: "household" },
    { id: 27, name: "Unscented White Household Candles 13.5cm - 2 Packs of 12 (Total of24)", price: 9.99, image: "../images/Household/Unscented_White_Household_Candles_71Ihm8zDxWL._AC_SL1500_.jpg", "description": "Shabbos/Shabbat Candles for Power Cuts, Emergency, Prayer, Vigil, Church, Long Burning, Decorative & Daily Use [Energy Class A]", category: "household" },
    { id: 28, name: "Rotary Cheese Grater with Handle", price: 19.99, image: "../images/Household/Rotary_Cheese_Grater_with_Handle_61PSb15uO5L._AC_SL1500_.jpg", "description": "Manual Speed Round Cheese Shredder with Strong Suction Base, Easy to Use Potato Hashbrown Shredder with 3 Replaceable Stainless Steel Drum Blades (Black)", category: "household" },
    { id: 29, name: "2 Pack Household Voltage Stabilizer", price: 14.99, image: "../images/Household/2_Pack_Household_Voltage_Stabilizer_61IdSyMl7rL._AC_SL1254_.jpg", "description": "220V Household Over & Under Voltage Stabiliser Socket, Surge Spike Protection Wall Plug for Fridge TV Air Conditioner Washing Machine", category: "household" },
    { id: 30, name: "IGNPION Woven Square Tissue Holder Seagrass Facial Tissue", price: 15.99, image: "../images/Household/IGNPION_Woven_Square_Tissue_Holder_Seagrass_Facial_Tissue_81N3ym13jtL._AC_SL1500_.jpg", "description": "Box Cover Decorative Household Cube Tissue Organizer Box with Remote Control Storage Holder for House Office Car Hotel, Caramels", category: "household" },
    { id: 31, name: "Sightday Medicine Storage Box", price: 16.99, image: "../images/Household/Sightday_Medicine_Storage_Box_71bg5xw1jRL._AC_SL1500_.jpg", "description": "Household Medicine Storage Box Organiser,Double Layers First Aid Box,Multi Grid Portable with Lid Medication Cabinet for Home(Green-L)", category: "household" },
    { id: 32, name: "Bio-D Washing Powder | 2 Kg | Upto 33 Washes", price: 13.45, image: "../images/Household/Bio-D_Washing_Powder_71fAUeyHipL._AC_SL1500_.jpg", "description": "Concentrated Non-Bio Laundry Detergent | Fragrance Free & Hypoallergenic | Allergy UK Approved | Vegan & Cruelty Free", category: "household" },
]

const stationery = [
    { id: 1, name: "A4 Notebook", price: 4.50, image: "../images/Stationery/A4-Notebook-89410080.png", "description": "A comprehensive guide filled with useful resources, illustrations, and clear examples for learning.", category: "stationery" },
    { id: 2, name: "Helix Oxford Complete Back to School Stationery Set", price: 22.49, image: "../images/Stationery/Helix_Oxford_Complete_Back_to_School_Stationery_Set_81nkjhDX9TL._AC_SL1392_.jpg", "description": "Comprehensive Helix Oxford school supplies set including Maths Set, Pens, Ruler, Scientific Calculator & More - Ideal for High School or College", category: "stationery" },
    { id: 3, name: "FINDMAG Strong Fridge Magnets", price: 5.99, image: "../images/Stationery/FINDMAG_Strong_Fridge_Magnets_71Rj-XfDKkL._AC_SL1500_.jpg", "description": "8 Pack Magnetic Push Pins for Refrigerator and Noticeboard, Small Whiteboard Magnets for Crafts, Planner, School Office Locker Accessory (Black)", category: "stationery" },
    { id: 4, name: "BLUE GINKGO Desk Organizer", price: 25.99, image: "../images/Stationery/BLUE_GINKGO_Desk_Organizer_614z7w+EtsL._AC_SL1500_.jpg", "description": "Korean-Made Office Storage for Pens, Notes, Mail, and Supplies (White)", category: "stationery" },
    { id: 5, name: "Four Candies 45PCS Stationery Supplies Set", price: 23.74, image: "../images/Stationery/Four_Candies_45PCS_Stationery_Supplies_Set_81Il2flPo7L._AC_SL1500_.jpg", "description": "Pencil Case with 6 Gel Pens, 6 Mechanical Pencils, 12 Highlighters, School Essentials (Black)", category: "stationery" },
    { id: 6, name: "Wonderwall Classic Tamperproof Lockable Green Felt Noticeboard", price: 95.50, image: "../images/Stationery/Wonderwall_Classic_Tamperproof_Lockable_Green_Felt_Noticeboard_51VnayFOtML._AC_SL1200_.jpg", "description": "90 x 60 cm, Aluminium Frame with 2 Safety Locks - Wall Mounted- Ideal for Indoor Message Display, Office, School", category: "stationery" },
    { id: 7, name: "Black Desk Accessories Black Office Supplies", price: 16.99, image: "../images/Stationery/Black_Desk_Accessories_Black_Office_Supplies_61fQqngn5EL._AC_SL1500_.jpg", "description": "Tape and Stapler Dispenser Set for with Large Stapler Tape Dispenser Staple Remover Staples Clips Scissor and Tabs Gifts for Office Clerks", category: "stationery" },
    { id: 8, name: "Desk Organiser File Holder", price: 19.99, image: "../images/Stationery/Desk_Organiser_File_Holder_81xnUZBtWGL._AC_SL1500_.jpg", "description": "5-Tier Paper Letter Tray Organiser with Drawer, 4 Pen Holder, Mesh Desktop Storage with Magazine Holder for Office Supplies (Black)", category: "stationery" },
    { id: 9, name: "BIC Back to School Stationery Set", price: 13.29, image: "../images/Stationery/BIC_Back_to_School_Stationery_Set_81VOwJ4MpkL._AC_SL1500_.jpg", "description": "Assorted Colour Ballpoint Pens, Highlighters and Retractable 4 Colour Pen Multipack - 23 Piece Bundle", category: "stationery" },
    { id: 10, name: "MUNBYN Shipping Scale, 200kg/440lb/1.8oz", price: 35.99, image: "../images/Stationery/MUNBYN_Shipping_Scale_71vR-xFDveL._SL1500_.jpg", "description": "Digital Postal Scale for Packages with Hold/Tare Function, Backlit LCD, Battery & Cable Included, Postage Scale for Small Business,Packages,Luggage,Home Use", category: "stationery" },
    { id: 11, name: "Star Wars Bumper Stationery Set (The Mandalorian Where I Go Design)", price: 11.99, image: "../images/Stationery/Star_Wars_Bumper_Stationery_Set_71dkUij6rmL._AC_SL1080_.jpg", "description": "School Stationery Set and Office Supplies - Official Merchandise", category: "stationery" },
    
    { id: 12, name: "STABILO BOSS ORIGINAL", price: 8.50, image: "../images/Stationery/STABILO_BOSS_ORIGINAL_817qQVERhxL._AC_SL1500_.jpg", "description": "Highlighter - Pack of 8 - Assorted Colours", category: "stationery" },
    { id: 13, name: "27 Pcs Back to School Stationery Set", price: 10.99, image: "../images/Stationery/27_Pcs_Back_to_School_Stationery_Set_714WHKxw+AL._AC_SL1500_.jpg", "description": "Maths Set with Clear Pencil Case, Assorted Stationery Pack with Ballpoint Pens, Highlighters, Pencils, Foldback Clips, Ruler Set, Compasses", category: "stationery" },
    { id: 14, name: "Shuttle Art Dual Tip Brush Pens", price: 29.98, image: "../images/Stationery/Shuttle_Art_Dual_Tip_Brush_Pens_Art_Markers_71w121sNY9L._AC_SL1500_.jpg", "description": "105 Colours Fine and Brush Tip Markers Set with Portable Case & 1 Colouring Book, Felt Tip Colouring Pens for Adults and Kids Colouring Calligraphy Journal Doodling", category: "stationery" },
    { id: 15, name: "APOGO Rollerball Black Gel Pens 16-Pack", price: 7.99, image: "../images/Stationery/APOGO_Rollerball_Black_Gel_Pens_16-Pack_71D2QwwMi0L._AC_SL1500_.jpg", "description": "0.5mm Quick-Drying for Note-Taking and Sketching - School & Office Supplies", category: "stationery" },
    { id: 16, name: "Nyxi Whiteboard, 90cm X 60cm (WxH)", price: 32.99, image: "../images/Stationery/Nyxi_Whiteboard_71xmOalmkdL._AC_SL1500_.jpg", "description": "Dry-Wipe Magnetic Aluminium Frame with Strong Rear Galvanised Zinc Sheet, Comes with 6 X Markers, 10 Magnets, 1 X Duster. for Home, Office, School (900mmx600mm)", category: "stationery" },
    { id: 17, name: "Pencil Erasers Classic Eraser", price: 3.79, image: "../images/Stationery/Pencil_Erasers_Classic_Eraser_71OgSAoPsmL._AC_SL1500_.jpg", "description": "White Plastic Rubbers Erasers for Universal Use in Schools Offices Sketches Paintings Fine Arts Soft 2B Eraser 10 Pcs", category: "stationery" },
    { id: 18, name: "deli Stapler with 640 Staples", price: 7.99, image: "../images/Stationery/deli_Stapler_with_640_Staples_61x3ctb9iXL._AC_SL1500_.jpg", "description": "Desktop Office Stapler, 25 Sheet Capacity, Compact Stapler and Staples Set for Home, School & Office Stationery Supplies Black", category: "stationery" },
    { id: 19, name: "PRT Label Maker Machine with Tape", price: 13.99, image: "../images/Stationery/PRT_Label_Maker_Machine_with_Tape_61BB0MG4ygL._AC_SL1500_.jpg", "description": "Portable Bluetooth Label Printer, Handheld Sticker Maker with Multiple Templates for Home, School, Office Organization, Waterproof Storage Barcode Label- White", category: "stationery" },
    { id: 20, name: "100 A4 Plastic Value Punched Punch Pockets", price: 6.99, image: "../images/Stationery/Plastic_Value_Punched_Punch_Pockets_51zWuH0AIwL._AC_SL1000_.jpg", "description": "10-15 Sheets 30 Micron for Folders Filing Wallets Sleeves", category: "stationery" },
    { id: 21, name: "Parker Jotter Ballpoint Pen", price: 13.49, image: "../images/Stationery/Parker_Jotter_Ballpoint_Pen_71zvXjwBxvL._AC_SL1500_.jpg", "description": "Stainless Steel with Chrome Trim | Medium Point | Handwriting Pens & Stationery Supplies | Blue Ink | Gift Box", category: "stationery" },
    { id: 22, name: "Lychico Desk Organiser", price: 8.99, image: "../images/Stationery/Lychico_Desk_Organiser_71pTYd+rCGL._AC_SL1500_.jpg", "description": "360-Degree Rotating Pencil Cup Organiser With 5-Compartment Desk Organiser, Large Capacity Pencil Pot Cup for Office, Home & School Supplies, Stationery Accessories", category: "stationery" },
    { id: 23, name: "SUPVAN E11 Bluetooth Label", price: 29.99, image: "../images/Stationery/SUPVAN_E11_Bluetooth_Label_71QV-+5fTsL._AC_SL1500_.jpg", "description": "Maker Machine with 4 Tapes, Support Keyboard & App with 30+ Fonts and 660+ Icons, Rechargeable Inkless Labeler for Home, Kitchen, Office, School Organization, Black", category: "stationery" },
    { id: 24, name: "Yafe A5 Spiral Notebooks 5 Pack", price: 9.39, image: "../images/Stationery/Yafe_A5_Spiral_Notebooks_5Pack_81QKDA+olIL._AC_SL1500_.jpg", "description": "Kraft Cover, Lined, 120 Pages | Double Wirebound, Thick Beige Paper, Easy to Carry for School, Office, Travel", category: "stationery" },
    { id: 25, name: "SUIN Gel Pens Black Ink 0.7mm", price: 8.99, image: "../images/Stationery/SUIN_Gel_Pens_Black_Ink_0.7mm_71TZiSMgYOL._AC_SL1500_.jpg", "description": "Retractable Smooth Writing Pens with Soft Grip, 5 Pack Refillable Aesthetic Pens with 5 Refills for Journaling, Note Taking, Office & School", category: "stationery" },
    { id: 26, name: "Helix Pringles Desk Stationery Set", price: 5.69, image: "../images/Stationery/Helix_Pringles_Desk_Stationery_Set_71NzT9ENM2L._AC_SL1500_.jpg", "description": "Elevate Your Workspace with Our Eco-Friendly Stationery Desk Set! Transform your desk into a hub of creativity and organization with our meticulously curated stationery set. This set includes.", category: "stationery" },
    { id: 27, name: "AFMAT Fully Automatic Electric Pencil Sharpener for Colored Pencils 7-11.5mm", price: 30.49, image: "../images/Stationery/AFMAT_Fully_Automatic_Electric_Pencil_Sharpener_71JT55om+-L._AC_SL1500_.jpg", "description": "Auto in&Out, Rechargeable Hands-Free Pencil Sharpener with Container for School,Home,Classroom,Battery Operated,Black PSX5", category: "stationery" },
    { id: 28, name: "Rapesco 1808 Transparent Adhesive Tape Rolls, 26 mm x 66 m, Clear Refills, Pack of 8", price: 7.81, image: "../images/Stationery/Rapesco_1808_Transparent_Adhesive_Tape_71f5J63YHbL._AC_SL1500_.jpg", "description": "Strong, anti-tangle, and moisture-resistant adhesive tape offering long-lasting adhesion, making it suitable for applications requiring a reliable seal", category: "stationery" },
    { id: 29, name: "ABC life Expanding File Folder", price: 10.98, image: "../images/Stationery/ABC_life_Expanding_File_Folder_81QHXerHGpL._AC_SL1500_.jpg", "description": "12 Pockets A4 Accordion File Organiser, Portable Rainbow Document Filing Box, Accordian Monthly Bill Receipt Paperwork Organiser Storage for Home & Office & School", category: "stationery" },
    { id: 30, name: "Pocket Size Notebook", price: 13.71, image: "../images/Stationery/Pocket_Size_Notebook_714TV5XezYL._AC_SL1500_.jpg", "description": "Mini Diary,Pocket Size Notebook | For Business, Student, Travel, Office, Study, Daily, School, Work, Meetings", category: "stationery" },
    { id: 31, name: "Rapesco PF827PB2 Germ-Savvy Antibacterial", price: 8.92, image: "../images/Stationery/Rapesco_1808_Transparent_Adhesive_Tape_71f5J63YHbL._AC_SL1500_.jpg", "description": "2-Hole Punch, 30 Sheet Capacity, Black", category: "stationery" },
    { id: 32, name: "Dragon Touch Calendar", price: 160.98, image: "../images/Stationery/Dragon_Touch_Calendar_71MRGrqf3+L._AC_SL1500_.jpg", "description": "15.6 Digital Calendar Family Wall Planner, 1080P Full HD Interactive Touchscreen, Smart Chore Chart and Home Organization, Gift for Busy Families Scheduling-Black", category: "stationery" },
]

// ==========================================
// 4.2 Setting up the Dictionary in JavaScript - the "translator map" object
// ==========================================

const productDataMap = {
    grocery: grocery,
    household: household,
    stationery: stationery
};

// ==========================================
// 5. FOOTER COMPONENT
// ==========================================

// Finds the <span> with ID 'year' in the footer and sets it to the current calendar year.
document.getElementById("year").textContent = new Date().getFullYear();




