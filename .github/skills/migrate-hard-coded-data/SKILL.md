---
name: migrate-hard-coded-data
description: "Multi-step workflow to migrate hard-coded content arrays (announcements, events, members) to API or CMS. Use when: moving from template data to dynamic content, setting up API integration, converting JavaScript objects to JSON schema, or scaling content management."
---

# Data Migration: Hard-Coded to API/CMS

Migrate template data structures from hard-coded JavaScript arrays to dynamic API endpoints or CMS integration.

## Current State

Hard-coded data arrays in `src/main.jsx`:
- `journeyStops[6]` — Journey waypoints (text, z-position, rotation)
- `announcements[3]` — Event cards (`{title, description, date, image}`)
- `events[3]` — Photo showcases (`{title, description, date, image}`)
- `people[3]` — Role templates (`{name, role, bio, image}`)
- `members[4]` — Team roster (`{name, role, social: {github, linkedin, ...}}`)
- `builders[3]` — Credits (`{name, role, bio}`)
- `IMAGE_CREDITS[]` — Wikimedia Commons attribution links

## Migration Path

### Phase 1: Schema Design (Requires Domain Knowledge)
Define JSON schema for each data type:

**Example: Announcements Schema**
```json
{
  "announcements": [
    {
      "id": "uuid",
      "title": "string",
      "description": "string",
      "date": "ISO8601",
      "image": "url",
      "qrCode": "url or null"
    }
  ]
}
```

**What you need to decide:**
- Should hard-coded data map 1:1 or need restructuring?
- Add new fields (e.g., qrCode URLs, event location for map)?
- Archive old announcements or only show recent?

### Phase 2: API/CMS Choice
Choose one:

- **Headless CMS** (e.g., Contentful, Strapi, Sanity) — Best for scalability + editorial UI
- **Firebase Realtime DB** — Quick integration, good for small teams
- **REST API** (custom backend) — For in-house control, requires backend setup
- **Static JSON** (GitHub or S3) — Simplest, no backend needed, requires manual updates

### Phase 3: React Integration (Agent Can Help)

Replace hard-coded arrays with `fetch()` or API client:

```javascript
// Before
const announcements = [{title: "...", ...}];

// After
const [announcements, setAnnouncements] = useState([]);
useEffect(() => {
  fetch('/api/announcements')
    .then(r => r.json())
    .then(setAnnouncements)
    .catch(err => console.error('Failed to fetch announcements', err));
}, []);
```

**Agent can help:**
- Refactor components to handle loading/error states
- Add fallback UI (skeleton loaders, retry logic)
- Keep prop interfaces stable (`{title, description, ...}`)

### Phase 4: Image Attribution & Hosting

Current: Hard-coded Wikimedia Commons links in `IMAGE_CREDITS[]`

Options:
- Keep Wikimedia for attribution, self-host copies on CDN
- Migrate to cloud storage (Vercel Blob, AWS S3, Cloudinary)
- Update `IMAGE_CREDITS[]` with new URLs and attribution metadata

**Important:** Preserve attribution logic; don't lose source citations.

### Phase 5: Testing & Validation

When migration is complete:
- [ ] All 6 data types (journeyStops, announcements, events, people, members, builders) fetch from API
- [ ] Fallback UI appears while loading (no blank sections)
- [ ] Error states handled gracefully (retry button, default content)
- [ ] Responsive design maintained (Three.js canvas doesn't break during fetch)
- [ ] Mobile performance acceptable with dynamic content
- [ ] Image loading doesn't block page render

## I'm Ready to Help

Ask me to:

1. **"Refactor the announcements section to fetch from an API"** → I'll update component with loading/error states and keep props stable
2. **"Create a JSON schema for events"** → I'll design schema matching Kannada Sangha categories
3. **"Set up Firebase integration for members list"** → I'll add Firestore fetch logic and auth if needed
4. **"Add skeleton loaders during data fetch"** → I'll create placeholder UI components
5. **"Preserve Wikimedia attribution for migrated images"** → I'll restructure `IMAGE_CREDITS[]` to map new URLs to sources

---

## Timeline Estimate

| Phase | Effort | Notes |
|-------|--------|-------|
| Schema Design | 30 min | Coordination with team on data structure |
| API/CMS Setup | 1–3 hours | Depends on choice (CMS UI setup vs. backend config) |
| React Integration | 1–2 hours | Fetch logic, loading states, error handling |
| Image Migration | 30 min–1 hour | CDN setup, attribution mapping |
| Testing & Validation | 1 hour | Mobile, performance, edge cases |
| **Total** | **4–8 hours** | Parallelizable with team (schema + CMS setup concurrently) |

**Next Step:** Choose a data type to start with (e.g., announcements as pilot), then ask for phase 3 help.
