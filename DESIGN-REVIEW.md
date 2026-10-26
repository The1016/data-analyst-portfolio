# Current review — v16, 24 October 2026

| Before | After | Why |
| --- | --- | --- |
| The smaller cleanup offer described the result only in text. | A clearly labelled four-row sample organises into three unique orders and a traceable 3,400 summary; replay is optional. | Demonstrates the deliverable without claiming client outcomes. |
| Project card and case reader appeared as disconnected surfaces. | A visible project preview moves and scales into the reader over 650ms; the image remains at its final size for inspection. | Preserves spatial context and gives the project opening a distinctive transition. |
| Process steps had independent borders. | A thin lime connector grows between consecutive steps on arrival. | Visually connects question, preparation, reporting and handover. |
| V15 triggered at 78% of viewport height. | Trigger is now 86%, following the user's later request to move it lower. | Starts slightly earlier while preserving accepted pacing. |

Implementation uses native transform/opacity animations and the existing cancellation policy. The process stroke uses scaleY rather than animating line dimensions. The connected image measures the source and destination once, then animates the actual reader image; it does not leave an overlay behind. Demo replay cancels prior effects. No new library, continuous loop or permanent will-change layer was added. The existing globe remains the hero signature.

The phone layout starts the cleanup when its visual reaches the trigger, rather than when the preceding description enters. Off and no-script states show the completed illustration; Reduced uses fades of at most 150ms. Keyboard actions are immediate. The replay button is hidden until JavaScript is available. The bottom-of-document exception is retained.

32 controlled DOM checks and the responsive Chrome fixture pass. Browser checks cover 375px and 1280px widths, all three new effects, document overflow, Off cancellation and Reduced behavior. No physical-device FPS or conversion improvement is claimed.

---

# Historical review — v15, 24 October 2026

| Before | After | Why |
| --- | --- | --- |
| Main reveals triggered 80px above the bottom; details and replays triggered at 20px. | One viewport-relative trigger at 78% of screen height for initial entrances, details and section replays. | Gives visitors more time to see the effect and behaves consistently on smaller screens. |
| A later threshold could strand content at the end of the page. | At document bottom, intersecting content can reveal without more scrolling. | Keeps the contact section reachable. |
| V14 pacing was accepted. | Durations, easing and group stagger are unchanged. | Changes when entrances start, not their speed. |

IntersectionObserver tracks visible candidates; the existing coalesced scroll/resize update checks their positions. Revealed items are unobserved and ordinary scrolling does not replay them. No new perpetual loop, library or animated layout property was added. The existing globe and motion modes are retained.

29 controlled DOM scenarios pass. They include later triggers across viewport sizes, resize handling, once-only reveals, report-preview timing, explicit navigation replay and the document-bottom exception. Browser verification is recorded in README.md. These checks are not physical-phone or frame-rate measurements.

Recommended future additions, not implemented in v15: a small sample-data morph from messy rows to a clean summary; a shared-element transition from a project preview into its reader; one short process-connector line drawing. Prioritize the sample-data demonstration because it explains the deliverable. Keep the existing globe as the hero signature and provide static Reduced/Off states.

---

# Historical review — v14, 24 October 2026

| Before | After | Why |
| --- | --- | --- |
| Main entrances lasted 400–600ms with a steep initial ease-out. | Hero 1200ms; content 1000ms; previews 1100ms; cubic-bezier(.32,.72,0,1) (`dist/app.js`, entranceTiming; `dist/design.css`, reveal tokens). | Makes occasional portfolio entrances visibly slower, as requested. |
| First-visit service effects ignored group stagger; hero inline delays were overridden. | 80ms group stagger and distinct hero delays are applied. | Elements arrive in a readable sequence. |
| Reveal started just 20px inside the bottom edge. | Reveal waits until 80px inside the viewport. | More of the effect is visible during ordinary scrolling. |
| Globe formation used a 2.6 exponential rate. | Rate 1.65; idle drift is unchanged. | Slows the scatter/organize transformation while retaining interruption from the current state. |

**Verdict: APPROVE within checked scope.** Longer timing is restricted to occasional marketing entrances, as explicitly requested. Everyday UI keeps short feedback; Reduced, Off and keyboard behavior are preserved. The existing transform/opacity animation paths and canvas visibility guards remain. No frame-rate guarantee or retention improvement is claimed.

Earlier reviews below are historical.

---

# Historical review — v13, 23 October 2026

