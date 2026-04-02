# PRTG Sidekick — NEO Platform

> See also: [AGENTS.md](./AGENTS.md) for the NEO agent architecture, data flow design, and agent-specific details.

## Project Overview
PRTG Sidekick is an AI-powered companion app for PRTG Network Monitor. It provides agentic AI capabilities that help IT admins monitor more effectively through coverage gap detection, alert noise reduction, root cause analysis, natural language querying, and impact tracking.

## Tech Stack
- **Framework**: React 19 + Vite 8
- **Styling**: Tailwind CSS 4 with Paessler Spectrum design system tokens
- **Charts**: Recharts
- **Icons**: Lucide React
- **Deployment**: GitHub Pages via GitHub Actions

## Architecture
- Single-page app with sidebar navigation routing between agent modules
- All components in `src/components/`
- Design tokens defined as CSS variables in `src/index.css` (dark/light themes)
- Currently uses mock data — no live PRTG API or LLM integration yet (prototype stage)

## Design System
- Uses Paessler Spectrum design tokens via `sp-*` Tailwind color classes
- Status colors: `sp-up` (green), `sp-down` (red), `sp-warning` (yellow), `sp-unusual` (orange)
- Background surfaces: `sp-bg-base` < `sp-bg-raised` < `sp-bg-surface` (layered elevation)
- Text hierarchy: `sp-text-brand` > `sp-text-base` > `sp-text-alt` > `sp-text-secondary` > `sp-text-tertiary`
- Border radius: 4px (small), 6px (buttons), 8px (cards), 12px (panels)
- Font sizes: 10px (labels), 11px (captions), 12px (body small), 13px (body), 14px (headings), 20px (page titles)

## Component Patterns
- Each agent/view is a standalone component with its own mock data
- Cards use `bg-sp-bg-raised rounded-[12px] border border-sp-border-subtle p-4`
- Section headers: `text-[14px] font-medium text-sp-text-brand`
- Labels: `text-[10px] font-bold text-sp-text-tertiary uppercase tracking-[0.06em]`
- Buttons: `rounded-[4px] bg-sp-accent text-white text-[12px] font-bold`
- Status badges: `text-[10px] px-1.5 py-0.5 rounded-[4px] font-bold` + status color bg/text

## Commands
- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run lint` — ESLint check
- `npm run preview` — preview production build locally

## Conventions
- No TypeScript — plain JSX
- No state management library — React hooks only
- Prefer Tailwind classes over CSS modules
- Mock data is co-located at the top of each component file
- Responsive layouts use Tailwind grid (grid-cols-5, grid-cols-2, etc.)
- Animations: `transition-all duration-200` for interactive elements
