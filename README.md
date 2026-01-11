## Repository Structure
```text
volunteer-match-mvp/
├─ README.md
├─ .gitignore
├─ .env.example
│
├─ backend/
│  ├─ requirements.txt
│  ├─ .env.example
│  └─ app/
│     ├─ main.py                        # FastAPI app bootstrap
│     │
│     ├─ core/
│     │  └─ config.py                   # env + settings
│     │
│     ├─ models/                        # (M) Pydantic models (contracts)
│     │  ├─ profile.py
│     │  ├─ opportunity.py
│     │  ├─ match.py
│     │  └─ moderation.py
│     │
│     ├─ repositories/                  # data access layer
│     │  └─ opportunity_repo.py         # loads preseeded opportunities.json
│     │
│     ├─ services/                      # business logic layer
│     │  ├─ scoring_service.py          # rule-based score (non-AI)
│     │  ├─ ai_service.py               # AI explanation + trust flag (or mock)
│     │  └─ match_service.py            # orchestrates repo + scoring + AI
│     │
│     ├─ controllers/                   # (C) routers/endpoints
│     │  ├─ opportunities_controller.py # feed endpoints
│     │  └─ match_controller.py         # match endpoints
│     │
│     ├─ views/                         # (V) response shaping
│     │  └─ presenters.py               # confidence labels, match response DTO
│     │
│     └─ data/
│        └─ opportunities.json          # preloaded opportunity feed
│
└─ frontend/
   ├─ package.json
   ├─ vite.config.ts
   ├─ .env.example
   └─ src/
      ├─ main.tsx
      ├─ App.tsx
      ├─ api.ts                         # fetch wrapper (sends token if needed)
      ├─ firebase.ts                    # Firebase init
      │
      ├─ pages/
      │  ├─ Login.tsx                   # Firebase auth UI
      │  ├─ Profile.tsx                 # profile creation
      │  ├─ Feed.tsx                    # opportunities feed + filters
      │  └─ Matches.tsx                 # match results page (score + AI explain)
      │
      └─ components/
         ├─ OpportunityCard.tsx
         ├─ Filters.tsx
         └─ MatchCard.tsx

```
