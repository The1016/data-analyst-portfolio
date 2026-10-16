# MD Zawwadul Islam — Analytics Portfolio, v8

A buildless portfolio with local fonts, 18 actual screenshots, and native HTML, CSS, and JavaScript. No installation, build step, remote scripts, or hosted font service is required.

## Animation update in v8

- The hero illustration assembles scattered points into the existing signal structure on arrival. Its Scatter / Organize control remains available throughout; there is no loading screen or timed content gate.
- Report previews have a short depth reveal. When a project stacks on a phone, its preview waits until the preview itself reaches the viewport. Supporting project facts keep their real values and enter in a short sequence.
- Desktop screenshot previews respond to the pointer by at most 1.8 degrees. The hit area stays still, touch devices skip the effect, and full-size screenshots remain flat for inspection. Pointer updates are batched into the next animation frame and reset on exit, scrolling, window blur, hidden tabs, or Motion Off.
- The three service icons build in small steps; keyboard focus also triggers their feedback. Headings, process numbers, dividers and link arrows receive coordinated, brief motion.
- The existing insight bars now replay on first arrival as well as on tab changes. The availability dot is still, and the small scroll cue ends after two cycles, keeping the signal illustration as the main moving element.

**Motion stays On by default**, and saved Off choices remain respected. Switching Off cancels active and queued detail animations and leaves every element readable. New decorative depth and icon effects become short fades when the system requests reduced motion. The existing main On/Off behavior from v7 remains independent of the system preference, as requested; this is not a claim of full reduced-motion accessibility compliance.

The current palette, layout, project evidence, email links and **zawwadul@gmail.com** are retained. No animation library, external script, analytics tracker or new image download was added.

Research and the reasoning behind these choices are recorded in the v8 section of `DESIGN-REVIEW.md`. This is a design improvement; an increase in retention or enquiries has not been measured.

**Verification:** JavaScript syntax and 18 controlled DOM scenarios passed for both the modular site and the single-file export. They cover the new viewport timing, motion cancellation, pointer cleanup, touch exclusions, icon keyboard feedback, animation failure fallback, and the previous navigation, gallery and contact flows. The ZIP is checked against the same source files. These checks do not render a browser or measure real-device frame rates. Visual smoothness, 320 px rendering, 200% zoom and physical-phone behavior still need a browser/device review.

The updated workspace Site is separate from the public Vercel deployment. Upload the v8 files to your Vercel project to update that public address; publishing the workspace Site does not change Vercel automatically.

## Default motion and smoother animation in v7

**Full motion starts On by default**, including when the operating system requests reduced motion. Visitors can switch motion Off in the header; a saved Off choice is still respected on later visits. Turning motion back on replays the current section.

The signal illustration now draws on every browser animation frame. The previous 45 fps threshold could skip alternate frames on a 60 Hz display. Static geometry is precalculated and shared calculations run once per frame to reduce the cost of the extra redraws. Motion remains time-based, with the same illustration and movement speed, and pauses offscreen or while the tab is hidden. Slightly softer easing and a 280 ms content transition retain the current style and pacing.

An unavailable animation API no longer stops the remaining page features from initializing. The local-file clipboard fallback now works inside an open case-study dialog, and shows a selectable case-study URL if browser copying is blocked. The single-file version downloads original screenshots directly, avoiding Chrome's blocked data-URL tab navigation.

The design, project content, contact improvements and **zawwadul@gmail.com** are retained.

## Easiest way to open the download

Open **zawwadul-portfolio.html** in Chrome. This is a complete standalone page with the current CSS, JavaScript, fonts and all 18 project screenshots embedded. It works without a server or internet connection for local interactions. Email, LinkedIn, GitHub and other external destinations still need internet access. No companion files are required, and it can be moved or renamed.

For editing or hosting, the ZIP also contains the usual `index.html`, `design.css`, `app.js` and `assets/` files. Keep those together, or use the standalone page.

## Contact update in v7

The current design, project content, galleries, navigation, and motion behavior are preserved. All contact details now use **zawwadul@gmail.com**, including the visible address and Copy email button.

The three service Discuss buttons, contact actions, and enquiries inside case studies open a prefilled Gmail draft in a new tab. Each service keeps its own subject and any project-brief fields. This works through a normal website link, including when JavaScript is disabled, and does not depend on Chrome having a default email app configured. Gmail may ask the visitor to sign in. The visible email address opens the visitor's email app. The contact section also provides **Email via Gmail**, **Use your email app** and **Copy email** options. Every project reader includes the visible address and both email choices. Shared case-study links use the public Vercel portfolio address. Opening a draft does not send a message.

## Local testing on Windows

1. Extract the entire ZIP into a **new folder**. Keep `index.html`, `design.css`, `app.js`, and `assets/` together.
2. Opening `index.html` directly works for the portfolio's local interactions. A local web server more closely represents deployment behavior.
3. Open a terminal in the extracted folder and run:

   ```powershell
   py -m http.server 5500 --bind 127.0.0.1
   ```

   If `py` is unavailable, try `python -m http.server 5500 --bind 127.0.0.1`. You can also double-click `start-preview.bat`.

4. Open **http://localhost:5500** in your browser. Leave the terminal running and press **Ctrl+C** there to stop it.
5. Use **Ctrl+F5** after editing files. **Full motion starts On by default.** The header switch remembers a saved On or Off choice. If you previously switched it Off, click it once to turn it back On.

If port 5500 is occupied, use 5501 in the command and browser address.

## Project hierarchy

