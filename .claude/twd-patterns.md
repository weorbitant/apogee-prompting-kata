# TWD Project Patterns

## Project Configuration

- **Framework**: React 19 (with React Router v7)
- **Vite base path**: `/`
- **Dev server port**: `5173`
- **Entry point**: `src/main.tsx`
- **Public folder**: `public/`

### Relay Commands

```bash
# Run all tests
npx twd-relay run
```

## Standard Imports

```typescript
import { twd, userEvent, screenDom, expect } from "twd-js";
import { describe, it, beforeEach, afterEach } from "twd-js/runner";
```

## Visit Paths

```typescript
await twd.visit("/");
await twd.visit("/some-page");
```

## Standard beforeEach / afterEach

```typescript
beforeEach(() => {
  twd.clearRequestMockRules();
  twd.clearComponentMocks();
  Sinon.restore();
});

afterEach(() => {
  twd.clearRequestMockRules();
});
```

## API Service Types

Service/API types are located in: `src/api/`

Read files in this folder to understand endpoint URLs and response shapes when writing mock data.

## CSS / Component Library

- **Library**: Tailwind CSS v4 + Radix UI (shadcn/ui pattern)
- **Docs**: https://tailwindcss.com/docs , https://www.radix-ui.com/primitives/docs

When writing tests, refer to library docs for correct ARIA roles and component structure.

## Portals and Dialogs

Use `screenDomGlobal` instead of `screenDom` for elements rendered in portals (modals, dropdowns, tooltips):

```typescript
import { screenDomGlobal } from "twd-js";
const modal = screenDomGlobal.getByRole("dialog");
```
