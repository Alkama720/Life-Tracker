# Personal Life Operating System (Life OS) — User Guide & Architecture Manual

## 1. Overview & Core Operating Philosophy

The **Life Operating System (Life OS)** is a behavioral-systems framework engineered specifically for a 21-year-old B2B Sales Professional at Starz AI in Mumbai (Base Salary ₹20,000/mo, 6-day workweek, 9:30 AM–8:00 PM commute/work window).

Unlike conventional motivational journals, this system operates as a personal command center that enforces **priority hierarchy**, replaces self-deception with **numeric behavior tracking**, and aligns daily action with financial independence and physical health stability.

### The 10 Core Operating Rules:
1. **Consistency over intensity:** Small daily 1% compounding beats short bursts of extreme effort.
2. **Progress over perfection:** Flawless execution is an illusion. Record actual numbers without shame.
3. **Systems over motivation:** Motivation is unreliable; evening rotational focus routines enforce execution.
4. **Track reality, not intentions:** Measure exact cigarette counts, screen time minutes, and sales calls.
5. **Protect health & sleep:** Non-negotiable foundation for sales performance and cognitive longevity.
6. **Single-habit focus:** Never attempt to alter 10 habits simultaneously.
7. **Strict Priority Hierarchy:** When goals conflict, higher priority always wins (Health → Money → Sales Mastery → Discipline → Peace → AI Skills → Faceless YT → Content → College).
8. **No Python:** AI learning strictly targets practical prompt engineering, sales workflows, and automations.
9. **Non-Medical Observation:** Hair/scalp tracking strictly logs observations and clinician preparation queries; diagnostic decisions remain exclusively with medical professionals.
10. **Every Metric Is An Action Signal:** Dashboards must answer: *"What decision should I make because of this?"*

---

## 2. Review Cadence Manual

| Cadence | Duration | Scheduled Time | Core Objective | Key Deliverables & Actions |
|---|---|---|---|---|
| **Daily Review** | 3–5 Mins | 10:30 – 10:45 PM | Log daily metrics & identify tomorrow's #1 leverage action | Log cig count, screen time, sales calls, water, answer 4 reflection prompts |
| **Weekly Review** | 20–30 Mins | Sunday 07:00 – 07:30 PM | Analyze trend lines, adjust rotational evening focus, audit sales funnel | Complete 7-question weekly review, calculate conversion rates, plan YT batching |
| **Monthly Review** | 45–60 Mins | Last Sunday of Month | Evaluate revenue, budget adjustments, health progress, bottleneck audit | Update dynamic savings target, calculate net worth, adjust lead/lag targets |
| **Quarterly Review** | 60–90 Mins | End of Q1, Q2, Q3, Q4 | Life Radar Scoreboard audit (1–10 scale) & strategic realignment | Complete 9-area radar scoreboard, identify top needle-movers vs stallers |
| **Annual Reset** | 2 Hours | End of Year | 12-Month identity reset & complete system overhaul | Review 12-month vision, update priority matrix, generate new yearly PDF templates |

---

## 3. Database Schema & Data Models

The Life OS uses a structured, local-first JSON data model persisted in browser `LocalStorage` under the key `LIFE_OS_DATA_V1`.