| Before | After | Why |
| --- | --- | --- |
| The OS media query always overrode On, leaving Reduced/Off as the only reachable behavior (`dist/app.js:43`). | Explicit visitor choice wins; On, Off and Reduced all remain reachable and persisted (`dist/app.js:114`). | Fixes the reported absence of motion without requiring a device settings change. |
| Three CSS media blocks could suppress animation independently of the control. | One resolved class policy, with a reduced-motion fallback before JavaScript (`dist/design.css`, V13 policy block). | Keeps rendered CSS, WAAPI, scrolling and the canvas consistent. |

**Verdict: APPROVE within the checked scope.** Device reduction is the initial default for visitors who have not chosen a mode. Explicit On is a visitor override; Reduced and Off are retained. Keyboard navigation remains immediate. This fixes state selection rather than adding distracting effects.

27 controlled DOM scenarios pass for source and export, including explicit On under system reduction, all three modes, persistence and system-preference changes. The Chrome fixture simulates a reduced-motion device in both JS and CSS; observed canvas frame changes and service transforms confirm that full On works. A static globe in Reduced/Off is intentional. This is not a physical-device frame-rate benchmark.

Readability changes brighten secondary text from #b3b8aa to #c9cebf and enlarge service descriptions/deliverables to 1rem, supporting scope copy to .9375rem and service labels to .8125rem. The dark/lime identity, original globe, service scopes and contact links remain.

All reviews below are historical.

---

# Historical review — v12, 23 October 2026

**Verdict: APPROVE for source and browser-preview delivery, within the limits below.**

| Before | After | Why |
| --- | --- | --- |
| The requested globe was replaced in v11. | Restore the original interactive geometry and scatter/organize control (`dist/index.html:46`, `dist/app.js:937`). | Preserves the visual the owner specifically asked to keep. |
| Keyboard input disabled motion until a click. | Pointer movement, wheel and touch resume motion (`dist/app.js:91–111`). | Switching input methods no longer leaves the page stuck in keyboard mode. |
| Service content was absent from reveal targets. | Heading, starter offer and service cards enter and replay (`dist/app.js:187`, `dist/app.js:1071`). | Connects the commercial section to the actual motion system. |
| “On” could conceal a system reduced-motion preference. | Explicit On / Reduced / Off state (`dist/app.js:119`). | Makes the visible behavior understandable while respecting device settings. |
| Interrupted entrance effects restarted from their first frame. | Sample the currently rendered transform and opacity before cancellation (`dist/app.js:147`). | Avoids jumping on rapid section navigation. |

The globe is an intentional user-requested canvas illustration, so it requires painting. It has bounded point counts, a capped pixel ratio, and frame-time-based smoothing. Drawing stops offscreen, in a hidden document, behind dialogs, and in Off/Reduced modes. Transform/opacity entrances remain short and the commercial controls stay available independently of animation. This is not a claim that a canvas loop is compositor-only.

The 26 controlled DOM scenarios pass for hosting source and portable export. They cover all seven projects and contact routing, animation cancellation/fallbacks, service entrances, keyboard recovery, globe interaction and pause/resume. Chrome frame sampling confirmed changing globe pixels, service transforms, and Off/On recovery. Browser extension metadata errors were observed, not application errors. No physical-phone frame-rate measurement, screen-reader session, actual email delivery or conversion experiment was performed.

All reviews below are historical and may describe behavior replaced by v12.

---

# Historical review — v11, 23 October 2026

**Verdict: APPROVE for source and browser-preview delivery, within the limits below.**

The primary change makes the purchase clear before asking a buyer to inspect technical evidence. Existing palette, typography, project claims and downloadable reconciliation evidence are preserved. Previous reviews below describe earlier versions and are historical.

| Before | After | Why |
| --- | --- | --- |
| Projects led the buyer journey. | Services precede Work; a scoped Excel cleanup is the smaller first project (`dist/index.html:63`). | Gives a buyer a concrete output to request. |
| Broad discussion links required the buyer to define the work. | Four named scopes and case-to-quote routing select a deliverable and prepare the draft (`dist/index.html:69`, `dist/app.js:658`). | Carries purchase context into contact without collecting data. |
| Continuous canvas particles and pointer-following previews competed with evidence. | A one-shot handover illustration and steady screenshots (`dist/design.css:508`). | Explains editable deliverables and removes continuous animation work. |
| Some updates restarted their entrance on interruption. | Content transitions sample the painted state before cancellation (`dist/app.js:79`). | Avoids visible jumps when a pointer changes content quickly. |
| Keyboard interactions replayed visual motion. | Keyboard updates are immediate; pointer transitions use short transform/opacity feedback (`dist/app.js:89`). | Repeated navigation remains quick. |
| All project screenshots were preloaded. | Initial screenshots load normally; additional report tabs preload on intent (`dist/app.js:853`). | Reduces competing initial work. |
| Header CSS size was rewritten on every scroll update. | The value is written only after an actual size change (`dist/app.js:253`). | Avoids unnecessary style invalidation. |