- **Automated Sales Reporting:** lead service foundation, with a four-tab preview of the actual report.
- **Excel Tracker and Retail Profitability:** prominent service examples, immediately after the lead reporting system.
- **DataRole Radar:** the technical showcase of API ingestion, classification, audits, SQL, tests, and explainable recommendations.
- **E-commerce and Churn:** concise supporting analytical projects.

Services link to corresponding case studies, expandable input requirements, and email enquiries with useful subject lines. Contact includes a project-brief link, a separate hiring link, an email-app fallback, and a visible Copy email control. Primary email actions open Gmail drafts in a new tab.

The Apple Design review and implemented changes are documented in `DESIGN-REVIEW.md`. The redesign keeps the charcoal and lime identity, uses relative typography and comfortable controls, removes repeated decoration, and leads with the work most useful as a service.

## Motion and interactions

- Native smooth scrolling, staggered reveals, animated project rearrangements, tab transitions, and modal entry/exit.
- Navigation clicks replay a section's entrance animations when its content comes into view, including repeat clicks on the current section. Returning home replays the hero typography; revisiting Insights replays the chart bars. Switching destinations cancels earlier replays, and Motion off disables them.
- The navigation and URL track Home, Work, Services, Insights, Approach, About, and Contact in both scroll directions.
- All six projects participate in the filters, including featured work.
- Case studies use a full-window reader with a persistent return action, quick section navigation, scroll tracking, deep links, Escape dismissal, and focus restoration.
- Actual screenshot galleries include a full-size viewer, previous/next controls, arrow-key navigation, and an original-image link. Opening a screenshot suspends the reader so one modal is active at a time; closing it restores the reader's position and focus.
- Canvas motion pauses offscreen, when the tab is hidden, or when motion is Off.
- The header On/Off switch controls motion independently of the system setting, as requested for this portfolio. Reduced transparency, increased contrast, and forced colors still have CSS responses.
- Email copying includes a fallback for local-file contexts. Case links copied under `file://` use the hosted URL.

## Manual checks

Scroll from top to bottom and back; watch the navigation, hash, progress line, and back-to-top button. Try every filter and report tab, including rapid switching. Open each case study and try its section buttons and manual scrolling. Enlarge a screenshot, use arrow keys, open its original, and press Escape; the reader should return to the same place. Check email and case-link copying. Test deep links with browser Back/Forward. Narrow the window and try the mobile menu, outside click, and Escape. Expand service input requirements. Toggle Motion, reload, and check persistence; check that the On/Off switch behaves consistently when your system's Reduce Motion setting changes. Also check 320 px width, 200% zoom, larger browser text, keyboard-only navigation, and a screen reader.

## Files and deployment

The source checkout keeps public files in `dist/`. The downloaded standalone package places them at its root.

- `index.html`: page content, project hierarchy, navigation, and dialog shells
- `design.css`: the current visual system, responsive layouts, and motion/accessibility rules
- `app.js`: interactions, project content, galleries, and canvas
- `assets/`: local fonts, actual screenshots, favicon, and social preview
- `start-preview.bat`: optional Windows local-server launcher
- `DESIGN-REVIEW.md`: v3 findings, v4 changes, measured colors, and verification scope

For Vercel, use Framework Preset **Other**, no build command, and the folder containing `index.html` as the public root. For the source checkout, use output directory `dist`.

Update canonical and Open Graph URLs and `sitemap.xml` when moving to another domain. Contact details are in `index.html` and `app.js`.

## Evidence and verification

Project findings come from supplied documentation and screenshots. They describe portfolio datasets, not claimed client outcomes. Python prepares sales data automatically; Power BI refresh remains manual. Sales summary metrics now match the pictured snapshot: 2.46M revenue and 12.31% margin. A note beside them explains that the original README finding describes an earlier period with 2.30M revenue and 12.47% margin. DataRole Radar uses the final audited count of **2,056** job-skill relationships.

Earlier validation: the v4 release recorded **282 controlled DOM interaction assertions**, covering section tracking, case-study buttons, reader navigation and scrolling, one-modal galleries, original-image links, filters, keyboard tabs, focus restoration, deep links, motion preferences, local-file copying, mobile navigation, canvas failure isolation, default-on motion, repeated section entrances, arrival timing, rapid navigation changes, and system reduced-motion fades. Those historical assertions were not rerun for v5. The v5 contact update checks JavaScript syntax, static and case-study email destinations, preserved subject and body fields, clickable arrow markup, the email-app fallback, the copy-address value, and local asset references. Calculated v4 text contrast is 9.33:1 for supporting text on the page and 8.31:1 on panels.

For v5, JavaScript syntax validation and **119 targeted contact and asset checks** passed.

V7 runs 13 controlled interaction scenarios using the real page markup and application code, with simulated browser APIs, geometry and scheduling. They cover full-motion defaults including system Reduce Motion, persistence, blocked storage, system changes, restarting motion, one canvas redraw per frame at simulated 60/120/144 Hz, canvas movement and visibility pauses, unavailable animation/canvas APIs, filters, keyboard tabs, all case studies, gallery restoration, local-file clipboard fallback, screenshot export, email destinations, mobile navigation and deep links. The v6 motion regression was reproduced before its fix; v7 additionally checks full-motion defaults and display-frame cadence. The suite is run against both the modular website and the standalone export. These are behavioral checks, not visual browser tests.

Run `node checks/interactions.cjs` from the source checkout (Python 3 and lxml are used to parse the real HTML). Rebuild exports with `python3 checks/build-download.py /absolute/output/folder`. JavaScript syntax, HTML structure, local assets and ZIP byte integrity are also checked. A full Chrome session, visual rendering and real-device animation performance were not available in this environment; the manual checks above remain useful.