```json
{
  "profile": {
    "age": 21,
    "location": "Mumbai, India",
    "company": "Starz AI",
    "role": "Business Development / B2B Sales",
    "baseSalary": 20000,
    "workHours": "Mon-Sat (10:30 AM - 7:00 PM)",
    "commuteHours": "09:30 AM Depart | 20:00 PM Arrival",
    "sleepTarget": "12:00 AM Sleep - 08:00 AM Wake"
  },
  "priorities": [
    {
      "rank": 1,
      "area": "Health",
      "why": "Foundation for energy, focus & longevity",
      "outcome": "Consistent exercise, reduced smoking, scalp care",
      "bottleneck": "No gym, smoking 6+/day, high screen time",
      "action": "30-min daily morning movement",
      "status": "ACTIVE"
    }
  ],
  "dailyEntries": [
    {
      "date": "YYYY-MM-DD",
      "wakeTime": "08:00",
      "sleepTime": "00:00",
      "waterLiters": 3.0,
      "exerciseMins": 30,
      "cigarettes": 4,
      "screenTimeHrs": 2.0,
      "instagramMins": 45,
      "youtubeMins": 45,
      "gamingMins": 0,
      "salesCalls": 30,
      "salesMeets": 2,
      "revenue": 0,
      "reclaimedAllocation": ["Exercise", "Sales Calls"]
    }
  ],
  "salesLogs": [
    {
      "date": "YYYY-MM-DD",
      "calls": 30,
      "convs": 15,
      "leads": 5,
      "meets": 2,
      "demos": 2,
      "closes": 1,
      "revenue": 10000,
      "objection": "Budget constraints",
      "lesson": "Frame ROI before discussing price"
    }
  ],
  "finance": {
    "salary": 20000,
    "commissions": 30000,
    "sideIncome": 0,
    "expenses": {
      "travel": 3500,
      "food": 4500,
      "bills": 3000,
      "family": 3000,
      "subscriptions": 500,
      "health": 1500,
      "misc": 1000
    },
    "emergencyFund": 15000,
    "netWorth": 45000
  },
  "hairLogs": [
    {
      "date": "YYYY-MM-DD",
      "observation": "Scalp sensation normal",
      "visibleChanges": "Fine vellus hair growth",
      "treatment": "Hygiene & gentle massage",
      "adherence": "100%",
      "clinicianQuestions": "What specific blood panels are recommended?"
    }
  ],
  "youtubePipeline": [
    {
      "id": 1,
      "title": "5 AI Sales Automations That Close Deals",
      "hook": "How I book 10+ meetings/week without calling twice",
      "stage": "SCRIPT",
      "views": 0,
      "ctr": 0,
      "avgDur": "0m",
      "subs": 0
    }
  ],
  "aiLogs": [
    {
      "date": "YYYY-MM-DD",
      "topic": "B2B Objection Handling Prompts",
      "category": "Sales AI",
      "resource": "ChatGPT Custom Prompting",
      "takeaway": "3-step prompt framework",
      "built": "10 sales prompt templates",
      "applied": "Live call follow-ups"
    }
  ],
  "reflections": {
    "daily": {
      "accomplishments": "Logged 30 calls",
      "avoided": "Morning pushups",
      "why": "Late sleep",
      "priorityTomorrow": "Sleep by 12:00 AM"
    },
    "weekly": {
      "worked": "Call volume consistency",
      "wasted": "Instagram scrolling",
      "stop": "No phone scrolling after 8pm",
      "continue": "Night walk routine",
      "nextObjective": "Close 2 Starz AI deals"
    },
    "quarterlyScoreboard": {
      "Health": 6, "Money": 7, "Career": 8, "Sales": 8, "Discipline": 6,
      "Peace": 7, "Learning": 8, "Content": 4, "Relationships": 7
    }
  }
}
```

---

## 4. Privacy & Backup/Restore Instructions

### 100% Offline Data Sovereignty:
- All data entered into the Life OS Web App remains stored inside your browser's private `LocalStorage`.
- No login required. No third-party servers. No telemetry or tracking scripts.

### Backup Procedure:
1. Open the Web App and navigate to **Settings & Privacy** (`data-view="settings"`).
2. Click **📥 Export Backup JSON**.
3. Save the timestamped `.json` file to a secure local folder or encrypted flash drive.

### Restore Procedure:
1. On a new device or fresh browser, navigate to **Settings & Privacy**.
2. Click **📤 Restore JSON Backup** and select your saved `.json` file.
3. The system will validate the schema and automatically restore your complete historical database.

---

## 5. Version 2 Roadmap & Enhancements

1. **Native PWA (Progressive Web App) Offline Installation**:
   - Add service workers and web manifest so the web app can be installed natively on iOS/Android home screens without an app store.
2. **Automated Printable PDF Exporter**:
   - Integrated headless browser rendering to auto-generate weekly PDF summaries directly from logged Web App metrics.
3. **Custom Goal Progression Milestones**:
   - Automated achievement badges triggered when cigarette counts drop below 3/day or monthly sales commissions exceed ₹30,000.
