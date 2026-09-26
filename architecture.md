# Baskit Shopping List --- Architecture

> This document is the living architectural reference for Baskit
> Shopping List. It describes the architecture that currently exists in
> the project, the responsibilities of its major parts, important
> architectural decisions, and known future considerations.
>
> **Principle:** Document the architecture that exists today. Future
> technologies and possible production improvements must be clearly
> identified as future considerations rather than being represented as
> part of the current system.

------------------------------------------------------------------------

## 1. Architecture Overview

Baskit is currently a client-side shopping-list web application built
with HTML, CSS, and JavaScript.

The current architecture is intentionally front-end focused. The browser
is responsible for rendering the interface, managing application state,
handling user interactions, performing product searches, rendering
product data, and persisting selected state through the browser's Local
Storage API.

The project does not currently contain a backend service, database,
authentication system, or external API integration.

Baskit is also a deliberate software-development learning project. Its
architecture is therefore designed to provide useful separation of
responsibilities without introducing unnecessary infrastructure or
abstraction.

### Current architectural model

``` text
                    ┌───────────────────────┐
                    │         User          │
                    └───────────┬───────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │   HTML / CSS / DOM    │
                    │    Presentation UI    │
                    └───────────┬───────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │      JavaScript       │
                    │  Application Logic    │
                    └───────────┬───────────┘
                                │
             ┌──────────────────┼──────────────────┐
             ▼                  ▼                  ▼
      ┌─────────────┐   ┌──────────────┐   ┌──────────────┐
      │ Navigation  │   │ Product Data │   │ Basket State │
      │ & Lifecycle │   │ & Rendering  │   │ & Counters   │
      └─────────────┘   └──────────────┘   └──────────────┘
             │                  │                  │
             └──────────────────┼──────────────────┘
                                ▼
                    ┌───────────────────────┐
                    │    Browser APIs       │
                    │ Local Storage / DOM   │
                    └───────────────────────┘
```

------------------------------------------------------------------------

## 2. Project Structure

The architecture document should reflect the actual project structure
rather than a generic full-stack application layout.

The current project is a front-end application. The exact directory
names should be kept synchronized with the repository as the project
evolves.

A representative structure is:

``` text
[Project Root]/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── app.js
│   └── ...
├── assets/
│   ├── images/
│   └── ...
├── README.md
├── ARCHITECTURE.md
├── LICENSE
└── ...
```

### Important project files

  -----------------------------------------------------------------------
  File / Area                         Responsibility
  ----------------------------------- -----------------------------------
  `index.html`                        Application document structure and
                                      UI templates

  `css/`                              Presentation, layout, responsive
                                      behaviour, and visual styling

  `js/app.js`                         Main application logic, state,
                                      navigation, rendering, and
                                      lifecycle behaviour

  `assets/`                           Static project assets

  `README.md`                         Public project overview and usage
                                      information

  `ARCHITECTURE.md`                   Architectural reference

  `LICENSE`                           EOUSdigital Source-Available
                                      Non-Commercial License (SANCL) v1.0
  -----------------------------------------------------------------------

If the project structure changes, this section should be updated.

------------------------------------------------------------------------

## 3. Application Layers

Baskit does not currently use a formal enterprise layered architecture.
Instead, the application contains several logical responsibilities
within its front-end code.

### 3.1 Presentation Layer

**Responsibility:**

-   HTML document structure
-   Semantic elements
-   Templates
-   Product-card containers
-   Navigation controls
-   Search controls
-   Basket UI
-   Product Details UI

CSS controls:

-   Layout
-   Typography
-   Responsive presentation
-   Visibility states
-   Visual styling

The presentation layer should provide the structure that JavaScript
operates on without taking over application logic.

### 3.2 Navigation and View Lifecycle

**Responsibility:**

-   Determine which application section is visible.
-   Persist the selected route.
-   Restore a route after page refresh.
-   Update navigation UI.
-   Reset relevant UI state when changing sections.
-   Manage section-specific lifecycle behaviour.

The central view-change mechanism is responsible for changing which
section is visible rather than forcing each feature to implement its own
navigation logic.

### 3.3 Product Data

Product information is represented as JavaScript objects grouped into
category arrays.

Current categories include:

-   Grocery
-   Household
-   Stationery

A product-data map translates category names into their corresponding
product arrays.

A combined `allProducts` collection provides a reusable collection for
operations that need to work across all product categories.

### 3.4 Product Rendering

Product rendering converts product data into DOM elements.

The rendering system is reused by:

-   Category views
-   All Products
-   Search results
-   Other product displays that require product cards

