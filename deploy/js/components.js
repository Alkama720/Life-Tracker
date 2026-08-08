/* ==========================================================================
   LIFE OS COMPONENT RENDERERS — FULLY INTERACTIVE, ESCAPED & HARDENED
   ========================================================================== */

const esc = window.escapeHTML;

window.renderView = function(viewName) {
  const container = document.getElementById('view-content');
  const data = window.appState.data;

  switch (viewName) {
    case 'dashboard':
      container.innerHTML = renderDashboard(data);
      if (window.renderDashboardCharts) window.renderDashboardCharts(data);
      break;
    case 'crm':
      container.innerHTML = renderCRM(data);
      break;
    case 'calendar':
      container.innerHTML = renderCalendar(data);
      break;
    case 'priorities':
      container.innerHTML = renderPriorities(data);
      break;
    case 'schedule':
      container.innerHTML = renderSchedule(data);
      break;
    case 'habits':
      container.innerHTML = renderHabits(data);
      if (window.renderHabitCharts) window.renderHabitCharts(data);
      break;
    case 'sales':
      container.innerHTML = renderSales(data);
      if (window.renderSalesCharts) window.renderSalesCharts(data);
      break;
    case 'finance':
      container.innerHTML = renderFinance(data);
      break;
    case 'health':
      container.innerHTML = renderHealth(data);
      break;
    case 'screentime':
      container.innerHTML = renderScreenTime(data);
      break;
    case 'youtube':
      container.innerHTML = renderYouTube(data);
      break;
    case 'ai':
      container.innerHTML = renderAI(data);
      break;
    case 'college':
      container.innerHTML = renderCollege(data);
      break;
    case 'reflection':
      container.innerHTML = renderReflection(data);
      if (window.renderRadarChart) window.renderRadarChart(data);
      break;
    case 'settings':
      container.innerHTML = renderSettings(data);
      break;
    default:
      container.innerHTML = '<h3>View Not Found</h3>';
  }
};

/* 1. DASHBOARD VIEW */
function renderDashboard(data) {
  const entries = data.dailyEntries || [];
  const latestEntry = entries.length > 0 ? entries[entries.length - 1] : {};
  const todayDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

  const totalPipeline = (data.crmLeads || []).reduce((acc, l) => acc + (l.dealValue || 0), 0);
  const pendingPayments = (data.clientPayments || []).reduce((acc, p) => acc + (p.pendingAmount || 0), 0);

  return `
    <div class="notice-box">
      <strong>SYSTEM PHILOSOPHY:</strong> Consistency Over Intensity | Track Reality, Not Intentions | Protect Health & Sleep
    </div>

    <!-- Dynamic Stat Widgets -->
    <div class="grid-cols-4" style="margin-bottom: 24px;">
      <div class="stat-widget">
        <div class="stat-label">Active CRM Pipeline</div>
        <div class="stat-value" style="color: var(--accent-emerald);">₹${totalPipeline.toLocaleString()}</div>
        <div class="stat-trend trend-up">${(data.crmLeads || []).length} Active Client Deals</div>
      </div>
      <div class="stat-widget">
        <div class="stat-label">Pending Client Invoices</div>
        <div class="stat-value" style="color: var(--accent-amber);">₹${pendingPayments.toLocaleString()}</div>
        <div class="stat-trend trend-down">Client Invoices Due</div>
      </div>
      <div class="stat-widget">
        <div class="stat-label">Today's Sales Calls</div>
        <div class="stat-value" style="color: var(--accent-cyan);">${latestEntry.salesCalls || 0}</div>
        <div class="stat-trend trend-up">Quota Target: 30 Calls/day</div>
      </div>
      <div class="stat-widget">
        <div class="stat-label">Cigarettes Smoked</div>
        <div class="stat-value" style="color: ${(latestEntry.cigarettes || 0) <= 4 ? 'var(--accent-emerald)' : 'var(--accent-rose)'}">${latestEntry.cigarettes || 0}</div>
        <div class="stat-trend trend-up">Target: &lt; 4 / day</div>
      </div>
    </div>

    <!-- Highest Leverage Question & Today's Schedule -->
    <div class="grid-cols-2" style="margin-bottom: 24px;">
      <div class="card">
        <div class="card-header">
          <div class="card-title">💡 Single Highest-Leverage Action Today</div>
          <div class="card-subtitle">${todayDate}</div>
        </div>
        <div style="background: var(--accent-cyan-glow); border: 1px solid rgba(6, 182, 212, 0.3); padding: 14px; border-radius: 8px; margin-bottom: 12px; font-style: italic; color: var(--accent-cyan);">
          "What is the single highest-leverage action I can take today that makes everything else easier or unnecessary?"
        </div>
        <textarea id="leverage-input" class="form-textarea" rows="3" placeholder="Enter your key leverage action for today...">${esc(data.reflections?.daily?.priorityTomorrow || '')}</textarea>
        <button class="btn btn-primary" style="margin-top: 10px;" onclick="saveLeverageAction()">Save Action</button>
      </div>

      <div class="card">
        <div class="card-header">
          <div class="card-title">📅 Today's Time-Block Schedule</div>
          <div class="card-subtitle">Rotational Evening Focus</div>
        </div>
        <ul style="list-style: none; display: flex; flex-direction: column; gap: 8px; font-size: 13px;">
          <li style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-color); padding-bottom: 4px;">
            <span><strong>08:00 - 09:00 AM</strong> Morning Routine & Movement</span>
            <span style="color: var(--accent-emerald);">[✓] ${latestEntry.exerciseMins || 30}m Pushups/Jog</span>
          </li>
          <li style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-color); padding-bottom: 4px;">
            <span><strong>09:30 - 10:30 AM</strong> Commute to Starz AI</span>
            <span style="color: var(--accent-cyan);">Sales Audio / Reading</span>
          </li>
          <li style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-color); padding-bottom: 4px;">
            <span><strong>10:30 - 19:00 PM</strong> Starz AI B2B Work Block</span>
            <span style="color: var(--text-primary);">${latestEntry.salesCalls || 30}+ Calls & Demos</span>
          </li>
          <li style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-color); padding-bottom: 4px;">
            <span><strong>20:45 - 21:30 PM</strong> ROTATING EVENING BLOCK</span>
            <span style="color: var(--accent-purple); font-weight: 700;">Sales / AI / YT Focus</span>
          </li>
          <li style="display: flex; justify-content: space-between;">
            <span><strong>22:30 - 00:00 AM</strong> Journal & Sleep Prep</span>
            <span style="color: var(--text-muted);">Lights Out at 12:00 AM</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- Dynamic Trend Visualizers -->
    <div class="grid-cols-2">
      <div class="card">
        <div class="card-header">
          <div class="card-title">🚬 Cigarette Count Trend (Baseline: 6+)</div>
        </div>
        <canvas id="chart-cigs" height="180"></canvas>
      </div>
      <div class="card">
        <div class="card-header">
          <div class="card-title">📱 Screen Time Trend (Baseline: 3.5 hrs)</div>
        </div>
        <canvas id="chart-screen" height="180"></canvas>
      </div>
    </div>
  `;
}

