# Baskit Shopping List

Baskit is a front-end shopping-list project built as part of a
deliberate software-development learning journey.

The project is designed to develop practical understanding of how HTML,
CSS, and JavaScript work together to create an interactive web
application. The emphasis is not only on making the interface work, but
on understanding the reasoning behind the application's structure,
state, navigation, rendering, and user interactions.

## Project Purpose

Baskit is a practical learning project centred around a shopping
experience.

The project is used to practise and demonstrate:

-   Semantic HTML and document structure
-   CSS layout and responsive presentation
-   JavaScript application logic
-   DOM manipulation
-   Event handling
-   Navigation and view management
-   Product data structures
-   Product rendering
-   Search
-   Product details
-   Shopping basket state
-   Quantity management
-   Local Storage and persistence
-   UI state and lifecycle management
-   Reusable JavaScript functions
-   Debugging and problem-solving

The project is intentionally developed incrementally. Features are
introduced when they provide an opportunity to understand a real
software-development problem rather than simply adding features for the
sake of complexity.

## Current Scope

Baskit currently provides a front-end shopping experience including:

-   All Products
-   Grocery
-   Household
-   Stationery
-   Product search
-   Product details
-   Shopping basket
-   Basket quantity controls
-   Basket item deletion
-   Clear basket functionality
-   Product sharing
-   Persistent navigation state
-   Persistent product-details state
-   Promotional slider demonstration
-   Responsive interface behaviour

The project currently focuses on the front end. Back-end services and
database integration are outside the current scope.

## Technology

The project currently uses:

-   HTML
-   CSS
-   JavaScript
-   Browser APIs
-   Local Storage

## Architecture

### Product Data

Product collections are represented as JavaScript arrays containing
product objects.

The application maintains a product-data map so category names can be
translated into their corresponding product collections. A combined
`allProducts` collection is used for operations that need to work across
all categories.

### Navigation

Baskit uses section-based navigation.

Navigation determines which section is displayed, which products are
rendered, which route is persisted, and which related UI state needs to
be reset.

### Search

Search operates against product data rather than directly against the
rendered DOM.

The search process:

1.  Reads the user's query.
2.  Determines the selected category.
3.  Selects the appropriate product collection.
4.  Filters products by name and description.
5.  Displays matching products.
6.  Updates the search-results heading.

Changing section clears the search input so stale search state does not
remain visible when the user navigates elsewhere.

The promotional slider remains visible during search.

### Product Rendering

Product cards are generated from reusable product data and inserted into
the appropriate product grid. The same rendering logic can therefore be
reused across categories and search results.

### Product Details

When a user selects a product, Baskit stores the active product so that
the Product Details view can be restored after a page refresh.

The project demonstrates an important distinction:

> Local Storage persists data; it does not persist the DOM.

The application therefore restores saved product data and rebuilds the
required interface.

### Shopping Basket

Basket state is maintained in JavaScript and synchronised with the
application's UI.

Users can:

-   Add products
-   Increase quantities
-   Decrease quantities
-   Edit quantities
-   Delete individual products
-   Clear the entire basket
-   Share basket items

Product identity uses both the product ID and category, allowing
products with the same ID in different categories to remain distinct.

## Slider

The promotional slider is currently a demonstration feature.

The current implementation stops the active slider timer when leaving a
section. The slider behaviour is intentionally limited at this stage
because the project is primarily concerned with learning and
demonstrating front-end application concepts.

A production implementation may use a different slider lifecycle and
management strategy.

## Persistence

Baskit uses browser Local Storage for selected application state.

Persisted information includes navigation state and the currently
selected product for the Product Details view.

Local Storage is used here as a front-end learning and demonstration
mechanism. It is not intended to represent a production authentication,
security, or server-side persistence architecture.

## Development Approach

Baskit is developed using an incremental problem-solving approach:

1.  Identify a real user-interface or application behaviour.
2.  Describe the desired behaviour.
3.  Break the behaviour into smaller logical steps.
4.  Identify the JavaScript or browser capability required.
5.  Implement the smallest appropriate change.
6.  Test the behaviour.
7.  Investigate unexpected behaviour.
8.  Refactor when the design genuinely benefits from it.

The project deliberately values understanding over memorisation.

## Learning Context

Baskit is part of a broader software-development learning programme.

The project is not intended to represent a production-ready commercial
application. Its primary purpose is to provide a realistic environment
in which software-development concepts can be learned, applied, tested,
debugged, and reviewed.

The project is progressively assessed for correctness, organisation,
state management, reusability, maintainability, user experience,
understanding of browser behaviour, and problem-solving ability.

## Project Status

Baskit is an active learning project.

The current front-end implementation is functional, while some
architectural decisions are intentionally kept simple or demonstrational
so that more advanced concepts can be introduced at the appropriate
stage of the learning journey.

## Licence

Baskit is licensed under the **EOUSdigital Source-Available
Non-Commercial License (SANCL) v1.0**.

This is a source-available licence and is **not an OSI-approved Open
Source licence**.

Commercial use is not permitted under SANCL v1.0 without a separate
written commercial licence from EOUSdigital.

See the complete licence:

**[LICENSE](./LICENSE)**

For the full terms and conditions, refer to the `LICENSE` file included
with this project.

## Copyright

Copyright (c) 2021--2026 EOUSdigital

EOUSdigital Source-Available Non-Commercial License (SANCL) v1.0
