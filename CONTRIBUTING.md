# Contributing to Aurum & Co. Jewelry Showcase

Thank you for contributing. This guide will get you set up quickly.

---

## Getting started

### Prerequisites

- Node.js 20+
- pnpm 9+ (`npm install -g pnpm`)

### Setup

```bash
git clone https://github.com/mulder-nz/aurum-jewelry-showcase.git
cd aurum-jewelry-showcase
pnpm install
pnpm --filter @workspace/jewelry-showcase run dev
```

The showcase runs at the local URL printed in your terminal.

---

## Project overview

This is a **pnpm monorepo**. The jewelry showcase lives in `artifacts/jewelry-showcase/`. There's also a shared API server in `artifacts/api-server/` (unused by the showcase currently, available for future backend features).

Key files to know:

| File | Purpose |
|---|---|
| `artifacts/jewelry-showcase/src/components/Ring3D.tsx` | All 3D logic — Three.js scene, materials, lighting, controls |
| `artifacts/jewelry-showcase/src/pages/Home.tsx` | Full page layout, configurator state, scroll hooks |
| `artifacts/jewelry-showcase/src/index.css` | Theme variables (colors, fonts, radius) |

---

## How to make changes

### Changing the 3D ring

Everything is in `Ring3D.tsx`. The component initialises a Three.js scene in a `useEffect` hook. Key areas:

- **Band geometry** — `TorusGeometry` around line 75
- **Diamond material** — `MeshPhysicalMaterial` with `transmission`, `ior`, `thickness`
- **Gold material** — `MeshStandardMaterial` with high `metalness`, driven by the `metalColor` prop
- **Lighting** — multiple `PointLight` and `DirectionalLight` objects; sparkle lights animate in the render loop for caustics

When adding metal colors or stone cuts, update the `METALS` / `CUTS` arrays in `Home.tsx` and the geometry/material logic in `Ring3D.tsx`.

### Changing the page

`Home.tsx` manages:
- `activeMetal` / `activeCut` state → passed as props to `Ring3D`
- `scrollProgress` state → fed from Framer Motion's `useScroll`
- Section layout with Framer Motion `whileInView` animations

### Theming

Colors are CSS custom properties in `index.css` under `:root, .dark`. All values are HSL without the `hsl()` wrapper — Tailwind CSS v4 composes them. Gold accent is `--primary: 43 74% 60%`.

---

## Branch and PR workflow

1. Fork the repo (or request collaborator access)
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Make changes and commit: `git commit -m "feat: description"`
4. Push and open a Pull Request against `main`
5. PRs need one approval before merging

---

## Commit style

Use conventional commits:

```
feat: add platinum metal option
fix: diamond transmission on mobile Safari
chore: update three.js to 0.171
docs: update Ring3D prop table
```

---

## Adding a new metal

1. Add to `METALS` array in `Home.tsx`:
   ```ts
   { id: 'platinum', name: 'Platinum', color: '#e8e8f0', hex: '#E8E8F0' }
   ```
2. The `Ring3D` component picks up the color automatically via the `metalColor` prop — no changes needed there.

## Adding a new stone cut

1. Add to `CUTS` array in `Home.tsx`
2. In `Ring3D.tsx`, add a new branch in the `stoneGeometry` block (look for `stoneCut === 'emerald'`)

---

## Questions?

Open a GitHub Discussion or drop a message in the repo Issues.
