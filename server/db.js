import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = process.env.DATABASE_PATH || path.join(__dirname, '../data/lawandlegacy.db');
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

export const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Initialize schema
db.exec(`
  CREATE TABLE IF NOT EXISTS site_content (
    id TEXT PRIMARY KEY,
    section TEXT NOT NULL,
    key TEXT NOT NULL,
    value TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(section, key)
  );

  CREATE TABLE IF NOT EXISTS events (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    event_url TEXT,
    image_url TEXT,
    event_date TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS automations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    trigger_type TEXT NOT NULL,
    trigger_label TEXT NOT NULL,
    is_active INTEGER NOT NULL DEFAULT 1,
    actions TEXT NOT NULL, -- JSON array of steps
    last_run_at DATETIME,
    run_count INTEGER NOT NULL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS automation_logs (
    id TEXT PRIMARY KEY,
    automation_id TEXT NOT NULL,
    automation_name TEXT NOT NULL,
    trigger_source TEXT NOT NULL,
    status TEXT NOT NULL, -- 'completed', 'running', 'failed', 'warning'
    steps TEXT NOT NULL, -- JSON array of executed step outcomes
    duration_ms INTEGER NOT NULL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS consultations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    practice_area TEXT,
    message TEXT,
    status TEXT DEFAULT 'pending',
    tracking_code TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS slides (
    id TEXT PRIMARY KEY,
    title TEXT,
    caption TEXT,
    image_url TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS admin_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
`);

