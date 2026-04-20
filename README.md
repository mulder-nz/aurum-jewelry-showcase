# Aurum & Co. — 3D Jewelry Showcase

A luxury, immersive 3D jewelry showcase built with React, Three.js, and Framer Motion. Inspired by the [WebGI Jewelry demo](https://github.com/ektogamat/webgi-jewelry), but fully self-contained with no proprietary rendering engine.

**Live demo:** https://aurum-jewelry-showcase.replit.app *(deploy to activate)*

---

## What it is

An editorial, scroll-driven jewelry product page featuring:

- **Interactive 3D diamond ring** — vanilla Three.js, PBR gold material, MeshPhysicalMaterial diamond with IOR 2.42 for realistic light refraction
- **Real-time configurator** — switch between Yellow Gold / White Gold / Rose Gold and Round Brilliant / Emerald Cut; the 3D model updates instantly
- **Scroll-driven animation** — ring tilts and floats as you scroll
- **Cinematic UI** — Cormorant Garamond + DM Sans, near-black palette, warm gold accents, Framer Motion scroll-reveal animations
- **AI-generated imagery** — macro diamond, gold band, engraving detail, lifestyle shots

---

## Tech stack

| Layer | Tech |
|---|---|
| Framework | React 19 + TypeScript |
| Build tool | Vite 7 |
| 3D rendering | Three.js (vanilla, no R3F — React 19 compatible) |
| Animation | Framer Motion |
| Styling | Tailwind CSS v4 |
| Monorepo | pnpm workspaces |
| Icons | Lucide React |

---

## Project structure

```
artifacts/jewelry-showcase/
├── src/
│   ├── components/
│   │   └── Ring3D.tsx        ← Self-contained 3D ring component
│   ├── pages/
│   │   └── Home.tsx          ← Full showcase page
│   ├── assets/               ← AI-generated jewelry images
│   ├── App.tsx
│   └── index.css             ← Theme variables + Google Fonts
├── vite.config.ts
└── package.json
```

---

## Using Ring3D in your own React project

`Ring3D` is a self-contained component. To use it in any React + Vite project:

**1. Copy the file**
```
src/components/Ring3D.tsx  →  your-project/src/components/Ring3D.tsx
```

**2. Install dependencies**
```bash
npm install three @types/three
```

**3. Use it**
```tsx
import { Ring3D } from './components/Ring3D';

function App() {
  return (
    // Needs a sized container
    <div style={{ width: '100%', height: '600px', position: 'relative' }}>
      <Ring3D
        metalColor="#d4a843"   // yellow gold hex
        stoneCut="round"       // "round" | "emerald"
        scrollProgress={0}     // 0–1, drives tilt animation
      />
    </div>
  );
}
```

**Ring3D props**

| Prop | Type | Default | Description |
|---|---|---|---|
| `metalColor` | `string` | required | Hex color for gold PBR material |
| `stoneCut` | `string` | required | `"round"` or `"emerald"` |
| `scrollProgress` | `number` | `0` | 0–1 scroll value, tilts ring on scroll |

The component is fully self-cleaning (disposes renderer, controls, event listeners on unmount) and handles WebGL unavailability gracefully.

---

## Running locally

```bash
# Install dependencies
pnpm install

# Start the dev server
pnpm --filter @workspace/jewelry-showcase run dev
```

The app runs on `http://localhost:<PORT>` (port is auto-assigned by the workspace).

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for setup and workflow.

---

## License

MIT
