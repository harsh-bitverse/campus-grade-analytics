# Kannada Sangha IITD: Project Guidelines

## Overview
Interactive storytelling website for the Kannada cultural organization at IIT Delhi. Features a scroll-linked 3D globe animation that guides users from Earth through India to IIT Delhi, with sections for culture, announcements, events, and community members.

## Code Style

### React & Component Patterns
- **Single-file app structure**: All components are in `src/main.jsx` (not typical, by design for this phase)
- **Naming**: PascalCase for React components (e.g., `ScrollCamera()`, `JourneyScene()`)
- **Styling**: Global styles in `src/styles.css` + inline className strings
- **Three.js in React**: Use `@react-three/fiber` and `@react-three/drei` hooks (`useFrame()`, `useThree()`)
- **Responsiveness**: Use CSS `clamp()` for fluid scaling rather than media queries

### Naming Conventions
- Hard-coded data arrays: lowercase plural (e.g., `journeyStops[]`, `announcements[]`, `events[]`, `members[]`)
- Component data props: object with descriptive keys (e.g., `{title, description, role, social}`)
- Scroll-linked values: Track `scrollPosition` as a normalized 0-1 value across journey stops

## Architecture

### Layout Structure (7 Major Sections)
1. **Hero/Journey** — Animated 3D scroll experience with Globe + Camera sync
2. **Culture** — Kannada Sangha introduction + image grid
3. **Announcements** — Event cards with QR code placeholders
4. **Events** — Photo-led event showcase (horizontally scrollable)
5. **Our People** — Role-based profile cards
6. **Active Members** — Team roster with names, roles, social links
7. **Builders** — Credits section

### Component Hierarchy
```
App()
├── Hero → JourneyScene()
│   ├── Globe() [3D canvas with scroll-linked rotation]
│   ├── ScrollCamera() [scroll-linked zoom/pan]
│   └── Stars background
├── ScrollJourney() [section with 6 waypoint stops]
├── SectionHeader() [reusable title + kicker pattern]
├── Culture section
├── Announcements, Events, People sections
└── Footer
```

### Scroll-Linked Animation Pattern
- `journeyStops[6]` defines 6 waypoints with z-camera distances and rotation targets
- Scroll position calculates which stop is active, then lerps between stops
- `useFrame()` updates rotation/scale smoothly without janky jumps
- See `ScrollCamera()` and `Globe()` for implementation details

### Data Architecture
All content is **hard-coded** as JavaScript objects (not fetched):
- `journeyStops` — 6 journey stages with descriptive text
- `announcements`, `events` — 3 items each with `{title, description, date, image}`
- `people` — Role templates `{name, role, bio, image}`
- `members` — Team roster with social links `{name, role, social}`
- `IMAGE_CREDITS[]` — Wikimedia Commons attribution links

**Future migration**: These should be replaced with a CMS or API when content scales beyond templates.

## Build and Test

### Development
```bash
npm run dev
# Starts Vite dev server on http://127.0.0.1:5173/
# Hot module reloading enabled
```

### Production Build
```bash
npm run build
# Generates optimized bundle in /dist/
```

### Preview Production Build
```bash
npm run preview
# Serves /dist/ locally for testing before deploy
```

### Dependencies
- **React 19** + **React DOM 19** — UI framework
- **Three.js (0.171)** — 3D graphics engine
- **@react-three/fiber (9.x)** — React renderer for Three.js
- **@react-three/drei (10.x)** — Reusable Three.js utilities
- **Vite 6** — Build tool + dev server
- **@vitejs/plugin-react** — React JSX support

**No explicit `vite.config.js`**: Using Vite defaults; adjust at `${PROJECT_ROOT}/vite.config.js` if needed.

## Conventions

### Color Palette
- **Dark background**: `#07100d` (nearly black)
- **Gold accent**: `#f8c14e` (Kannada cultural warmth)
- **Dark overlay**: `rgba(7, 16, 13, 0.9)` for glassmorphism
- Gradients use soft blue-to-green transitions in animations

### Typography
- **Kannada text**: "Baloo Tamma 2" (Google Fonts)
- **English text**: "Inter" (Google Fonts, system fallback sans-serif)
- Section titles: Large, bold, with gold accent underline
- Body: 14-16px for mobile, scaling with `clamp()`

### CSS Patterns
- **Glassmorphism**: `background: rgba(...); backdrop-filter: blur(10px);`
- **Scroll animations**: CSS `scroll-behavior: smooth;` + inline scroll position tracking
- **Responsive**: Prioritize mobile-first with `clamp()` over breakpoints
- **Animations**: 0.3–0.8s transitions for smooth but not sluggish feel

### Kannada Language Labels
App includes native Kannada labels for accessibility:
- ನಮ್ಮ ಸಂಗ (Our Sangha)
- ಘೋಷಣೆಗಳು (Announcements)
- ಕಾರ್ಯಕ್ರಮಗಳು (Events)
- ನಮ್ಮ ಜನ (Our People)
- ಸದಸ್ಯರು (Members)
- ಕಟ್ಟುವವರು (Builders)

Preserve these labels when refactoring or copying content sections.

### Placeholder Content
Current content is intentionally templated (3 announcements, 3 events, etc.). When adding real data:
1. Replace hard-coded arrays with API calls or imported JSON
2. Keep component props interface stable (don't change `{title, description, ...}`)
3. Verify Three.js canvas still renders during data transitions
4. Test responsive breakpoints on tablet/mobile

### Common Development Gotchas
- **Three.js Canvas Stubs**: The Globe and Stars are rendered inside `<Canvas>` from React Three Fiber. Avoid adding DOM overlays directly inside it; wrap them in a `<group>` or use `<Html>` component from drei.
- **Scroll Hijacking**: Journey section uses `overflow-y: scroll` to control camera. Ensure other sections don't conflict with scroll listeners.
- **Image Attribution**: All images sourced from Wikimedia Commons. Update `IMAGE_CREDITS[]` whenever new images are added.
- **Performance**: Monitor GPU usage on mobile with React DevTools Profiler; Three.js scenes can be heavy on lower-end devices.
