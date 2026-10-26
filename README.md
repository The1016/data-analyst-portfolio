# MD Zawwadul Islam — Analytics Portfolio, v16

A static portfolio with a direct buying path: choose a deliverable, inspect an example, then prepare a scoped quote request.

## What changed

Services now precede the project gallery. A smaller Excel cleanup and owner-summary project provides a clear starting point. Four further service scopes specify deliverables, limits, estimated delivery and revision rounds. Case studies link directly to the matching quote selection. All seven projects, 20 screenshots and reconciliation evidence downloads are retained.

The contact builder prepares a Gmail or ordinary email draft addressed to zawwadul@gmail.com. The visitor reviews and sends it in their own email service. No message, form contents or file is collected by this website. Without JavaScript, service links still open a Gmail draft.

The requested “From noise to structure” particle globe is restored with its scatter/organize control. Motion defaults to On unless the device requests Reduced or the visitor saved a choice. The control cycles On → Off → Reduced → On. An explicit On choice now takes precedence over device reduction and persists after reload; Reduced and Off remain available. CSS, JavaScript effects, scrolling and the globe use the same resolved state. Keyboard interactions update immediately; pointer movement, wheel scrolling or touch restores motion without requiring an extra click. Service headings and cards now have entrance/replay effects. The canvas pauses offscreen, in hidden tabs and behind a case dialog; Off and Reduced show a static illustration. Evidence screenshots remain steady for reading.

## Files and hosting

Open `zawwadul-portfolio.html` as the portable, self-contained version. It embeds fonts, screenshots and example downloads. For hosting, upload `index.html`, `design.css`, `app.js` and `assets/` together from this ZIP. Keep the assets directory structure. The standalone file is optional for hosting.

The workspace Site and public Vercel portfolio are separate deployments. Upload these updated hosting files to the existing Vercel project to update https://data-analyst-portfolio-virid-three.vercel.app/. Updating the workspace Site does not update Vercel or its audience.

The ordinary email link requires a configured mail handler. The Gmail option works through the browser and may require the visitor to sign into their own Google account. Neither option sends automatically.

## Validation

`node checks/interactions.cjs` checks 32 controlled DOM behavior scenarios. `python3 checks/build-download.py /absolute/output/path` creates the portable HTML and complete ZIP, validates archive integrity and compares every packaged hosting file with its source. The same 32 scenarios can be run against the portable script with PORTFOLIO_TEST_HTML and PORTFOLIO_TEST_SCRIPT.

Earlier Chrome preview checks cover the service-to-project-to-quote path and responsive 375px/320px layouts. These are browser viewport checks, not physical-phone, screen-reader, email-delivery or frame-rate measurements. See DESIGN-REVIEW.md for the current motion review and its limits.

V13 Chrome checks observed changing canvas pixels across successive animation frames, scatter/organize state, Off/On and keyboard-to-wheel recovery, and changing service entrance transforms. Timing uses browser frames because cloud rendering can be throttled; this is not a frame-rate benchmark.
The restored globe also fits a 375px iframe (360px content viewport with scrollbar), with no horizontal overflow. This is responsive browser inspection, not a physical phone.

V13 fixes the Reduced/Off trap. The Chrome regression fixture simulates a reduced-motion device in both the media query and CSS, then verifies full On, Off and Reduced, moving canvas pixels and spatial service entrances. Secondary text is brighter; service copy and deliverables are 16px, supporting scope text 15px and small service labels 13px at the default font size.

V14 pacing: hero lines 1.2 seconds, content/section entrances 1 second, project previews 1.1 seconds, neighbouring elements staggered by 80ms (capped at 240ms). Entrances use a gentler deceleration. Globe formation settles more slowly; idle drift is unchanged. Buttons, tabs and dialogs retain their quick response. Reduced fades remain at most 150ms and Off stays static.

V15 changes only the scroll entrance trigger: headings, service cards, report previews and section replays wait until their top passes 78% of viewport height. Intersecting candidates are checked in the existing coalesced scroll/resize frame, then unobserved after revealing. At the bottom of the document, visible content can enter without additional scrolling. V14 durations, easing, the globe and all contact paths are retained.

V15 Chrome checks at 375px and 960px iframe widths (600px height) confirmed that the service card waits at about 510px from the top, then reveals after scrolling its resting position to about 444px. Existing behavior checks cover contact routes, motion modes and navigation. Cloud rendering is throttled; no frame-rate claim is made.


V16 adds three effects: the labelled sample-data cleanup demonstration below the starter offer (with a replay button); a connected preview-image entrance when opening an image-backed case study from a visible project card; and a lime connector that draws between the process steps. The large retail, Excel and reconciliation thumbnails now open their case study; full-size screenshots remain available inside the reader. The hero globe is retained.

The latest scroll trigger is 86% of viewport height, moved closer to the bottom as requested. Existing entrance durations are unchanged. The cleanup illustration waits for its own viewport arrival on small screens. Full motion takes about 2.7 seconds for the entire demonstration; the connected reader image takes 650ms; process connectors take 1 second. Reduced uses short fades, Off shows complete static content, and keyboard input skips movement. Repeated replay cancels previous demo animations; closing a case cancels its image transition.

Chrome checks at 375px and 1280px iframe widths verified the cleanup sequence, connected reader opening, process connector animation, no horizontal page overflow, cancellation with Off and gentle Reduced behavior. 32 controlled DOM scenarios pass for both hosting source and the portable HTML. These are responsive browser checks, not a physical-phone or frame-rate benchmark.
