---
name: frontend-skill
description: Build responsive, animated frontend pages with reusable components, layouts, and styling. Use for modern web apps and landing pages.
---

# Frontend Skill

## Instructions

1. **Page & Layout Structure**
   - Build complete pages: Home, About, Contact, Blog, Dashboard
   - Use semantic HTML: header, main, footer, sections
   - Apply responsive grids or flex layouts
   - Maintain consistent spacing, typography, and color palette
   - Follow mobile-first design principles

2. **Components**
   - Reusable UI components: buttons, cards, modals, forms, navbar, alerts
   - Component props for flexibility (text, size, color, variant)
   - Consistent design system and spacing
   - Example: a card component that can be reused across pages

3. **Styling**
   - Use CSS, Tailwind, Styled Components, or CSS-in-JS
   - Apply gradients, shadows, hover/focus states
   - Avoid inline styles unless necessary
   - Use CSS variables or themes for scalable styling

4. **Animations & Transitions**
   - Fade-in or slide-up on page load
   - Smooth hover effects for buttons, cards, and links
   - Transition component states (modals, tabs, accordions)
   - Optional parallax or scroll-triggered animations

5. **Interactivity & Accessibility**
   - Handle events and state changes (click, hover, focus)
   - Validate forms and provide clear user feedback
   - Ensure ARIA roles, keyboard navigation, and focus management
   - Test across devices and screen sizes

## Best Practices
- Keep code modular, reusable, and DRY
- Use semantic HTML for SEO and accessibility
- Optimize images and assets for fast loading
- Test responsiveness and accessibility
- Maintain a consistent design system or theme

## Example Structure
```html
<div class="page-container">
  <header class="header bg-white shadow-md">
    <nav class="nav flex justify-between items-center p-4">
      <h1 class="logo animate-fade-in">Brand</h1>
      <ul class="menu flex gap-4">
        <li class="menu-item animate-fade-in-delay">Home</li>
        <li class="menu-item animate-fade-in-delay-2">Features</li>
        <li class="menu-item animate-fade-in-delay-3">Contact</li>
      </ul>
    </nav>
  </header>

  <section class="hero min-h-screen flex flex-col justify-center items-center text-center bg-gradient-to-r from-purple-500 to-indigo-600">
    <h1 class="text-5xl font-bold text-white animate-fade-in">Welcome to Our App</h1>
    <p class="mt-4 text-lg text-white animate-fade-in-delay">Build fast, responsive, and beautiful pages</p>
    <button class="mt-6 px-6 py-3 bg-white text-indigo-600 font-semibold rounded-lg shadow-lg hover:bg-indigo-50 transition-all duration-300 animate-fade-in-delay-2">
      Get Started
    </button>
  </section>

  <main class="features grid grid-cols-1 md:grid-cols-3 gap-6 p-8">
    <div class="card p-4 rounded-lg shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-2 animate-slide-up">
      <h2 class="font-bold text-xl mb-2">Feature 1</h2>
      <p>Some description of feature 1.</p>
    </div>
    <div class="card p-4 rounded-lg shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-2 animate-slide-up-delay-1">
      <h2 class="font-bold text-xl mb-2">Feature 2</h2>
      <p>Some description of feature 2.</p>
    </div>
    <div class="card p-4 rounded-lg shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-2 animate-slide-up-delay-2">
      <h2 class="font-bold text-xl mb-2">Feature 3</h2>
      <p>Some description of feature 3.</p>
    </div>
  </main>

  <section class="cta-section text-center p-8 bg-indigo-50">
    <h2 class="text-3xl font-semibold animate-fade-in">Ready to Get Started?</h2>
    <button class="mt-4 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-300 animate-fade-in-delay">
      Sign Up Now
    </button>
  </section>

  <footer class="footer bg-gray-100 p-4 text-center">
    &copy; 2026 Your Company. All Rights Reserved.
  </footer>
</div>