## Motion craft and performance

Animate, Animation Performance, Emil Design Engineering and Review Animations informed this implementation. UI feedback uses roughly 160–240ms and a shared strong ease-out. The occasional hero explanation uses 500–600ms with a restrained stagger, then settles. Only transform and opacity are animated in the new effects; there is no permanent will-change promotion, idle particle loop, animated numerical evidence or layout animation. Hover motion is limited to fine-pointer devices. Commercial actions remain visible without waiting for an entrance.

Motion starts On unless the visitor saved Off. Off cancels active and queued effects. A system reduced-motion preference removes spatial effects and limits remaining fades to 150ms. Keyboard input makes CSS and programmatic transitions immediate. Case-to-quote navigation jumps directly to contact after closing the case instead of scrolling through the entire page.

## Checks and limits

The hosting source and portable export each pass 22 controlled DOM scenarios, including all seven cases, filtering, galleries, modal focus, cancellation, storage fallback, quote selection and safe context encoding. Gmail and mailto URLs target zawwadul@gmail.com and carry the same selected scope. Chrome preview checks confirmed service → reconciliation example → matching quote, settled modal focus, and readable 375px/320px responsive layouts without horizontal overflow. No application-console error was observed; the cloud browser extension emitted metadata errors unrelated to the page.

The viewport tests are not physical-phone testing. No screen-reader session, slow-motion recording, frame-rate trace, real email delivery or conversion experiment was performed. Composite-friendly source does not prove a particular device frame rate. No claim of improved leads, retention, savings or client outcomes is made. Existing analytical screenshots and source claims were preserved, not re-audited as part of this design change.

---

## V7 requested motion refinement

Full motion now starts On by default, independently of the operating system preference, as explicitly requested by the portfolio owner. The header switch still offers Off and remembers that choice. The illustration redraws on every browser frame, with invariant geometry precalculated; this removes the former 45 fps threshold that skipped alternate frames on 60 Hz screens. CSS and JavaScript use the same slightly softer easing curve. The layout, visual identity, content and contact actions are preserved.

---

## V6 interaction follow-up

The review below records v4 decisions. V6 corrects the motion-control conflict: a saved or newly selected On choice now enables full animation; without a manual preference the system's reduced-motion setting remains the default and is visibly labelled Reduced. Off remains available. The same policy governs CSS, JavaScript transitions, scrolling and the canvas. More visible hero/reveal timing and the earlier scroll cue/status motion were restored at the user's request.

V6 also isolates optional animation failures, repairs copying inside case-study dialogs, and provides a self-contained HTML export. The current verification scope is in README.md; no visual browser test is claimed.

---

## Design review: Zawwadul Islam’s portfolio v3

### Summary

**Overall rating: Needs work.** V3 has useful project evidence and a recognizable charcoal and lime identity, but its first impression spends too much space on atmosphere and too little on what someone can hire you to deliver. The portfolio should be remembered for the path from recurring business files to a documented reporting workflow; v4 makes that path the main story.

This is a source-based review of v3’s HTML, CSS, JavaScript, supplied project documentation, and actual dashboard assets. Sizes and contrast figures below come from source values. Browser rendering, assistive-technology use, and real-device performance were unavailable, so this is not a claim of accessibility certification.

### Improvements

**[High] Make the type comfortable to read. — Implemented**

- **What:** At narrow widths, v3’s project fact labels shrink to 6.5 px, report tabs to 8–9 px, and case-study body text to 12 px. Fixed pixel text also bypasses the browser’s preferred default font size.
- **Why:** `typography.md › Using custom fonts`: “Make sure custom fonts are legible.” `accessibility.md › Vision`: “Support larger text sizes.” Apple’s native point sizes are guidance for legibility, rather than a CSS pixel compliance rule.
- **Fix:** V4 uses a 100% root size, 1 rem body copy, 1.0625 rem case-study prose, 0.8125 rem captions, and a 0.75 rem minimum for utility text. At the default 16 px root, these are 16, 17, 13, and 12 px. Relative sizing, wrapping headings, flexible grids, and em breakpoints accommodate larger text.

