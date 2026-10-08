'use strict';

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const email = 'werewereside@gmail.com';
const motionPreferenceKey = 'portfolio-motion-v3';
let userMotion = null;
try { userMotion = localStorage.getItem(motionPreferenceKey); } catch (_) {}
if (!['on', 'off'].includes(userMotion)) userMotion = null;
let motionEnabled = userMotion !== 'off';
let renderField = () => {};
let toastTimer;
const motionAnimations = new Set();
const pendingSectionReplays = new Map();
const sectionReplayAnimations = new Map();
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
  const animation = el.animate(frames, { duration: 460, easing: 'cubic-bezier(.16,1,.3,1)', ...options });
  motionAnimations.add(animation);
  animation.finished.then(() => motionAnimations.delete(animation), () => motionAnimations.delete(animation));
  return animation;
}
function animateContent(el) {
  el.getAnimations?.().forEach(animation => animation.cancel());
  animateElement(el, [{ opacity: 0, transform: 'translateY(9px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 380 });
}
function applyMotion() {
  const root = document.documentElement;
  root.classList.toggle('motion-off', !motionEnabled);
  root.classList.toggle('motion-on', motionEnabled);
  const button = $('#motion-toggle');
  button.setAttribute('aria-pressed', String(motionEnabled));
  $('span', button).textContent = motionEnabled ? 'on' : 'off';
  button.setAttribute('aria-label', motionEnabled ? 'Turn animations off' : 'Turn animations on');
  button.title = motionEnabled ? 'Animations enabled. Click to reduce motion.' : 'Animations disabled. Click to enable.';
  if (!motionEnabled) {
    pendingSectionReplays.clear();
    pendingHeroReplay = false;
    motionAnimations.forEach(animation => animation.cancel());
    motionAnimations.clear();
    sectionReplayAnimations.clear();
    $$('.reveal').forEach(el => el.classList.add('visible'));
  }
  renderField();
}
applyMotion();
$('#motion-toggle').addEventListener('click', () => {
  motionEnabled = !motionEnabled;
  userMotion = motionEnabled ? 'on' : 'off';
  try { localStorage.setItem(motionPreferenceKey, userMotion); } catch (_) {}
  applyMotion();
  toast(motionEnabled ? 'Animations enabled.' : 'Reduced motion enabled.');
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
function resetSectionAnimations(section) {
  pendingSectionReplays.clear();
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
    playSectionEntrance(element, [{ opacity: 0, transform: 'translateY(32px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 850, delay });
    $$('.bar-fill', element).forEach((bar, index) => playSectionEntrance(bar, [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: 900, delay: delay + index * 55 }));
  }
  if (pendingHeroReplay && inView($('#hero-title'))) {
    pendingHeroReplay = false;
    $$('.hero-line span').forEach((line, index) => playSectionEntrance(line, [{ transform: 'translateY(112%)' }, { transform: 'translateY(0)' }], { duration: 1100, delay: index * 130 }));
    $$('.hero-enter').forEach((element, index) => playSectionEntrance(element, [{ opacity: 0, transform: 'translateY(20px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 950, delay: 180 + index * 70 }));
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
matchMedia('(min-width: 1001px)').addEventListener('change', e => { if (e.matches) closeMenu(); });

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
    document.body.appendChild(input);
    input.select();
    try { copied = document.execCommand('copy'); } catch (_) {}
    input.remove();
    focused?.focus({ preventScroll: true });
  }
  toast(copied ? message : 'Select and copy the email address, or use the email link.');
  return copied;
}
$('#copy-email').addEventListener('click', () => copyText(email, 'Email address copied.'));

const escapeHTML = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));

const projectData = {
  sales: {
    number: '01', type: 'Reporting automation', title: 'Automated Sales Reporting System',
    description: 'A repeatable workflow that turns monthly sales CSV files into clean reporting data and a four-page Power BI dashboard.',
    metrics: [['2.30M', 'Approx. baseline revenue'], ['12.47%', 'Baseline profit margin'], ['4', 'Power BI report pages']],
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
  sales: ['A recurring reporting workflow', 'A scoped adaptation could combine your monthly files, define your KPIs, create a focused report, and document the preparation and refresh process.', 'Monthly sales reporting project'],
  excel: ['A workbook for your business', 'A scoped adaptation could organize your orders, stock, expenses, and customers into a workbook with formulas and an operational dashboard.', 'Custom Excel business tracker'],
  retail: ['A dashboard for business decisions', 'A scoped adaptation could clean your sales data, define meaningful metrics, and investigate product margins, discounts, and customer profitability.', 'Profitability dashboard project']
};
projectData.sales.limitation += ' The screenshots show a refreshed snapshot, while the baseline figures above describe the earlier period documented in the README.';
projectData.excel.limitation = 'The workbook and screenshots demonstrate a portfolio example. The sample includes filtered views; no measured client impact is claimed. A public repository or workbook download has not been supplied.';
projectData.radar.tools = ['Python', 'Pandas', 'SQL / SQLite', 'Power BI', 'pytest', 'Data quality'];

const dialog = $('#case-dialog');
const imageDialog = $('#image-dialog');
let lastCaseTrigger, activeProject, returnHash = '#work';
let closeSequence = 0;
let galleryProject, galleryIndex = 0, lastImageTrigger;

function lockBody() { document.body.classList.toggle('modal-open', dialog.open || imageDialog.open); }
function screenshotMarkup(key, index = 0) {
  const [file, title] = galleries[key][index];
  return `<button class="dashboard-shot" data-image="${key}" data-image-index="${index}" aria-label="Enlarge ${escapeHTML(title)}"><img src="assets/projects/${file}" alt="${escapeHTML(title)} — actual ${escapeHTML(projectData[key].title)} screenshot" width="1440" height="810" decoding="async"><span class="image-expand">View full size <i aria-hidden="true">↗</i></span></button>`;
}
function galleryMarkup(key) {
  const shots = galleries[key];
  if (!shots) return '';
  return `<section class="case-gallery" aria-label="Actual project screenshots"><div class="case-gallery-top"><h3>Inside the actual project</h3><span>${shots.length} screenshots · click to enlarge</span></div><div id="case-gallery-image">${screenshotMarkup(key)}</div><div class="case-gallery-tabs" role="group" aria-label="Choose a project screenshot">${shots.map(([, title], index) => `<button data-gallery-index="${index}" aria-pressed="${index === 0}">${escapeHTML(title)}</button>`).join('')}</div><p class="case-gallery-caption" id="case-gallery-caption" role="status" aria-live="polite">${escapeHTML(shots[0][2])}</p></section>`;
}
function serviceMarkup(key) {
  const offer = serviceOffers[key];
  if (!offer) return '';
  return `<section class="case-service"><h3>${escapeHTML(offer[0])}</h3><p>${escapeHTML(offer[1])}</p><a class="text-link" href="mailto:${email}?subject=${encodeURIComponent(offer[2])}">Discuss a similar project <span aria-hidden="true">↗</span></a></section>`;
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
  $('#case-content').innerHTML = `<p class="eyebrow case-kicker">${project.number} / ${escapeHTML(project.type)}</p><h2 class="case-title" id="case-title">${escapeHTML(project.title)}</h2><p class="case-subtitle">${escapeHTML(project.description)}</p><div class="tags">${project.tools.map(tool => `<span>${escapeHTML(tool)}</span>`).join('')}</div>${galleryMarkup(key)}<div class="case-metrics">${project.metrics.map(([value, label]) => `<div class="case-metric"><strong>${escapeHTML(value)}</strong><span>${escapeHTML(label)}</span></div>`).join('')}</div><section class="case-section"><h3>The question</h3><p>${escapeHTML(project.problem)}</p></section><section class="case-section"><h3>How I approached it</h3><ol>${project.steps.map(text => `<li>${escapeHTML(text)}</li>`).join('')}</ol></section><section class="case-section"><h3>What I built</h3><ul>${project.outcomes.map(text => `<li>${escapeHTML(text)}</li>`).join('')}</ul></section><section class="case-section"><h3>The useful finding</h3><p>${escapeHTML(project.finding)}</p></section>${serviceMarkup(key)}<p class="case-note">${escapeHTML(project.limitation)}</p><div class="case-links">${project.repo ? `<a class="button button-lime" href="${escapeHTML(project.repo)}" target="_blank" rel="noopener noreferrer">Explore the repository <span aria-hidden="true">↗</span></a>` : `<a class="button button-lime" href="mailto:${email}?subject=Excel%20Business%20Tracker%20inquiry">Ask about the workbook <span aria-hidden="true">↗</span></a>`}<button class="button button-outline" id="copy-case">Copy case study link <span aria-hidden="true">↗</span></button></div>`;
  if (!dialog.open) dialog.showModal();
  else animateContent($('#case-content'));
  lockBody();
  dialog.scrollTop = 0;
  $('.close-dialog', dialog).focus({ preventScroll: true });
  $('#copy-case').addEventListener('click', () => {
    const base = location.protocol === 'file:' ? $('link[rel="canonical"]').getAttribute('href') : location.origin + location.pathname;
    copyText(`${base.replace(/#.*$/, '')}#case-${activeProject}`, 'Case study link copied.');
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
  full.src = 'assets/projects/' + file;
  full.alt = title + ' — actual project screenshot';
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
  lockBody();
  if (lastImageTrigger?.isConnected) lastImageTrigger.focus({ preventScroll: true });
});
closeOnBackdrop(imageDialog, closeImage);

document.addEventListener('click', event => {
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
      if (imageDialog.open) imageDialog.close();
      openCase(key, false);
    }
  } else {
    closeSequence++;
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
  for (const id of ['service-projects', 'supporting-projects']) {
    const group = $('#' + id);
    group.hidden = !$$('.project-item', group).some(item => !item.hidden);
  }
  $('#project-count').textContent = filter === 'all' ? '06 projects · 02 featured systems' : `${String(count).padStart(2, '0')} ${count === 1 ? 'project' : 'projects'} · ${button.textContent.trim()}`;
  if (motionEnabled) projectItems.filter(item => !item.hidden).forEach((item, index) => {
    const old = oldRects.get(item), rect = item.getBoundingClientRect();
    const transform = old ? `translate(${old.left - rect.left}px,${old.top - rect.top}px)` : 'translateY(18px)';
    animateElement(item, [{ opacity: old ? 1 : 0, transform }, { opacity: 1, transform: 'translate(0,0)' }], { duration: 520, delay: old ? 0 : Math.min(index * 35, 140) });
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
  const path = 'assets/projects/' + galleries[key][index][0];
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
const compactLab = matchMedia('(max-width: 600px)');
function updateLabOrientation() { $('.lab-tabs').setAttribute('aria-orientation', compactLab.matches ? 'horizontal' : 'vertical'); }
compactLab.addEventListener('change', updateLabOrientation);
updateLabOrientation();
connectTabs($('.lab-tabs'), 'lab', (key, id) => { renderLab(key, id); animateContent($('#lab-panel')); }, () => !compactLab.matches);
renderLab('churn', 'lab-tab-churn');

try {
(function setupSignalField() {
  const canvas = $('#signal-canvas');
  const context = canvas.getContext('2d');
  if (!context) { $('#signal-toggle').disabled = true; $('#field-mode').textContent = 'Visual unavailable'; return; }
  const field = $('#signal-field');
  const toggle = $('#signal-toggle');
  let width = 0, height = 0, raf = 0, visible = true;
  let organized = true, blend = 1, tick = 0;
  let pointerX = 0, pointerY = 0, aimX = 0, aimY = 0;
  let seed = 3016;
  const random = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  const columns = matchMedia('(max-width: 600px)').matches ? 20 : 27;
  const rows = 14;
  const points = [];
  for (let r = 0; r < rows; r++) for (let c = 0; c < columns; c++) {
    points.push({ u: c / (columns - 1), v: r / (rows - 1), rawX: (random() - .5) * 1.7, rawY: (random() - .5) * 1.6, rawZ: random() - .5, size: .65 + random() * .7, phase: random() * Math.PI * 2 });
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
    const rendered = points.map(p => {
      const angle = p.u * Math.PI * 2;
      const band = (p.v - .5) * 1.8;
      const radius = .56 + Math.cos(band * 1.8) * .13;
      let x = Math.cos(angle) * radius;
      let z = Math.sin(angle) * radius;
      let y = band * .52 + Math.sin(angle * 2 + tick * .45) * .10;
      const yaw = -.32 + Math.sin(tick * .14) * .12 + pointerX * .07;
      const rotatedX = x * Math.cos(yaw) + z * Math.sin(yaw);
      z = -x * Math.sin(yaw) + z * Math.cos(yaw);
      x = rotatedX;
      const surfaceX = x + z * .38;
      const surfaceY = y - z * .34;
      const px = p.rawX * (1 - blend) + surfaceX * blend;
      const py = p.rawY * (1 - blend) + surfaceY * blend;
      const depth = p.rawZ * (1 - blend) + z * blend;
      const scale = Math.min(width * .49, height * .59);
      return { x: width * .48 + px * scale + pointerX * depth * 7, y: height * .49 + py * scale + pointerY * depth * 7, depth, size: p.size * (1 + depth * .25), opacity: .40 + (depth + .7) * .34 };
    });
    context.lineWidth = .5;
    if (blend > .15) for (let r = 0; r < rows; r++) for (let c = 0; c < columns; c++) {
      const index = r * columns + c;
      const p = rendered[index];
      context.strokeStyle = `rgba(162,191,104,${(.04 + (p.depth + .7) * .07) * blend})`;
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
  let lastTime = 0, lastDraw = 0;
  function animate(time) {
    raf = 0;
    if (!motionEnabled || !visible || document.hidden) return;
    const dt = Math.min((time - (lastTime || time)) / 1000, .05); lastTime = time;
    tick += dt;
    const smoothing = 1 - Math.exp(-dt * 3.3);
    blend += ((organized ? 1 : 0) - blend) * smoothing;
    pointerX += (aimX - pointerX) * smoothing;
    pointerY += (aimY - pointerY) * smoothing;
    if (time - lastDraw >= 1000 / 45) { draw(); lastDraw = time; }
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
        entry.target.classList.add('visible');
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
