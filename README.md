# Vision AI — Agentic Decision Intelligence

Vision AI is an operations workspace for Rehrig Pacific fleet and service-provider work. It answers natural-language questions in chat, then opens the evidence — tables, charts, analysis, and recommendations — in the dashboard beside it.

The product tagline in the UI is **Summary in chat · Detail in dashboard**.

This document explains what the site is, how the screens fit together, and how a typical session works.

---

## What the site is for

Operators and leaders currently juggle two operational problems:

1. **RFID visibility** — which trucks across the provider network still lack readers
2. **Aging work orders** — missing WOs in Edmonton AB that have sat open for hundreds of days

Vision AI puts those two datasets on one screen: a chat assistant that can be asked in plain language, a live operations dashboard, a provider directory scored by risk, and a reports library built from pinned analysis.

It is a front-end prototype. Answers are grounded in the loaded Excel extracts, not a live LLM. The agent workflow, citations, and delays are simulated so the product experience can be demonstrated end to end.

### Snapshot of the loaded data (as of 2026-08-03)

| Dataset | Source report | What it contains |
| --- | --- | --- |
| Fleet | *Customers with Truck and/or Cameras* | 74 service providers, 1,072 trucks, 83.9% RFID coverage, 173 unequipped |
| Work orders | *Missing Work Orders — Edmonton AB* | 16 open missing WOs, average age 741 days, 5 overdue (>700 days) |

Largest RFID gap by unequipped count: **Lakeland**. Largest fleet: **Edmonton AB** (271 trucks). Oldest open WO exceeds 1,200 days.

---

## How the screen is laid out

The app is a three-part shell. Chat never leaves the left side. The center pane is the only area that changes as you navigate.

```
┌────────┬──────────────────┬──────────────────────────────┐
│  RP    │  Vision AI chat  │  Home / Data / Reports       │
│  Home  │  Personas        │                              │
│  Data  │  History         │  Command Center              │
│  Reports│  Summary        │  or Evidence & detail        │
│        │  Suggested       │  or Intelligence Directory   │
│        │  Ask…            │  or Pinned reports           │
└────────┴──────────────────┴──────────────────────────────┘
                         Inspector overlay (when opened)
```

| Region | What it is |
| --- | --- |
| **Left rail (RP)** | Primary navigation: Home, Data, Reports |
| **Left pane** | Vision AI assistant — always visible |
| **Center pane** | The working surface. Home shows Command Center until a question is asked; then it becomes Evidence & detail. Data and Reports replace it entirely. |
| **Inspector** | A slide-over for a single provider or work-order node. Opened from Investigate / Inspect. |

Asking a question does not open a new page. The chat stays put; Command Center is **replaced** by the analysis stack. Closing analysis, or pinning a widget to the dashboard, returns you to Home.

---

## Navigation

The rail uses three views:

| Nav label | View | Center pane |
| --- | --- | --- |
| **Home** | Command Center | Network operations dashboard. After a question, this becomes **Evidence & detail**. |
| **Data** | Intelligence Directory | All 75 decision nodes, grouped Critical / At risk / On track |
| **Reports** | Reports | Tables and charts pinned from analysis. A badge shows how many are saved. |

The brand mark **RP** is Rehrig Pacific.

---

## Personas

The chat header has three lenses. The default is **Service Provider**.

| Persona | Role | What it emphasizes |
| --- | --- | --- |
| **Leadership** | Strategic | Network KPIs, executive summaries, coverage trends |
| **Service Provider** | Operational | SLA risk, dispatch load, RFID gaps, WO backlog |
| **Segments** | Analytical | Provider comparisons, cohorts, geographic clustering |

Switching persona changes:

- Suggested questions at the bottom of chat
- The input placeholder (`Ask as Leadership…`, etc.)
- Command Center framing (header KPI and default filters)
- The workflow-trace subtitle once an answer is complete

It does **not** currently change the mock answer text. Routing is by keywords in the question, not by which persona is selected.

---

## Vision AI chat (left pane)

This is the ops desk. Empty state copy:

> Ask a question for a short summary. Detail replaces Command Center. Use history to jump back; pin insights to dashboard or reports.

### Asking a question

You can type in the input, or click a **Suggested** pill. Service Provider suggestions include Edmonton RFID Gaps, WO by Request Type, and Bulk Pickup Backlog. Leadership and Segments have their own pools (fleet coverage, SLA risk, Edmonton deep dive, case-age distribution, and so on). Used questions rotate out so the same three do not sit there forever.

When a question is sent:

1. A user bubble appears in chat.
2. The center pane switches to **Evidence & detail** and a four-step workflow starts (intent → retrieval → aggregation → drafting).
3. Chat shows a short grounded summary with clickable **bold metrics**.
4. Suggested follow-ups appear under the answer.

Chat stays compact on purpose. Tables, charts, analysis, and recommendations live in the center pane.

### History and Clear

Once there is a conversation, a **History** bar appears under the persona tabs. Prior questions show as chips. Click a chip (or a user bubble) to jump back to that analysis in the detail pane.

**Clear** sits on the History row. The first click asks for confirmation; the second wipes chat, analysis history, and the detail pane.

### Info

The **Info** control in the header opens a live snapshot from the loaded reports: trucks, providers, open WOs, RFID %, unequipped trucks, and overdue WOs. In the split layout it also explains the current center view.

---

## Command Center (Home)

Title: **Network operations**, with a chip for the active persona (for example *Service Provider view*).

This is the default landing surface. It is a one-fold operations board:

