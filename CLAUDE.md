# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with host binding (accessible externally)
- `npm run build` - Build production site to `./dist/`
- `npm run preview` - Preview production build locally
- `npm run astro` - Run Astro CLI commands

## Project Architecture

This is an Astro 5 project for the "3&3" newsletter website, configured for server-side rendering and deployed to Vercel.

### Tech Stack
- **Framework**: Astro 5 with React integration
- **Styling**: Modular CSS with design tokens and CSS layers
- **Deployment**: Vercel (configured via `@astrojs/vercel` adapter)
- **Analytics**: Pirsch analytics integration

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── Head.astro      # SEO and meta tags component
│   ├── Welcome.astro   # Default Astro welcome component (likely unused)
│   └── SignUpFormReact.jsx # Newsletter signup form (React)
├── layouts/
│   └── Layout.astro    # Base page layout
├── pages/
│   └── index.astro     # Homepage
├── styles/
│   ├── modules/        # CSS design tokens and utilities
│   ├── stylebase.css   # Main CSS imports with layers
│   └── ugly.css        # Additional global styles
└── assets/             # Static assets (SVGs, images)
```

### Key Features
- Newsletter signup form using Loops.so API
- Modular CSS architecture with design tokens
- Server-side rendering configuration
- Social media integration (Bluesky, YouTube, Are.na, Luma)
- Comprehensive SEO and meta tag setup

### CSS Architecture
The project uses a layered CSS approach with design tokens:
- **Layers**: webfont → reset → token → utility → composition → global
- **Modules**: Separate files for colors, typography, spacing, border-radius, etc.
- **Design System**: Uses utility classes with `u:` prefix for typography scales

### Deployment
- Configured for Vercel deployment via Pierre CI system
- Server output mode enabled for dynamic features
- Project configured with specific Vercel org/project IDs in `.pierre/ci/vercel.js`

### Development Notes
- Uses React 19 for interactive components
- TypeScript configured with strict mode
- VSCode extension recommendations include Astro language support
- No linting or testing scripts currently configured