window.saveLeverageAction = function() {
  const el = document.getElementById('leverage-input');
  if (!el) return;
  const val = window.validateString(el.value, 500);
  window.appState.data.reflections.daily.priorityTomorrow = val;
  window.appState.saveData();
  alert('Highest-leverage action saved!');
};

/* 2. CRM & CLIENT MANAGEMENT VIEW */
function renderCRM(data) {
  const leads = data.crmLeads || [];
  const payments = data.clientPayments || [];

  const totalPipelineVal = leads.reduce((acc, l) => acc + (l.dealValue || 0), 0);
  const totalPaid = payments.reduce((acc, p) => acc + (p.paidAmount || 0), 0);
  const totalPending = payments.reduce((acc, p) => acc + (p.pendingAmount || 0), 0);

  const leadRows = leads.map(l => {
    const stageBadgeClass = l.stage === 'WON' ? 'badge-active' : (l.stage === 'PROPOSAL' ? 'badge-paused' : (l.stage === 'MEETING_SCHEDULED' ? 'badge-active' : 'badge-notstarted'));
    return `
      <tr>
        <td>
          <strong>${esc(l.name)}</strong><br/>
          <span style="font-size: 11px; color: var(--text-secondary);">${esc(l.company)}</span>
        </td>
        <td>
          <span style="font-size: 11px;">✉️ ${esc(l.email || '-')}</span><br/>
          <span style="font-size: 11px;">📞 ${esc(l.phone || '-')}</span>
        </td>
        <td style="color: var(--accent-emerald); font-weight: 700;">₹${(l.dealValue || 0).toLocaleString()}</td>
        <td><span class="status-badge ${stageBadgeClass}">${esc(l.stage.replace(/_/g, ' '))}</span></td>
        <td><strong>${esc(l.followUpDate || '-')}</strong></td>
        <td style="font-size: 11px; max-width: 180px;">${esc(l.notes || '-')}</td>
        <td>
          <div style="display: flex; gap: 4px;">
            <button class="btn btn-secondary" style="padding: 4px 8px; font-size: 10px;" onclick="quickUpdateStage('${l.id}')">Stage</button>
            <button class="btn btn-secondary" style="padding: 4px 8px; font-size: 10px; border-color: var(--accent-rose); color: var(--accent-rose);" onclick="window.appState.deleteLead('${l.id}')">Delete</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  const paymentRows = payments.map(p => {
    const statusClass = p.status === 'PAID' ? 'badge-active' : (p.status === 'PARTIAL' ? 'badge-paused' : 'badge-risk');
    return `
      <tr>
        <td><strong>${esc(p.clientName)}</strong></td>
        <td>₹${(p.dealAmount || 0).toLocaleString()}</td>
        <td style="color: var(--accent-emerald); font-weight: 700;">₹${(p.paidAmount || 0).toLocaleString()}</td>
        <td style="color: var(--accent-rose); font-weight: 700;">₹${(p.pendingAmount || 0).toLocaleString()}</td>
        <td><span class="status-badge ${statusClass}">${esc(p.status)}</span></td>
        <td>${esc(p.dueDate || '-')}</td>
        <td style="font-size: 11px;">${esc(p.history || '-')}</td>
        <td>
          <button class="btn btn-secondary" style="padding: 4px 8px; font-size: 10px; border-color: var(--accent-rose); color: var(--accent-rose);" onclick="window.appState.deletePayment('${p.id}')">Delete</button>
        </td>
      </tr>
    `;
  }).join('');

  return `
    <div class="grid-cols-3" style="margin-bottom: 24px;">
      <div class="stat-widget">
        <div class="stat-label">Active Lead Pipeline</div>
        <div class="stat-value" style="color: var(--accent-emerald);">₹${totalPipelineVal.toLocaleString()}</div>
        <div class="stat-trend trend-up">${leads.length} Deals in Pipeline</div>
      </div>
      <div class="stat-widget">
        <div class="stat-label">Client Payments Collected</div>
        <div class="stat-value" style="color: var(--accent-cyan);">₹${totalPaid.toLocaleString()}</div>
        <div class="stat-trend trend-up">Cash Received</div>
      </div>
      <div class="stat-widget">
        <div class="stat-label">Pending Client Invoices</div>
        <div class="stat-value" style="color: var(--accent-rose);">₹${totalPending.toLocaleString()}</div>
        <div class="stat-trend trend-down">Outstanding Receivable</div>
      </div>
    </div>

    <div style="display: flex; gap: 12px; margin-bottom: 20px; flex-wrap: wrap;">
      <button class="btn btn-primary" onclick="openAddLeadModal()">+ Add New Lead / Client</button>
      <button class="btn btn-secondary" onclick="openAddPaymentModal()">+ Log Client Payment</button>
    </div>

    <div class="card" style="margin-bottom: 24px;">
      <div class="card-header">
        <div class="card-title">📇 Client Leads & Follow-Up Pipeline</div>
      </div>
      <div class="table-responsive">
        <table class="custom-table">
          <thead>
            <tr>
              <th>Client / Lead</th>
              <th>Contact Info</th>
              <th>Deal Value</th>
              <th>Stage</th>
              <th>Next Follow-Up</th>
              <th>Notes / Requirement</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${leadRows || '<tr><td colspan="7" style="text-align: center; color: var(--text-muted);">No leads added yet. Click "+ Add New Lead" above.</td></tr>'}
          </tbody>
        </table>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <div class="card-title">💰 Client Payment & Invoice Ledger</div>
      </div>
      <div class="table-responsive">
        <table class="custom-table">
          <thead>
            <tr>
              <th>Client Name</th>
              <th>Deal Amount</th>
              <th>Paid Amount</th>
              <th>Pending Amount</th>
              <th>Payment Status</th>
              <th>Due Date</th>
              <th>Payment Notes</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${paymentRows || '<tr><td colspan="8" style="text-align: center; color: var(--text-muted);">No client payments logged yet.</td></tr>'}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

window.openAddLeadModal = function() {
  const name = prompt('Enter Lead / Client Name:');
  if (!name || !name.trim()) return;
  const company = prompt('Enter Company Name:', 'Starz AI Prospect');
  const email = prompt('Enter Email:', 'client@example.com');
  const phone = prompt('Enter Phone Number:', '+91 ');
  const dealValue = prompt('Enter Estimated Deal Value (₹):', '50000');
  const stage = prompt('Enter Stage (CONTACTED, MEETING_SCHEDULED, PROPOSAL, WON, LOST):', 'CONTACTED');
  const followUpDate = prompt('Enter Follow-up Date (YYYY-MM-DD):', new Date().toISOString().slice(0,10));
  const notes = prompt('Enter Notes / Key Requirement:');

  window.appState.addLead({
    name, company, email, phone, dealValue, stage, followUpDate, notes
  });

  alert('Lead added successfully!');
  window.renderView('crm');
};

window.openAddPaymentModal = function() {
  const clientName = prompt('Enter Client Name & Company:');
  if (!clientName || !clientName.trim()) return;
  const dealAmount = prompt('Enter Total Deal Amount (₹):', '50000');
  const paidAmount = prompt('Enter Paid Amount Received (₹):', '20000');
  const dueDate = prompt('Enter Due Date for Remaining Balance (YYYY-MM-DD):', new Date().toISOString().slice(0,10));
  const history = prompt('Enter Receipt Notes / Payment Method:', 'Paid via UPI');

  window.appState.addPayment({
    clientName, dealAmount, paidAmount, dueDate, history
  });

  alert('Payment logged successfully!');
  window.renderView('crm');
};

window.quickUpdateStage = function(leadId) {
  const newStage = prompt('Enter new stage (CONTACTED, MEETING_SCHEDULED, PROPOSAL, WON, LOST):', 'PROPOSAL');
  if (newStage) {
    window.appState.updateLeadStage(leadId, newStage);
    window.renderView('crm');
  }
};

/* 3. CALENDAR & GOOGLE TASKS VIEW */
function renderCalendar(data) {
  const meetings = data.meetings || [];
  const tasks = data.googleTasks || [];

  const meetingRows = meetings.map(m => {
    const gcalUrl = window.appState.createGCalUrl(
      `Starz AI Meeting: ${m.clientName}`,
      `Agenda: ${m.agenda} | Location: ${m.location}`,
      m.date,
      m.time
    );
    return `
      <tr>
        <td><strong>${esc(m.date)}</strong><br/><span style="font-size: 11px; color: var(--accent-cyan); font-weight: 700;">⏰ ${esc(m.time)}</span></td>
        <td><strong>${esc(m.clientName)}</strong></td>
        <td>${esc(m.agenda)}</td>
        <td><span style="font-size: 11px;">📍 ${esc(m.location)}</span></td>
        <td><span class="status-badge badge-active">${esc(m.status)}</span></td>
        <td>
          <div style="display: flex; gap: 4px;">
            <a href="${gcalUrl}" target="_blank" class="btn btn-secondary" style="padding: 4px 8px; font-size: 10px; border-color: var(--accent-cyan); color: var(--accent-cyan);">
              📅 Google Calendar
            </a>
            <button class="btn btn-secondary" style="padding: 4px 8px; font-size: 10px; border-color: var(--accent-rose); color: var(--accent-rose);" onclick="window.appState.deleteMeeting('${m.id}')">Delete</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  const taskRows = tasks.map(t => `
    <tr style="${t.completed ? 'opacity: 0.5; text-decoration: line-through;' : ''}">
      <td>
        <input type="checkbox" ${t.completed ? 'checked' : ''} onchange="window.appState.toggleTask('${t.id}'); window.renderView('calendar');">
      </td>
      <td><strong>${esc(t.title)}</strong></td>
      <td><strong>${esc(t.dueDate || '-')}</strong></td>
      <td><span class="status-badge ${t.priority === 'HIGH' ? 'badge-risk' : 'badge-paused'}">${esc(t.priority)}</span></td>
      <td>
        <div style="display: flex; gap: 4px;">
          <a href="https://tasks.google.com/" target="_blank" class="btn btn-secondary" style="padding: 4px 8px; font-size: 10px;">
            ☑️ Google Tasks
          </a>
          <button class="btn btn-secondary" style="padding: 4px 8px; font-size: 10px; border-color: var(--accent-rose); color: var(--accent-rose);" onclick="window.appState.deleteTask('${t.id}')">Delete</button>
        </div>
      </td>
    </tr>
  `).join('');

  return `
    <div class="notice-box">
      <strong>1-CLICK GOOGLE INTEGRATION:</strong> Click "Google Calendar" next to any meeting or "Google Tasks" to seamlessly sync client appointments and reminders to your phone!
    </div>

    <div style="display: flex; gap: 12px; margin-bottom: 20px; flex-wrap: wrap;">
      <button class="btn btn-primary" onclick="openAddMeetingModal()">+ Schedule Client Meeting</button>
      <button class="btn btn-secondary" onclick="openAddTaskModal()">+ Add Action Task</button>
    </div>

    <div class="card" style="margin-bottom: 24px;">
      <div class="card-header">
        <div class="card-title">🗓️ Scheduled Client Meetings & Google Calendar Sync</div>
      </div>
      <div class="table-responsive">
        <table class="custom-table">
          <thead>
            <tr>
              <th>Date & Time</th>
              <th>Client / Lead</th>
              <th>Agenda</th>
              <th>Location</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${meetingRows || '<tr><td colspan="6" style="text-align: center; color: var(--text-muted);">No meetings scheduled.</td></tr>'}
          </tbody>
        </table>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <div class="card-title">☑️ Client Action Tasks & Google Tasks Integration</div>
      </div>
      <div class="table-responsive">
        <table class="custom-table">
          <thead>
            <tr>
              <th style="width: 30px;">Done</th>
              <th>Task Action</th>
              <th>Due Date</th>
              <th>Priority</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${taskRows || '<tr><td colspan="5" style="text-align: center; color: var(--text-muted);">No tasks added.</td></tr>'}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

window.openAddMeetingModal = function() {
  const clientName = prompt('Enter Client Name / Company:');
  if (!clientName || !clientName.trim()) return;
  const date = prompt('Enter Meeting Date (YYYY-MM-DD):', new Date().toISOString().slice(0,10));
  const time = prompt('Enter Meeting Time (HH:MM e.g. 15:30):', '15:30');
  const agenda = prompt('Enter Meeting Agenda / Objective:', 'Starz AI Solution Demo');
  const location = prompt('Enter Location (Google Meet / Starz AI Office / Phone):', 'Google Meet');

  window.appState.addMeeting({
    clientName, date, time, agenda, location, status: 'SCHEDULED'
  });

  alert('Meeting scheduled successfully!');
  window.renderView('calendar');
};

window.openAddTaskModal = function() {
  const title = prompt('Enter Task Title / Action:');
  if (!title || !title.trim()) return;
  const dueDate = prompt('Enter Due Date (YYYY-MM-DD):', new Date().toISOString().slice(0,10));
  const priority = prompt('Enter Priority (HIGH, MEDIUM, LOW):', 'HIGH');

  window.appState.addTask({
    title, dueDate, priority
  });

  alert('Task added successfully!');
  window.renderView('calendar');
};

/* 4. PRIORITIES & GOALS VIEW */
function renderPriorities(data) {
  const rows = (data.priorities || []).map(p => `
    <tr>
      <td><strong>${p.rank}</strong></td>
      <td><strong>${esc(p.area)}</strong></td>
      <td>${esc(p.why)}</td>
      <td>${esc(p.outcome)}</td>
      <td style="color: var(--accent-rose); font-weight: 600;">${esc(p.bottleneck)}</td>
      <td>${esc(p.action)}</td>
      <td><span class="status-badge ${p.status === 'ACTIVE' ? 'badge-active' : (p.status === 'PAUSED' ? 'badge-paused' : 'badge-notstarted')}">${esc(p.status)}</span></td>
    </tr>
  `).join('');

  return `
    <div class="card" style="margin-bottom: 24px;">
      <div class="card-header">
        <div class="card-title">🎯 Priority Hierarchy Matrix (Rules: Higher Priority Wins Conflict)</div>
      </div>
      <div class="table-responsive">
        <table class="custom-table">
          <thead>
            <tr>
              <th>P#</th>
              <th>Priority Area</th>
              <th>Why It Matters</th>
              <th>Desired Outcome</th>
              <th>Current Bottleneck</th>
              <th>Next Action</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <div class="card-title">📌 SMART Lead & Lag Measures</div>
      </div>
      <div class="grid-cols-3">
        <div style="background: var(--bg-card-header); padding: 14px; border-radius: 8px; border: 1px solid var(--border-color);">
          <div style="color: var(--accent-cyan); font-weight: 700; margin-bottom: 4px;">Health Goal</div>
          <div style="font-size: 12px; color: var(--text-secondary);">Lead Measure: 30-min daily morning exercise + &lt;4 cigarettes/day</div>
          <div style="font-size: 12px; color: var(--text-primary); margin-top: 4px;">Lag Measure: Stable energy levels & scalp health improvement</div>
        </div>
        <div style="background: var(--bg-card-header); padding: 14px; border-radius: 8px; border: 1px solid var(--border-color);">
          <div style="color: var(--accent-cyan); font-weight: 700; margin-bottom: 4px;">B2B Sales Goal</div>
          <div style="font-size: 12px; color: var(--text-secondary);">Lead Measure: 30+ calls & 2 demos booked per working day</div>
          <div style="font-size: 12px; color: var(--text-primary); margin-top: 4px;">Lag Measure: ₹50,000+ monthly commissions at Starz AI</div>
        </div>
        <div style="background: var(--bg-card-header); padding: 14px; border-radius: 8px; border: 1px solid var(--border-color);">
          <div style="color: var(--accent-cyan); font-weight: 700; margin-bottom: 4px;">Faceless YouTube Goal</div>
          <div style="font-size: 12px; color: var(--text-secondary);">Lead Measure: 2 script & production sessions per week</div>
          <div style="font-size: 12px; color: var(--text-primary); margin-top: 4px;">Lag Measure: 2 published videos/month & monetization milestone</div>
        </div>
      </div>
    </div>
  `;
}

/* 5. SCHEDULE VIEW */
function renderSchedule(data) {
  const weeklyRows = (data.weeklySchedule || []).map(s => `
    <tr>
      <td><strong>${esc(s.day.toUpperCase())}</strong></td>
      <td><strong style="color: var(--accent-cyan);">${esc(s.theme)}</strong></td>
      <td>${esc(s.focus)}</td>
      <td>${esc(s.salesTarget)}</td>
      <td>${esc(s.healthFocus)}</td>
    </tr>
  `).join('');

  return `
    <div class="grid-cols-2" style="margin-bottom: 24px;">
      <div class="card">
        <div class="card-header">
          <div class="card-title">⏰ Default Daily Schedule (Mon–Sat)</div>
        </div>
        <div style="display: flex; flex-direction: column; gap: 8px; font-size: 13px;">
          <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-color); padding-bottom: 6px;">
            <span><strong>08:00 – 08:30 AM</strong> Wake up, 500ml water, zero screen time</span>
            <span class="status-badge badge-active">ROUTINE</span>
          </div>
          <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-color); padding-bottom: 6px;">
            <span><strong>08:30 – 09:00 AM</strong> Movement / Bodyweight exercise</span>
            <span class="status-badge badge-active">HEALTH</span>
          </div>
          <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-color); padding-bottom: 6px;">
            <span><strong>09:30 – 10:30 AM</strong> Commute to Starz AI (Audio Learning)</span>
            <span class="status-badge badge-paused">COMMUTE</span>
          </div>
          <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-color); padding-bottom: 6px;">
            <span><strong>10:30 AM – 07:00 PM</strong> Starz AI B2B Sales Execution</span>
            <span class="status-badge badge-active">WORK</span>
          </div>
          <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-color); padding-bottom: 6px;">
            <span><strong>08:45 – 09:30 PM</strong> ROTATING EVENING BLOCK</span>
            <span class="status-badge badge-risk" style="background: rgba(168, 85, 247, 0.2); color: #C084FC;">THEMED</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span><strong>10:30 – 12:00 AM</strong> Reflection Journal & Reading</span>
            <span class="status-badge badge-notstarted">RECOVERY</span>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div class="card-title">💡 Rotation Rule Enforcer</div>
        </div>
        <div class="notice-box-warning">
          <strong>BURNOUT PREVENTION RULE:</strong> Do NOT attempt to do sales, YouTube, AI, college, and gym every single night. Execute ONLY the assigned theme for today!
        </div>
        <ul style="font-size: 13px; display: flex; flex-direction: column; gap: 8px; padding-left: 16px; color: var(--text-secondary);">
          <li>Monday = Pure Sales Outreach & Script Polish</li>
          <li>Tuesday = Pitch Objection Handling + Practical AI Tools</li>
          <li>Wednesday = LinkedIn Prospecting + YouTube Scripting</li>
          <li>Thursday = Call Recording Analysis + Email Automations</li>
          <li>Friday = Closing Handles + YouTube Voiceover/Editing</li>
          <li>Saturday = CRM Stage Maintenance & Pipeline Audit</li>
          <li>Sunday = Rest, Recovery, Meal Prep & Content Batching</li>
        </ul>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <div class="card-title">🗓️ Rotating Mon–Sun Theme Planner</div>
      </div>
      <div class="table-responsive">
        <table class="custom-table">
          <thead>
            <tr>
              <th>Day</th>
              <th>Primary Evening Theme</th>
              <th>Specific Deliverable</th>
              <th>Sales Target</th>
              <th>Health Focus</th>
            </tr>
          </thead>
          <tbody>
            ${weeklyRows}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

/* 6. HABITS VIEW */
function renderHabits(data) {
  const habitRows = (data.dailyEntries || []).map(e => `
    <tr>
      <td><strong>${esc(e.date)}</strong></td>
      <td style="color: ${(e.cigarettes || 0) <= 4 ? 'var(--accent-emerald)' : 'var(--accent-rose)'}; font-weight: 700;">${e.cigarettes || 0} cigs</td>
      <td style="color: ${(e.screenTimeHrs || 0) <= 2 ? 'var(--accent-emerald)' : 'var(--accent-amber)'}; font-weight: 700;">${e.screenTimeHrs || 0} hrs</td>
      <td>${e.waterLiters || 0} L</td>
      <td>${e.exerciseMins || 0} mins</td>
      <td>${e.salesCalls || 0} calls</td>
      <td>${esc(e.sleepTime || '-')}</td>
    </tr>
  `).join('');

  return `
    <div class="notice-box">
      <strong>NUMERIC TRACKING:</strong> Behaviors like cigarettes and screen time are tracked numerically to reveal actual trendlines.
    </div>

    <div class="grid-cols-2" style="margin-bottom: 24px;">
      <div class="card">
        <div class="card-header">
          <div class="card-title">🚬 Cigarettes Daily Trend (Target: &lt; 4)</div>
        </div>
        <canvas id="chart-habits-cigs" height="200"></canvas>
      </div>
      <div class="card">
        <div class="card-header">
          <div class="card-title">📱 Screen Time Trend (Target: &lt; 1.5 hrs)</div>
        </div>
        <canvas id="chart-habits-screen" height="200"></canvas>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <div class="card-title">📋 Historical Behavior Log</div>
      </div>
      <div class="table-responsive">
        <table class="custom-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Cigarettes</th>
              <th>Screen Time</th>
              <th>Water</th>
              <th>Exercise</th>
              <th>Sales Calls</th>
              <th>Sleep Time</th>
            </tr>
          </thead>
          <tbody>
            ${habitRows || '<tr><td colspan="7" style="text-align: center; color: var(--text-muted);">No entries logged yet.</td></tr>'}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

/* 7. SALES VIEW */
function renderSales(data) {
  const salesLogs = data.salesLogs || [];
  const salesRows = salesLogs.map(s => {
    const revVal = s.revenue || 0;
    const callsVal = s.calls || 0;
    const convRate = callsVal > 0 ? (( (s.closes || 0) / callsVal ) * 100).toFixed(1) : '0.0';
    return `
      <tr>
        <td><strong>${esc(s.date)}</strong></td>
        <td>${callsVal}</td>
        <td>${s.convs || 0}</td>
        <td>${s.leads || 0}</td>
        <td>${s.meets || 0}</td>
        <td>${s.closes || 0}</td>
        <td style="color: var(--accent-emerald); font-weight: 700;">₹${revVal.toLocaleString()}</td>
        <td style="color: var(--accent-cyan); font-weight: 700;">${convRate}%</td>
        <td style="color: var(--accent-amber);">${esc(s.objection || '-')}</td>
        <td>${esc(s.lesson || '-')}</td>
      </tr>
    `;
  }).join('');

  const totalCalls = salesLogs.reduce((acc, x) => acc + (x.calls || 0), 0);
  const totalCloses = salesLogs.reduce((acc, x) => acc + (x.closes || 0), 0);
  const totalRev = salesLogs.reduce((acc, x) => acc + (x.revenue || 0), 0);
  const overallConvRate = totalCalls > 0 ? ((totalCloses / totalCalls) * 100).toFixed(1) : '0.0';

  return `
    <div class="grid-cols-3" style="margin-bottom: 24px;">
      <div class="stat-widget">
        <div class="stat-label">Total Calls Logged</div>
        <div class="stat-value" style="color: var(--accent-cyan);">${totalCalls}</div>
        <div class="stat-trend trend-up">Quota: 30 Calls/day</div>
      </div>
      <div class="stat-widget">
        <div class="stat-label">Deals Closed</div>
        <div class="stat-value" style="color: var(--accent-emerald);">${totalCloses}</div>
        <div class="stat-trend trend-up">Conversion Rate: ${overallConvRate}%</div>
      </div>
      <div class="stat-widget">
        <div class="stat-label">Total Sales Revenue</div>
        <div class="stat-value" style="color: var(--accent-emerald);">₹${totalRev.toLocaleString()}</div>
        <div class="stat-trend trend-up">Starz AI B2B Performance</div>
      </div>
    </div>

    <div class="card" style="margin-bottom: 24px;">
      <div class="card-header">
        <div class="card-title">💼 Daily B2B Sales Activity & Objection Log</div>
      </div>
      <div class="table-responsive">
        <table class="custom-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Calls</th>
              <th>Convs</th>
              <th>Leads</th>
              <th>Meets</th>
              <th>Closes</th>
              <th>Revenue</th>
              <th>Conv %</th>
              <th>Main Objection</th>
              <th>Daily Lesson</th>
            </tr>
          </thead>
          <tbody>
            ${salesRows || '<tr><td colspan="10" style="text-align: center; color: var(--text-muted);">No sales activity logged yet.</td></tr>'}
          </tbody>
        </table>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <div class="card-title">📈 Sales Performance & Conversion Funnel</div>
      </div>
      <canvas id="chart-sales-funnel" height="150"></canvas>
    </div>
  `;
}

/* 8. FINANCE VIEW */
function renderFinance(data) {
  const fin = data.finance || { salary: 20000, commissions: 0, sideIncome: 0, expenses: {} };
  const expObj = fin.expenses || {};
  const totalExp = Object.values(expObj).reduce((a, b) => a + (parseFloat(b) || 0), 0);
  const totalInc = (fin.salary || 0) + (fin.commissions || 0) + (fin.sideIncome || 0);
  const netSavings = Math.max(0, totalInc - totalExp);
  const savingsRate = totalInc > 0 ? ((netSavings / totalInc) * 100).toFixed(1) : '0.0';

  return `
    <div class="grid-cols-4" style="margin-bottom: 24px;">
      <div class="stat-widget">
        <div class="stat-label">Base Salary</div>
        <div class="stat-value">₹${(fin.salary || 0).toLocaleString()}</div>
        <div class="stat-trend">Fixed Base Income</div>
      </div>
      <div class="stat-widget">
        <div class="stat-label">Sales Commissions</div>
        <div class="stat-value" style="color: var(--accent-emerald);">₹${(fin.commissions || 0).toLocaleString()}</div>
        <div class="stat-trend trend-up">Variable Earned</div>
      </div>
      <div class="stat-widget">
        <div class="stat-label">Total Monthly Expenses</div>
        <div class="stat-value" style="color: var(--accent-rose);">₹${totalExp.toLocaleString()}</div>
        <div class="stat-trend trend-down">Controlled Spending</div>
      </div>
      <div class="stat-widget">
        <div class="stat-label">Savings Rate</div>
        <div class="stat-value" style="color: var(--accent-cyan);">${savingsRate}%</div>
        <div class="stat-trend trend-up">Net Savings: ₹${netSavings.toLocaleString()}</div>
      </div>
    </div>

    <div class="grid-cols-2">
      <div class="card">
        <div class="card-header">
          <div class="card-title">💰 Dynamic Income & Expenses Ledger</div>
        </div>
        <div style="display: flex; flex-direction: column; gap: 10px; font-size: 13px;">
          <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-color); padding-bottom: 4px;">
            <span>Base Salary (Starz AI)</span> <strong>₹${(fin.salary || 0).toLocaleString()}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-color); padding-bottom: 4px;">
            <span>Sales Commissions</span> <strong style="color: var(--accent-emerald);">₹${(fin.commissions || 0).toLocaleString()}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-color); padding-bottom: 4px;">
            <span>Travel & Commute Expenses</span> <span>₹${(expObj.travel || 0).toLocaleString()}</span>
          </div>
          <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-color); padding-bottom: 4px;">
            <span>Food & Groceries</span> <span>₹${(expObj.food || 0).toLocaleString()}</span>
          </div>
          <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-color); padding-bottom: 4px;">
            <span>Family & Household Bills</span> <span>₹${(expObj.bills || 0).toLocaleString()}</span>
          </div>
          <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-color); padding-bottom: 4px;">
            <span>Health & Personal Care</span> <span>₹${(expObj.health || 0).toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div class="card-title">🧗 Financial Priority Ladder</div>
        </div>
        <ol style="display: flex; flex-direction: column; gap: 10px; font-size: 13px; padding-left: 20px;">
          <li style="color: var(--accent-emerald); font-weight: 600;">1. Track Expenses Daily (100% Execution)</li>
          <li style="color: var(--accent-emerald); font-weight: 600;">2. Control Unnecessary Spending</li>
          <li style="color: var(--accent-cyan); font-weight: 600;">3. Build Emergency Buffer (Target: ₹30,000)</li>
          <li style="color: var(--accent-cyan); font-weight: 600;">4. Increase Income via Starz AI Commissions</li>
          <li style="color: var(--text-secondary);">5. Build Dynamic Monthly Savings Buffer</li>
          <li style="color: var(--text-secondary);">6. Invest When Financially Appropriate</li>
        </ol>
      </div>
    </div>
  `;
}

/* 9. HEALTH VIEW WITH ADD & DELETE */
function renderHealth(data) {
  const hairRows = (data.hairLogs || []).map(h => `
    <tr>
      <td><strong>${esc(h.date)}</strong></td>
      <td>${esc(h.observation)}</td>
      <td>${esc(h.visibleChanges)}</td>
      <td>${esc(h.treatment)}</td>
      <td><span class="status-badge badge-active">${esc(h.adherence)}</span></td>
      <td style="color: var(--accent-cyan);">${esc(h.clinicianQuestions)}</td>
      <td>
        <button class="btn btn-secondary" style="padding: 4px 8px; font-size: 10px; border-color: var(--accent-rose); color: var(--accent-rose);" onclick="window.appState.deleteHairLog('${h.id}')">Delete</button>
      </td>
    </tr>
  `).join('');

  return `
    <div class="notice-box-warning">
      <strong>MEDICAL DISCLAIMER:</strong> Medical treatment decisions should be made with a qualified healthcare professional. This tracker strictly logs observations, symptom changes, treatment adherence, and preparation questions for clinician visits.
    </div>

    <div style="margin-bottom: 20px;">
      <button class="btn btn-primary" onclick="openAddHairModal()">+ Add Scalp Observation Log</button>
    </div>

    <div class="card" style="margin-bottom: 24px;">
      <div class="card-header">
        <div class="card-title">🩺 Alopecia Areata Observation & Clinician Preparation Log</div>
      </div>
      <div class="table-responsive">
        <table class="custom-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Scalp Observation</th>
              <th>Visible Changes</th>
              <th>Treatment / Routine</th>
              <th>Adherence</th>
              <th>Questions for Clinician</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${hairRows || '<tr><td colspan="7" style="text-align: center; color: var(--text-muted);">No scalp observations logged yet.</td></tr>'}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

window.openAddHairModal = function() {
  const obs = prompt('Enter Scalp / Hair Observation:');
  if (!obs || !obs.trim()) return;
  const changes = prompt('Enter Visible Changes (e.g. Fine vellus hair growth, stable patch):', 'Stable patch boundary');
  const treatment = prompt('Enter Treatment / Routine (e.g. Daily massage, hygiene):', 'Daily scalp care & hygiene');
  const adherence = prompt('Enter Adherence % (e.g. 100%):', '100%');
  const questions = prompt('Enter Questions for Clinician:');

  window.appState.addHairLog({
    date: new Date().toISOString().slice(0, 10),
    observation: obs,
    visibleChanges: changes,
    treatment, adherence,
    clinicianQuestions: questions
  });

  alert('Observation logged successfully!');
  window.renderView('health');
};

/* 10. SCREEN TIME VIEW */
function renderScreenTime(data) {
  const baselineScreenHrs = 3.5;
  const entries = data.dailyEntries || [];
  
  const totalReclaimedHrs = entries.reduce((acc, e) => {
    const screenHrs = parseFloat(e.screenTimeHrs) || 0;
    const diff = Math.max(0, baselineScreenHrs - screenHrs);
    return acc + diff;
  }, 0).toFixed(1);

  return `
    <div class="card" style="margin-bottom: 24px;">
      <div class="card-header">
        <div class="card-title">⏳ Screen Time Reclaimed Time Allocation</div>
      </div>
      <div class="notice-box">
        <strong>RECOVERY METRIC:</strong> Measuring whether reduced screen time becomes sleep, exercise, sales calls, learning, or YouTube output.
      </div>
      <div class="grid-cols-2">
        <div style="background: var(--bg-card-header); padding: 16px; border-radius: 8px;">
          <div style="font-weight: 700; color: var(--accent-cyan); margin-bottom: 8px;">Reclaimed Hours Allocation</div>
          <ul style="font-size: 13px; display: flex; flex-direction: column; gap: 6px; padding-left: 16px; color: var(--text-primary);">
            <li>[✓] Morning Movement & Exercise (30 mins)</li>
            <li>[✓] Daily B2B Sales Prospecting (45 mins)</li>
            <li>[✓] Faceless YouTube Scripting (30 mins)</li>
            <li>[✓] Night Walk & Scalp Routine (30 mins)</li>
          </ul>
        </div>
        <div style="background: var(--bg-card-header); padding: 16px; border-radius: 8px;">
          <div style="font-weight: 700; color: var(--accent-emerald); margin-bottom: 8px;">Weekly Recovered Balance (Dynamic)</div>
          <div style="font-size: 28px; font-weight: 800; color: var(--accent-emerald);">+${totalReclaimedHrs} Hours</div>
          <div style="font-size: 12px; color: var(--text-secondary); margin-top: 4px;">Total time diverted from scrolling/gaming into high-leverage actions based on actual logs.</div>
        </div>
      </div>
    </div>
  `;
}

/* 11. YOUTUBE VIEW WITH ADD & DELETE */
function renderYouTube(data) {
  const ytRows = (data.youtubePipeline || []).map(y => `
    <tr>
      <td><strong>${esc(y.title)}</strong></td>
      <td>${esc(y.hook)}</td>
      <td><span class="status-badge badge-active">${esc(y.stage)}</span></td>
      <td>${y.views || 0}</td>
      <td>${y.ctr || 0}%</td>
      <td>${esc(y.avgDur || '0m')}</td>
      <td>
        <button class="btn btn-secondary" style="padding: 4px 8px; font-size: 10px; border-color: var(--accent-rose); color: var(--accent-rose);" onclick="window.appState.deleteYouTubeVideo('${y.id}')">Delete</button>
      </td>
    </tr>
  `).join('');

  return `
    <div style="margin-bottom: 20px;">
      <button class="btn btn-primary" onclick="openAddYouTubeModal()">+ Add YouTube Video Idea</button>
    </div>

    <div class="card">
      <div class="card-header">
        <div class="card-title">🎬 Faceless YouTube Content Pipeline (10-Stage System)</div>
      </div>
      <div style="background: var(--bg-card-header); padding: 10px; border-radius: 6px; font-size: 11px; color: var(--text-secondary); margin-bottom: 16px; text-align: center;">
        IDEA ➔ RESEARCH ➔ HOOK ➔ SCRIPT ➔ VOICEOVER ➔ VISUALS ➔ EDIT ➔ THUMBNAIL ➔ UPLOAD ➔ ANALYZE
      </div>
      <div class="table-responsive">
        <table class="custom-table">
          <thead>
            <tr>
              <th>Video Title</th>
              <th>Hook Highlight</th>
              <th>Stage</th>
              <th>Views</th>
              <th>CTR</th>
              <th>Avg Duration</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${ytRows || '<tr><td colspan="7" style="text-align: center; color: var(--text-muted);">No videos in pipeline.</td></tr>'}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

window.openAddYouTubeModal = function() {
  const title = prompt('Enter Video Title / Topic:');
  if (!title || !title.trim()) return;
  const hook = prompt('Enter Hook (First 5 seconds):', 'How to...');
  const stage = prompt('Enter Stage (IDEA, RESEARCH, HOOK, SCRIPT, EDIT, UPLOAD):', 'IDEA');

  window.appState.addYouTubeVideo({
    title, hook, stage, views: 0, ctr: 0, avgDur: '0m', subs: 0
  });

  alert('Video added to pipeline!');
  window.renderView('youtube');
};

/* 12. AI VIEW WITH ADD & DELETE */
function renderAI(data) {
  const aiRows = (data.aiLogs || []).map(a => `
    <tr>
      <td><strong>${esc(a.date)}</strong></td>
      <td><strong>${esc(a.topic)}</strong></td>
      <td><span class="status-badge badge-active">${esc(a.category)}</span></td>
      <td>${esc(a.resource)}</td>
      <td>${esc(a.takeaway)}</td>
      <td style="color: var(--accent-emerald); font-weight: 600;">${esc(a.applied)}</td>
      <td>
        <button class="btn btn-secondary" style="padding: 4px 8px; font-size: 10px; border-color: var(--accent-rose); color: var(--accent-rose);" onclick="window.appState.deleteAILog('${a.id}')">Delete</button>
      </td>
    </tr>
  `).join('');

  return `
    <div class="notice-box">
      <strong>PRACTICAL AI RULES:</strong> Exclusively practical B2B sales automations, marketing tools, and prompt frameworks. Python is strictly excluded.
    </div>

    <div style="margin-bottom: 20px;">
      <button class="btn btn-primary" onclick="openAddAIModal()">+ Log Practical AI Tool</button>
    </div>

    <div class="card">
      <div class="card-header">
        <div class="card-title">🤖 Practical AI Tool Application Log</div>
      </div>
      <div class="table-responsive">
        <table class="custom-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Topic</th>
              <th>Category</th>
              <th>Resource</th>
              <th>Key Takeaway</th>
              <th>Where Applied</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${aiRows || '<tr><td colspan="7" style="text-align: center; color: var(--text-muted);">No AI applications logged.</td></tr>'}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

window.openAddAIModal = function() {
  const topic = prompt('Enter Practical AI Topic / Skill:');
  if (!topic || !topic.trim()) return;
  const category = prompt('Enter Category (Sales AI, Automation, Marketing AI, Content):', 'Sales AI');
  const resource = prompt('Enter Resource / Tool Used:', 'ChatGPT Custom Prompting');
  const takeaway = prompt('Enter Key Takeaway:');
  const applied = prompt('Enter Where Applied in Workflow:', 'B2B Sales Outreach');

  window.appState.addAILog({
    date: new Date().toISOString().slice(0, 10),
    topic, category, resource, takeaway,
    built: 'Saved workflow template', applied
  });

  alert('Practical AI Log saved!');
  window.renderView('ai');
};

/* 13. COLLEGE VIEW WITH ADD & DELETE */
function renderCollege(data) {
  const collegeRows = (data.collegeTasks || []).map(c => `
    <tr>
      <td><strong>${esc(c.subject)}</strong></td>
      <td>${esc(c.task)}</td>
      <td>${esc(c.deadline)}</td>
      <td><span class="status-badge ${c.priority === 'HIGH' ? 'badge-risk' : 'badge-paused'}">${esc(c.priority)}</span></td>
      <td><span class="status-badge badge-notstarted">${esc(c.status)}</span></td>
      <td>
        <button class="btn btn-secondary" style="padding: 4px 8px; font-size: 10px; border-color: var(--accent-rose); color: var(--accent-rose);" onclick="window.appState.deleteCollegeTask('${c.id}')">Delete</button>
      </td>
    </tr>
  `).join('');

  return `
    <div style="margin-bottom: 20px;">
      <button class="btn btn-primary" onclick="openAddCollegeModal()">+ Add College Task</button>
    </div>

    <div class="card">
      <div class="card-header">
        <div class="card-title">🎓 Lightweight College Task Tracker</div>
      </div>
      <div class="table-responsive">
        <table class="custom-table">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Assignment / Exam</th>
              <th>Deadline</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${collegeRows || '<tr><td colspan="6" style="text-align: center; color: var(--text-muted);">No college tasks pending.</td></tr>'}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

window.openAddCollegeModal = function() {
  const subject = prompt('Enter Subject Name:');
  if (!subject || !subject.trim()) return;
  const task = prompt('Enter Assignment / Exam Detail:', 'Project Report');
  const deadline = prompt('Enter Deadline (YYYY-MM-DD):', new Date().toISOString().slice(0,10));
  const priority = prompt('Enter Priority (HIGH, MEDIUM, LOW):', 'MEDIUM');

  window.appState.addCollegeTask({
    subject, task, deadline, priority, status: 'PENDING'
  });

  alert('College task added!');
  window.renderView('college');
};

/* 14. REFLECTION VIEW */
function renderReflection(data) {
  const ref = data.reflections || {};
  const daily = ref.daily || {};
  const weekly = ref.weekly || {};

  return `
    <div class="grid-cols-2" style="margin-bottom: 24px;">
      <div class="card">
        <div class="card-header">
          <div class="card-title">📝 Daily 3-Minute Evening Reflection</div>
        </div>
        <div style="font-size: 13px; display: flex; flex-direction: column; gap: 10px;">
          <div><strong>1. Accomplished:</strong> ${esc(daily.accomplishments || '-')}</div>
          <div><strong>2. Avoided / Procrastinated:</strong> ${esc(daily.avoided || '-')}</div>
          <div><strong>3. Root Bottleneck:</strong> ${esc(daily.why || '-')}</div>
          <div style="color: var(--accent-cyan);"><strong>4. Tomorrow's #1 Priority:</strong> ${esc(daily.priorityTomorrow || '-')}</div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div class="card-title">🔍 Weekly 20-Minute Review</div>
        </div>
        <div style="font-size: 13px; display: flex; flex-direction: column; gap: 10px;">
          <div><strong>What Worked:</strong> ${esc(weekly.worked || '-')}</div>
          <div><strong>Where Time Wasted:</strong> ${esc(weekly.wasted || '-')}</div>
          <div><strong>STOP List:</strong> ${esc(weekly.stop || '-')}</div>
          <div style="color: var(--accent-emerald);"><strong>Next Objective:</strong> ${esc(weekly.nextObjective || '-')}</div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <div class="card-title">📊 Quarterly 1–10 Life Radar Scoreboard</div>
      </div>
      <canvas id="chart-radar" height="160"></canvas>
    </div>
  `;
}

/* 15. SETTINGS VIEW — ACCURATE PRIVACY DISCLOSURE */
function renderSettings(data) {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
  return `
    <div class="card" style="margin-bottom: 24px;">
      <div class="card-header">
        <div class="card-title">🎨 UI Theme & Display Settings</div>
      </div>
      <div style="display: flex; gap: 12px; align-items: center; margin-bottom: 16px; flex-wrap: wrap;">
        <button class="btn btn-secondary" onclick="window.toggleTheme()">
          <span>${currentTheme === 'dark' ? '☀️ Switch to Light Theme' : '🌙 Switch to Dark Theme'}</span>
        </button>
        <span style="font-size: 12px; color: var(--text-secondary);">Font Pairing: <strong>Outfit</strong> (Headings) + <strong>Inter</strong> (Data)</span>
      </div>
    </div>

    <div class="card" style="margin-bottom: 24px;">
      <div class="card-header">
        <div class="card-title">🔒 Local Storage & Privacy Disclosure</div>
      </div>
      <div class="notice-box">
        <strong>LOCAL STORAGE ARCHITECTURE:</strong> All personal, financial, health, and client data is stored locally in your browser's LocalStorage.
        <ul style="font-size: 12px; margin-top: 8px; padding-left: 18px; color: var(--text-secondary); display: flex; flex-direction: column; gap: 4px;">
          <li>Browser LocalStorage is unencrypted by default.</li>
          <li>Anyone with access to the same device or browser profile may potentially access stored data.</li>
          <li>The application operates client-side and currently has no server-side authentication.</li>
          <li>Users must maintain secure JSON backups regularly to protect against browser cache clearing.</li>
        </ul>
      </div>
      <div class="grid-cols-3" style="margin-top: 16px;">
        <button class="btn btn-primary" onclick="window.appState.exportJSON()">📥 Export Backup JSON</button>
        <button class="btn btn-secondary" onclick="document.getElementById('import-file').click()">📤 Restore JSON Backup</button>
        <button class="btn btn-secondary" style="border-color: var(--accent-rose); color: var(--accent-rose);" onclick="window.appState.resetData()">⚠️ Reset Factory Default</button>
      </div>
      <input type="file" id="import-file" style="display: none;" onchange="handleImportFile(event)">
    </div>
  `;
}

window.handleImportFile = function(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(evt) {
    window.appState.importJSON(evt.target.result);
  };
  reader.readAsText(file);
};
