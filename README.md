# MD Zawwadul Islam — Analytics Portfolio, v6

A buildless portfolio with local fonts, 18 actual screenshots, and native HTML, CSS, and JavaScript. No installation, build step, remote scripts, or hosted font service is required.

## Motion and reliability fixes in v6

An explicit **Motion on** choice now enables the full canvas, section, tab and navigation animations, even when the operating system requests reduced motion. With no saved preference, the system setting is respected and the control clearly says **Motion reduced**. Clicking it enables full motion. **Off** stops motion, and the choice persists. Turning motion back on replays the current section. Hero entrances and scroll reveals have more visible pacing, with the earlier scroll cue and status animation restored.

An unavailable animation API no longer stops the remaining page features from initializing. The local-file clipboard fallback now works inside an open case-study dialog, and shows a selectable case-study URL if browser copying is blocked. The single-file version downloads original screenshots directly, avoiding Chrome's blocked data-URL tab navigation.

The design, project content, contact improvements and **zawwadul@gmail.com** are retained.

## Easiest way to open the download

Open **zawwadul-portfolio.html** in Chrome. This is a complete standalone page with the current CSS, JavaScript, fonts and all 18 project screenshots embedded. It works without a server or internet connection for local interactions. Email, LinkedIn, GitHub and other external destinations still need internet access. No companion files are required, and it can be moved or renamed.

For editing or hosting, the ZIP also contains the usual `index.html`, `design.css`, `app.js` and `assets/` files. Keep those together, or use the standalone page.

## Contact update retained from v5

The current design, project content, galleries, navigation, and motion behavior are preserved. All contact details now use **zawwadul@gmail.com**, including the visible address and Copy email button.

The three service Discuss buttons, contact actions, and enquiries inside case studies open a prefilled Gmail draft in a new tab. Each service keeps its own subject and any project-brief fields. This works through a normal website link, including when JavaScript is disabled, and does not depend on Chrome having a default email app configured. Gmail may ask the visitor to sign in. The contact section also provides **Use your email app** and **Copy email** options. Opening a draft does not send a message.

## Local testing on Windows

1. Extract the entire ZIP into a **new folder**. Keep `index.html`, `design.css`, `app.js`, and `assets/` together.
2. Opening `index.html` directly works for the portfolio's local interactions. A local web server more closely represents deployment behavior.
3. Open a terminal in the extracted folder and run:

   ```powershell
   py -m http.server 5500 --bind 127.0.0.1
   ```

   If `py` is unavailable, try `python -m http.server 5500 --bind 127.0.0.1`. You can also double-click `start-preview.bat`.

4. Open **http://localhost:5500** in your browser. Leave the terminal running and press **Ctrl+C** there to stop it.
5. Use **Ctrl+F5** after editing files. **Motion starts on by default** unless the system requests reduced motion. The header switch remembers a saved On or Off choice. With no saved choice and system Reduce Motion enabled, it reads Reduced; click once to enable full animations.

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
- Canvas motion pauses offscreen, when the tab is hidden, when motion is off, or when reduced motion is in effect without an explicit On override.
- System Reduce Motion uses fades of at most 150 ms unless the visitor explicitly enables full motion. Reduced transparency, increased contrast, and forced colors have CSS responses.
- Email copying includes a fallback for local-file contexts. Case links copied under `file://` use the hosted URL.

## Manual checks

Scroll from top to bottom and back; watch the navigation, hash, progress line, and back-to-top button. Try every filter and report tab, including rapid switching. Open each case study and try its section buttons and manual scrolling. Enlarge a screenshot, use arrow keys, open its original, and press Escape; the reader should return to the same place. Check email and case-link copying. Test deep links with browser Back/Forward. Narrow the window and try the mobile menu, outside click, and Escape. Expand service input requirements. Toggle Motion, reload, and check persistence; enable your system's Reduce Motion setting and check the fade-only behavior. Also check 320 px width, 200% zoom, larger browser text, keyboard-only navigation, and a screen reader.

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

V6 adds 13 controlled interaction scenarios using the real page markup and application code, with simulated browser APIs, geometry and scheduling. They cover explicit On overriding system Reduce Motion, reduced defaults, persistence, blocked storage, system changes, restarting motion, canvas movement and visibility pauses, unavailable animation/canvas APIs, filters, keyboard tabs, all case studies, gallery restoration, local-file clipboard fallback, screenshot export, email destinations, mobile navigation and deep links. The motion regression was reproduced against the previous script before the fix. The suite is run against both the modular website and the standalone export. These are behavioral checks, not visual browser tests.

Run `node checks/interactions.cjs` from the source checkout (Python 3 and lxml are used to parse the real HTML). Rebuild exports with `python3 checks/build-download.py /absolute/output/folder`. JavaScript syntax, HTML structure, local assets and ZIP byte integrity are also checked. A full Chrome session, visual rendering and real-device animation performance were not available in this environment; the manual checks above remain useful.
