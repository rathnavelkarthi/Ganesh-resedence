# Preferred Tech Stack & Implementation Rules

When generating code or UI components for this brand, you **MUST** strictly adhere to the following technology choices.

## Core Stack
* **Framework:** React 19 (TypeScript preferred, Functional Components & Hooks)
* **Build Tool:** Vite
* **Styling Engine:** Tailwind CSS 4.0 (Mandatory. Do not use plain CSS or styled-components unless explicitly asked.)
* **Component Library:** shadcn/ui (Use these primitives as the base for all new components.)
* **Animations:** Framer Motion (Smooth page transitions and micro-interactions)
* **Icons:** Lucide React
* **Charts:** Recharts

## Implementation Guidelines

### 1. Tailwind Usage
* Use utility classes directly in JSX.
* Utilize the color tokens defined in `design-tokens.json` mapped via Tailwind config (e.g., `text-primary`, `bg-secondary`).
* **Mobile-First:** Ensure all layouts use mobile-first responsive utilities (`md:`, `lg:`).

### 2. Component Patterns
* **Buttons:** Primary actions must use the solid Primary color. Secondary actions should use the 'Ghost' or 'Outline' variants. Large tap targets are required for mobile usability.
* **Forms:** Labels must always be placed *above* input fields. Use standard Tailwind spacing (e.g., `gap-4` between form items).
* **Layout:** Use Flexbox and CSS Grid via Tailwind utilities for all layout structures.

### 3. Forbidden Patterns
* Do NOT use jQuery.
* Do NOT use Bootstrap classes.
* Do NOT create new CSS files; keep styles located within component files via Tailwind.
