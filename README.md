# ConnectKingston | Built for King Hacks 2026
An AI-powered matching platform that helps Kingston residents discover meaningful volunteer opportunities tailored to their interests and skills.

## Repository Structure
```text
backend/
├── app/
│   ├── main.py                     # FastAPI entry
│   │
│   ├── routes/                     # API endpoints
│   │   ├── profile_routes.py       # /profile
│   │   ├── opportunity_routes.py   # /opportunities
│   │   ├── match_routes.py         # /match
│   │   └── post_routes.py          # /post-opportunity
│   │
│   ├── controllers/                # Business logic
│   │   ├── profile_controller.py
│   │   ├── opportunity_controller.py
│   │   ├── match_controller.py     # Calls matcher + AI explanation
│   │   └── post_controller.py      # Calls fraud flag AI
│   │
│   ├── models/                     # Data schemas
│   │   ├── user_model.py           # Volunteer profile
│   │   ├── opportunity_model.py
│   │   └── match_model.py
│   │
│   ├── services/                   # Core logic
│   │   ├── matcher.py              # Rule-based scoring (NO AI)
│   │   ├── ai_client.py            # Pre-trained LLM wrapper
│   │   ├── explanation_service.py  # Match → AI explanation
│   │   └── fraud_service.py        # Posting → AI flag
│   │
│   ├── database/
│   │   ├── mongodb.py              # Mongo connection
│   │   ├── user_repo.py            # User CRUD
│   │   └── opportunity_repo.py     # Opportunity CRUD
│   │
│   └── utils/
│       └── scoring.py              # Skill, interest, location logic
│
├── requirements.txt
└── .env
```
