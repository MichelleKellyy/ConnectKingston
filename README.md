# ConnectKingston
Built for King Hacks 2026 | a platform that helps Kingston residents discover and match with local volunteer opportunities.

## Problem, Solution, and Intended Impact
**Problem:** Volunteer opportunities in Kingston are scattered across many different websites and social channels, making them hard to find and overwhelming to navigate for those wanting to get involved. Existing centralized platforms are limited, meaning residents often miss opportunities that match their interests, availability, and skills.

**Solution:** ConnectKingston is an AI-powered matching platform that brings Kingston volunteer opportunities into one place. Users create a quick profile and are instantly recommended the most relevant opportunities based on their interests, skills and availability.

**Intended Impact:** By reducing the friction of searching, ConnectKingston makes volunteering more accessible and personalized. This will increase participation, strengthen community connections, and help local organizations reach the right volunteers faster. ConnectKingston helps residents get involved and contribute meaningfully where they’re needed most.

## Repository Structure
```text
CONNECTKINGSTON/                          # repo root
├── backend/
│   ├── main.py                           # FastAPI app entry + CORS + startup indexes
│   │
│   ├── controller/                       # API business logic
│   │   ├── favourites_controller.py      # favorites CRUD/helpers
│   │   ├── opportunity_controller.py     # ingest_source(), ingest_all()
│   │   └── user_controller.py            # create/update/delete/get + normalize_user(), default_msg()
│   │
│   ├── routes/
│   │   └── routes.py                     # APIRouter: users, ingest, feed, match (LLM), favorites
│   │
│   ├── model/
│   │   └── model.py                      # Pydantic models: User, Favorite
│   │
│   ├── database/
│   │   ├── mongo.py                      # Mongo connection + collections
│   │   └── opportunity.py                # list_opportunities(), ensure_opportunity_indexes()
│   │
│   ├── utils/
│   │   └── llm.py                        # match_with_llm_ids(profile, opportunities)
│   │
│   ├── scrapers/                         # scraping + ingestion sources
│   │   ├── __init__.py
│   │   ├── http.py                       # HTTP fetching helpers
│   │   ├── registry.py                   # list_sources() + source registry
│   │   ├── utils.py                      # scraper utilities
│   │   └── sources/                      # individual scraper implementations
│   │       ├── __init__.py
│   │       ├── cityofkingston.py
│   │       ├── providencecare.py
│   │       └── youthdiversion.py
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/
│       │   ├── Footer.jsx
│       │   ├── GuestRoute.jsx
│       │   ├── Nav.jsx
│       │   ├── ProfileEditor.jsx
│       │   └── ProtectedRoute.jsx
│       ├── context/
│       │   └── AuthContext.jsx
│       ├── firebase/
│       │   └── firebase.jsx
│       ├── pages/
│       │   ├── Dashboard.jsx
│       │   ├── Favourites.jsx
│       │   ├── Feed.jsx
│       │   ├── Home.jsx
│       │   ├── SignIn.jsx
│       │   └── SignUp.jsx
│       ├── App.jsx
│       ├── index.css
│       └── main.jsx
│
├── .gitignore
├── LICENSE
├── README.md
└── requirements.txt
```
