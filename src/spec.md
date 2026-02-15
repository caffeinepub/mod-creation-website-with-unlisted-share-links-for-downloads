# Specification

## Summary
**Goal:** Persist each mod’s on/off (enabled/disabled) toggle in the backend so the same state loads across all devices, while enforcing proper access control and handling disabled mods cleanly.

**Planned changes:**
- Store each mod’s enabled/disabled state in the backend and return it to the creator when loading mod management on any device.
- Add backend authorization so only the mod creator (or an admin) can read or update a mod’s enabled state.
- Block public/unlisted access to disabled mods so fetching by unlistedId fails while disabled and succeeds again when re-enabled.
- Update the mod management page to show an on/off toggle below the share link section that loads state from the backend and updates it via a backend mutation, with loading + success/error feedback in English.
- Update the public mod page to show an English “mod unavailable/disabled” message (and hide download/share actions) when the backend denies access due to the mod being disabled.

**User-visible outcome:** Mod creators can toggle a mod on/off on one device and see the same state on other devices (including consoles); disabled mods are inaccessible via unlisted links and public pages show a clear “unavailable/disabled” message instead of broken UI.
