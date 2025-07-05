# Telescope Through Time: Interactive Astronomical Calendar

## 🌌 Project Overview

Telescope Through Time is an innovative web application designed to make astronomical education interactive and engaging. It visualizes 365 stars in a spiral galaxy formation, each representing a day of the year, allowing users to explore real astronomical events through an immersive virtual telescope interface.

## ✨ Website Functionality and Unique Features

This application offers a unique way to discover the cosmos with its blend of interactive design and real-time data:

*   *Interactive Celestial Calendar*: Each star in the virtual galaxy corresponds to a specific date in the year (MM-DD format), providing a dynamic astronomical calendar where users can uncover daily space events, missions, and celestial phenomena.
*   *Virtual Telescope Experience*: Users can navigate through the galaxy using a draggable telescope viewport, complete with crosshairs, zoom controls, and coordinate tracking, simulating an authentic astronomical observation.
*   *Real-Time Event Discovery Engine*: Each star fetches real astronomical events for its corresponding date from the NASA API. Events are categorized (Stars, Planets, Comets, Space Missions) and include fascinating facts and links to authoritative astronomy sources.
*   *Advanced Filtering & Controls*: Users can filter stars by event type, adjust zoom levels (1x to 5x magnification), and observe visual indicators (blue stars for events, selected stars with a golden glow).
*   *Dual Navigation Methods*: Explore by directly clicking stars in the galaxy or by using a collapsible monthly calendar for date-specific navigation. Calendar selections automatically center the telescope on the corresponding star.
*   *Responsive Design*: Optimized for various devices, ensuring a seamless experience on desktop, tablet, and mobile.
*   *Authentic Visuals*: Features deep slate backgrounds, stellar gradients, and smooth animations to create an immersive space theme.

## 🛠 Installation and Setup Instructions

To get "Telescope Through Time" up and running on your local machine, follow these steps:

### Prerequisites

Before you begin, ensure you have the following installed:

*   *Node.js*: Version 18 or higher. You can download it from [nodejs.org](https://nodejs.org/).
*   *npm* (Node Package Manager) or *Yarn*: npm comes bundled with Node.js. If you prefer Yarn, you can install it via npm install -g yarn.

### Steps

1.  *Clone the Repository*:
    Open your terminal or command prompt and clone the project repository:
    bash
    git clone <repository_url> # Replace <repository_url> with the actual URL
    cd telescope-through-time
    

2.  *Install Dependencies*:
    Navigate into the project directory and install all required dependencies using npm:
    bash
    npm install
    
    Alternatively, if you use Yarn:
    bash
    yarn install
    

3.  *Run the Development Server*:
    Once the dependencies are installed, start the development server:
    bash
    npm run dev
    
    This will typically start the application on http://localhost:5173 (or another available port). The terminal will provide the exact URL.

4.  *Open in Browser*:
    Open your web browser and navigate to the address provided in your terminal (e.g., http://localhost:5173) to view the application.

## 📦 Dependencies

This project relies on the following key technologies and libraries:

### Core Technologies

*   *React 18*: A JavaScript library for building user interfaces.
*   *TypeScript*: A superset of JavaScript that adds static typing.
*   *Vite*: A fast build tool that provides a lightning-fast development experience.
*   *Tailwind CSS*: A utility-first CSS framework for rapidly building custom designs.

### Project Dependencies (dependencies from package.json)

These are the libraries essential for the application's runtime functionality:

*   lucide-react: Icons for React applications.
*   react: The core React library.
*   react-dom: React package for working with the DOM.

### Development Dependencies (devDependencies from package.json)

These libraries are used during development, testing, and building the project:

*   @eslint/js: ESLint's core JavaScript rules.
*   @types/react: TypeScript type definitions for React.
*   @types/react-dom: TypeScript type definitions for React DOM.
*   @vitejs/plugin-react: Vite plugin for React projects.
*   autoprefixer: PostCSS plugin to parse CSS and add vendor prefixes to CSS rules.
*   eslint: A pluggable linting utility for JavaScript and JSX.
*   eslint-plugin-react-hooks: ESLint rules for React Hooks.
*   eslint-plugin-react-refresh: ESLint plugin for React Fast Refresh.
*   globals: Global variables for ESLint.
*   postcss: A tool for transforming CSS with JavaScript.
*   tailwindcss: The Tailwind CSS framework.
*   typescript: The TypeScript compiler.
*   typescript-eslint: ESLint parser and plugins for TypeScript.
*   vite: The Vite build tool.