The goal is to keep product data separate from the DOM representation of
that data.

### 3.5 Search

Search is responsible for:

1.  Reading the user's query.
2.  Determining the selected search category.
3.  Selecting the appropriate product collection.
4.  Filtering products by name and description.
5.  Updating the search-results heading.
6.  Rendering matching products.

Search should not own unrelated systems such as the promotional slider
lifecycle.

### 3.6 Shopping Basket

The basket is responsible for:

-   Basket state
-   Adding products
-   Increasing quantity
-   Decreasing quantity
-   Editing quantity
-   Deleting individual items
-   Clearing the basket
-   Updating basket counters
-   Rendering basket contents

Product identity uses both product ID and category so that products with
the same ID in different categories remain distinct.

### 3.7 Product Details

The Product Details system is responsible for:

-   Opening a selected product
-   Rendering its details
-   Persisting the active product
-   Restoring the active product after refresh

The active product is stored as data in Local Storage and is
subsequently passed back through the existing product-details rendering
logic.

### 3.8 Promotional Slider

The slider is currently a demonstration feature.

Its current lifecycle:

-   Render the promotional slider for the relevant section.
-   Stop an active timer when leaving a section.
-   Keep the slider visible during search.
-   Do not treat the slider as search-result content.

The current slider lifecycle is intentionally simple. A production
implementation may require a different lifecycle design.

------------------------------------------------------------------------

## 4. State Management

Baskit currently uses simple JavaScript state rather than a dedicated
state-management framework.

### 4.1 In-Memory Application State

Examples include:

-   Current basket contents
-   Active section information
-   Product collections
-   Product rendering state
-   Slider timer state
-   Search-related UI state

State is changed by application events and then reflected in the DOM.

### 4.2 Persistent State

Browser Local Storage is used for selected state that needs to survive a
page refresh.

Current persisted state includes:

-   Saved navigation route
-   Active product for Product Details

Local Storage persists data, not the DOM.

Therefore, after a refresh, Baskit must:

1.  Read the saved data.
2.  Reconstruct the required application state.
3.  Re-render the appropriate interface.

### 4.3 Search State

Search contains both data and UI state.

The search input is cleared when the user changes section so that stale
search information does not remain visible.

When a user searches:

``` text
Query
  ↓
Determine category
  ↓
Select product collection
  ↓
Filter product data
  ↓
Render results
```

The promotional slider remains independent of the search results.

------------------------------------------------------------------------

## 5. Application Lifecycle

The application lifecycle describes how Baskit moves from an initial
page load to an interactive state.

### 5.1 Initialisation

During `DOMContentLoaded`, the application:

1.  Identifies the initial application section.
2.  Initializes/render promotional content where required.
3.  Loads the normal All Products content.
4.  Updates basket counters.
5.  Reads the saved route.
6.  Restores category-specific content where required.
7.  Restores the basket when the saved route is the basket.
8.  Changes to the saved route.
9.  Restores Product Details when the saved route is Product Details and
    an active product has been persisted.

### 5.2 Navigation Lifecycle

The general navigation flow is:

``` text
User selects navigation
        ↓
Read destination
        ↓
Determine category
        ↓
Render required product data
        ↓
Clear stale search UI state
        ↓
Persist route
        ↓
Change visible section
        ↓
Run section lifecycle behaviour
        ↓
Reset scroll position
```

This centralised lifecycle prevents each navigation target from
implementing unrelated versions of the same behaviour.

### 5.3 Refresh Lifecycle

A refresh destroys the current DOM state.

Baskit therefore restores important state from persistent data rather
than expecting the browser to preserve the existing DOM.

------------------------------------------------------------------------

## 6. Navigation Architecture

Navigation uses section-based views within the client-side application.

The main navigation responsibilities are:

-   Read the destination from the navigation element.
-   Determine the selected category.
-   Render category-specific products.
-   Restore the normal All Products display when appropriate.
-   Clear the search input when changing section.
-   Save the route.
-   Change the visible section.

### Special routes

Some views do not represent normal product categories.

Examples include:

-   Product Details
-   Shopping Basket

These views have their own rendering requirements and are excluded from
ordinary category state where appropriate.

### Scroll behaviour

When changing sections, the application resets the browser scroll
position so that the newly displayed section begins at the top of the
viewport.

The project currently uses immediate scroll behaviour rather than
visibly animating the user from the previous section's scroll position.

------------------------------------------------------------------------

## 7. Search Architecture

Search operates on product data rather than searching the rendered DOM.

### Search flow

