# CLAUDE.md

**FISCUS** — Portuguese IRS tax calculator for ETF/stock investors. Users upload broker CSVs, the tool calculates capital gains using Portuguese tax rules, and generates Modelo 3 XML for submission to Portal das Finanças.

## Stack

- **Next.js 16** with App Router (`src/app/`), Turbopack, React 19
- **Tailwind CSS 4** via `@tailwindcss/postcss` — no `tailwind.config.js`, theme defined in `globals.css` using `@theme inline`
- **shadcn/ui** with Base UI primitives (`@base-ui/react`) instead of Radix UI
- **next-themes** — dark mode, `d` key hotkey (via `ThemeHotkey` in `theme-provider.tsx`)

## Path Aliases

`@/*` maps to `./src/*`. shadcn aliases: `@/components`, `@/ui`, `@/lib`, `@/hooks`.

## Internationalization

The app is localized in PT (Portuguese) and EN (English) via `next-intl`.

- Never hardcode UI strings — always use `useTranslations()`
- Translation files: `src/messages/pt.json` and `src/messages/en.json`
- Default locale: `pt`

## 🧩 COMPONENT POLICY — SHADCN FIRST

Before writing any UI component, follow this decision tree:

```
1. Does shadcn/ui have it? → https://ui.shadcn.com/docs/components
   YES → use it: `npx shadcn@latest add <component>`
         Note: project uses @base-ui/react, not Radix — verify compatibility
   NO  → ask user: "No shadcn component for [X]. Create custom?" → WAIT
         User YES → build custom (SOLID rules apply, one component per file)
         User NO  → find alternative shadcn approach
```

New shadcn components go in `src/components/ui/`. They use `@base-ui/react` primitives (not Radix). Reference `button.tsx` for implementation pattern.

Client components need `"use client"` directive. Everything else is a Server Component by default.