**[High] Give controls a comfortable hit region. — Implemented**

- **What:** V3 has a 35 px wide mobile menu control, a 36 px back-to-top control, and tightly packed small screenshot tabs. These fall below Apple’s comfortable 44-point touch default, although a source review alone does not establish a WCAG failure.
- **Why:** `accessibility.md › Mobility`: “Offer sufficiently sized controls.” `buttons.md › Best practices`: “Always include a press state for a custom button.”
- **Fix:** Buttons now default to at least 2.75 rem in both dimensions; navigation, filters, image browsing, and disclosures have at least a 44 px default height. Screenshot tabs use two columns on compact screens. Press states, visible focus, selected-state labels, and native disclosure controls provide feedback.

**[High] Explain the offer before asking people to explore. — Implemented**

- **What:** “Less noise. More clarity.” is a mood, but it does not establish dashboards, Excel tools, or recurring reporting. The person and role were comparatively quiet.
- **Why:** `writing.md › Best practices`: “Consider each screen’s purpose.” `branding.md › Best practices`: “Ensure branding always defers to content.”
- **Fix:** “Clear reports. Less busywork.” is paired immediately with “Business analytics & reporting systems,” concrete Python/Power BI/Excel deliverables, and the analyst’s name and role. A small evidence rail scopes every number: six projects, four sales-report pages, and 35 documented DataRole Radar tests. This positioning is design judgment, grounded in the supplied work.

**[High] Order the portfolio around buyer relevance. — Implemented**

- **What:** The large technical showcase appeared before the Excel and profitability examples that map more directly to sellable services.
- **Why:** `layout.md › Visual hierarchy`: “Order content by relative importance.”
- **Fix:** The sales reporting workflow leads, with a “Useful for” explanation and its actual report. Excel and retail profitability follow as prominent service examples. DataRole Radar remains a full-width technical showcase, with less visual weight than the flagship. E-commerce and churn stay concise supporting analyses. Every filter still includes every matching project.

**[Medium] Make case studies a clear reading experience. — Implemented**

- **What:** A long article in a constrained modal, followed by another modal for its images, increases the effort of reading and returning to the original context.
- **Why:** `modality.md › Best practices`: “Consider using a full-screen modal style for in-depth content or a complex task.”
- **Fix:** A full-window native HTML dialog provides a persistent return action and local navigation for summary, screenshots, outputs, process, and findings. Reader navigation tracks scrolling and transfers focus to the destination heading. Opening an image suspends the reader; closing it restores its position and focus, keeping one modal active at a time. An original-image link supports closer inspection outside the scaled preview.

**[Medium] Reduce the work needed to start a conversation. — Implemented**

- **What:** The service descriptions explain outputs, but do not tell a prospective client what to bring. A large arrow is less explicit than a useful contact action.
- **Why:** `writing.md › Best practices`: “Be action oriented.” `layout.md › Visual hierarchy`: “Use progressive disclosure to make layouts cleaner and easier to interact with.”
- **Fix:** Each service has a native “What I need to start” disclosure, a matching case study, and a scoped email action. Contact offers a prefilled project brief, a separate junior-role link, and a visible Copy email button. No unsupplied prices, turnaround promises, client logos, or results have been invented.

**[Medium] Keep animation purposeful and optional. — Implemented**

- **What:** Longer entrances and repeated spatial transitions make common interactions feel slower. V3’s default-on motion also bypassed the system’s Reduce Motion preference.
- **Why:** `motion.md › Providing feedback`: “Aim for brevity and precision in feedback animations.” `motion.md › Best practices`: “Make motion optional.”
- **Fix:** Section replays take 600 ms, content switches 240 ms, and filter rearrangements 320 ms. The header switch remains on by default as requested and retains an explicit off choice. System Reduce Motion changes replays to fades of at most 150 ms, removes smooth scrolling and spatial movement, and stops the continuous illustration. Off stops animation entirely. Offscreen and hidden-tab canvas work still pauses.

**[Medium] Align visible evidence and summary figures. — Implemented**

