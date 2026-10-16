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
