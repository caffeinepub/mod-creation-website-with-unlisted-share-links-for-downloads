# Specification

## Summary
**Goal:** Simplify mod creation by letting creators type the target game name directly, and require a mod prompt that is stored and shown in mod metadata.

**Planned changes:**
- Update the mod creation wizard Game step to replace the game selector and “Create New Game” dialog with a required freeform text input for game name, and gate Next until it’s non-empty.
- Add a new required Prompt field to the wizard details step with validation consistent with existing fields, and gate proceeding until it’s non-empty.
- Update frontend validation helpers and step gating logic to validate the typed game name and the new prompt field.
- Update backend mod model and APIs to store a freeform game name per mod (no longer dependent on a pre-existing game record) and to require/store/return the prompt field.
- Update createMod calls, query/mutation layer, and generated types so prompt and game name are included end-to-end and compile cleanly.
- Update mod display pages (creator manage and public unlisted) to show game name and prompt as read-only metadata.

**User-visible outcome:** Creators can type the game name for a mod (no game selection/creation UI), must provide a prompt when creating/publishing, and both the game name and prompt are visible on creator and public mod pages.