``` text
User submits search
        ↓
Read query
        ↓
Read selected category
        ↓
Select search pool
        ↓
Filter by product name / description
        ↓
Update heading
        ↓
Display search results
        ↓
Keep promotional slider visible
```

### Search and navigation relationship

Search is temporary UI state.

When the user changes section:

-   The search input is cleared.
-   Normal category/all-products rendering is restored.
-   Search results do not remain as the active product display.

This prevents stale search state from leaking into another section.

------------------------------------------------------------------------

## 8. Shopping Basket Lifecycle

The basket lifecycle is based on JavaScript state and DOM rendering.

### Basket operations

``` text
Add product
    ↓
Update basket state
    ↓
Update counters
    ↓
Render basket
```

For quantity changes:

``` text
Increase / decrease / edit
    ↓
Update item quantity
    ↓
Update basket state
    ↓
Synchronise counters / UI
```

For deletion:

``` text
Delete item
    ↓
Request user confirmation
    ↓
Remove matching basket item
    ↓
Update counters
    ↓
Render basket
```

For clearing the basket:

``` text
Clear basket
    ↓
Request user confirmation
    ↓
Set basket to empty
    ↓
Update counters
    ↓
Render basket
```

------------------------------------------------------------------------

## 9. Product Details Lifecycle

Product Details uses the selected product as persisted application data.

### Opening Product Details

``` text
User selects product
        ↓
Build Product Details view
        ↓
Change route
        ↓
Save route
        ↓
Save active product
```

### Refreshing Product Details

``` text
Page refresh
        ↓
Read saved route
        ↓
Read saved product
        ↓
Pass product to Product Details rendering logic
        ↓
Rebuild Product Details DOM
```

This avoids storing HTML in Local Storage and keeps product data
separate from its presentation.

------------------------------------------------------------------------

## 10. Slider Lifecycle

The promotional slider currently has a deliberately limited lifecycle.

The current implementation stops an active timer when leaving a section.

``` text
Current section
      ↓
Active timer
      ↓
User changes section
      ↓
Stop previous timer
```

The slider does not need to be destroyed when search results are
displayed.

Search therefore does not manipulate the slider DOM.

### Current design decision

The slider is a demonstration feature rather than a production-grade
promotional system.

The current lifecycle is intentionally simple and should not be expanded
merely for architectural completeness.

If Baskit becomes a production application, the slider lifecycle can be
redesigned according to the actual product requirements.

------------------------------------------------------------------------

## 11. Responsibilities and Boundaries

Clear ownership of behaviour is important to prevent unnecessary
coupling.

### Navigation owns

-   Section changes
-   Route persistence
-   Navigation UI
-   Section-level lifecycle behaviour
-   Clearing stale search UI when changing section

### Search owns

-   Reading search input
-   Selecting the search pool
-   Filtering product data
-   Updating search results
-   Updating the search-results heading

### Product rendering owns

-   Converting product objects into product cards
-   Clearing the appropriate product grid
-   Inserting rendered product cards

### Basket owns

-   Basket state
-   Basket item operations
-   Basket rendering
-   Basket counters

### Product Details owns

-   Active product display
-   Saving/restoring active product data
-   Rendering Product Details

### Slider owns

-   Promotional slider rendering
-   Slider timer lifecycle

### Important boundary

Search should not directly destroy or rebuild slider content.

Likewise, the slider should not be responsible for interpreting search
queries or basket state.

Keeping these boundaries clear reduces accidental coupling between
unrelated features.

------------------------------------------------------------------------

## 12. Data Model

### Product

A product currently contains properties such as:

``` text
id
name
price
image
description
category
```

### Product collections

Products are grouped into category arrays.

Current categories:

``` text
grocery
household
stationery
```

### Product data map

The product-data map provides a central translation between category
names and product collections.

Conceptually:

``` text
"grocery"    → grocery
"household"  → household
"stationery" → stationery
```

### All Products collection

`allProducts` combines the current product categories into one
collection for operations that need to search or process all products.

When a new category is added, the application should update the central
product collection rather than duplicating category-combination logic
throughout the application.

------------------------------------------------------------------------

## 13. Data Persistence

### Browser Local Storage

Current persistence mechanism:

**Browser Local Storage**

Current purposes:

-   Persist selected navigation route.
-   Persist the active Product Details product.

### Not currently provided

The current architecture does not provide:

-   Server-side persistence
-   User accounts
-   Authentication
-   Authorisation
-   Database storage
-   Server-side orders
-   Server-side basket storage

Local Storage should therefore be considered a front-end demonstration
and learning mechanism, not a production security boundary or
replacement for a server-side data store.

------------------------------------------------------------------------

## 14. Browser and External Integrations

