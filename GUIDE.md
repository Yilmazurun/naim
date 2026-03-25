# 🎓 NAIM Challenge — Instructor Guide

## For: Dr. Nurettin Şenyer | AIgile Mobile
## Date: March 27, 2026

---

## Context: Why This, Why Now

Three things converged this week:

1. **Karpathy's autoresearch** (50k+ GitHub stars) proved that autonomous iteration loops produce results that beat human-tuned systems. The pattern is 3 primitives: editable asset, scalar metric, time-boxed cycle. This is not ML-specific — Shopify CEO used it to get 53% faster rendering from 93 automated commits.

2. **Google Stitch** got a major redesign (March 19, 2026 — one week ago). It's now an AI-native infinite canvas with voice design, multi-screen generation, and an MCP server that connects to coding tools. Free, browser-based, no install.

3. **Google Antigravity** is a free agent-first IDE that lets AI agents plan, code, test, and verify autonomously. Powered by Gemini 3.1 Pro. Free during preview.

The NAIM Challenge maps autoresearch's iterate-measure-improve loop onto mobile app development using these tools.

---

## How autoresearch Maps to NAIM

| autoresearch | NAIM |
|-------------|------|
| `train.py` (editable code) | Mobile app codebase |
| `program.md` (agent instructions) | MOBILE.md (iteration log) |
| `val_bpb` (scalar metric) | Total weight in kg |
| 5-min training cycle | 15-min iteration cycle |
| AI agent modifies code | Student + AI tools modify app |
| Keep/discard based on metric | Commit if feature works |
| ~12 experiments/hour | ~4 iterations/hour |
| Overnight run = 100 experiments | 2-hour lab = 8 iterations |

The key insight from autoresearch: **the constraint (fixed time, single metric) is what makes it work.** Without the 15-min box and the kg metric, students will waste time on perfection instead of iteration.

---

## Tomorrow's Session Plan (2 hours)

### Setup (15 min)
1. Brief intro: autoresearch pattern (3 min)
2. Show NAIM concept + Cep Herkülü image (2 min)
3. Tool setup check:
   - Everyone opens https://stitch.withgoogle.com (browser, no install)
   - Everyone confirms Antigravity installed OR has backup tool (a0.dev, Claude Code)
4. Fork repo: https://github.com/seyyah/naim
5. Copy `MOBILE.template.md` → `MOBILE.md`

### Phase 1: Design Sprint (30 min)
- **Task:** Design 2-3 screens of a simple app in Stitch
- App type: personal assistant, chat, to-do, notes, weather — student choice
- Use voice or text prompts in Stitch
- Export the design (HTML/CSS or screenshot)
- First MOBILE.md entry: "Iteration 1 — Basic UI design — 5kg"

### Phase 2: Build Sprint (45 min)
- **Task:** Build the app using Antigravity (or backup tool)
- Import Stitch design as context
- Iterate: add one feature per 15-min cycle
- Each feature = new iteration in MOBILE.md
- Each iteration = new commit
- Target: 3 iterations minimum

### Phase 3: Log + Reflect (15 min)
- Complete MOBILE.md reflection section
- Calculate total weight
- Final commit and push

### Wrap-up (15 min)
- Quick show: who lifted the most?
- 2-3 volunteer demos
- Announce awards next week

---

## Practical Concerns

### Antigravity Rate Limits
Credits run out after ~20 min of heavy agent use. Plan B:
- a0.dev component generator (React Native, browser-based)
- Claude Code CLI (if students have API access)
- Cursor (many students already have it)
- Even ChatGPT/Claude web + manual code copying works

**Tell students upfront:** "Your credits will run out. That's part of the challenge. Switch tools. Adapt. A real developer doesn't stop when one tool breaks."

### Stitch Limitations
- Outputs HTML/CSS only (no React Native export yet)
- 350 free generations/month — more than enough for one session
- Designs are starting points, not production code
- MCP integration to Antigravity works but requires stitch-mcp CLI setup (skip for tomorrow — just screenshot/copy)

### Student Skill Variance
- Strong students: push toward Boss Level features (AI integration, server-driven UI)
- Struggling students: focus on Warm-Up + Working Set, celebrate completing 3 iterations
- The weight system naturally differentiates without embarrassing anyone

---

## What NOT to Do

1. **Don't explain every tool in detail.** Give them the links, let them figure it out. That IS the learning.
2. **Don't let them spend 45 min on one feature.** 15-min timer is sacred. Incomplete feature? Log it as "⚠️ Partial" and move on.
3. **Don't grade on app quality alone.** Grade on iteration quality — MOBILE.md is the deliverable.
4. **Don't require a specific tech stack.** If someone wants to use Flutter instead of React Native, fine. The loop is the point.

---

## Grading Rubric (Suggestion)

| Criteria | Weight | Description |
|----------|--------|-------------|
| MOBILE.md completeness | 40% | All iterations logged with prompts, results, reflections |
| Total weight (kg) | 20% | Features actually built and committed |
| Reflection quality | 20% | Honest analysis of AI strengths/weaknesses |
| Commit history | 10% | Clean, incremental commits with NAIM format |
| Creativity | 10% | Original features, clever tool usage |

---

## Stitch → Antigravity Pipeline (For Advanced Students)

For students who want to go deeper with the design-to-code bridge:

```bash
# Install Stitch MCP
npm install -g @_davideast/stitch-mcp

# Setup (one-time)
npx @_davideast/stitch-mcp init

# In Antigravity, add to MCP config:
# {
#   "mcpServers": {
#     "stitch": {
#       "command": "npx",
#       "args": ["@_davideast/stitch-mcp", "proxy"]
#     }
#   }
# }

# Now Antigravity can read Stitch designs directly
```

This creates the "vibe design → vibe code" pipeline:
1. Design in Stitch (natural language)
2. Export DESIGN.md (design system spec)
3. Antigravity reads DESIGN.md as context
4. Code generation matches the design

---

## Connection to AIgile Mobile Course

| NAIM Element | AIgile Mobile Term |
|-------------|-------------------|
| NAIM Challenge | Away Mission (Dış Görev) |
| Each iteration | Field Mission (Saha Görevi) |
| MOBILE.md | Captain's Log (Kaptan Günlüğü) |
| AI tools | Navigation Tools (Navigasyon Araçları) |
| Feature weights | Discoveries (Keşifler) |
| Reflection | Telemetry (Telemetri) |
| Final total | System Check (Sistem Kontrolü) |

---

## Post-Challenge: LinkedIn Captain's Log

After the challenge, the weekly Captain's Log should cover:
- The autoresearch → mobile dev connection
- Stitch + Antigravity as the 2026 toolchain
- Student results (total weights, best features)
- The "constraint enables creativity" lesson

Use the images (Cep Herkülü) for the post visual.

---

## Future NAIM Expansions

- **NAIM v2:** Students fork each other's apps and iterate further (Karpathy's "collaborative autoresearch" vision)
- **NAIM Overnight:** Give students a weekend to run extended iteration sessions
- **NAIM vs NAIM:** Two crews iterate on the same app concept, compare total weights
- **AutoNAIM:** Students build an agent that iterates on their app autonomously (the real autoresearch for mobile)
