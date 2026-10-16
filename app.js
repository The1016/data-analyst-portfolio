'use strict';

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
// The optional single-file export supplies embedded copies of the same assets.
const assetURL = path => window.PORTFOLIO_ASSETS?.[path] || path;
const email = 'zawwadul@gmail.com';
function emailDraftURL(subject = '', body = '') {
  const url = new URL('https://mail.google.com/mail/');
  url.searchParams.set('view', 'cm');
  url.searchParams.set('fs', '1');
  url.searchParams.set('to', email);
  if (subject) url.searchParams.set('su', subject);
  if (body) url.searchParams.set('body', body);
  return url.href;
}
const motionPreferenceKey = 'portfolio-motion-v3';
let userMotion = 'on';
try { userMotion = localStorage.getItem(motionPreferenceKey) || 'on'; } catch (_) {}
if (!['on', 'off'].includes(userMotion)) userMotion = 'on';
let motionEnabled = userMotion !== 'off';
let renderField = () => {};
let resetPreviewDepth = () => {};
const gentleDetails = matchMedia('(prefers-reduced-motion: reduce)');
let toastTimer;
const motionAnimations = new Set();
const pendingSectionReplays = new Map();
const sectionReplayAnimations = new Map();
const pendingDetailEntrances = new Map();
let pendingHeroReplay = false;