### Browser APIs

Baskit currently relies on browser capabilities including:

-   DOM APIs
-   Local Storage
-   Event APIs
-   Window APIs
-   Browser scrolling
-   Browser confirmation dialogs where applicable

### External APIs

No external application API is currently required by the architecture.

If external APIs are introduced, this section must be updated with:

-   Service name
-   Purpose
-   Integration method
-   Data exchanged
-   Authentication requirements
-   Relevant licence or terms

------------------------------------------------------------------------

## 15. Security Considerations

Baskit is currently a client-side learning application.

Important security considerations include:

-   Client-side data must be treated as user-controlled.
-   Local Storage must not be treated as a secure credential store.
-   Authentication is not currently implemented.
-   Authorisation is not currently implemented.
-   Production deployment would require appropriate transport security
    and server-side controls.
-   Third-party dependencies and assets must retain their applicable
    licences.
-   Sensitive information should not be stored in Local Storage.

Security requirements should be reassessed if Baskit gains user
accounts, payments, private data, server-side persistence, or other
production functionality.

------------------------------------------------------------------------

## 16. Development and Testing

The project is developed incrementally.

### Development approach

``` text
Identify behaviour
      ↓
Describe desired behaviour
      ↓
Break into smaller steps
      ↓
Identify required browser / JavaScript capability
      ↓
Implement smallest appropriate change
      ↓
Test
      ↓
Investigate unexpected behaviour
      ↓
Refactor when justified
```

### Testing approach

Testing currently focuses on:

-   Manual browser testing
-   User interaction flows
-   Refresh behaviour
-   Navigation behaviour
-   Search behaviour
-   Basket behaviour
-   Product Details restoration
-   UI lifecycle behaviour

Examples of important integration flows include:

``` text
Search → Category → All Products
Search → Search again
Product → Product Details → Refresh
Category → Refresh
Basket → Refresh
Basket → Delete
Basket → Clear
```

Automated testing may be introduced later when the project reaches an
appropriate level of complexity.

------------------------------------------------------------------------

## 17. Architectural Decisions

### ADR-001 --- Client-Side Architecture

**Decision:** Baskit currently uses a front-end-only architecture.

**Reason:** The current project is focused on learning and demonstrating
front-end software-development concepts without introducing unnecessary
backend infrastructure.

**Consequence:** Application data and state are currently managed in the
browser.

------------------------------------------------------------------------

### ADR-002 --- Product Data as JavaScript Objects

**Decision:** Product data is represented as JavaScript objects grouped
into category arrays.

**Reason:** This provides a simple data model that can be reused by
rendering, search, basket, and Product Details functionality.

**Consequence:** The current product catalogue is part of the
client-side application.

------------------------------------------------------------------------

### ADR-003 --- Central Product Data Map

**Decision:** Category names are mapped to their corresponding product
collections through a central product-data map.

**Reason:** This reduces repeated category-selection logic.

**Consequence:** Adding a category should require changes to the central
product-data configuration rather than duplicated search/navigation
logic.

------------------------------------------------------------------------

### ADR-004 --- Combined `allProducts` Collection

**Decision:** Maintain a reusable `allProducts` collection.

**Reason:** Operations such as searching across all categories should
not repeatedly construct the same combined array.

**Consequence:** The combined product collection has a clear
application-level responsibility rather than being created inside search
logic.

------------------------------------------------------------------------

### ADR-005 --- Section-Based Navigation

**Decision:** Baskit uses section-based client-side navigation.

**Reason:** The project can provide multiple application views without
requiring full document navigation for every section.

**Consequence:** Navigation and view lifecycle logic must remain
coordinated.

------------------------------------------------------------------------

### ADR-006 --- Local Storage for Selected Persistent State

**Decision:** Use Local Storage for route persistence and Product
Details restoration.

**Reason:** These values need to survive browser refreshes in the
current front-end architecture.

**Consequence:** State must be reconstructed from stored data after
refresh because Local Storage does not persist the DOM.

------------------------------------------------------------------------

### ADR-007 --- Search State Reset on Navigation

**Decision:** Clear the search input when the user changes section.

**Reason:** Search is temporary UI state and should not remain visible
when the user moves to another section.

**Consequence:** Navigation is responsible for clearing stale search UI
state.

------------------------------------------------------------------------

### ADR-008 --- Search Does Not Own the Slider

**Decision:** Search must not destroy or rebuild promotional slider
content.

**Reason:** The slider has its own lifecycle responsibility.

**Consequence:** Search results can appear while the promotional slider
remains visible.

------------------------------------------------------------------------