// Seed site_content if empty
const countSiteContent = db.prepare('SELECT COUNT(*) as count FROM site_content').get();
if (countSiteContent.count === 0) {
  console.log('[DB] Seeding initial site content...');
  const insertContent = db.prepare(`
    INSERT INTO site_content (id, section, key, value) 
    VALUES (?, ?, ?, ?)
  `);

  const initialContent = [
    // Hero
    ['hero', 'title', 'Law & Legacy'],
    ['hero', 'subtitle', 'Premier Advocacy Firm in Bangladesh'],
    ['hero', 'description', 'A new-generation law firm providing comprehensive legal solutions from documentation to litigation, serving individuals, corporations, and government entities with excellence and integrity.'],
    ['hero', 'button_text', 'Get Legal Consultation'],

    // About
    ['about', 'title', 'About Law & Legacy'],
    ['about', 'paragraph1', 'Law & Legacy is a pre-eminent law firm providing specialist advice and a full range of legal services. As one of the most promising, growing, and multidimensional law firms in Bangladesh, we offer comprehensive legal services meeting virtually every need of our clients.'],
    ['about', 'paragraph2', 'Our practice is predominantly litigation-based, providing comprehensive advice to clients ranging from individuals and small businesses to large privately held national and international corporations, banks, and governmental entities.'],
    ['about', 'highlights', [
      'Top-tier legal professionals from leading law schools',
      'Comprehensive one-stop legal service centre',
      'Enlisted with numerous companies and banks',
      'Proven track record with government ministries'
    ]],
    ['about', 'quote', 'We depend on our legal mind and prudence rather than traditional understanding. Our audacity of honesty and sincerity has instituted us as a successful growing law firm.'],

    // Practice Areas
    ['practice_areas', 'title', 'Areas of Practice'],
    ['practice_areas', 'subtitle', 'Comprehensive legal services across diverse practice areas, meeting virtually every need of our clients'],
    ['practice_areas', 'areas', [
      { icon: 'Gavel', title: 'Civil & Criminal Litigation', description: 'Representing clients before all courts of Bangladesh from Judges Court to Appellate Division with meticulous case preparation.' },
      { icon: 'Building2', title: 'Banking & Finance', description: 'Expert scrutiny of documents, property title determination, and drafting security documents for banks and NBFIs.' },
      { icon: 'Briefcase', title: 'Company & Corporate Law', description: 'Comprehensive services from incorporation to mergers and acquisitions, serving as retainer lawyers for major corporations.' },
      { icon: 'FileText', title: 'Documentation & Registration', description: 'Meticulous scrutiny of title deeds, verification with government authorities, and expert assistance in document registration.' },
      { icon: 'Users', title: 'Labour & Employment', description: 'Cost-effective representation in labour courts and tribunals, with thousands of BLA cases successfully litigated.' },
      { icon: 'Award', title: 'Intellectual Property', description: 'Full range of IP services including copyright, trademark, patent, and industrial design protection.' },
      { icon: 'Home', title: 'Family Law', description: 'Professional and confidential handling of divorce, maintenance, custody, and other family matters under various laws.' },
      { icon: 'Shield', title: 'Constitutional & Administrative', description: 'Expert representation in constitutional matters and administrative law before High Court and Appellate Division.' },
      { icon: 'Globe', title: 'International Trade', description: 'Comprehensive support for foreign investment, joint ventures, and international business transactions.' },
      { icon: 'Scale', title: 'Alternative Dispute Resolution', description: 'Skilled in domestic and international arbitration, mediation, conciliation, and negotiation processes.' },
      { icon: 'TrendingUp', title: 'Capital Market', description: 'Securities law, stock exchange regulation, and comprehensive capital market advisory services.' },
      { icon: 'Landmark', title: 'Land & Property Law', description: 'Expert handling of land disputes, property transactions, leases, and licensing matters.' }
    ]],

    // Team
    ['team', 'title', 'Our Legal Team'],
    ['team', 'subtitle', 'Experienced legal professionals committed to providing the highest standards of advocacy and advice'],
    ['team', 'members', [
      { name: 'Porob Naser Siddique', role: 'Head of Chamber', credentials: 'Advocate, Supreme Court of Bangladesh', education: 'LLM & LLB, University of Dhaka', specialization: 'Corporate Law, Banking, International Trade, Mergers & Acquisitions' },
      { name: 'George Chowdhury', role: 'Managing Partner', credentials: 'Advocate, Supreme Court of Bangladesh', experience: '17+ years in litigation and corporate advisory', specialization: 'Civil, Criminal, Constitutional, High-Stakes Litigation' },
      { name: 'Neshatul Islam', role: 'Associate', credentials: 'Advocate', education: 'LL.B (Hons) & LL.M, Dhaka International University', specialization: 'Corporate Law, Securities, Company Formation, Intellectual Property' },
      { name: 'Nazibul Islam', role: 'Associate', credentials: 'Advocate, Supreme Court of Bangladesh', education: 'LL.M. & LL.B. (Hons), Jagannath University', specialization: 'Civil & Criminal Law, Constitutional Matters, Labour Law' },
      { name: 'Samir Chakrabarty', role: 'Associate', credentials: 'Advocate, Sessions Court Dhaka', specialization: 'Land Law, Contract Disputes, Family Law, Criminal Defense' },
      { name: 'Aktaruzzaman Aktar', role: 'Associate', education: 'LL.B & LL.M, East West University', experience: '5+ years with national and multinational corporations', specialization: 'Corporate Law, Regulatory Compliance, Consumer Rights' },
      { name: 'Pampa Mukherjee', role: 'Junior Associate', credentials: 'Advocate, District & Sessions Court Dhaka', education: 'LL.B. (Hons) & LL.M., Northern University Bangladesh', specialization: 'Property Disputes, Family Law, General Litigation' },
      { name: 'Md. Rayhanul Islam', role: 'Junior Associate', credentials: 'Advocate, District & Sessions Court Dhaka', education: 'LL.B. (Hons) & LL.M., Eastern University', specialization: 'Property Law, Family Disputes, General Litigation' }
    ]],

    // Clients
    ['clients', 'title', 'Our Clients'],
    ['clients', 'subtitle', 'Trusted by government ministries, multinational corporations, banks, and leading businesses across Bangladesh'],
    ['clients', 'categories', [
      { icon: 'Landmark', title: 'Government Entities', clients: ['Bangladesh Hi-Tech Park Authority', 'Ministry of Commerce', 'Ministry of Expatriates Welfare & Overseas Employment', 'Bangladesh Fisheries Development Corporation', 'Export Promotion Bureau (EPB)', 'Directorate of Government Accommodation'] },
      { icon: 'Building2', title: 'Corporate Clients', clients: ['Ashiyan Group', 'Arizona Holding Ltd.', 'Alif Group', 'Planet Group', 'Studio Dhaka Limited', 'ESSDEE Infrastructure Ltd.'] },
      { icon: 'Shield', title: 'Financial Institutions', clients: ['Leading Banks of Bangladesh', 'Non-Banking Financial Institutions', 'Capital Market Participants', 'Insurance Companies'] },
      { icon: 'Briefcase', title: 'Industry Partners', clients: ['Fakir Fashions Ltd', 'Transport Partner Ltd.', 'Banglalink Employees Union', 'BA3 Limited'] }
    ]],

    // Contact
    ['contact', 'title', 'Get In Touch'],
    ['contact', 'subtitle', 'Reach out to us for legal consultation and advice. We are here to help you navigate your legal challenges.'],
    ['contact', 'phone', '+880 1716 32 8898'],
    ['contact', 'email', 'info@lawandlegacy.com.bd'],
    ['contact', 'office_hours', 'Saturday - Thursday, 9:00 AM - 6:00 PM'],
    ['contact', 'offices', [
      { name: 'Supreme Court Office', address: 'Room No. 9049 (8th Floor), Huseyn Shaheed Suhrawardy Building, Supreme Court Bar Association', city: 'Dhaka-1000' },
      { name: 'Evening Office', address: 'House No. 1/1 (B), (3rd Floor) Block-C, Lalmatia', city: 'Dhaka-1207' },
      { name: 'Judge Court Office', address: 'Room No. 746 (6th Floor), Dhaka Bar Association Building, 6-7, Court House Street, Kotwali', city: 'Dhaka' }
    ]],

    // Footer
    ['footer', 'description', 'A pre-eminent law firm providing comprehensive legal services across Bangladesh. We pride ourselves on our commitment to personal service and delivering the very best results for our clients.']
  ];

  const insertTx = db.transaction((items) => {
    for (const [section, key, val] of items) {
      const id = `${section}_${key}`;
      insertContent.run(id, section, key, JSON.stringify(val));
    }
  });

  insertTx(initialContent);
}

