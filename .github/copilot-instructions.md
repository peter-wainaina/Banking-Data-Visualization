# Copilot Instructions for Banking-Data-Visualization

## Project Overview

This is a modern banking data visualization dashboard built with React, TypeScript, Vite, and Tailwind CSS. It visualizes data from `Comprehensive_Banking_Database.csv` using interactive charts, KPIs, and filters.

## Architecture & Key Components

- **src/components/**: Main UI components. Charts are in `charts/`, reusable UI in `ui/`, and dashboard logic in files like `banking-dashboard.tsx` and `statsdashboard.tsx`.
- **src/lib/**: Utility functions (see `utils.ts`).
- **src/services/**: Validation logic (`validator.ts`).
- **src/types/**: TypeScript types for banking data (`bankingtypes.ts`).
- **src/utils/**: Data processing, cleaning, mapping, parsing, and business metrics.
- **public/**: Static assets.
- **index.html**: App entry point.
- **Comprehensive_Banking_Database.csv**: Main data source.

## Data Flow

- Data is loaded from the CSV, processed via utilities in `src/utils/`, and passed to components for visualization.
- Charts receive processed data and configuration props.
- Filters and toggles update dashboard state, triggering re-renders.

## Developer Workflows

- **Build**: `npm run build` (uses Vite)
- **Dev Server**: `npm run dev`
- **Type Checking**: `tsc --noEmit`
- **Linting**: `npx eslint .`
- **Styling**: Tailwind CSS, configured in `tailwind.config.js`

## Conventions & Patterns

- **Type Safety**: All data and props use explicit types from `src/types/bankingtypes.ts`.
- **Component Structure**: Prefer functional components. Charts are isolated in `src/components/charts/`.
- **State Management**: Local state via React hooks; dashboard state is lifted to parent components.
- **Data Utilities**: Use `src/utils/` for all data transformation before passing to UI.
- **Validation**: Use `src/services/validator.ts` for input/data validation.
- **Theming**: Theme logic in `theme-provider.tsx` and `theme-toggle.tsx`.

## Integration Points

- **CSV Data**: All visualizations depend on `Comprehensive_Banking_Database.csv`.
- **External Libraries**: React, Vite, Tailwind CSS, ESLint, TypeScript.

## Examples

- To add a new chart, create a component in `src/components/charts/`, use types from `src/types/`, and process data via `src/utils/`.
- To add a new KPI card, update `kpi-cards.tsx` and ensure data is validated and typed.

## Key Files

- `src/components/banking-dashboard.tsx`: Main dashboard logic.
- `src/components/charts/`: All chart components.
- `src/utils/`: Data transformation utilities.
- `src/types/bankingtypes.ts`: Data types.
- `src/services/validator.ts`: Validation logic.

---

For questions or unclear patterns, ask for clarification or examples from maintainers.
