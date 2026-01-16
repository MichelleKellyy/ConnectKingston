# ConnectKingston
Built for King Hacks 2026: An AI-powered matching platform that helps Kingston residents discover meaningful volunteer opportunities tailored to their interests and skills.

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
