# Specification

## Summary
**Goal:** Add a prominent “Create Mod” section on creator pages and introduce 30-second ad placements plus mandatory 60-second ad gating after creators publish/save.

**Planned changes:**
- Add a reusable “Create Mod” section (Card/CTA) that links to `/create`, rendered above main content (and above any tab navigation where present).
- Place the “Create Mod” section at the top of `/character-showcase` and at the top of `/story-mode/edit/$storyId` above the editor content (and above tabs if present).
- Create a reusable 30-second ad placement component with clear “Advertisement” labeling and a visible countdown timer while playing.
- Embed the 30-second ad placement on at least the Landing page (`/`) and Dashboard (`/dashboard`) within the frontend layout.
- Add a mandatory, non-dismissible 60-second ad modal gate after successful Story Mode save navigation and after successful Character Showcase publish/update; include “Advertisement” labeling, countdown, and a fallback message if video fails to load while still enforcing the countdown.
- Apply a cohesive modern theme for the new Create Mod section and all ad UI, consistent across placements and avoiding a blue/purple primary look.

**User-visible outcome:** Creators see a “Create Mod” call-to-action above creator experiences, users see 30-second ad experiences on key pages, and creators must complete a 60-second ad watch gate after saving/publishing before continuing.