- **What:** Sales screenshots show 2.46M revenue and 12.31% margin, while the original project README records 2.30M and 12.47%. Explaining the difference only near the bottom makes accurate figures look contradictory.
- **Why:** Editorial judgment: a portfolio’s claims should be easy to trace to the evidence being shown.
- **Fix:** The summary now uses the pictured snapshot and explains both reporting periods beside the metrics. The older finding remains clearly attributed to the original README. These remain dataset figures, not client outcomes. Manual Power BI refresh is still stated accurately.

### Craft notes

The strongest signature is the real reporting workflow, supported by a single interactive illustration of noise becoming structure. Charcoal and lime survive because they are an established preference; the actual dashboard imagery, readable project narratives, and uneven project hierarchy give the identity a reason beyond the palette.

V4 removes the orbit glow, unused coordinate overlay, nonsequential project numbering, repeated clickable headings, and footer copy about animation. The remaining numbers represent actual project evidence or the four genuine process steps. The redesign was checked against the brief: replacing this person’s projects with another profession would require changing the hero, proof, hierarchy, service inputs, and reading structure.

#### Compact token system

Dark values are implemented. Light counterparts below are a design reference for a future light treatment; v4 preserves the established dark web identity.

| Role | V4 dark value | Contrast on dark page / panel | Light counterpart | Contrast on light page |
| --- | --- | --- | --- | --- |
| Page | `#10110f` | Surface | `#f6f7f2` | Surface |
| Panel | `#1b1e18` | Surface | `#ffffff` | Surface |
| Primary text | `#eff0e8` | 16.50:1 / 14.69:1 | `#191b17` | 16.11:1 |
| Supporting text | `#b3b8aa` | 9.33:1 / 8.31:1 | `#525a4d` | 6.66:1 |
| Accent | `#d3fa68` | 15.91:1 / 14.17:1 | `#31451a` | 9.77:1 |
| Control border | `#68715f` | 3.71:1 / 3.30:1 | `#69745f` | 4.57:1 |

Subtle decorative dividers use `#343a2e`; control boundaries use the stronger control token. The inherited supporting text already had adequate contrast: 7.54:1 on the page and 6.91:1 on the old panel. The main legibility defect was size and density, not a failing primary text palette.

Signal Sans carries display and body text; Signal Mono is reserved for labels and quantities. Body and case prose use generous line spacing, while headings use size and weight rather than extra visual accessories.

| Layout | Reading order |
| --- | --- |
| Regular width | Clear offer + one illustration; compact evidence rail; lead reporting project with actual screenshot preview; two service examples; technical showcase; supporting analyses; services, lab, process, person, contact |
| Compact width | Same order in one column; wrapping filters; two-column report tabs; stacked project details and case metrics; full-width contact action |

### What works

- Eighteen actual screenshots are stronger evidence than invented dashboard illustrations.
- Distinguishing portfolio data from client impact protects credibility.
- Python preparation and manual Power BI refresh are described accurately.
- DataRole Radar’s final audited count is 2,056 job-skill relationships; its sample and model limitations remain visible.
- Six filterable projects, working deep links, keyboard tabs, clipboard fallback, and persistent motion controls are worth retaining.
- The identity remains MD Zawwadul Islam, BS CSE student and junior analyst; the redesign does not invent professional experience.

### Platform notes

This is a responsive vanilla web portfolio. Apple’s legibility, hierarchy, writing, focus, control comfort, motion, and restraint principles apply. Native iOS tab bars, macOS menu bars, SF Symbols, or native appearance settings are not requirements for this website. `cross-platform.md` supplies the translation into semantic HTML, ARIA, relative CSS sizing, and space-based layouts. `designing-for-ios.md › Best practices` reinforces keeping primary tasks clear at compact widths.

The site retains the chosen dark appearance. Increased contrast, forced colors, and reduced transparency have explicit CSS responses. System Reduce Motion and the manual motion switch have distinct, tested behavior.

**Verification:** 282 controlled DOM assertions pass, covering all existing actions plus the reader, focus, one-modal browsing, original-image links, and reduced-motion fades. Source checks verify structure, links, assets, image integrity, responsive rules, and relative typography. Font-metric checks confirm the normal-size hero lines fit the 280 px content area at a 320 px viewport. These checks do not replace browser rendering, 200% zoom inspection, screen-reader testing, or real-device animation measurements.

**Project follow-up:** The supplied sales image has a monthly axis whose displayed dates are not in chronological order, and the Excel image includes application chrome and a partially captured lower dashboard. Those are source-project presentation issues. V4 preserves the authentic assets; improved exports and a shareable Excel workbook would make the underlying examples stronger.

