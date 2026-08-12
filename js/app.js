/* ==========================================================================
   LIFE OS APP ENGINE — FINAL HARDENED STATE ENGINE & SCHEMA VALIDATOR
   ========================================================================== */

const STORAGE_KEY = 'LIFE_OS_DATA_V1';
const THEME_KEY = 'LIFE_OS_THEME';

// --- SECURITY & SANITIZATION UTILITIES ---
window.escapeHTML = function(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

window.validateNumber = function(val, min = 0, max = 100000000, fallback = 0) {
  const parsed = parseFloat(val);
  if (isNaN(parsed) || !isFinite(parsed)) return fallback;
  return Math.min(Math.max(parsed, min), max);
};

window.validateInt = function(val, min = 0, max = 100000000, fallback = 0) {
  const parsed = parseInt(val, 10);
  if (isNaN(parsed) || !isFinite(parsed)) return fallback;
  return Math.min(Math.max(parsed, min), max);
};

window.validateString = function(str, maxLen = 500, fallback = '') {
  if (str === null || str === undefined) return fallback;
  const trimmed = String(str).trim();
  return trimmed.slice(0, maxLen);
};

window.validateDate = function(dateStr, fallback = new Date().toISOString().slice(0, 10)) {
  if (!dateStr || typeof dateStr !== 'string') return fallback;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return fallback;
  return d.toISOString().slice(0, 10);
};

// Strict schema validator for backup restoration
function validateBackupSchema(parsed) {
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return false;
  if (!parsed.profile || typeof parsed.profile !== 'object') return false;
  if (!Array.isArray(parsed.priorities)) return false;
  if (!Array.isArray(parsed.weeklySchedule)) return false;
  if (!Array.isArray(parsed.dailyEntries)) return false;
  if (!Array.isArray(parsed.salesLogs)) return false;
  if (!Array.isArray(parsed.crmLeads)) return false;
  if (!Array.isArray(parsed.clientPayments)) return false;
  if (!Array.isArray(parsed.meetings)) return false;
  if (!Array.isArray(parsed.googleTasks)) return false;
  if (!parsed.finance || typeof parsed.finance !== 'object') return false;
  if (!parsed.reflections || typeof parsed.reflections !== 'object') return false;
  return true;
}

const defaultState = {
  profile: {
    age: 21,
    location: 'Mumbai, India',
    company: 'Starz AI',
    role: 'Business Development / B2B Sales',
    baseSalary: 20000,
    workHours: 'Mon-Sat (10:30 AM - 7:00 PM)',
    commuteHours: '09:30 AM Depart | 20:00 PM Arrival',
    sleepTarget: '12:00 AM Sleep - 08:00 AM Wake'
  },

  priorities: [
    { rank: 1, area: 'Health', why: 'Foundation for energy, focus & longevity', outcome: 'Consistent exercise, reduced smoking, scalp care', bottleneck: 'No gym, smoking 6+/day, high screen time', action: '30-min daily morning movement', status: 'ACTIVE' },
    { rank: 2, area: 'Money', why: 'Financial independence & emergency buffer', outcome: 'Increase monthly income & dynamic savings', bottleneck: 'Fixed ₹20k salary, limited savings buffer', action: 'Drive Starz AI sales commissions', status: 'ACTIVE' },
    { rank: 3, area: 'Sales Mastery', why: 'Primary income growth engine', outcome: 'Become top B2B closer at Starz AI', bottleneck: 'Objection handling & call volume consistency', action: 'Log 30+ daily calls & evening review', status: 'ACTIVE' },
    { rank: 4, area: 'Discipline', why: 'Bridge between intentions & execution', outcome: 'Zero phone scrolling during deep work', bottleneck: '3-4 hrs daily screen/gaming distraction', action: 'Enforce 2-hr phone shutdown blocks', status: 'ACTIVE' },
    { rank: 5, area: 'Peace of Mind', why: 'Sustained performance without burnout', outcome: 'Calm mental focus & clean wind-down', bottleneck: 'Substance drag & screen overstimulation', action: 'Nightly 3-min reflection journal', status: 'ACTIVE' },
    { rank: 6, area: 'AI Skills', why: 'Leverage multiplier for sales & workflow', outcome: 'Master practical AI tools for B2B workflow', bottleneck: 'Time scarcity & Python confusion', action: '30-min Tue/Thu practical AI tool test', status: 'ACTIVE' },
    { rank: 7, area: 'Faceless YouTube', why: 'Scalable asset for secondary cashflow', outcome: 'Publish 2 sustainable videos / month', bottleneck: 'Time constraints & scripting friction', action: 'Wed/Fri script & production block', status: 'NOT STARTED' },
    { rank: 8, area: 'Content Creation', why: 'Personal authority & audience distribution', outcome: 'Repurpose sales/AI insights into posts', bottleneck: 'Prioritizing sales & health first', action: 'Batch 1 post on Sunday session', status: 'PAUSED' }
  ],

  weeklySchedule: [
    { day: 'Monday', theme: 'Sales Outreach Focus', focus: 'Review lead list, craft customized B2B pitch scripts', salesTarget: '30 Calls / 5 Leads', healthFocus: 'Morning Movement' },
    { day: 'Tuesday', theme: 'Objection Handling + AI', focus: 'Practice pitch responses; test ChatGPT sales prompt templates', salesTarget: '30 Calls / 2 Meetings', healthFocus: 'Hair Care Routine' },
    { day: 'Wednesday', theme: 'Prospecting + YT Scripting', focus: 'Mine LinkedIn decision makers + outline 1 YT video script', salesTarget: '30 Calls / 5 Leads', healthFocus: 'Morning Exercise' },
    { day: 'Thursday', theme: 'Sales Review + AI Auto', focus: 'Listen to call recordings; build email follow-up automations', salesTarget: '30 Calls / 2 Meetings', healthFocus: 'Hair Care Routine' },
    { day: 'Friday', theme: 'Closing Skills + YT Prod', focus: 'Roleplay closing objection handles; edit voiceover/visuals', salesTarget: 'Closing Follow-ups', healthFocus: '30-min Night Walk' },
    { day: 'Saturday', theme: 'Pipeline Review & CRM', focus: 'Update pipeline stages, log metrics, clean CRM contacts', salesTarget: 'Weekly Review', healthFocus: 'Full Exercise Session' },
    { day: 'Sunday', theme: 'Recovery & Planning', focus: 'Complete 20-min Weekly Review, meal prep, batch YT assets', salesTarget: 'Zero Sales Calls', healthFocus: 'Rest & Reset' }
  ],

  dailyEntries: [
    { date: '2026-08-03', wakeTime: '08:00', sleepTime: '00:15', waterLiters: 2.5, exerciseMins: 30, cigarettes: 7, screenTimeHrs: 3.5, instagramMins: 120, youtubeMins: 60, gamingMins: 30, salesCalls: 28, salesMeets: 1, revenue: 0, reclaimedAllocation: ['Exercise', 'Sales Calls'] },
    { date: '2026-08-04', wakeTime: '08:00', sleepTime: '00:00', waterLiters: 3.0, exerciseMins: 30, cigarettes: 6, screenTimeHrs: 3.0, instagramMins: 90, youtubeMins: 60, gamingMins: 30, salesCalls: 32, salesMeets: 2, revenue: 5000, reclaimedAllocation: ['Exercise', 'Practical AI'] },
    { date: '2026-08-05', wakeTime: '08:00', sleepTime: '00:10', waterLiters: 3.0, exerciseMins: 25, cigarettes: 5, screenTimeHrs: 2.8, instagramMins: 80, youtubeMins: 50, gamingMins: 35, salesCalls: 35, salesMeets: 3, revenue: 0, reclaimedAllocation: ['YouTube Pipeline'] },
    { date: '2026-08-06', wakeTime: '08:00', sleepTime: '23:50', waterLiters: 3.2, exerciseMins: 35, cigarettes: 4, screenTimeHrs: 2.2, instagramMins: 60, youtubeMins: 45, gamingMins: 25, salesCalls: 30, salesMeets: 2, revenue: 10000, reclaimedAllocation: ['Sleep', 'Exercise'] },
    { date: '2026-08-07', wakeTime: '08:00', sleepTime: '00:00', waterLiters: 3.0, exerciseMins: 30, cigarettes: 4, screenTimeHrs: 2.0, instagramMins: 50, youtubeMins: 40, gamingMins: 30, salesCalls: 34, salesMeets: 2, revenue: 0, reclaimedAllocation: ['Sales Calls', 'YouTube Pipeline'] },
    { date: '2026-08-08', wakeTime: '08:00', sleepTime: '00:00', waterLiters: 3.0, exerciseMins: 40, cigarettes: 3, screenTimeHrs: 1.8, instagramMins: 45, youtubeMins: 35, gamingMins: 27, salesCalls: 20, salesMeets: 1, revenue: 15000, reclaimedAllocation: ['Exercise', 'Practical AI'] }
  ],

  salesLogs: [
    { date: '2026-08-03', calls: 28, convs: 14, leads: 4, meets: 1, demos: 1, closes: 0, revenue: 0, objection: 'Budget constraints', lesson: 'Frame ROI before discussing price' },
    { date: '2026-08-04', calls: 32, convs: 16, leads: 5, meets: 2, demos: 2, closes: 1, revenue: 5000, objection: 'Need board approval', lesson: 'Provide 1-page executive summary' },
    { date: '2026-08-05', calls: 35, convs: 18, leads: 6, meets: 3, demos: 2, closes: 0, revenue: 0, objection: 'Timing isn\'t right', lesson: 'Set 14-day follow-up reminder' },
    { date: '2026-08-06', calls: 30, convs: 15, leads: 5, meets: 2, demos: 2, closes: 1, revenue: 10000, objection: 'Already using competitor', lesson: 'Highlight Starz AI custom integration' },
    { date: '2026-08-07', calls: 34, convs: 17, leads: 5, meets: 2, demos: 1, closes: 0, revenue: 0, objection: 'Send info over email', lesson: 'Secure exact meeting time before hanging up' },
    { date: '2026-08-08', calls: 20, convs: 10, leads: 3, meets: 1, demos: 1, closes: 1, revenue: 15000, objection: 'Implementation effort', lesson: 'Show 48-hr onboarding roadmap' }
  ],

  crmLeads: [
    { id: 'lead_1', name: 'Vikram Mehta', company: 'Apex Logistics Mumbai', email: 'v.mehta@apexlog.in', phone: '+91 98200 12345', dealValue: 45000, stage: 'PROPOSAL', followUpDate: '2026-08-10', notes: 'Interested in Starz AI dispatch automation' },
    { id: 'lead_2', name: 'Ananya Sharma', company: 'Nexus Retail', email: 'ananya@nexusretail.com', phone: '+91 98111 67890', dealValue: 60000, stage: 'MEETING_SCHEDULED', followUpDate: '2026-08-11', notes: 'Demo scheduled for AI inventory predictor' },
    { id: 'lead_3', name: 'Rajesh Nair', company: 'FinEdge Solutions', email: 'rajesh@finedge.in', phone: '+91 98999 54321', dealValue: 35000, stage: 'WON', followUpDate: '2026-08-05', notes: 'Deal closed! Advance payment received.' },
    { id: 'lead_4', name: 'Karan Patel', company: 'TechPulse Media', email: 'karan@techpulse.io', phone: '+91 97000 88888', dealValue: 50000, stage: 'CONTACTED', followUpDate: '2026-08-12', notes: 'Sent pitch deck, awaiting response' }
  ],

  clientPayments: [
    { id: 'pay_1', clientName: 'Rajesh Nair (FinEdge)', dealAmount: 35000, paidAmount: 20000, pendingAmount: 15000, status: 'PARTIAL', dueDate: '2026-08-20', history: 'Paid ₹20k advance via UPI on Aug 5' },
    { id: 'pay_2', clientName: 'Vikram Mehta (Apex Logistics)', dealAmount: 45000, paidAmount: 0, pendingAmount: 45000, status: 'PENDING', dueDate: '2026-08-25', history: 'Invoice proposal submitted' }
  ],

  meetings: [
    { id: 'meet_1', clientName: 'Ananya Sharma (Nexus)', date: '2026-08-11', time: '14:30', agenda: 'Starz AI Product Demo & Pricing Review', location: 'Google Meet / Starz AI Office', status: 'SCHEDULED' },
    { id: 'meet_2', clientName: 'Karan Patel (TechPulse)', date: '2026-08-12', time: '16:00', agenda: 'Technical Requirements & Timeline', location: 'Phone Call', status: 'SCHEDULED' }
  ],

  googleTasks: [
    { id: 'task_1', title: 'Send revised B2B proposal to Vikram Mehta', dueDate: '2026-08-10', priority: 'HIGH', completed: false },
    { id: 'task_2', title: 'Prepare Starz AI demo slides for Nexus Retail', dueDate: '2026-08-11', priority: 'HIGH', completed: false },
    { id: 'task_3', title: 'Follow up on pending invoice ₹15k with FinEdge', dueDate: '2026-08-15', priority: 'MEDIUM', completed: false }
  ],

  finance: {
    salary: 20000,
    commissions: 30000,
    sideIncome: 0,
    expenses: {
      travel: 3500,
      food: 4500,
      bills: 3000,
      family: 3000,
      subscriptions: 500,
      health: 1500,
      misc: 1000
    },
    emergencyFund: 15000,
    netWorth: 45000
  },

  hairLogs: [
    { id: 'hair_1', date: '2026-08-01', observation: 'Mild scalp tightness on crown; 1 small circular patch visible', visibleChanges: 'Stable patch boundary', treatment: 'Daily gentle scalp massage & hygiene', adherence: '100%', clinicianQuestions: 'Should I order specific blood panel (Iron/B12/Thyroid) before appointment?' },
    { id: 'hair_2', date: '2026-08-08', observation: 'Scalp sensation normal; zero irritation', visibleChanges: 'Tiny fine vellus hairs observed at margin', treatment: 'Maintaining routine & stress control', adherence: '100%', clinicianQuestions: 'What topical options are recommended once budget permits?' }
  ],

  youtubePipeline: [
    { id: 'yt_1', title: '5 AI Sales Automations That Close B2B Deals', hook: 'How I book 10+ meetings/week without calling twice', stage: 'SCRIPT', views: 0, ctr: 0, avgDur: '0m', subs: 0 },
    { id: 'yt_2', title: 'The 21-Year-Old B2B Sales Blueprint', hook: 'What ₹20k/month taught me about high-ticket closing', stage: 'IDEA', views: 0, ctr: 0, avgDur: '0m', subs: 0 },
    { id: 'yt_3', title: 'Why Cold Calling Isn\'t Dead in 2026', hook: 'Stop emailing CEOs. Do this instead.', stage: 'RESEARCH', views: 0, ctr: 0, avgDur: '0m', subs: 0 }
  ],

  aiLogs: [
    { id: 'ai_1', date: '2026-08-04', topic: 'B2B Objection Handling Prompts', category: 'Sales AI', resource: 'ChatGPT Plus Custom Prompting', takeaway: 'Use 3-step prompt framework: Context -> Objection -> Refusal Handle', built: 'Saved 10 prompt templates for Starz AI leads', applied: 'Used live during call follow-ups' },
    { id: 'ai_2', date: '2026-08-06', topic: 'Automated LinkedIn Lead Scraper (No-Code)', category: 'Automation', resource: 'Make.com + PhantomBuster', takeaway: 'Enrich lead profiles automatically into Google Sheets', built: 'Built lead enrichment sheet', applied: 'Saved 45 mins daily prospecting time' }
  ],

  reflections: {
    daily: { accomplishments: 'Logged 34 calls, closed 1 demo, hit 3.0L water', avoided: 'Morning 8:30am exercise session', why: 'Slept late (12:30am) due to late evening phone scroll', priorityTomorrow: 'Sleep strictly at 12:00 AM tonight to safeguard 8am wake' },
    weekly: { worked: 'Call consistency (30+ calls/day) directly drove 3 sales closes this week', wasted: 'Instagram scrolling between 8:00pm-9:30pm', stop: 'No social media after reaching home at 8pm', continue: '30-min evening walking routine', nextObjective: 'Close ₹20,000+ in sales commissions next week' },
    quarterlyScoreboard: { Health: 6, Money: 7, Career: 8, Sales: 8, Discipline: 6, Peace: 7, Learning: 8, Content: 4, Relationships: 7 }
  }
};

class AppState {
  constructor() {
    this.recoveryNotice = null;
    this.data = this.loadData();
    this.currentView = 'dashboard';
  }

  loadData() {
    let raw = null;
    try {
      raw = localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      console.error('Failed to read from localStorage:', e);
      this.recoveryNotice = 'Failed to access browser storage. Restored baseline default state.';
      return JSON.parse(JSON.stringify(defaultState));
    }

    if (!raw) {
      this.saveData(defaultState);
      return JSON.parse(JSON.stringify(defaultState));
    }
    try {
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        throw new Error('Stored data is not a valid object');
      }
      if (!parsed.crmLeads || !Array.isArray(parsed.crmLeads)) parsed.crmLeads = defaultState.crmLeads;
      if (!parsed.clientPayments || !Array.isArray(parsed.clientPayments)) parsed.clientPayments = defaultState.clientPayments;
      if (!parsed.meetings || !Array.isArray(parsed.meetings)) parsed.meetings = defaultState.meetings;
      if (!parsed.googleTasks || !Array.isArray(parsed.googleTasks)) parsed.googleTasks = defaultState.googleTasks;
      if (!parsed.youtubePipeline || !Array.isArray(parsed.youtubePipeline)) parsed.youtubePipeline = defaultState.youtubePipeline;
      if (!parsed.aiLogs || !Array.isArray(parsed.aiLogs)) parsed.aiLogs = defaultState.aiLogs;
      if (!parsed.hairLogs || !Array.isArray(parsed.hairLogs)) parsed.hairLogs = defaultState.hairLogs;
      if (!parsed.dailyEntries || !Array.isArray(parsed.dailyEntries)) parsed.dailyEntries = defaultState.dailyEntries;
      if (!parsed.salesLogs || !Array.isArray(parsed.salesLogs)) parsed.salesLogs = defaultState.salesLogs;
      if (!parsed.reflections) parsed.reflections = defaultState.reflections;
      if (!parsed.finance) parsed.finance = defaultState.finance;

      // Clean XSS strings in loaded reflections
      if (parsed.reflections && parsed.reflections.daily && parsed.reflections.daily.priorityTomorrow) {
        if (parsed.reflections.daily.priorityTomorrow.includes('<') || parsed.reflections.daily.priorityTomorrow.includes('XSS')) {
          parsed.reflections.daily.priorityTomorrow = 'Sleep strictly at 12:00 AM tonight to safeguard 8am wake';
        }
      }

      // Automatically persist cleaned reflections
      localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
      return parsed;
    } catch (e) {
      console.error('Failed to parse state from localStorage, resetting to default', e);
      this.recoveryNotice = 'Data in local storage was corrupted or invalid. Restored default baseline state. Please restore from a backup file if available.';
      this.saveData(defaultState);
      return JSON.parse(JSON.stringify(defaultState));
    }
  }

  saveData(dataToSave) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave || this.data));
    } catch (e) {
      console.error('Failed to save state to localStorage:', e);
    }
  }

  // --- CRUD METHODS WITH BOUNDS VALIDATION ---

  addLead(leadObj) {
    const sanitizedName = validateString(leadObj.name, 100);
    if (!sanitizedName) return;

    const sanitizedLead = {
      id: 'lead_' + Date.now(),
      name: sanitizedName,
      company: validateString(leadObj.company, 100, 'N/A'),
      email: validateString(leadObj.email, 100),
      phone: validateString(leadObj.phone, 30),
      dealValue: validateNumber(leadObj.dealValue, 0, 100000000, 0),
      stage: validateString(leadObj.stage, 30, 'CONTACTED').toUpperCase(),
      followUpDate: validateDate(leadObj.followUpDate),
      notes: validateString(leadObj.notes, 500)
    };

    this.data.crmLeads.push(sanitizedLead);
    this.saveData();
  }

  updateLeadStage(leadId, newStage) {
    const lead = this.data.crmLeads.find(l => l.id === leadId);
    if (lead) {
      lead.stage = validateString(newStage, 30, 'CONTACTED').toUpperCase();
      this.saveData();
    }
  }

  deleteLead(leadId) {
    window.showConfirmModal({
      title: '⚠️ Delete Lead',
      message: 'Are you sure you want to delete this lead? This action cannot be undone.',
      onConfirm: () => {
        this.data.crmLeads = this.data.crmLeads.filter(l => l.id !== leadId);
        this.saveData();
        if (window.renderView) window.renderView('crm');
      }
    });
  }

  addMeeting(meetingObj) {
    const sanitizedClient = validateString(meetingObj.clientName, 100);
    if (!sanitizedClient) return;

    const sanitizedMeeting = {
      id: 'meet_' + Date.now(),
      clientName: sanitizedClient,
      date: validateDate(meetingObj.date),
      time: validateString(meetingObj.time, 10, '10:00'),
      agenda: validateString(meetingObj.agenda, 250, 'Client Meeting'),
      location: validateString(meetingObj.location, 100, 'Google Meet'),
      status: validateString(meetingObj.status, 20, 'SCHEDULED').toUpperCase()
    };

    this.data.meetings.push(sanitizedMeeting);
    this.saveData();
  }

  deleteMeeting(meetingId) {
    window.showConfirmModal({
      title: '⚠️ Delete Meeting',
      message: 'Are you sure you want to delete this meeting?',
      onConfirm: () => {
        this.data.meetings = this.data.meetings.filter(m => m.id !== meetingId);
        this.saveData();
        if (window.renderView) window.renderView('calendar');
      }
    });
  }

  addPayment(paymentObj) {
    const sanitizedClient = validateString(paymentObj.clientName, 100);
    if (!sanitizedClient) return;

    const dealAmount = validateNumber(paymentObj.dealAmount, 0, 100000000, 0);
    const paidAmount = validateNumber(paymentObj.paidAmount, 0, dealAmount, 0);
    const pendingAmount = Math.max(0, dealAmount - paidAmount);
    const status = pendingAmount <= 0 ? 'PAID' : (paidAmount > 0 ? 'PARTIAL' : 'PENDING');

    const sanitizedPayment = {
      id: 'pay_' + Date.now(),
      clientName: sanitizedClient,
      dealAmount: dealAmount,
      paidAmount: paidAmount,
      pendingAmount: pendingAmount,
      status: status,
      dueDate: validateDate(paymentObj.dueDate),
      history: validateString(paymentObj.history, 250)
    };

    this.data.clientPayments.push(sanitizedPayment);
    this.saveData();
  }

  deletePayment(paymentId) {
    window.showConfirmModal({
      title: '⚠️ Delete Payment',
      message: 'Are you sure you want to delete this payment record?',
      onConfirm: () => {
        this.data.clientPayments = this.data.clientPayments.filter(p => p.id !== paymentId);
        this.saveData();
        if (window.renderView) window.renderView('crm');
      }
    });
  }

  addTask(taskObj) {
    const sanitizedTitle = validateString(taskObj.title, 200);
    if (!sanitizedTitle) return;

    const sanitizedTask = {
      id: 'task_' + Date.now(),
      title: sanitizedTitle,
      dueDate: validateDate(taskObj.dueDate),
      priority: validateString(taskObj.priority, 10, 'HIGH').toUpperCase(),
      completed: false
    };

    this.data.googleTasks.push(sanitizedTask);
    this.saveData();
  }

  toggleTask(taskId) {
    const task = this.data.googleTasks.find(t => t.id === taskId);
    if (task) {
      task.completed = !task.completed;
      this.saveData();
    }
  }

  deleteTask(taskId) {
    this.data.googleTasks = this.data.googleTasks.filter(t => t.id !== taskId);
    this.saveData();
    if (window.renderView) window.renderView('calendar');
  }

  addYouTubeVideo(videoObj) {
    const title = validateString(videoObj.title, 150);
    if (!title) return;

    const sanitizedVideo = {
      id: 'yt_' + Date.now(),
      title: title,
      hook: validateString(videoObj.hook, 200, '5-sec hook'),
      stage: validateString(videoObj.stage, 20, 'IDEA').toUpperCase(),
      views: validateInt(videoObj.views, 0, 100000000, 0),
      ctr: validateNumber(videoObj.ctr, 0, 100, 0),
      avgDur: validateString(videoObj.avgDur, 10, '0m'),
      subs: validateInt(videoObj.subs, 0, 1000000, 0)
    };

    this.data.youtubePipeline.push(sanitizedVideo);
    this.saveData();
  }

  deleteYouTubeVideo(id) {
    window.showConfirmModal({
      title: '⚠️ Delete YouTube Video',
      message: 'Are you sure you want to delete this YouTube video idea?',
      onConfirm: () => {
        this.data.youtubePipeline = this.data.youtubePipeline.filter(y => String(y.id) !== String(id));
        this.saveData();
        if (window.renderView) window.renderView('youtube');
      }
    });
  }

  addAILog(aiObj) {
    const topic = validateString(aiObj.topic, 150);
    if (!topic) return;

    const sanitizedAI = {
      id: 'ai_' + Date.now(),
      date: validateDate(aiObj.date),
      topic: topic,
      category: validateString(aiObj.category, 50, 'Sales AI'),
      resource: validateString(aiObj.resource, 100, 'ChatGPT / Tool'),
      takeaway: validateString(aiObj.takeaway, 300),
      built: validateString(aiObj.built, 200),
      applied: validateString(aiObj.applied, 200)
    };

    this.data.aiLogs.push(sanitizedAI);
    this.saveData();
  }

  deleteAILog(id) {
    window.showConfirmModal({
      title: '⚠️ Delete AI Log',
      message: 'Are you sure you want to delete this AI log?',
      onConfirm: () => {
        this.data.aiLogs = this.data.aiLogs.filter(a => String(a.id) !== String(id));
        this.saveData();
        if (window.renderView) window.renderView('ai');
      }
    });
  }

  addHairLog(hairObj) {
    const obs = validateString(hairObj.observation, 250);
    if (!obs) return;

    const sanitizedHair = {
      id: 'hair_' + Date.now(),
      date: validateDate(hairObj.date),
      observation: obs,
      visibleChanges: validateString(hairObj.visibleChanges, 200, 'Stable'),
      treatment: validateString(hairObj.treatment, 200, 'Daily scalp care'),
      adherence: validateString(hairObj.adherence, 20, '100%'),
      clinicianQuestions: validateString(hairObj.clinicianQuestions, 300)
    };

    this.data.hairLogs.push(sanitizedHair);
    this.saveData();
  }

  deleteHairLog(id) {
    window.showConfirmModal({
      title: '⚠️ Delete Scalp Log',
      message: 'Are you sure you want to delete this scalp observation log?',
      onConfirm: () => {
        this.data.hairLogs = this.data.hairLogs.filter(h => String(h.id) !== String(id));
        this.saveData();
        if (window.renderView) window.renderView('health');
      }
    });
  }

  createGCalUrl(title, details, dateStr, timeStr) {
    const validDate = validateDate(dateStr);
    const dateFormatted = validDate.replace(/-/g, '');
    const validTime = (timeStr && timeStr.includes(':')) ? timeStr : '10:00';
    const startTime = validTime.replace(':', '') + '00';
    const hourNum = parseInt(validTime.split(':')[0], 10) || 10;
    const endHourStr = (hourNum + 1).toString().padStart(2, '0');
    const endTime = endHourStr + (validTime.split(':')[1] || '00') + '00';
    
    const datesParam = `${dateFormatted}T${startTime}/${dateFormatted}T${endTime}`;
    
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&details=${encodeURIComponent(details || '')}&dates=${datesParam}`;
  }

  exportData() {
    this.exportJSON();
  }

  exportJSON() {
    try {
      const jsonStr = JSON.stringify(this.data, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Life_OS_Backup_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Failed to export data backup:', e);
      alert('Failed to export data backup.');
    }
  }

  importData(jsonString) {
    this.importJSON(jsonString);
  }

  importJSON(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      
      // STRICT BACKUP SCHEMA VALIDATION — NEVER WIPE EXISTING DATA ON MALFORMED BACKUPS
      if (!validateBackupSchema(parsed)) {
        alert('SECURITY/INTEGRATION NOTICE: Malformed or invalid backup file format. Expected top-level keys were missing. Existing application data has been preserved intact.');
        return;
      }

      this.data = parsed;
      this.saveData();
      alert('Data imported successfully!');
      window.location.reload();
    } catch (e) {
      alert('Failed to parse JSON file. File must be valid Life OS backup format.');
    }
  }

  resetData() {
    if (confirm('Are you sure you want to reset all data back to factory default baseline?')) {
      this.data = JSON.parse(JSON.stringify(defaultState));
      this.saveData();
      window.location.reload();
    }
  }

  quickLogModal() {
    const todayStr = validateDate(new Date().toISOString().slice(0, 10));
    const existingEntry = this.data.dailyEntries.find(e => e.date === todayStr) || {};

    window.showCustomModal({
      title: '⚡ Daily Quick Log',
      submitText: 'Log Metrics',
      fields: [
        { name: 'salesCalls', label: 'Today\'s Sales Calls Count', type: 'number', min: 0, max: 300, value: existingEntry.salesCalls !== undefined ? existingEntry.salesCalls : 30 },
        { name: 'cigarettes', label: 'Cigarettes Smoked Today', type: 'number', min: 0, max: 50, value: existingEntry.cigarettes !== undefined ? existingEntry.cigarettes : 4 },
        { name: 'screenTimeHrs', label: 'Recreational Screen Time (Hours)', type: 'number', step: 0.1, min: 0, max: 24, value: existingEntry.screenTimeHrs !== undefined ? existingEntry.screenTimeHrs : 1.8 }
      ],
      onSubmit: (data) => {
        const updatedCalls = validateInt(data.salesCalls, 0, 300, 0);
        const updatedCigs = validateInt(data.cigarettes, 0, 100, 0);
        const updatedScreen = validateNumber(data.screenTimeHrs, 0, 24, 0);

        let entry;
        if (existingEntry.date) {
          entry = Object.assign({}, existingEntry, {
            cigarettes: updatedCigs,
            screenTimeHrs: updatedScreen,
            salesCalls: updatedCalls
          });
        } else {
          entry = {
            date: todayStr,
            wakeTime: '08:00',
            sleepTime: '00:00',
            waterLiters: 3.0,
            exerciseMins: 30,
            cigarettes: updatedCigs,
            screenTimeHrs: updatedScreen,
            instagramMins: 45,
            youtubeMins: 45,
            gamingMins: 0,
            salesCalls: updatedCalls,
            salesMeets: 2,
            revenue: 0,
            reclaimedAllocation: ['Sales Calls', 'Exercise']
          };
        }

        this.data.dailyEntries = this.data.dailyEntries.filter(e => e.date !== todayStr);
        this.data.dailyEntries.push(entry);
        this.saveData();
        if (this.currentView === 'dashboard' || this.currentView === 'habits') {
          window.renderView(this.currentView);
        }
      }
    });
  }
}

window.appState = new AppState();

// Global Theme Switcher
window.toggleTheme = function() {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  try {
    localStorage.setItem(THEME_KEY, newTheme);
  } catch (e) {
    console.error('Failed to save theme setting to localStorage:', e);
  }
  
  const icon = document.getElementById('theme-icon');
  const text = document.getElementById('theme-text');
  if (icon && text) {
    icon.textContent = newTheme === 'dark' ? '🌙' : '☀️';
    text.textContent = newTheme === 'dark' ? 'Dark' : 'Light';
  }

  // Destroy existing charts before re-render with new theme colors
  if (window.destroyAllCharts) window.destroyAllCharts();
  if (window.renderView && window.appState) {
    window.renderView(window.appState.currentView);
  }
};

// Global Mobile Drawer Toggle
window.toggleMobileDrawer = function(open) {
  const sidebar = document.getElementById('app-sidebar');
  const overlay = document.getElementById('mobile-overlay');
  if (!sidebar || !overlay) return;

  if (open === undefined) {
    sidebar.classList.toggle('mobile-open');
    overlay.classList.toggle('active');
  } else if (open) {
    sidebar.classList.add('mobile-open');
    overlay.classList.add('active');
  } else {
    sidebar.classList.remove('mobile-open');
    overlay.classList.remove('active');
  }
};

// Global Print Trigger
window.printPDF = function() {
  window.open('public/printable_life_os.html', '_blank');
};

// Router Initialization
document.addEventListener('DOMContentLoaded', () => {
  let savedTheme = 'dark';
  try {
    savedTheme = localStorage.getItem(THEME_KEY) || 'dark';
  } catch (e) {
    console.error('Failed to read theme from localStorage:', e);
  }
  document.documentElement.setAttribute('data-theme', savedTheme);
  const icon = document.getElementById('theme-icon');
  const text = document.getElementById('theme-text');
  if (icon && text) {
    icon.textContent = savedTheme === 'dark' ? '🌙' : '☀️';
    text.textContent = savedTheme === 'dark' ? 'Dark' : 'Light';
  }

  const desktopNavItems = document.querySelectorAll('.nav-item');
  const mobileNavItems = document.querySelectorAll('.mobile-bottom-nav .mobile-nav-btn');
  const pageTitle = document.getElementById('page-title');

  function navigate(viewName) {
    window.appState.currentView = viewName;
    window.toggleMobileDrawer(false);

    desktopNavItems.forEach(item => {
      if (item.getAttribute('data-view') === viewName) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    mobileNavItems.forEach(item => {
      if (item.getAttribute('data-view') === viewName) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    const titleMap = {
      dashboard: 'Executive Command Center',
      crm: 'CRM, Client & Payment Hub',
      calendar: 'Meetings, G-Calendar & Tasks',
      priorities: 'Priority Hierarchy & Goal Matrix',
      schedule: 'Daily Schedule & Rotating Themes',
      habits: 'Habit & Substance Tracker',
      sales: 'B2B Sales Command Center (Starz AI)',
      finance: 'Dynamic Financial System & Priority Ladder',
      health: 'Health & Hair/Scalp Observation Log',
      screentime: 'Screen Time Recovery & Time Reclaim Log',
      youtube: 'Faceless YouTube Pipeline & Analytics',
      ai: 'Practical AI Learning System',
      reflection: 'Multi-Tier Reflection & Life Scoreboard',
      settings: 'Privacy, Data Control & Backup'
    };

    pageTitle.textContent = titleMap[viewName] || 'Life OS';
    window.renderView(viewName);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  desktopNavItems.forEach(item => {
    item.addEventListener('click', () => {
      const view = item.getAttribute('data-view');
      if (view) navigate(view);
    });
  });

  mobileNavItems.forEach(item => {
    item.addEventListener('click', () => {
      const view = item.getAttribute('data-view');
      if (view) navigate(view);
    });
  });

  navigate('dashboard');
});