// Seed events if empty
const countEvents = db.prepare('SELECT COUNT(*) as count FROM events').get();
if (countEvents.count === 0) {
  console.log('[DB] Seeding sample events...');
  const insertEvent = db.prepare(`
    INSERT INTO events (id, title, description, event_url, image_url, event_date, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const events = [
    [
      'ev_1',
      'Supreme Court Bar Association Conference 2026',
      'Chamber Head Porob Naser Siddique chaired the panel on modern cross-border commercial arbitration & investment protection treaties.',
      'https://scba.org.bd',
      'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
      '2026-10-15T10:00:00Z',
      '2026-10-10T10:00:00Z'
    ],
    [
      'ev_2',
      'Banking & Capital Market Regulatory Symposium',
      'Managing Partner George Chowdhury delivered keynote insights on security document scrutiny and NBFI risk compliance under Bangladesh Bank directives.',
      'https://bangladesh-bank.org.bd',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
      '2026-09-22T09:30:00Z',
      '2026-09-18T09:30:00Z'
    ],
    [
      'ev_3',
      'Workshop: Digital Property Scrutiny & Bangladesh Land Law',
      'Comprehensive practical session on automated title search, mutation verification, and High Court writ precedents on land acquisition.',
      'https://lawandlegacy.com.bd',
      'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80',
      '2026-08-30T15:00:00Z',
      '2026-08-25T15:00:00Z'
    ]
  ];

  for (const ev of events) {
    insertEvent.run(...ev);
  }
}

// Seed hero slides if empty
const countSlides = db.prepare('SELECT COUNT(*) as count FROM slides').get();
if (countSlides.count === 0) {
  console.log('[DB] Seeding hero slide images...');
  const insertSlide = db.prepare(`
    INSERT INTO slides (id, title, caption, image_url, display_order, is_active)
    VALUES (?, ?, ?, ?, ?, 1)
  `);

  const initialSlides = [
    [
      'slide_1',
      'Supreme Court Architecture',
      'Supreme Court Architecture & Apex Chambers',
      'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=2070&q=85',
      1
    ],
    [
      'slide_2',
      'Jurisprudence & Precedents',
      'Comprehensive Jurisprudence & Legal Precedents',
      'https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=2070&q=85',
      2
    ],
    [
      'slide_3',
      'Scales of Justice',
      'Advocate Counsel & Scales of Justice',
      'https://images.unsplash.com/photo-1453733197781-704fa5988299?auto=format&fit=crop&w=2070&q=85',
      3
    ],
    [
      'slide_4',
      'Corporate Advisory',
      'Corporate Advisory & Commercial Arbitration',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2070&q=85',
      4
    ],
    [
      'slide_5',
      'Appellate Division',
      'High Court Division & Appellate Practice',
      'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=2070&q=85',
      5
    ]
  ];

  for (const s of initialSlides) {
    insertSlide.run(...s);
  }
}

// Seed dynamic legal automations if empty
const countAutomations = db.prepare('SELECT COUNT(*) as count FROM automations').get();
if (countAutomations.count === 0) {
  console.log('[DB] Seeding dynamic legal automations...');
  const insertAuto = db.prepare(`
    INSERT INTO automations (id, name, category, description, trigger_type, trigger_label, is_active, actions, last_run_at, run_count)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const automations = [
    {
      id: 'auto_client_intake',
      name: 'Client Intake & Conflict Check Dispatch',
      category: 'Intake & Onboarding',
      description: 'Triggered when a new consultation request is submitted. Performs chamber conflict checks, assigns lead counsel, and sends confirmation dossier.',
      trigger_type: 'event:consultation_submitted',
      trigger_label: 'New Consultation Submitted',
      is_active: 1,
      actions: JSON.stringify([
        { id: 'step_1', type: 'conflict_check', name: 'Conflict of Interest Scan', detail: 'Cross-checks client & counter-party names against active chamber matters' },
        { id: 'step_2', type: 'ai_categorize', name: 'Practice Area Categorization', detail: 'Analyzes legal matter urgency and maps to chamber specialist' },
        { id: 'step_3', type: 'lead_assign', name: 'Advocate Assignment', detail: 'Assigns docket to Chamber Head / Senior Associate' },
        { id: 'step_4', type: 'notify_client', name: 'Client SMS & Secure Email Dispatch', detail: 'Sends consultation receipt & preliminary intake instructions' }
      ]),
      last_run_at: new Date(Date.now() - 1000 * 60 * 42).toISOString(),
      run_count: 87
    },
    {
      id: 'auto_cause_list_sync',
      name: 'Supreme & Subordinate Court Daily Cause List Sync',
      category: 'Litigation & Court Ops',
      description: 'Daily morning synchronization with Supreme Court Appellate & High Court Division cause lists. Matches enrolled cases and alerts arguing counsel.',
      trigger_type: 'schedule:cron_daily_6am',
      trigger_label: 'Every Morning at 06:00 AM',
      is_active: 1,
      actions: JSON.stringify([
        { id: 'step_1', type: 'fetch_cause_list', name: 'Scrape Daily Cause List', detail: 'Pulls cause list tables for Annex & Main High Court Benches' },
        { id: 'step_2', type: 'match_vakalatnama', name: 'Vakalatnama & Docket Matching', detail: 'Matches listed matter item numbers with chamber docket database' },
        { id: 'step_3', type: 'alert_counsel', name: 'Counsel Notification Matrix', detail: 'Dispatches courtroom number, bench, and estimated hearing time to lead advocate' },
        { id: 'step_4', type: 'prep_files', name: 'Chamber Clerk Briefing Docket', detail: 'Marks case records for physical court transport by chamber clerks' }
      ]),
      last_run_at: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
      run_count: 312
    },
    {
      id: 'auto_document_scrutiny',
      name: 'Deed Scrutiny & Stamp Duty Calculation Engine',
      category: 'Property & Banking',
      description: 'Automatically analyzes land title deeds and drafts, checks encumbrance history, and computes statutory stamp duty & registration tariffs.',
      trigger_type: 'webhook:document_uploaded',
      trigger_label: 'Property Title / Deed Uploaded',
      is_active: 1,
      actions: JSON.stringify([
        { id: 'step_1', type: 'ocr_parse', name: 'Deed & Mutation Scrutiny', detail: 'Parses Khatiyan, CS, SA, RS & City Jarip details' },
        { id: 'step_2', type: 'tariff_calc', name: 'Statutory Fee Calculator', detail: 'Calculates Stamp Act schedule fees, local govt taxes & AIT' },
        { id: 'step_3', type: 'risk_report', name: 'Legal Vetting Memorandum', detail: 'Compiles draft legal opinion for lending bank / purchaser' }
      ]),
      last_run_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
      run_count: 144
    },
    {
      id: 'auto_emergency_injunction',
      name: 'Urgent Injunction & Anticipatory Bail Rapid Dispatch',
      category: 'Emergency Relief',
      description: 'Immediate multi-channel escalation for urgent injunctions, stay orders, and habeas corpus petitions across emergency counsel rosters.',
      trigger_type: 'alert:emergency_flag',
      trigger_label: 'Urgent Matter Priority Tagged',
      is_active: 1,
      actions: JSON.stringify([
        { id: 'step_1', type: 'instant_sms', name: 'High-Priority Roster Broadcast', detail: 'Sends emergency priority SMS & push notification to on-duty advocates' },
        { id: 'step_2', type: 'draft_petition', name: 'Instant Template Assembly', detail: 'Pre-populates urgent motion under Order 39 or Section 498 CrPC' },
        { id: 'step_3', type: 'court_officer', name: 'Bench Officer Advance Alert', detail: 'Prepares chamber slip for mentioning before senior bench' }
      ]),
      last_run_at: new Date(Date.now() - 1000 * 60 * 920).toISOString(),
      run_count: 48
    },
    {
      id: 'auto_corporate_compliance',
      name: 'RJSC Retainer & Annual Compliance Pulse',
      category: 'Corporate Advisory',
      description: 'Monitors statutory return filing windows (Form XII, Schedule X, Annual General Meetings) for corporate retainers and corporate entities.',
      trigger_type: 'schedule:cron_monthly',
      trigger_label: 'Monthly Retainer Audit Cycle',
      is_active: 1,
      actions: JSON.stringify([
        { id: 'step_1', type: 'rjsc_audit', name: 'Corporate Registry Audit', detail: 'Scans compliance calendar for enlisted enterprise retainers' },
        { id: 'step_2', type: 'generate_memo', name: 'Compliance Health Digest', detail: 'Generates automated memorandum detailing due filings & penalty risks' },
        { id: 'step_3', type: 'client_portal', name: 'Corporate Retainer Portal Sync', detail: 'Updates client dashboard with compliance status and action items' }
      ]),
      last_run_at: new Date(Date.now() - 1000 * 60 * 1440).toISOString(),
      run_count: 65
    }
  ];

  for (const auto of automations) {
    insertAuto.run(
      auto.id,
      auto.name,
      auto.category,
      auto.description,
      auto.trigger_type,
      auto.trigger_label,
      auto.is_active,
      auto.actions,
      auto.last_run_at,
      auto.run_count
    );
  }
}

// Seed initial automation logs if empty
const countLogs = db.prepare('SELECT COUNT(*) as count FROM automation_logs').get();
if (countLogs.count === 0) {
  console.log('[DB] Seeding sample automation logs...');
  const insertLog = db.prepare(`
    INSERT INTO automation_logs (id, automation_id, automation_name, trigger_source, status, steps, duration_ms, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const sampleLogs = [
    [
      'log_01',
      'auto_client_intake',
      'Client Intake & Conflict Check Dispatch',
      'Consultation Form: Ashiyan City Property Inquiry',
      'completed',
      JSON.stringify([
        { step: 'Conflict Check', status: 'passed', message: '0 chamber conflict detected across 420 active cases' },
        { step: 'Matter Categorization', status: 'passed', message: 'Classified: Land & Property Law (Urgency: High)' },
        { step: 'Advocate Assigned', status: 'passed', message: 'Assigned to George Chowdhury & Samir Chakrabarty' },
        { step: 'Client Notification', status: 'passed', message: 'Confirmation SMS sent to +880 171XXXXXXX' }
      ]),
      342,
      new Date(Date.now() - 1000 * 60 * 42).toISOString()
    ],
    [
      'log_02',
      'auto_cause_list_sync',
      'Supreme & Subordinate Court Daily Cause List Sync',
      'Daily High Court Division Cause List Parser',
      'completed',
      JSON.stringify([
        { step: 'Cause List Ingestion', status: 'passed', message: 'Scraped 48 benches, 1,840 daily listed matters' },
        { step: 'Chamber Matching', status: 'passed', message: 'Found 4 chamber matters listed (Bench 14, 22, 29, 35)' },
        { step: 'Counsel SMS Alert', status: 'passed', message: 'Dispatched cause schedule to arguing senior counsels' }
      ]),
      1280,
      new Date(Date.now() - 1000 * 60 * 360).toISOString()
    ],
    [
      'log_03',
      'auto_document_scrutiny',
      'Deed Scrutiny & Stamp Duty Calculation Engine',
      'Document Upload: Commercial Title Deed (Badda, Dhaka)',
      'completed',
      JSON.stringify([
        { step: 'OCR & Khatiyan Verification', status: 'passed', message: 'Extracted RS Khatiyan #412; title chain verified 25 years' },
        { step: 'Statutory Fee Calculator', status: 'passed', message: 'Stamp Duty: 1.5%, Reg Fee: 1%, Total Calculated: ৳285,000' },
        { step: 'Vetting Memorandum', status: 'passed', message: 'Clear Title opinion draft generated and queued for partner signature' }
      ]),
      780,
      new Date(Date.now() - 1000 * 60 * 180).toISOString()
    ]
  ];

  for (const log of sampleLogs) {
    insertLog.run(...log);
  }
}

export default db;