Reference pages opened for this review: `accessibility.md`, `layout.md`, `typography.md`, `color.md`, `designing-for-ios.md`, `motion.md`, `buttons.md`, `modality.md`, `writing.md`, `branding.md`, and `cross-platform.md` from the Apple Design skill.

## V8 motion review — 16 October 2026

**Summary: Good, based on source and controlled interaction checks.** This responsive web portfolio helps a prospective buyer move from a business problem to real project evidence and an email enquiry. Its signature is an illustration of scattered data forming a coherent signal. The changes develop that metaphor and highlight actual work; improved visitor retention remains an untested hypothesis.

### Research and decisions

| Source | Principle used | Implementation choice |
| --- | --- | --- |
| [Apple HIG: Motion](https://developer.apple.com/design/human-interface-guidelines/motion), Best practices / Providing feedback | Purposeful, optional motion; brief feedback that can be interrupted | One hero assembly; shared Motion switch; no loading gates or forced scrolling |
| [Nielsen Norman Group: The Role of Animation and Motion in UX](https://www.nngroup.com/articles/animation-purpose-ux/) | Motion attracts attention and can also distract; use it to explain transitions and interactions | Reveal the report evidence, provide service-icon and button feedback, then settle |
| [web.dev: High-performance CSS animations](https://web.dev/articles/animations-guide) | Prefer transform and opacity; avoid layout-triggering animation and unnecessary layer promotion | Native Web Animations and CSS transforms/opacity, batched pointer updates, no permanent will-change layers |

These sources support the design principles, not a predicted increase in leads or session duration. To assess that business effect, compare case-study opens and contact attempts with the previous version under similar traffic conditions; a longer session alone can also reflect confusion. No tracking was added.

### Implemented improvements

- **[Medium] Make the signature understandable on arrival.** Points assemble in a staggered wave into the existing signal form, then resume the previous gentle motion. The same Scatter / Organize control reverses it. The still state is complete when motion is disabled. This expresses the actual service theme without inventing business results.
- **[Medium] Let project previews enter when people can see them.** A separate visibility check holds a below-fold preview until it arrives, which matters when the featured project stacks on a phone. Entrances run once during ordinary scrolling; explicit section navigation can still replay them.
- **[Low] Make interactive objects feel responsive.** Preview images receive bounded pointer depth on devices with a fine pointer. Their buttons remain fixed. Pointer work ends after an event; it does not start another continuous animation loop. Full-size readers, touch devices and system reduced-motion preferences exclude this depth effect.
- **[Low] Connect smaller moments to the content.** The reporting path, workbook grid and dashboard bars animate as service symbols. Process numbers and rules reveal in sequence. Headings and arrows share the existing easing. Values in the analysis remain visible as their final, documented numbers.

### What remains unchanged

The six projects, 18 screenshots, pricing/contact context, Gmail and ordinary email paths, keyboard tabs, modal focus handling and local-file fallbacks are retained. The existing color/type tokens and compact/regular reading order described above still apply; no new palette or typeface was introduced. Apple principles are translated to the web, not native Apple navigation conventions.

### Craft and accessibility trade-off

`motion.md > Best practices` calls for purposeful and optional motion; `branding.md > Best practices` keeps the brand subordinate to content. The signal field earns its movement because it demonstrates the offer. The availability pulse was removed and the scroll cue stops after two cycles, leaving a quieter background for reading.

The requested default-On behavior is preserved. A saved Off choice cancels active and waiting animations. New detail animations use short fades for a system reduced-motion preference, while the existing hero/navigation behavior continues to follow the explicit site On/Off policy. Consequently this release does not claim comprehensive WCAG or reduced-motion conformance. `accessibility.md > Cognitive` is the basis for reducing these new spatial effects.

### Verification limits

The modular site and portable HTML each pass 18 controlled DOM scenarios. The added scenarios verify independent preview arrival, cancellation of pending reveals, reduced-motion detail fades, bounded pointer updates and cleanup, touch exclusions, flat full-size readers, keyboard icon feedback, optional-animation failure handling, and a complete static canvas after switching Off. Existing contact, navigation, filtering and gallery scenarios also pass. Static checks and ZIP byte comparison cover the exports.

No supported local browser preview was available for this run. These are source and behavior checks, not observed animation playback, physical-phone testing, screen-reader testing, a frame-rate measurement or a measured retention experiment.