### ADR-009 --- Demonstration Slider Lifecycle

**Decision:** Keep the current slider lifecycle deliberately simple.

**Reason:** The slider is currently demonstration functionality rather
than a production promotional system.

**Consequence:** The active timer is stopped when leaving a section,
while the full production lifecycle remains a future consideration.

------------------------------------------------------------------------

## 18. Current Limitations

The current architecture intentionally has limitations.

These include:

-   No backend
-   No database
-   No user authentication
-   No server-side authorisation
-   No server-side basket persistence
-   No production payment system
-   Product data is client-side
-   Local Storage is used for selected state
-   Slider functionality is demonstrational
-   Automated test coverage is limited
-   Production security architecture has not yet been implemented

These limitations are known and should not be mistaken for missing
functionality that must be added immediately.

------------------------------------------------------------------------

## 19. Future Architecture

Future architecture must be introduced only when the project's
requirements justify it.

Potential future areas include:

-   More structured front-end modules
-   React
-   TypeScript
-   Vite or another modern build system
-   Backend API
-   Node.js
-   Server-side authentication
-   PostgreSQL
-   Server-side basket and order persistence
-   Automated testing
-   CI/CD
-   Production monitoring
-   Improved security controls

These technologies are **not part of the current Baskit architecture**.

A future full-stack architecture may conceptually become:

``` text
                    ┌──────────────────┐
                    │      User        │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ Frontend Client  │
                    │ React / TS       │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │    Backend API   │
                    │  Node.js / ...   │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │    PostgreSQL    │
                    └──────────────────┘
```

This diagram is a future consideration only and does not describe the
current implementation.

------------------------------------------------------------------------

## 20. Project Identification

-   **Project Name:** Baskit Shopping List
-   **Architecture Document:** `ARCHITECTURE.md`
-   **Primary Project Owner:** EOUSdigital
-   **Current Architecture:** Front-end client-side application
-   **Current Persistence:** Browser Local Storage
-   **Current Backend:** None
-   **Current Database:** None
-   **Last Architecture Review:** 2026-09-26

The date should be updated when a material architectural change is made.

------------------------------------------------------------------------

## 21. Glossary

  -----------------------------------------------------------------------
  Term                                Meaning
  ----------------------------------- -----------------------------------
  Application State                   Data describing the current state
                                      of the application

  DOM                                 Document Object Model representing
                                      the current HTML document in the
                                      browser

  Lifecycle                           The sequence of events through
                                      which a feature or view is
                                      initialized, changed, and cleaned
                                      up

  Product Data Map                    Mapping between category names and
                                      product collections

  `allProducts`                       Combined product collection used
                                      when an operation needs all
                                      categories

  Route                               Identifier representing the current
                                      application section

  Local Storage                       Browser storage mechanism used to
                                      persist selected client-side data

  Search State                        Temporary state associated with the
                                      current search query and search UI

  Slider Lifecycle                    The process of creating, running,
                                      stopping, and managing the
                                      promotional slider

  View                                A visible application section

  SANCL                               EOUSdigital Source-Available
                                      Non-Commercial License
  -----------------------------------------------------------------------

------------------------------------------------------------------------

## 22. Documentation Maintenance

This document is a living architecture reference.

Update it when a change materially affects:

-   Project structure
-   Application responsibilities
-   State management
-   Navigation
-   Persistence
-   Data models
-   External integrations
-   Security
-   Deployment
-   Major architectural decisions

Do not update this document merely because an implementation detail
changes if the architectural responsibility remains the same.

When architecture changes, update the relevant section and, where
appropriate, add a new Architectural Decision Record.

The architecture document should remain understandable to both human
developers and AI-assisted development tools.

------------------------------------------------------------------------

## 23. Licence and Third-Party Software

Baskit is licensed under the:

**EOUSdigital Source-Available Non-Commercial License (SANCL) v1.0**

See:

**[LICENSE](./LICENSE)**

SANCL is a source-available licence and is not an OSI-approved Open
Source licence.

Third-party libraries, assets, fonts, images, data, and other materials
may be subject to separate licences. Their applicable copyright and
licence requirements remain in force.

------------------------------------------------------------------------

## 24. References

The original generic architecture template that informed this document
may be retained separately as a reference. It should not be treated as a
description of Baskit's current architecture.

For the current project, this document is the authoritative
architectural reference.

------------------------------------------------------------------------

## 25. Acknowledgements

This architecture document is adapted from the project's original
architecture-documentation template and has been revised to describe
Baskit's actual front-end architecture, state management, lifecycle
behaviour, responsibilities, boundaries, and current limitations.