function toast(message) {
  const el = $('#toast');
  el.textContent = message;
  el.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('visible'), 3400);
}
function animateElement(el, frames, options = {}) {
  if (!motionEnabled || !el?.animate) return null;
  const settings = { duration: 320, easing: 'cubic-bezier(.22,1,.36,1)', ...options };
  // An optional animation must never prevent the rest of the page starting.
  let animation;
  try { animation = el.animate(frames, settings); } catch (_) { return null; }
  motionAnimations.add(animation);
  animation.finished.then(() => motionAnimations.delete(animation), () => motionAnimations.delete(animation));
  return animation;
}
function animateContent(el) {
  el.getAnimations?.().forEach(animation => animation.cancel());
  animateElement(el, [{ opacity: 0, transform: 'translateY(7px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 280 });
}
function applyMotion() {
  const root = document.documentElement;
  root.classList.toggle('motion-off', !motionEnabled);
  root.classList.toggle('motion-on', motionEnabled);
  const button = $('#motion-toggle');
  button.setAttribute('aria-pressed', String(motionEnabled));
  $('span', button).textContent = motionEnabled ? 'on' : 'off';
  button.setAttribute('aria-label', motionEnabled ? 'Turn animations off' : 'Turn animations on');
  button.title = motionEnabled ? 'Animations enabled. Click to turn motion off.' : 'Animations disabled. Click to enable.';
  if (!motionEnabled) {
    pendingSectionReplays.clear();
    pendingDetailEntrances.clear();
    pendingHeroReplay = false;
    motionAnimations.forEach(animation => animation.cancel());
    motionAnimations.clear();
    sectionReplayAnimations.clear();
    $$('.reveal').forEach(el => el.classList.add('visible'));
  }
  renderField();
  if (!motionEnabled) resetPreviewDepth();
}
applyMotion();
$('#motion-toggle').addEventListener('click', () => {
  motionEnabled = !motionEnabled;
  userMotion = motionEnabled ? 'on' : 'off';
  try { localStorage.setItem(motionPreferenceKey, userMotion); } catch (_) {}
  applyMotion();
  if (motionEnabled) {
    resetSectionAnimations($('#' + (currentSection || 'home')));
    requestScrollUpdate(false);
  }
  toast(motionEnabled ? 'Animations enabled.' : 'Animations disabled.');
});

function playSectionEntrance(element, frames, options) {
  sectionReplayAnimations.get(element)?.cancel();
  const animation = animateElement(element, frames, options);
  if (!animation) return;
  sectionReplayAnimations.set(element, animation);
  const clear = () => {
    if (sectionReplayAnimations.get(element) === animation) sectionReplayAnimations.delete(element);
  };
  animation.finished.then(clear, clear);
}
function detailInView(element) {
  const rect = element.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.top < innerHeight - 20;
}
function playDetailEntrance(element, frames, options) {
  if (!motionEnabled) return;
  // On a phone a report sits below its project description. Wait for that
  // report itself, instead of spending its entrance above the viewport.
  if (!detailInView(element)) { pendingDetailEntrances.set(element, { frames, options }); return; }
  pendingDetailEntrances.delete(element);
  playSectionEntrance(element, frames, options);
}
function processDetailEntrances() {
  for (const [element, { frames, options }] of pendingDetailEntrances) {
    if (!element.isConnected) { pendingDetailEntrances.delete(element); continue; }
    if (detailInView(element)) playDetailEntrance(element, frames, options);
  }
}
// Each reveal has one small secondary beat. No timers hide content, and all
// animations share the same cancellation path as the main Motion switch.
function animateRevealDetails(element, delay = 0) {
  if (!motionEnabled) return;
  const gentle = gentleDetails.matches;
  const enter = (target, transform, offset = 0, duration = 650) => {
    if (!target) return;
    playDetailEntrance(target, [
      { opacity: 0, transform: gentle ? 'none' : transform },
      { opacity: 1, transform: 'none' }
    ], { duration: gentle ? 150 : duration, delay: gentle ? 0 : delay + offset, fill: 'backwards' });
  };
  if (element.classList.contains('section-heading')) {
    enter($('h2 .muted', element), 'translateY(12px)', 100, 700);
    enter($('.section-intro', element), 'translateY(8px)', 160, 650);
  }
  if (element.classList.contains('project-item')) {
    const preview = $('.report-preview,.priority-image,.radar-feature-visual', element);
    enter(preview, 'perspective(1000px) translateY(24px) rotateX(5deg) scale(.985)', 100, 850);
    $$('.feature-facts div,.radar-proof div,.radar-flow span', element).forEach((part, i) => enter(part, 'translateY(10px)', 140 + i * 65, 550));
  }
  if (element.classList.contains('service')) animateServiceIcon(element, delay + 100);
  if (element.classList.contains('process-row')) {
    enter($('.process-number', element), 'scale(.8)', 0, 500);
    enter($('p', element), 'translateX(14px)', 100, 650);
  }
  $$('.bar-fill', element).forEach((bar, i) => playDetailEntrance(bar,
    gentle ? [{ opacity: 0 }, { opacity: 1 }] : [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }],
    { duration: gentle ? 150 : 700, delay: gentle ? 0 : delay + i * 55, fill: 'backwards' }));
}
function animateServiceIcon(service, delay = 0) {
  $$('.icon-part', service).forEach((part, i) => playDetailEntrance(part, [
    { opacity: 0, transform: gentleDetails.matches ? 'none' : 'translateY(5px)' },
    { opacity: 1, transform: 'none' }
  ], { duration: gentleDetails.matches ? 150 : 420, delay: gentleDetails.matches ? 0 : delay + i * 65, fill: 'backwards' }));
}
function resetSectionAnimations(section) {
  pendingSectionReplays.clear();
  pendingDetailEntrances.clear();
  pendingHeroReplay = false;
  sectionReplayAnimations.forEach(animation => animation.cancel());
  sectionReplayAnimations.clear();
  if (!motionEnabled) return;
  // Unseen elements retain their original scroll reveal. Previously viewed
  // elements replay when they arrive, without hiding an entire long section.
  $$('.reveal', section).forEach((element, index) => {
    if (element.classList.contains('visible')) pendingSectionReplays.set(element, index % 3 * 60);
  });
  pendingHeroReplay = section.id === 'home';
}
function processSectionReplays(headerHeight) {
  if (!motionEnabled) return;
  const inView = element => {
    const rect = element.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0 && rect.bottom > headerHeight && rect.top < innerHeight - 20;
  };
  for (const [element, delay] of pendingSectionReplays) {
    if (!inView(element)) continue;
    pendingSectionReplays.delete(element);
    playSectionEntrance(element, [{ opacity: 0, transform: 'translateY(20px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 600, delay });
    animateRevealDetails(element, delay);
  }
  if (pendingHeroReplay && inView($('#hero-title'))) {
    pendingHeroReplay = false;
    $$('.hero-line span').forEach((line, index) => playSectionEntrance(line, [{ transform: 'translateY(110%)' }, { transform: 'translateY(0)' }], { duration: 720, delay: index * 100 }));
    $$('.hero-enter').forEach((element, index) => playSectionEntrance(element, [{ opacity: 0, transform: 'translateY(16px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 600, delay: 100 + index * 50 }));
  }
}

const menuToggle = $('.menu-toggle');
const mobileNav = $('#mobile-nav');
function closeMenu() {
  mobileNav.hidden = true;
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open navigation');
}
menuToggle.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  mobileNav.hidden = !open;
  if (open) animateElement(mobileNav, [{ opacity: 0, transform: 'translateY(-8px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 280 });
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !mobileNav.hidden) { closeMenu(); menuToggle.focus(); }
});
document.addEventListener('click', event => {
  if (!mobileNav.hidden && !event.target.closest('.site-header')) closeMenu();
});
matchMedia('(min-width: 75.01em)').addEventListener('change', e => { if (e.matches) closeMenu(); });

const navLinks = $$('[data-nav]');
const trackedSections = ['home', 'work', 'services', 'insight', 'approach', 'about', 'contact'].map(id => $('#' + id));
let scrollPending = false, syncScrollURL = false, navigatingTo = null, navigationTimer;
let currentSection = '';
function activateSection(id) {
  if (id === currentSection) return;
  currentSection = id;
  navLinks.forEach(link => {
    const active = link.getAttribute('href') === '#' + id;
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current');
  });
}
function updateScrollState(syncURL = false) {
  syncURL = syncURL || syncScrollURL;
  syncScrollURL = false;
  scrollPending = false;
  if ($('#case-dialog').open || $('#image-dialog').open) return;
  const header = $('.site-header');
  const height = header.getBoundingClientRect().height;
  document.documentElement.style.setProperty('--header-height', height + 'px');
  processSectionReplays(height);
  processDetailEntrances();
  const distance = Math.max(0, document.documentElement.scrollHeight - innerHeight);
  const progress = distance > 0 ? Math.min(1, Math.max(0, scrollY / distance)) : 0;
  $('.scroll-progress span').style.transform = `scaleX(${progress})`;
  header.classList.toggle('scrolled', scrollY > 24);
  $('#back-to-top').hidden = scrollY < Math.max(500, innerHeight * .8);
  const probe = height + Math.min(130, innerHeight * .18);
  let section = 'home';
  for (const element of trackedSections) if (element.getBoundingClientRect().top <= probe) section = element.id;
  if (distance > 0 && scrollY >= distance - 3) section = 'contact';
  activateSection(navigatingTo || section);
  if (syncURL && !navigatingTo && !location.hash.startsWith('#case-')) {
    const hash = '#' + section;
    if (location.hash !== hash) {
      try { history.replaceState(null, '', hash); } catch (_) {}
    }
  }
}
function requestScrollUpdate(syncURL = false) {
  syncScrollURL = syncScrollURL || syncURL;
  if (scrollPending) return;
  scrollPending = true;
  requestAnimationFrame(() => updateScrollState(syncURL));
}
function navigateTo(id) {
  const target = $('#' + id);
  if (!target) return;
  closeMenu();
  resetSectionAnimations(target);
  navigatingTo = id;
  clearTimeout(navigationTimer);
  activateSection(id);
  document.documentElement.style.setProperty('--header-height', $('.site-header').getBoundingClientRect().height + 'px');
  if (location.hash !== '#' + id) {
    try { history.pushState(null, '', '#' + id); } catch (_) { location.hash = '#' + id; }
  }
  target.scrollIntoView({ behavior: motionEnabled ? 'smooth' : 'instant', block: 'start' });
  const focusTarget = $('h1,h2', target) || target;
  focusTarget.setAttribute('tabindex', '-1');
  focusTarget.focus({ preventScroll: true });
  requestScrollUpdate(false);
  navigationTimer = setTimeout(() => { navigatingTo = null; updateScrollState(true); }, motionEnabled ? 1100 : 0);
}
document.addEventListener('click', event => {
  const link = event.target.closest('a[href^="#"]');
  if (!link || event.button > 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const id = link.getAttribute('href').slice(1);
  if (!id || id.startsWith('case-') || !$('#' + id)) return;
  event.preventDefault();
  navigateTo(id);
});
addEventListener('scroll', () => requestScrollUpdate(true), { passive: true });
addEventListener('resize', () => requestScrollUpdate(false));
addEventListener('pageshow', () => requestScrollUpdate(false));
addEventListener('scrollend', () => { if (navigatingTo) { navigatingTo = null; clearTimeout(navigationTimer); updateScrollState(true); } });
for (const type of ['wheel', 'touchstart']) addEventListener(type, () => {
  if (navigatingTo) { navigatingTo = null; clearTimeout(navigationTimer); }
}, { passive: true });
$('#back-to-top').addEventListener('click', () => navigateTo('home'));
document.fonts?.ready.then(() => requestScrollUpdate(false));
$('#year').textContent = new Date().getFullYear();

async function copyText(value, message) {
  let copied = false;
  try { await navigator.clipboard.writeText(value); copied = true; } catch (_) {
    const input = document.createElement('textarea');
    const focused = document.activeElement;
    input.value = value;
    input.setAttribute('readonly', '');
    input.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0';
    // Background content is inert while a modal is open, including under file://.
    // Keep the fallback inside the active dialog so it can receive selection.
    ($('dialog[open]') || document.body).appendChild(input);
    input.select();
    try { copied = document.execCommand('copy'); } catch (_) {}
    input.remove();
    focused?.focus({ preventScroll: true });
  }
  toast(copied ? message : 'Copy did not complete. Please select and copy the text manually.');
  return copied;
}
$('#copy-email').addEventListener('click', () => copyText(email, 'Email address copied.'));

const escapeHTML = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));

const projectData = {
  reconciliation: {
    number: '07', type: 'Payment reconciliation', label: 'Synthetic demonstration', title: 'Payment Reconciliation and Exception Reporting',
    description: 'Two payment files, one traceable comparison: exact matches, amount differences, and records that need a person to review them.',
    metrics: [['101', 'Source records across two files'], ['43', 'Exact matched pairs'], ['12', 'Exception report rows requiring review']],
    snapshotNote: 'Synthetic baseline · 50 records in A and 51 in B. The 55 report rows represent all 101 source records; the 12 exception report rows represent 15 source records. A paired row contains one record from each source.',
    problem: 'Two teams can report payments in different orders, with missing records, duplicate references, or conflicting amounts. Comparing grand totals alone does not tell a reviewer which records need attention.',
    steps: [
      'Keep the two original CSV files unchanged. Work at one transaction per source row, for one sample period in BDT; neither file is assumed to be the authoritative ledger.',
      'Trim outer spaces in the transaction reference while retaining original values and leading zeros. Hold blank references and any reference repeated in either source for review.',
      'Pair only references that are unique on both sides. Compare amounts as exact integer paisa with zero tolerance; define every difference as A minus B.',
      'Separate matched pairs, amount differences, one-sided records, ambiguous references, and missing references. Retain source-row locations for investigation.',
      'Check source-row and amount conservation, then export comparison tables, exceptions, controls, and a gap explanation as CSV and HTML. Present the verified baseline in an Excel workbook.'
    ],
    outcomes: [
      'A transaction-level comparison and a focused exception report with original source-row locations.',
      'Cleaned copies that retain original identifiers and amounts, plus checks accounting for every source record exactly once on its own side.',
      'A gap explanation connecting the exception categories to the overall A-minus-B difference.',
      'A documented notebook and optional Python script, a browser-readable sample report, and a formatted Excel reference workbook.'
    ],
    finding: 'Source A totals Tk62,750.00 and source B totals Tk64,320.01, giving an A-minus-B difference of −Tk1,570.01. The report separates the records behind that gap so a reviewer can investigate them. Both original totals are conserved, with zero unaccounted records or amounts.',
    resultRows: [
      ['Matched', '43', 'Pairs'], ['Amount difference', '3', 'Pairs'],
      ['Only in A', '3', 'Source records'], ['Only in B', '2', 'Source records'],
      ['Ambiguous reference', '3', 'Source records'], ['Missing reference', '1', 'Source record']
    ],
    validation: [
      'Compared the baseline with independently specified expected results and verified that every original source row appears exactly once on its own side, with its original amount.',
      'Manually checked references 000010, 000020, and 000030: their A-minus-B differences are −Tk100.00, +Tk50.00, and −Tk0.01.',
      'Held reference 000048 for review because it appears once in A and twice in B. The blank-reference B row remains unpaired, even though an A-only row has the same amount.',
      'Checked changed-input behavior: increasing one B amount by Tk1 creates another amount difference. Invalid amounts stop the run rather than becoming zero.'
    ],
    limitation: 'All data and bank names are invented. This is a portfolio demonstration, not a bank client engagement. No measured time-saving or financial impact is claimed. The example excludes fuzzy matching, automatic financial adjustments, and production system integration.',
    tools: ['Python', 'pandas', 'Excel', 'Reconciliation', 'Data quality'],
    downloadNote: 'The notebook or script regenerates CSV and HTML reports. The Excel workbook and screenshots show the supplied baseline and do not refresh automatically. Download the complete example to run the code with its input files and expected results.',
    downloads: [
      { path: 'assets/reconciliation/report.html', label: 'Open sample report', filename: 'reconciliation-sample-report.html', preview: true, detail: 'HTML · full results, exceptions, controls, and gap explanation' },
      { path: 'assets/reconciliation/Reconciliation_Example.xlsx', label: 'Download sample workbook', filename: 'Reconciliation_Example.xlsx', detail: 'Excel · formatted reference for the synthetic baseline' },
      { path: 'assets/reconciliation/01_Reconciliation_Walkthrough.ipynb', label: 'Download notebook', filename: '01_Reconciliation_Walkthrough.ipynb', detail: 'Jupyter · code, method, and executed baseline outputs' },
      { path: 'assets/reconciliation/Payment_Reconciliation_Example.zip', label: 'Download complete example', filename: 'Payment_Reconciliation_Example.zip', detail: 'ZIP · input CSVs, notebook, script, reports, and screenshots' }
    ],
    repo: null
  },
  sales: {
    number: '01', type: 'Reporting automation', title: 'Automated Sales Reporting System',
    description: 'A repeatable workflow that turns monthly sales CSV files into clean reporting data and a four-page Power BI dashboard.',
    metrics: [['2.46M', 'Revenue in pictured dataset'], ['12.31%', 'Margin in pictured dataset'], ['4', 'Power BI report pages']],
    problem: 'A business receives separate monthly sales files. Repeating the same cleaning, combining, and reporting work every month makes a consistent overview harder to maintain.',
    steps: ['Load and combine monthly CSV files from a single input folder.', 'Remove duplicates, standardize dates and text, and create reporting fields with Python and Pandas.', 'Export clean_sales_data.csv and data_quality_summary.csv.', 'Use DAX measures and a date table in Power BI, then refresh the report after rerunning the pipeline.'],
    outcomes: ['Executive sales overview with revenue, profit, orders, and monthly performance.', 'Product and margin analysis, including discount impact and low-margin products.', 'Customer and regional analysis with performance and repeat-customer views.', 'A dedicated data quality and refresh summary page.'],
    finding: 'The original reporting period showed approximately 2.30M in revenue and 286.40K in profit. The West region led revenue and margin performance, while the Central region showed weaker profitability.',
    limitation: 'These figures describe the portfolio dataset, not client results. Data preparation is automated; Power BI refresh is manual. Scheduled Power BI Service refresh and automated email delivery are listed as future improvements.',
    tools: ['Python', 'Pandas', 'Power BI', 'DAX', 'Power Query', 'CSV'],
    repo: 'https://github.com/The1016/Automated-sales-reporting-system'
  },
  radar: {
    number: '02', type: 'Market intelligence', title: 'DataRole Radar',
    description: 'An automated job-market intelligence and skill-gap analytics system that connects job collection, role classification, skill extraction, quality checks, and Power BI.',
    metrics: [['337', 'Collected job records'], ['54', 'Canonical skills tracked'], ['98.29%', 'Target-job skill coverage']],
    problem: 'Job listings are noisy and job titles alone do not reliably identify useful data roles. A learning plan needs a clearer view of relevant jobs and the skills mentioned in them.',
    steps: ['Collect job postings from Himalayas and Remotive while preserving source lineage.', 'Classify roles and flag ambiguous records for a human review and override process.', 'Extract canonical skills using aliases and context-aware rules.', 'Audit false positives, calculate coverage, and build market and skill-gap views in Power BI.'],
    outcomes: ['234 target data-role postings across 201 represented companies.', '2,056 job-skill relationships after quality assurance, with 230 of 234 target jobs containing detected skills.', 'Four dashboard views: Market Overview, Role Explorer, Skill-Gap Radar, and Market Intelligence.', 'A manually reviewed classifier audit and 35 passing automated tests documented in the project README.'],
    finding: 'SQL appeared in 185 target jobs and Python in 141. Manual QA reduced the first-pass 2,096 relationships to 2,056 by fixing URL-related and contextual false positives.',
    limitation: 'This is a collected sample of remote job postings, not a census of the job market. Classifier precision (95.65%), recall (84.62%), and F1 (89.80%) come from an audit enriched with ambiguous cases and are not an unbiased estimate of overall accuracy.',
    tools: ['Python', 'Power BI', 'Automation', 'Role classification', 'Data quality'],
    repo: 'https://github.com/The1016/DataRole-Radar--Automated-Job-Market-Intelligence-and-Skill-Gap-Analytics-System'
  },
  excel: {
    number: '03', type: 'Small business tools', title: 'Excel Business Tracker Dashboard',
    description: 'A practical workbook designed to give a small shop one place to track orders, expenses, inventory, customers, and business performance.',
    metrics: [['4', 'Core business record areas'], ['8', 'Dashboard KPIs'], ['3', 'Slicer filter types']],
    problem: 'Small businesses often keep daily records in scattered spreadsheets or manual notes. That makes it difficult to see current stock, total expenses, profit, and customer activity together.',
    steps: ['Structure order, expense, inventory, and customer records into dedicated workbook sheets.', 'Use formulas and dropdown-based entry to make routine data entry consistent.', 'Calculate stock levels, profit, margins, customer orders, and customer spend.', 'Build a dashboard using PivotTables, PivotCharts, conditional formatting, and slicers.'],
    outcomes: ['Sales, profit, expenses, net profit, orders, average order value, low-stock products, and profit margin in one overview.', 'Monthly trends, category sales, top products, expense breakdowns, and low-stock alerts.', 'Interactive filters for order status, payment method, and category.', 'A workbook designed around the daily questions of a shop owner.'],
    finding: 'The dashboard combines operational records and business reporting in Excel, so the same workbook can support data entry and a clearer business overview.',
    limitation: 'The supplied documentation describes a portfolio workbook. No measured client impact is claimed. The original workbook, dashboard screenshots, and a project repository URL would make this case study more concrete.',
    tools: ['Excel', 'Formulas', 'PivotTables', 'PivotCharts', 'Slicers', 'Conditional formatting'],
    repo: null
  },
  retail: {
    number: '04', type: 'Profitability analysis', title: 'End-to-End Retail Profitability Analytics',
    description: 'An end-to-end business intelligence project using the Superstore Sales dataset to understand revenue, margin, discounting, customers, and shipping performance.',
    metrics: [['4', 'Power BI analysis pages'], ['7', 'Recommendation areas'], ['SQL', 'SQLite business analysis']],
    problem: 'High sales can hide low margins or loss-making products and customers. The business needs to understand where profit is being created and where it is being lost.',
    steps: ['Inspect and clean the dataset with Python, including dates and duplicate checks.', 'Engineer fields for profit margin, shipping duration, and profitability status.', 'Create a SQLite database and run SQL business analyses alongside exploratory charts.', 'Develop a four-page Power BI dashboard and document business recommendations.'],
    outcomes: ['Executive overview and product profitability pages.', 'Customer and segment analysis that considers profit alongside revenue.', 'Region, discount, and shipping analysis to explore operational differences.', 'Recommendations on loss-making products, discount controls, product mix, customer value, regional performance, margin monitoring, and shipping.'],
    finding: 'Technology and Office Supplies were stronger profit contributors. Furniture was weaker, and some high-revenue products and customers generated negative profit. Higher discounts appeared to reduce profitability in several areas.',
    limitation: 'This is an analytical case study using a portfolio dataset. The recommendations are proposed actions; no implemented profit increase or client outcome is claimed.',
    tools: ['Python', 'Pandas', 'NumPy', 'SQLite', 'SQL', 'Power BI'],
    repo: 'https://github.com/The1016/End-to-End-Retail-Profitability-Analytics-System'
  },
  ecommerce: {
    number: '05', type: 'E-commerce operations', title: 'E-commerce Revenue, Delivery & Customer Satisfaction',
    description: 'A multi-table analysis connecting revenue and customer behavior with delivery reliability, product categories, regions, payments, and review outcomes.',
    metrics: [['99,441', 'Orders analyzed'], ['7.87%', 'Late delivery rate'], ['4.09 / 5', 'Average review score']],
    problem: 'Revenue reports alone do not show whether delivery performance is weakening the customer experience. The business needs a joined view of sales, operations, and reviews.',
    steps: ['Inspect and clean related tables for orders, items, products, customers, payments, reviews, sellers, and geography.', 'Convert date fields and build order-level, category-level, and master analysis tables.', 'Calculate core KPIs and use SQL to explore category, state, and delivery-review performance.', 'Create Power BI views for executive performance, category and regional analysis, and delivery experience.'],
    outcomes: ['Documented revenue of 15,843,553.24 and average order value of 159.33 in dataset currency.', 'A 12.09-day average delivery time and a 7.87% late delivery rate.', 'Operational priority areas identified in MA, CE, BA, and RJ.', 'Recommendations to monitor large markets and high-revenue categories with weaker review scores.'],
    finding: 'Late delivery was strongly associated with lower review scores. São Paulo was the dominant market by order volume and revenue, making operational improvements in large markets a meaningful priority.',
    limitation: 'The analysis identifies associations in the dataset. It does not establish that delivery delays alone caused lower ratings, and it does not claim a measured post-project business improvement.',
    tools: ['Python', 'Pandas', 'SQL', 'Matplotlib', 'Power BI'],
    repo: 'https://github.com/The1016/E-commerce-sales-analysis-project'
  },
  churn: {
    number: '06', type: 'Customer retention', title: 'Customer Churn & Retention Analysis',
    description: 'A telecom customer analysis that explores who leaves, which groups face higher churn, and how five documented risk factors can guide retention priorities.',
    metrics: [['7,032', 'Cleaned customer records'], ['26.58%', 'Overall churn rate'], ['5', 'Risk score factors']],
    problem: 'Broad retention efforts can miss the customers most likely to leave. The business needs to understand how churn relates to contract type, tenure, payments, internet service, and charges.',
    steps: ['Convert TotalCharges to numeric values, remove missing rows, and check data quality.', 'Create readable demographic labels and tenure and monthly-charge segments.', 'Analyze churn across contract, tenure, charge, payment, and service groups.', 'Combine five factors into a transparent risk score and summarize the findings in a Power BI dashboard.'],
    outcomes: ['Month-to-month churn of 42.71%, compared with 11.28% for one-year contracts and 2.85% for two-year contracts.', 'Churn of 47.68% in the first 12 months, compared with 9.51% for customers with 49+ months of tenure.', 'A risk-score gradient from 2.27% churn at score 0 to 70.58% at score 5.', 'Recommendations for early-life onboarding, high-risk segments, contract upgrades, and payment-method review.'],
    finding: 'Customers combining several risk factors had much higher observed churn. Scores of 4 and 5 had churn rates of 56.53% and 70.58%, making those groups useful priorities for further retention investigation.',
    limitation: 'This is descriptive segmentation of the Telco dataset. The five-factor score is not presented as a validated predictive model, and it does not prove that changing one factor will prevent churn.',
    tools: ['Python', 'Pandas', 'NumPy', 'Matplotlib', 'Power BI', 'Risk scoring'],
    repo: 'https://github.com/The1016/Customer-Churn-and-Retention-Analysis'
  }
};

const galleries = {
  reconciliation: [
    ['reconciliation-exceptions.png', 'Exceptions requiring review', 'Synthetic baseline: 12 exception report rows representing 15 source records. Blank cells mean absent, not zero; differences are A minus B in BDT.', 2037, 960],
    ['reconciliation-summary.png', 'Summary and source controls', 'Synthetic baseline: category counts, source totals, the −Tk1,570.01 gap, matching rules, and checks accounting for all 101 source records.', 1334, 2048]
  ],
  sales: [
    ['sales-overview.png', 'Executive Sales Overview', 'Sales, profit, orders, and regional performance in one view.'],
    ['sales-products.png', 'Product & Margin Analysis', 'Category margins, product profitability, and discount impact.'],
    ['sales-customers.png', 'Customer & Region Analysis', 'Customer behavior and regional profit efficiency.'],
    ['sales-quality.png', 'Data Quality & Refresh Summary', 'A visible preparation trail. Rerun Python, then manually refresh Power BI.']
  ],
  radar: [
    ['radar-overview.png', 'Market Overview', '234 target postings, 201 companies, 54 skills, and 2,056 audited job-skill relationships.'],
    ['radar-roles.png', 'Role Explorer', 'Compare requirements and skill demand across the collected role families.'],
    ['radar-skills.png', 'Skill-Gap Radar', 'Explainable learning recommendations based on observed skill coverage.'],
    ['radar-intelligence.png', 'Market Intelligence', 'Skill combinations and salary observations in the collected sample.']
  ],
  excel: [
    ['excel-dashboard.png', 'Business Dashboard', 'Sales, expenses, inventory, and profit together in the actual workbook.'],
    ['excel-orders.png', 'Order Tracking', 'Structured order entries and calculated sales, cost, and margin fields.'],
    ['excel-inventory.png', 'Inventory', 'Stock levels, reorder levels, and product margin calculations.'],
    ['excel-expenses.png', 'Expenses', 'Expense records by category, date, and payment method.'],
    ['excel-customers.png', 'Customers', 'Customer records with order counts and total spending.']
  ],
  retail: [
    ['retail-overview.png', 'Executive Overview', 'A business overview of revenue, profit, and performance.'],
    ['retail-products.png', 'Product Profitability', 'Review product margins and loss-making products.'],
    ['retail-customers.png', 'Customer & Segment Analysis', 'Read customer value alongside revenue and profit.'],
    ['retail-operations.png', 'Region, Discount & Shipping', 'Explore regional margins, discount impact, and shipping.'],
    ['retail-category-profit.png', 'Profit by Category', 'A Python analysis chart from the project.']
  ]
};
const serviceOffers = {
  reconciliation: ['A clearer payment comparison', 'A scoped project could compare two payment exports using agreed reference and amount rules, separate exceptions for review, and hand over the results with source totals and documented checks.', 'Payment reconciliation project'],
  sales: ['A recurring reporting workflow', 'A scoped adaptation could combine your monthly files, define your KPIs, create a focused report, and document the preparation and refresh process.', 'Monthly sales reporting project'],
  excel: ['A workbook for your business', 'A scoped adaptation could organize your orders, stock, expenses, and customers into a workbook with formulas and an operational dashboard.', 'Custom Excel business tracker'],
  retail: ['A dashboard for business decisions', 'A scoped adaptation could clean your sales data, define meaningful metrics, and investigate product margins, discounts, and customer profitability.', 'Profitability dashboard project']
};
projectData.sales.limitation += ' The screenshots and summary metrics show a refreshed snapshot. The useful finding describes the earlier reporting period documented in the project README.';
projectData.excel.limitation = 'The workbook and screenshots demonstrate a portfolio example. The sample includes filtered views; no measured client impact is claimed. A public repository or workbook download has not been supplied.';
projectData.radar.tools = ['Python', 'Pandas', 'SQL / SQLite', 'Power BI', 'pytest', 'Data quality'];

const dialog = $('#case-dialog');
const imageDialog = $('#image-dialog');
let lastCaseTrigger, activeProject, returnHash = '#work';
let closeSequence = 0;
let galleryProject, galleryIndex = 0, lastImageTrigger;
let suspendedCase = false, suspendedCaseScroll = 0;
let readerUpdatePending = false;

function updateReader() {
  readerUpdatePending = false;
  if (!dialog.open) return;
  const toolbarHeight = $('.dialog-toolbar', dialog).getBoundingClientRect().height;
  const index = $('.case-index', dialog);
  const indexHeight = matchMedia('(max-width: 37.5em)').matches ? 0 : index.getBoundingClientRect().height;
  dialog.style.setProperty('--reader-toolbar-height', toolbarHeight + 'px');
  dialog.style.setProperty('--reader-offset', (toolbarHeight + indexHeight + 20) + 'px');
  const sections = $$('[data-reader-section]', dialog);
  const probe = dialog.getBoundingClientRect().top + toolbarHeight + indexHeight + 32;
  let active = sections[0]?.id;
  for (const section of sections) if (section.getBoundingClientRect().top <= probe) active = section.id;
  $$('.case-index button', dialog).forEach(button => {
    if (button.dataset.caseJump === active) button.setAttribute('aria-current', 'true');
    else button.removeAttribute('aria-current');
  });
}
function requestReaderUpdate() {
  if (readerUpdatePending || !dialog.open) return;
  readerUpdatePending = true;
  requestAnimationFrame(updateReader);
}
dialog.addEventListener('scroll', requestReaderUpdate, { passive: true });
addEventListener('resize', requestReaderUpdate);

function lockBody() { document.body.classList.toggle('modal-open', dialog.open || imageDialog.open); }
function screenshotMarkup(key, index = 0) {
  const [file, title, , width = 1440, height = 810] = galleries[key][index];
  return `<button class="dashboard-shot${height > width ? ' portrait-shot' : ''}" data-image="${key}" data-image-index="${index}" aria-label="Enlarge ${escapeHTML(title)}"><img src="${assetURL('assets/projects/' + file)}" alt="${escapeHTML(title)} — ${escapeHTML(projectData[key].label || 'actual project')} screenshot" width="${width}" height="${height}" decoding="async"><span class="image-expand">View full size <i aria-hidden="true">↗</i></span></button>`;
}
function galleryMarkup(key) {
  const shots = galleries[key];
  if (!shots) return '';
  return `<section class="case-gallery" id="reader-screens" data-reader-section aria-label="Actual project screenshots"><div class="case-gallery-top"><h3>Inside the actual project</h3><span>${shots.length} screenshots · select to enlarge</span></div><div id="case-gallery-image">${screenshotMarkup(key)}</div><div class="case-gallery-tabs" role="group" aria-label="Choose a project screenshot">${shots.map(([, title], index) => `<button data-gallery-index="${index}" aria-pressed="${index === 0}">${escapeHTML(title)}</button>`).join('')}</div><p class="case-gallery-caption" id="case-gallery-caption" role="status" aria-live="polite">${escapeHTML(shots[0][2])}</p></section>`;
}
function serviceMarkup(key) {
  const offer = serviceOffers[key];
  if (!offer) return '';
  return `<section class="case-service"><h3>${escapeHTML(offer[0])}</h3><p>${escapeHTML(offer[1])}</p><a class="text-link" href="${escapeHTML(emailDraftURL(offer[2]))}" target="_blank" rel="noopener noreferrer" title="Open an email draft in Gmail (new tab)">Discuss a similar project <span aria-hidden="true">↗</span></a></section>`;
}
function downloadsMarkup(project) {
  if (!project.downloads) return '';
  return `<section class="case-section" id="reader-downloads" data-reader-section><h3>Inspect the work</h3><p>${escapeHTML(project.downloadNote)}</p><div class="case-downloads">${project.downloads.map(file => {
    const url = assetURL(file.path);
    const download = !file.preview || url.startsWith('data:');
    const label = file.preview && download ? 'Download sample report' : file.label;
    return `<div class="case-download"><a class="text-link" href="${escapeHTML(url)}" ${download ? `download="${escapeHTML(file.filename)}"` : 'target="_blank" rel="noopener noreferrer"'}>${escapeHTML(label)} <span aria-hidden="true">${download ? '↓' : '↗'}</span></a><p>${escapeHTML(file.detail)}</p></div>`;
  }).join('')}</div></section>`;
}
function openCase(key, updateURL = true, trigger = null) {
  const project = projectData[key];
  if (!project) return;
  closeSequence++;
  dialog.getAnimations?.().forEach(animation => animation.cancel());
  if (!dialog.open) returnHash = location.hash.startsWith('#case-') ? '#work' : (location.hash || '#work');
  if (trigger) lastCaseTrigger = trigger;
  activeProject = key;
  closeMenu();
  $('#reader-project').textContent = project.title;
  const readerSections = [['reader-summary', 'At a glance'], ...(galleries[key] ? [['reader-screens', 'Screenshots']] : []), ['reader-built', 'What I built'], ['reader-method', 'Process'], ['reader-findings', 'Findings'], ...(project.validation ? [['reader-validation', 'Validation']] : []), ...(project.downloads ? [['reader-downloads', 'Downloads']] : [])];
  $('#case-content').innerHTML = `
    <p class="eyebrow case-kicker">${escapeHTML(project.type)} · ${escapeHTML(project.label || 'Portfolio project')}</p>
    <h2 class="case-title" id="case-title">${escapeHTML(project.title)}</h2>
    <p class="case-subtitle">${escapeHTML(project.description)}</p>
    <div class="tags">${project.tools.map(tool => `<span>${escapeHTML(tool)}</span>`).join('')}</div>
    <nav class="case-index" aria-label="Case study sections">${readerSections.map(([id, label]) => `<button data-case-jump="${id}">${label}</button>`).join('')}</nav>
    <div id="reader-summary" data-reader-section>
      <div class="case-metrics">${project.metrics.map(([value, label]) => `<div class="case-metric"><strong>${escapeHTML(value)}</strong><span>${escapeHTML(label)}</span></div>`).join('')}</div>
      ${key === 'sales' ? '<p class="snapshot-note">The pictured snapshot shows 2.46M revenue, 303.36K profit, and 12.31% margin. The original README documents an earlier period (2.30M revenue and 12.47% margin). These are portfolio dataset figures.</p>' : ''}
      ${project.snapshotNote ? `<p class="snapshot-note">${escapeHTML(project.snapshotNote)}</p>` : ''}
      <section class="case-section"><h3>The question</h3><p>${escapeHTML(project.problem)}</p></section>
    </div>
    ${galleryMarkup(key)}
    <section class="case-section" id="reader-built" data-reader-section><h3>What I built</h3><ul>${project.outcomes.map(text => `<li>${escapeHTML(text)}</li>`).join('')}</ul></section>
    <section class="case-section" id="reader-method" data-reader-section><h3>How I approached it</h3><ol>${project.steps.map(text => `<li>${escapeHTML(text)}</li>`).join('')}</ol></section>
    <section class="case-section" id="reader-findings" data-reader-section><h3>${project.resultRows ? 'What the comparison found' : 'The useful finding'}</h3><p>${escapeHTML(project.finding)}</p>${project.resultRows ? `<table class="case-results"><caption>Synthetic baseline · 55 report rows, representing 101 source records</caption><thead><tr><th scope="col">Result category</th><th scope="col">Report rows</th><th scope="col">Unit</th></tr></thead><tbody>${project.resultRows.map(row => `<tr><th scope="row">${escapeHTML(row[0])}</th><td>${escapeHTML(row[1])}</td><td>${escapeHTML(row[2])}</td></tr>`).join('')}</tbody></table>` : ''}</section>
    ${project.validation ? `<section class="case-section" id="reader-validation" data-reader-section><h3>How I checked it</h3><ul>${project.validation.map(text => `<li>${escapeHTML(text)}</li>`).join('')}</ul></section>` : ''}
    ${downloadsMarkup(project)}
    ${serviceMarkup(key)}
    <p class="case-note">${escapeHTML(project.limitation)}</p>
    <p class="case-contact-options">Email <a href="mailto:${email}?subject=${encodeURIComponent(project.title + ' inquiry')}">${email}</a> or <a href="${escapeHTML(emailDraftURL(project.title + ' inquiry'))}" target="_blank" rel="noopener noreferrer">open Gmail <span aria-hidden="true">↗</span></a>.</p>
    <div class="case-links">${project.repo ? `<a class="button button-lime" href="${escapeHTML(project.repo)}" target="_blank" rel="noopener noreferrer">Explore the repository <span aria-hidden="true">↗</span></a>` : `<a class="button button-lime" href="${escapeHTML(emailDraftURL(project.title + ' inquiry'))}" target="_blank" rel="noopener noreferrer" title="Open an email draft in Gmail (new tab)">${project.downloads ? 'Discuss this kind of project' : 'Ask about the workbook'} <span aria-hidden="true">↗</span></a>`}<button class="button button-outline" id="copy-case">Copy case study link <span aria-hidden="true">↗</span></button></div>`;
  if (!dialog.open) dialog.showModal();
  else animateContent($('#case-content'));
  lockBody();
  dialog.scrollTop = 0;
  updateReader();
  $('.close-dialog', dialog).focus({ preventScroll: true });
  $('#copy-case').addEventListener('click', () => {
    const base = location.protocol === 'file:' ? $('link[rel="canonical"]').getAttribute('href') : location.origin + location.pathname;
    const url = `${base.replace(/#.*$/, '')}#case-${activeProject}`;
    copyText(url, 'Case study link copied.').then(copied => {
      if (copied) return;
      let fallback = $('#case-copy-fallback');
      if (!fallback) {
        fallback = document.createElement('input');
        fallback.id = 'case-copy-fallback';
        fallback.className = 'copy-fallback';
        fallback.type = 'text';
        fallback.readOnly = true;
        fallback.setAttribute('aria-label', 'Case study link — select and copy');
        $('.case-links', dialog).appendChild(fallback);
      }
      fallback.value = url;
      fallback.focus({ preventScroll: true });
      fallback.select();
    });
  });
  if (updateURL && location.hash !== '#case-' + key) {
    try { history.pushState({ portfolioCase: key }, '', '#case-' + key); } catch (_) {}
  }
}
async function closeCase() {
  if (!dialog.open || imageDialog.open) return;
  const sequence = ++closeSequence;
  const exit = animateElement(dialog, [{ opacity: 1, transform: 'translateY(0) scale(1)' }, { opacity: 0, transform: 'translateY(12px) scale(.985)' }], { duration: 180 });
  if (exit) { try { await exit.finished; } catch (_) {} }
  if (sequence === closeSequence && dialog.open) dialog.close();
}
$('.close-dialog', dialog).addEventListener('click', closeCase);
dialog.addEventListener('cancel', event => { event.preventDefault(); closeCase(); });
function closeOnBackdrop(el, close) {
  let startedOutside = false;
  const outside = event => {
    const rect = el.getBoundingClientRect();
    return event.target === el && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom);
  };
  el.addEventListener('pointerdown', event => { startedOutside = outside(event); });
  el.addEventListener('click', event => { if (startedOutside && outside(event)) close(); startedOutside = false; });
}
closeOnBackdrop(dialog, closeCase);
dialog.addEventListener('close', () => {
  if (suspendedCase || dialog.open) return;
  lockBody();
  if (location.hash === '#case-' + activeProject) {
    try { history.replaceState(null, '', returnHash); } catch (_) {}
  }
  if (lastCaseTrigger?.isConnected) lastCaseTrigger.focus({ preventScroll: true });
  requestScrollUpdate(false);
});

function renderFullImage() {
  const shots = galleries[galleryProject];
  const [file, title] = shots[galleryIndex];
  $('#image-project').textContent = projectData[galleryProject].title;
  $('#image-title').textContent = title;
  const full = $('#image-full');
  full.src = assetURL('assets/projects/' + file);
  full.alt = title + ' — actual project screenshot';
  const original = $('#image-original');
  const originalURL = assetURL('assets/projects/' + file);
  original.setAttribute('href', originalURL);
  // Chrome blocks top-level data: navigation. The standalone export offers
  // the same original bytes as a download instead of opening a blank tab.
  if (originalURL.startsWith('data:')) {
    original.setAttribute('download', file);
    original.innerHTML = 'Download original image <span aria-hidden="true">↓</span>';
  } else {
    original.removeAttribute('download');
    original.innerHTML = 'Open original image <span aria-hidden="true">↗</span>';
  }
  $('#image-counter').textContent = `${galleryIndex + 1} / ${shots.length}`;
  $('#image-prev').hidden = $('#image-next').hidden = shots.length < 2;
  animateContent($('.image-stage'));
}
function openImage(key, index, trigger) {
  if (!galleries[key]) return;
  imageCloseSequence++;
  imageDialog.getAnimations?.().forEach(animation => animation.cancel());
  galleryProject = key;
  galleryIndex = Math.max(0, Math.min(galleries[key].length - 1, Number(index) || 0));
  lastImageTrigger = trigger;
  if (dialog.open) {
    // Show one modal at a time, then restore the reader's exact position.
    suspendedCase = true;
    suspendedCaseScroll = dialog.scrollTop;
    dialog.close();
  }
  renderFullImage();
  if (!imageDialog.open) imageDialog.showModal();
  lockBody();
  $('#close-image').focus({ preventScroll: true });
}
let imageCloseSequence = 0;
async function closeImage() {
  if (!imageDialog.open) return;
  const sequence = ++imageCloseSequence;
  const exit = animateElement(imageDialog, [{ opacity: 1, transform: 'translateY(0)' }, { opacity: 0, transform: 'translateY(10px)' }], { duration: 160 });
  if (exit) { try { await exit.finished; } catch (_) {} }
  if (sequence === imageCloseSequence && imageDialog.open) imageDialog.close();
}
function stepImage(delta) {
  galleryIndex = (galleryIndex + delta + galleries[galleryProject].length) % galleries[galleryProject].length;
  renderFullImage();
}
$('#image-prev').addEventListener('click', () => stepImage(-1));
$('#image-next').addEventListener('click', () => stepImage(1));
$('#close-image').addEventListener('click', closeImage);
imageDialog.addEventListener('cancel', event => { event.preventDefault(); closeImage(); });
imageDialog.addEventListener('keydown', event => {
  if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); stepImage(event.key === 'ArrowRight' ? 1 : -1); }
});
imageDialog.addEventListener('close', () => {
  if (imageDialog.open) return;
  if (suspendedCase) {
    suspendedCase = false;
    dialog.showModal();
    dialog.scrollTop = suspendedCaseScroll;
    updateReader();
  }
  lockBody();
  if (lastImageTrigger?.isConnected && (!dialog.open || lastImageTrigger.closest('#case-dialog'))) lastImageTrigger.focus({ preventScroll: true });
});
closeOnBackdrop(imageDialog, closeImage);

document.addEventListener('click', event => {
  const jumpButton = event.target.closest('[data-case-jump]');
  if (jumpButton && dialog.open) {
    const section = $('#' + jumpButton.dataset.caseJump, dialog);
    if (section) {
      section.scrollIntoView({ behavior: motionEnabled ? 'smooth' : 'instant', block: 'start' });
      const heading = $('h3', section) || section;
      heading.setAttribute('tabindex', '-1');
      heading.focus({ preventScroll: true });
      $$('.case-index button', dialog).forEach(button => {
        if (button === jumpButton) button.setAttribute('aria-current', 'true');
        else button.removeAttribute('aria-current');
      });
    }
    return;
  }
  const caseButton = event.target.closest('[data-case]');
  if (caseButton) { openCase(caseButton.dataset.case, true, caseButton); return; }
  const shotButton = event.target.closest('[data-image]');
  if (shotButton) { openImage(shotButton.dataset.image, shotButton.dataset.imageIndex, shotButton); return; }
  const galleryButton = event.target.closest('[data-gallery-index]');
  if (galleryButton && galleries[activeProject]) {
    const index = Number(galleryButton.dataset.galleryIndex);
    $('#case-gallery-image').innerHTML = screenshotMarkup(activeProject, index);
    $('#case-gallery-caption').textContent = galleries[activeProject][index][2];
    $$('.case-gallery-tabs button').forEach(button => button.setAttribute('aria-pressed', String(button === galleryButton)));
    animateContent($('#case-gallery-image'));
  }
});
function handleProjectHash() {
  if (location.hash.startsWith('#case-')) {
    const key = location.hash.slice(6);
    if (projectData[key]) {
      suspendedCase = false;
      if (imageDialog.open) imageDialog.close();
      openCase(key, false);
    }
  } else {
    closeSequence++;
    suspendedCase = false;
    if (imageDialog.open) imageDialog.close();
    if (dialog.open) dialog.close();
    requestScrollUpdate(false);
  }
}
addEventListener('popstate', handleProjectHash);
addEventListener('hashchange', handleProjectHash);

const projectItems = $$('.project-item');
$$('[data-filter]').forEach(button => button.addEventListener('click', () => {
  if (button.getAttribute('aria-pressed') === 'true') return;
  const filter = button.dataset.filter;
  const oldRects = new Map(projectItems.filter(item => !item.hidden).map(item => [item, item.getBoundingClientRect()]));
  projectItems.forEach(item => item.getAnimations?.().forEach(animation => animation.cancel()));
  $$('[data-filter]').forEach(other => {
    const active = other === button;
    other.classList.toggle('active', active);
    other.setAttribute('aria-pressed', String(active));
  });
  let count = 0;
  projectItems.forEach(item => {
    item.hidden = filter !== 'all' && !item.dataset.categories.split(' ').includes(filter);
    if (!item.hidden) { count++; item.classList.add('visible'); }
  });
  for (const id of ['service-projects', 'practical-projects', 'supporting-projects']) {
    const group = $('#' + id);
    group.hidden = !$$('.project-item', group).some(item => !item.hidden);
  }
  $('#project-count').textContent = filter === 'all' ? '07 projects · 03 featured projects' : `${String(count).padStart(2, '0')} ${count === 1 ? 'project' : 'projects'} · ${button.textContent.trim()}`;
  if (motionEnabled) projectItems.filter(item => !item.hidden).forEach((item, index) => {
    const old = oldRects.get(item), rect = item.getBoundingClientRect();
    const transform = old ? `translate(${old.left - rect.left}px,${old.top - rect.top}px)` : 'translateY(18px)';
    animateElement(item, [{ opacity: old ? 1 : 0, transform }, { opacity: 1, transform: 'translate(0,0)' }], { duration: 320, delay: old ? 0 : Math.min(index * 30, 120) });
  });
  requestScrollUpdate(false);
}));

function connectTabs(container, dataKey, onSelect, vertical = false) {
  const buttons = $$('[role="tab"]', container);
  function select(button, focus) {
    if (button.getAttribute('aria-selected') !== 'true') {
      buttons.forEach(other => {
        const active = other === button;
        other.setAttribute('aria-selected', String(active));
        other.tabIndex = active ? 0 : -1;
      });
      onSelect(button.dataset[dataKey], button.id);
    }
    if (focus) button.focus();
  }
  buttons.forEach((button, index) => {
    button.addEventListener('click', () => select(button, false));
    button.addEventListener('keydown', event => {
      let next;
      const useVertical = typeof vertical === 'function' ? vertical() : vertical;
      if (event.key === (useVertical ? 'ArrowDown' : 'ArrowRight')) next = (index + 1) % buttons.length;
      if (event.key === (useVertical ? 'ArrowUp' : 'ArrowLeft')) next = (index - 1 + buttons.length) % buttons.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = buttons.length - 1;
      if (next !== undefined) { event.preventDefault(); select(buttons[next], true); }
    });
  });
}
const reportKeys = ['executive', 'products', 'customers', 'quality'];
const preloadedScreenshots = new Map();
function preloadScreenshot(key, index) {
  const path = assetURL('assets/projects/' + galleries[key][index][0]);
  if (preloadedScreenshots.has(path) || typeof Image === 'undefined') return;
  const image = new Image();
  image.src = path;
  preloadedScreenshots.set(path, image);
  image.decode?.().catch(() => {});
}
$$('[data-report]').forEach(button => {
  for (const type of ['pointerenter', 'focus']) button.addEventListener(type, () => preloadScreenshot('sales', reportKeys.indexOf(button.dataset.report)));
});
const warmScreenshots = () => Object.keys(galleries).forEach(key => galleries[key].forEach((_, index) => preloadScreenshot(key, index)));
if ('requestIdleCallback' in window) requestIdleCallback(warmScreenshots, { timeout: 2500 });
else setTimeout(warmScreenshots, 1400);
connectTabs($('.report-tabs'), 'report', (key, id) => {
  const index = reportKeys.indexOf(key);
  const panel = $('#report-panel');
  panel.innerHTML = screenshotMarkup('sales', index) + `<p class="report-caption">${escapeHTML(galleries.sales[index][2])}</p>`;
  panel.setAttribute('aria-labelledby', id);
  animateContent(panel);
});

const churnViews = {
  contract: { title: 'Churn by contract', rows: [['Month-to-month', 42.71], ['One year', 11.28], ['Two years', 2.85]], insight: 'Month-to-month customers show much higher observed churn. Contract groups give retention teams a useful starting point.', note: 'Percentage of customers who churned within each contract group.' },
  tenure: { title: 'Churn by tenure', rows: [['0–12 months', 47.68], ['13–24 months', 28.71], ['25–48 months', 20.39], ['49+ months', 9.51]], insight: 'The first year is the most vulnerable period in this dataset. Early onboarding and customer support deserve attention.', note: 'Percentage of customers who churned within each tenure group.' },
  risk: { title: 'Churn by risk score', rows: [['Score 0', 2.27], ['Score 1', 8.70], ['Score 2', 20.49], ['Score 3', 34.37], ['Score 4', 56.53], ['Score 5', 70.58]], insight: 'Customers with several risk factors show the highest churn. Scores 4 and 5 identify groups for targeted retention investigation.', note: 'A descriptive five-factor score, not a validated predictive model.' }
};
function barRows(rows, max, suffix, decimals) {
  return `<div class="lab-bars" role="img" aria-label="${escapeHTML(rows.map(([name, value]) => `${name}: ${value}${suffix}`).join('; '))}">${rows.map(([name, value], index) => `<div class="lab-bar-row"><span>${escapeHTML(name)}</span><div class="bar-track"><div class="bar-fill" style="width:${Math.min(100, value / max * 100)}%;--delay:${index * 55}ms"></div></div><strong>${decimals ? value.toFixed(2) : value}${suffix}</strong></div>`).join('')}</div>`;
}
function renderChurn(view = 'contract') {
  const d = churnViews[view];
  $('#lab-panel').innerHTML = `<div class="lab-panel-header"><div><h3>${d.title}</h3><p>Different groups. Different retention priorities.</p></div><select class="lab-selector" id="churn-view" aria-label="Choose churn comparison"><option value="contract">By contract type</option><option value="tenure">By customer tenure</option><option value="risk">By risk score</option></select></div>${barRows(d.rows, 100, '%', true)}<p class="lab-takeaway"><span aria-hidden="true">↗</span>${d.insight}</p><p class="lab-note">${d.note} Common scale: 0–100%.</p>`;
  animateContent($('#lab-panel'));
  $('#churn-view').value = view;
  $('#churn-view').addEventListener('change', event => {
    renderChurn(event.target.value);
    $('#churn-view').focus({ preventScroll: true });
  });
}
function renderLab(key, id) {
  $('#lab-panel').setAttribute('aria-labelledby', id);
  if (key === 'churn') {
    renderChurn();
    $('#lab-source').innerHTML = 'Source: Customer Churn and Retention Analysis<br>7,032 cleaned customer records';
  } else if (key === 'skills') {
    const rows = [['SQL', 185], ['Python', 141], ['Dashboarding', 102], ['Data Quality', 96], ['Communication', 81], ['Data Modeling', 80], ['Power BI', 75]];
    $('#lab-panel').innerHTML = `<div class="lab-panel-header"><div><h3>Skills found in target jobs</h3><p>How often selected skills appeared in the collected sample.</p></div></div>${barRows(rows, 234, '', false)}<p class="lab-takeaway"><span aria-hidden="true">↗</span>SQL and Python lead this sample. Data quality and communication also appear frequently.</p><p class="lab-note">Counts among 234 target job postings. A posting can contain multiple skills. This sample is not the entire job market.</p>`;
    $('#lab-source').innerHTML = 'Source: DataRole Radar, final QA results<br>234 target postings · Himalayas + Remotive';
  } else {
    $('#lab-panel').innerHTML = '<div class="lab-panel-header"><div><h3>Delivery is part of the experience.</h3><p>Read sales performance alongside operational reliability.</p></div></div><div class="delivery-metrics"><div><strong>7.87<span>%</span></strong><span>Late delivery rate</span></div><div><strong>12.09</strong><span>Average delivery days</span></div><div><strong>4.09<span>/5</span></strong><span>Average review score</span></div></div><p class="lab-takeaway"><span aria-hidden="true">↗</span>Late delivery was strongly associated with lower review scores. MA, CE, BA, and RJ were identified as operational priorities.</p><p class="lab-note">These are documented dataset findings. An association does not establish causation or a measured client improvement.</p><button class="case-link" id="delivery-case">Explore the complete case study <span aria-hidden="true">↗</span></button>';
    $('#lab-source').innerHTML = 'Source: E-commerce Analytics<br>99,441 orders in the analyzed dataset';
    $('#delivery-case').addEventListener('click', event => openCase('ecommerce', true, event.currentTarget));
  }
}
const compactLab = matchMedia('(max-width: 37.5em)');
function updateLabOrientation() { $('.lab-tabs').setAttribute('aria-orientation', compactLab.matches ? 'horizontal' : 'vertical'); }
compactLab.addEventListener('change', updateLabOrientation);
updateLabOrientation();
connectTabs($('.lab-tabs'), 'lab', (key, id) => { renderLab(key, id); animateContent($('#lab-panel')); }, () => !compactLab.matches);
renderLab('churn', 'lab-tab-churn');

// Tiny pointer depth belongs to the screenshot, never the clickable hit area.
// Read geometry once per frame; no animation loop runs after the pointer stops.
(function setupPreviewDepth() {
  const pointer = matchMedia('(hover: hover) and (pointer: fine)');
  const transforms = new Set();
  let pending = 0, latest = null;
  const clear = () => {
    cancelAnimationFrame(pending); pending = 0; latest = null;
    transforms.forEach(img => { img.style.transform = ''; });
    transforms.clear();
  };
  resetPreviewDepth = clear;
  const permitted = () => motionEnabled && pointer.matches && !gentleDetails.matches && !document.hidden;
  document.addEventListener('pointermove', event => {
    if (!permitted() || event.pointerType === 'touch') return;
    const target = event.target.closest('.dashboard-shot,.priority-image');
    // Full-size galleries stay flat so the work can be inspected accurately.
    if (!target || target.closest('dialog')) { if (latest || transforms.size) clear(); return; }
    latest = { target, x: event.clientX, y: event.clientY };
    if (pending) return;
    pending = requestAnimationFrame(() => {
      pending = 0;
      if (!latest || !permitted()) { clear(); return; }
      const { target, x, y } = latest;
      const img = $('img', target), rect = target.getBoundingClientRect();
      if (!img || !rect.width || !rect.height) return;
      transforms.forEach(old => { if (old !== img) { old.style.transform = ''; transforms.delete(old); } });
      const px = Math.max(-1, Math.min(1, (x - rect.left) / rect.width * 2 - 1));
      const py = Math.max(-1, Math.min(1, (y - rect.top) / rect.height * 2 - 1));
      img.style.transform = `perspective(900px) rotateX(${-py * 1.8}deg) rotateY(${px * 1.8}deg) scale(1.025)`;
      transforms.add(img);
    });
  }, { passive: true });
  document.addEventListener('pointerout', event => {
    const target = event.target.closest('.dashboard-shot,.priority-image');
    if (target && event.relatedTarget?.closest?.('.dashboard-shot,.priority-image') !== target) clear();
  });
  pointer.addEventListener('change', clear);
  gentleDetails.addEventListener('change', clear);
  document.addEventListener('visibilitychange', clear);
  addEventListener('scroll', clear, { passive: true });
  addEventListener('blur', clear);
})();
$$('.service').forEach(service => {
  service.addEventListener('pointerenter', event => {
    if (event.pointerType !== 'touch') animateServiceIcon(service);
  });
  service.addEventListener('focusin', event => {
    if (event.relatedTarget?.closest?.('.service') !== service) animateServiceIcon(service);
  });
});

try {
(function setupSignalField() {
  const canvas = $('#signal-canvas');
  const context = canvas.getContext('2d');
  if (!context) { $('#signal-toggle').disabled = true; $('#field-mode').textContent = 'Visual unavailable'; return; }
  const field = $('#signal-field');
  const toggle = $('#signal-toggle');
  let width = 0, height = 0, raf = 0, visible = true;
  // One opening assembly, then the existing quiet signal field. Starting with
  // the final form when motion is Off avoids a half-assembled static drawing.
  let organized = true, blend = motionEnabled && !gentleDetails.matches ? 0 : 1, tick = 0;
  let pointerX = 0, pointerY = 0, aimX = 0, aimY = 0;
  let seed = 3016;
  const random = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  const columns = matchMedia('(max-width: 600px)').matches ? 20 : 27;
  const rows = 14;
  const points = [];
  for (let r = 0; r < rows; r++) for (let c = 0; c < columns; c++) {
    const angle = c / (columns - 1) * Math.PI * 2;
    const band = (r / (rows - 1) - .5) * 1.8;
    const radius = .56 + Math.cos(band * 1.8) * .13;
    points.push({ angle, order: (r / (rows - 1) + c / (columns - 1)) * .5, baseX: Math.cos(angle) * radius, baseZ: Math.sin(angle) * radius, baseY: band * .52, rawX: (random() - .5) * 1.7, rawY: (random() - .5) * 1.6, rawZ: random() - .5, size: .65 + random() * .7, phase: random() * Math.PI * 2 });
  }
  function resize() {
    const rect = field.getBoundingClientRect();
    width = rect.width; height = rect.height;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
  }
  function draw() {
    context.clearRect(0, 0, width, height);
    const yaw = -.32 + Math.sin(tick * .14) * .12 + pointerX * .07;
    const cosYaw = Math.cos(yaw), sinYaw = Math.sin(yaw);
    const scale = Math.min(width * .49, height * .59);
    const rendered = points.map(p => {
      const x = p.baseX * cosYaw + p.baseZ * sinYaw;
      const z = -p.baseX * sinYaw + p.baseZ * cosYaw;
      const y = p.baseY + Math.sin(p.angle * 2 + tick * .45) * .10;
      const surfaceX = x + z * .38;
      const surfaceY = y - z * .34;
      const progress = Math.max(0, Math.min(1, (blend - p.order * .18) / .82));
      const formation = progress * progress * (3 - 2 * progress);
      const px = p.rawX * (1 - formation) + surfaceX * formation;
      const py = p.rawY * (1 - formation) + surfaceY * formation;
      const depth = p.rawZ * (1 - formation) + z * formation;
      const assemblyLight = 4 * progress * (1 - progress);
      return { x: width * .48 + px * scale + pointerX * depth * 7, y: height * .49 + py * scale + pointerY * depth * 7, depth, formation, size: p.size * (1 + depth * .25 + assemblyLight * .35), opacity: .40 + (depth + .7) * .34 + assemblyLight * .16 };
    });
    context.lineWidth = .5;
    if (blend > .15) for (let r = 0; r < rows; r++) for (let c = 0; c < columns; c++) {
      const index = r * columns + c;
      const p = rendered[index];
      context.strokeStyle = `rgba(162,191,104,${(.04 + (p.depth + .7) * .07) * p.formation})`;
      for (const next of [c < columns - 1 ? index + 1 : -1, r < rows - 1 ? index + columns : -1]) if (next >= 0) {
        context.beginPath();context.moveTo(p.x, p.y);context.lineTo(rendered[next].x, rendered[next].y);context.stroke();
      }
    }
    for (const p of rendered.slice().sort((a, b) => a.depth - b.depth)) {
      context.fillStyle = `rgba(205,241,136,${Math.min(.92, p.opacity)})`;
      context.beginPath();context.arc(p.x, p.y, Math.max(.4, p.size), 0, Math.PI * 2);context.fill();
    }
    context.strokeStyle = '#65764a66';
    context.lineWidth = .7;
    const cx = width * .48, cy = height * .49;
    context.beginPath();context.moveTo(cx - 10, cy);context.lineTo(cx + 10, cy);context.moveTo(cx, cy - 10);context.lineTo(cx, cy + 10);context.stroke();
  }
  let lastTime = 0;
  function animate(time) {
    raf = 0;
    if (!motionEnabled || !visible || document.hidden) return;
    const dt = Math.min((time - (lastTime || time)) / 1000, .05); lastTime = time;
    tick += dt;
    const smoothing = 1 - Math.exp(-dt * 3.3);
    blend += ((organized ? 1 : 0) - blend) * (1 - Math.exp(-dt * 2.6));
    pointerX += (aimX - pointerX) * smoothing;
    pointerY += (aimY - pointerY) * smoothing;
    // Draw on every browser frame. A 45 fps threshold drops alternate frames
    // on common 60 Hz displays, producing a visibly uneven cadence.
    draw();
    raf = requestAnimationFrame(animate);
  }
  renderField = () => {
    cancelAnimationFrame(raf);raf = 0;lastTime = 0;
    if (!motionEnabled) { blend = organized ? 1 : 0; pointerX = pointerY = 0; draw(); }
    else if (visible && !document.hidden) raf = requestAnimationFrame(animate);
  };
  field.addEventListener('pointermove', event => {
    if (event.pointerType === 'touch') return;
    const rect = field.getBoundingClientRect();
    aimX = (event.clientX - rect.left) / rect.width * 2 - 1;
    aimY = (event.clientY - rect.top) / rect.height * 2 - 1;
  });
  field.addEventListener('pointerleave', () => { aimX = aimY = 0; });
  toggle.addEventListener('click', () => {
    organized = !organized;
    $('#field-mode').textContent = organized ? 'Organized' : 'Scattered';
    toggle.setAttribute('aria-label', organized ? 'Scatter the signal field' : 'Organize the signal field');
    toggle.title = organized ? 'Scatter the signal field' : 'Organize the signal field';
    renderField();
  });
  if ('IntersectionObserver' in window) new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;renderField();
  }, { threshold: 0 }).observe(field);
  document.addEventListener('visibilitychange', renderField);
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(field);
  else addEventListener('resize', resize);
  resize();renderField();
})();

} catch (_) { $('#signal-toggle').disabled = true; $('#field-mode').textContent = 'Visual unavailable'; }

function setupReveals() {
  for (const selector of ['.priority-grid', '.supporting-grid', '.service-grid', '.process-list', '.about-grid']) {
    const group = $(selector);
    if (group) [...group.children].forEach((element, index) => element.style.setProperty('--reveal-delay', Math.min(index * 70, 210) + 'ms'));
  }
  if (!('IntersectionObserver' in window)) { $$('.reveal').forEach(el => el.classList.add('visible')); return; }
  try {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) {
        const first = !entry.target.classList.contains('visible');
        entry.target.classList.add('visible');
        if (first) animateRevealDetails(entry.target);
        observer.unobserve(entry.target);
      }
    }, { threshold: .04, rootMargin: '0px 0px -20px 0px' });
    document.documentElement.classList.add('enhanced');
    $$('.reveal').forEach(el => observer.observe(el));
  } catch (_) {
    document.documentElement.classList.remove('enhanced');
    $$('.reveal').forEach(el => el.classList.add('visible'));
  }
}
setupReveals();
handleProjectHash();
updateScrollState(false);
