# MD Zawwadul Islam — Analytics Portfolio, v3

A buildless portfolio with local fonts, 18 actual screenshots, and native HTML, CSS, and JavaScript. No installation, build step, remote scripts, or hosted font service is required.

## Local testing on Windows

1. Extract the entire ZIP into a **new folder**. Keep `index.html`, both CSS files, `app.js`, and `assets/` together.
2. Opening `index.html` directly works for the portfolio's local interactions. A local web server more closely represents deployment behavior.
3. Open a terminal in the extracted folder and run:

   ```powershell
   py -m http.server 5500 --bind 127.0.0.1
   ```

   If `py` is unavailable, try `python -m http.server 5500 --bind 127.0.0.1`. You can also double-click `start-preview.bat`.

4. Open **http://localhost:5500** in your browser. Leave the terminal running and press **Ctrl+C** there to stop it.
5. Use **Ctrl+F5** after editing files. **Motion starts on by default**, including when the old version or system settings previously disabled it. The header switch still lets you turn motion off and remembers choices made in this version.

If port 5500 is occupied, use 5501 in the command and browser address.

## Project hierarchy

- **Automated Sales Reporting:** lead service foundation, with a four-tab preview of the actual report.
- **DataRole Radar:** a larger technical showcase of API ingestion, classification, audits, SQL, tests, and explainable recommendations.
- **Excel Tracker and Retail Profitability:** prominent service foundations with clear deliverables.
- **E-commerce and Churn:** concise supporting analytical projects.

Services link to the corresponding case studies and to email enquiries with useful subject lines. Email links use the visitor's configured email application.

## Motion and interactions

- Native smooth scrolling, staggered reveals, animated project rearrangements, tab transitions, and modal entry/exit.
- Navigation clicks replay a section's entrance animations when its content comes into view, including repeat clicks on the current section. Returning home replays the hero typography; revisiting Insights replays the chart bars. Switching destinations cancels earlier replays, and Motion off disables them.
- The navigation and URL track Home, Work, Services, Insights, Approach, About, and Contact in both scroll directions.
- All six projects participate in the filters, including featured work.
- Case studies support deep links, Escape dismissal, and focus restoration.
- Actual screenshot galleries include a full-size viewer, previous/next controls, and arrow-key navigation.
- Canvas motion pauses offscreen, when the tab is hidden, or when motion is off.
- Email copying includes a fallback for local-file contexts. Case links copied under `file://` use the hosted URL.

## Manual checks

Scroll from top to bottom and back; watch the navigation, hash, progress line, and back-to-top button. Try every filter and report tab, including rapid switching. Open every case study, enlarge a screenshot, use arrow keys, and press Escape; the parent case should remain open after closing an image. Check email and case-link copying. Test deep links with browser Back/Forward. Narrow the window and try the mobile menu, outside click, and Escape. Toggle Motion, reload, and check that the choice persists.

## Files and deployment

The source checkout keeps public files in `dist/`. The downloaded standalone package places them at its root.

- `index.html`: page content, project hierarchy, navigation, and dialog shells
- `styles.css`: original visual system and responsive foundations
- `refinements.css`: motion, project hierarchy, galleries, and responsive refinements
- `app.js`: interactions, project content, galleries, and canvas
- `assets/`: local fonts, actual screenshots, favicon, and social preview
- `start-preview.bat`: optional Windows local-server launcher

For Vercel, use Framework Preset **Other**, no build command, and the folder containing `index.html` as the public root. For the source checkout, use output directory `dist`.

Update canonical and Open Graph URLs and `sitemap.xml` when moving to another domain. Contact details are in `index.html` and `app.js`.

## Evidence and verification

Project findings come from supplied documentation and screenshots. They describe portfolio datasets, not claimed client outcomes. Python prepares sales data automatically; Power BI refresh remains manual. Sales screenshots show a refreshed snapshot, while the case-study baseline metrics refer to the earlier documented period. DataRole Radar uses the final audited count of **2,056** job-skill relationships.

Source checks and **238 DOM interaction assertions** passed, covering section tracking, all case-study buttons, filters, keyboard tabs, galleries, nested dialogs, focus restoration, deep links, motion preferences, local-file copying, mobile navigation, canvas failure isolation, default-on motion, repeated section entrances, arrival timing, and rapid navigation changes.

Full visual browser rendering and real-device animation performance were not tested in this environment. The manual checks above cover the remaining local checks.