| Card | What you see |
| --- | --- |
| **Regional Alerts** | Highest-priority triage rows — RFID gaps, overloaded dispatch, oldest WOs. **Investigate** opens the Inspector. |
| **Ops Health** | Work-order age histogram and overdue / RFID chips |
| **Live Dispatches** | Dispatch load bars and top dispatch / request-type KPIs |
| **Fleet Summary** | Truck and provider counts, unequipped total, coverage meter, largest gaps |

Filters (region, fleet focus, time window) apply client-side to the fleet data. Changing persona can reset those filters so the board matches the lens.

When you pin a KPI or chart from analysis, a **Pinned to dashboard** strip appears at the top of this board. Pinning also closes the analysis pane so you land back on Home with the widget visible.

---

## Evidence & detail (after a question)

The analysis pane stacks every question in the session, newest last. Each block includes:

1. **How I read your question** — the parsed intent (scope, metric, window, grain)
2. **Workflow trace** — a collapsible “behind the scenes” rail with thoughts and tool calls (`rag.search`, `calc.coverage`, `compose.reply`, …)
3. **Structured answer**, always in this order: **Summary → Table → Chart → Analysis → Recommendation**
4. **Export response** — downloads a standalone HTML file of that answer, including sources

From table and chart sections you can:

- **+ Add to dashboard** — pins a KPI tile or bar chart onto Command Center
- **+ Add to reports** — saves a tabular snapshot to the Reports view

Bold numbers in the chat summary are cites. Clicking one jumps to the matching claim in this pane. Muted traverse links open the full detail if you are still looking at chat only.

---

## Intelligence Directory (Data)

Eyebrow: *Providers & work orders*.

> Prioritized by RFID gaps and missing-WO risk. Click a cite in Vision AI to jump here.

Every service provider plus the Edmonton missing-WO backlog is scored into a RAG row:

| Group | Meaning |
| --- | --- |
| **Critical** | Highest exposure — large RFID gaps or severe WO aging |
| **At risk** | Elevated but not top-tier |
| **On track** | Coverage and backlog within acceptable range |

Columns: provider / initiative, status trend, exposure, AI confidence, **Inspect**.

Inspect opens the same Inspector used from Command Center triage.

---

## Inspector

A 680px overlay for one decision node (`SP-{Provider}` or `WO-Edmonton-Missing`). It shows:

- **Intelligence summary** — verdict, confidence, value at risk, what changed
- **Reality check** — predicted vs actual bars and a sparkline
- **Operational drivers** — live signals with source and freshness

**Mark resolved** closes the inspector, toasts confirmation, and strikes the matching triage row on Command Center. Resolve state lives in the current session only.

---

## Reports

Empty until you pin something from analysis:

> Pinned analysis tables

Each card stores the title, type, originating question, and timestamp, then a table of service provider, value, confidence, source, and note. Reports can be removed individually. The sidebar badge tracks the count.

---

## How an answer is produced

There is no backend API. The mock agent:

1. Waits through four workflow steps (~4.3 seconds total) so the trace feels live
2. Routes the question by keywords (`rfid`, `sla`, `edmonton`, `dispatch`, `bulk`, `cart`, `oldest`, `executive`, …)
3. Reads the in-memory Excel-derived tables
4. Shapes a structured response: summary markdown, table, chart, analysis bullets, recommendations, follow-up questions, and source catalog

Citations are tagged high / provisional and hover to a source receipt (Fleet Excel, Missing WO Excel, or a derived model).

If a question does not match a specialized route, the agent still returns a grounded network overview from the same reports.

---

## Typical journeys

### Ops triage without chat

Land on Home → read Regional Alerts (for example Lakeland’s RFID gap) → **Investigate** → review Reality Check and drivers → **Mark resolved**.

### Ask, inspect evidence, pin

Pick **Edmonton RFID Gaps** (or type a question) → watch the workflow → read the chat summary → use the center table/chart → **Add to dashboard** → return to Home with the pin visible. Use **History** to reopen the question later.

### Leadership briefing

Switch to **Leadership** → ask for an executive summary of fleet coverage and open WOs → review Evidence & detail → **Export response** as HTML to share.

### Directory browse

Open **Data** → scan Critical providers → **Inspect** Edmonton AB or any row → compare coverage, open WOs, and drivers.

### Build a reports pack

Ask a Segments question (case age, geographic clusters, RFID map) → **Add to reports** on the table or chart → open **Reports** to review the saved pack.

---

## Data and how it is refreshed

Two generated files sit under `src/`:

| File | Role |
| --- | --- |
| `excelData.js` | Parsed fleet and work-order rows plus rollup summaries |
| `store.js` | 75 scored decision nodes for the Directory and Inspector |

They are produced from the source workbooks:

```bash
npm run generate:data
```

That runs `scripts/generateExcelData.mjs` then `scripts/generateStore.mjs`. Chat session state (messages, analysis history, dashboard pins, reports) is in-memory React context and resets on refresh.

---

## Running the site

```bash
npm install
npm run dev
```

Opens Vite at [http://localhost:5173/](http://localhost:5173/).

```bash
npm run build
npm run preview
```

builds and serves the production bundle.

Stack: React 19, Vite 8, Recharts (pinned dashboard widgets), a single `src/style.css` design system (Inter + JetBrains Mono).

---

## What is simulated vs real

| Real | Simulated |
| --- | --- |
| Fleet and WO numbers from the Excel extracts | LLM reasoning, RAG search, and tool calls |
| Layout, personas, pinning, export, inspector | Answer *choice* (keyword router, not a model) |
| Decision-node scores generated from that data | Persona-specific wording of the same answer |

Treat Vision AI as a decision-intelligence **prototype** on real operational extracts: the screens, flows, and numbers are the product; the “agent” is a faithful mock of how a grounded assistant would behave on this corpus.
