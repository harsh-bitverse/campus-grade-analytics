# Campus Grade Analytics

Campus Grade Analytics is a full stack web application where college students can anonymously submit course marks and grades. The platform then uses a Python cleaning engine plus PostgreSQL-backed analytics to estimate relative grading cutoffs with confidence scores.

This project is intentionally written for a beginner or intermediate developer who wants clean structure, readable code, and room to scale later.

## 1. Simple idea first

Think of the project in four layers:

1. The **frontend** lets students and admins interact with the system.
2. The **backend API** validates requests, protects routes, and stores data.
3. The **database** keeps raw submissions, cleaned results, cutoff estimates, and flagged rows.
4. The **Python engine** studies the submissions and estimates likely grade boundaries.

## 2. Complete folder structure

```text
Campus Grade Analytics/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.js
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── validators/
│   ├── .env.example
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── pages/
│   │   ├── services/
│   │   └── styles/
│   ├── .env.example
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
├── python/
│   ├── grade_cleaner/
│   │   └── main.py
│   └── requirements.txt
├── docs/
│   ├── FOLDER_GUIDE.md
│   └── REQUEST_FLOW.md
├── .gitignore
├── docker-compose.yml
└── README.md
```

## 3. Backend first

### Beginner explanation

The backend is the brain of the app. It receives requests from the frontend, checks whether the data is valid, makes sure users are allowed to do what they are asking, and then stores or reads data from PostgreSQL.

### Why the backend is split into folders

- `routes/` decides which URL goes where
- `controllers/` handles HTTP request and response objects
- `services/` contains actual business logic
- `middleware/` runs shared logic like auth and validation
- `validators/` keeps request schemas separate from business code
- `utils/` stores small reusable helpers

### Example flow: login

`POST /api/auth/login` -> route -> controller -> service -> Prisma -> JWT response

This structure is scalable because each file has one clear job.

## 4. Frontend second

### Beginner explanation

The frontend is the visual side of the project. It uses React Router for page navigation, Axios for API calls, Tailwind CSS for styling, and Recharts for data visualizations.

### Main pages

- `Home`
- `Courses`
- `Submit Marks`
- `Login`
- `Signup`
- `Analytics`
- `Admin`

### Why the frontend is split this way

- `pages/` holds full screens
- `components/` holds reusable UI pieces
- `services/` wraps API calls
- `context/` holds shared auth state
- `hooks/` extracts repeatable React logic

## 5. Database setup third

### Beginner explanation

PostgreSQL stores permanent data. Prisma is the ORM that lets JavaScript code talk to the database in a safer, cleaner way.

### Main tables

#### `User`

- stores email, hashed password, and role

#### `Course`

- stores course code, course name, semester, professor, and archive state

#### `Submission`

- stores raw student submissions
- keeps the original grade and normalized numeric grade

#### `CleanedSubmission`

- stores the cleaned result after the Python engine runs

#### `EstimatedCutoff`

- stores estimated grade boundaries and confidence scores

#### `FlaggedEntry`

- stores suspicious rows for admin review

### Relationship summary

- One `User` can create many `Submission` rows
- One `Course` can have many `Submission` rows
- One `Submission` can have one cleaned record
- One `Course` can have many estimated cutoffs
- One `Submission` can create many flag entries over time if your system grows later

## 6. Python cleaning module fourth

### Beginner explanation

The Python module exists because pandas and numpy make data cleaning and statistical analysis easier than writing everything manually in JavaScript.

### What the script currently does

1. Removes blank rows
2. Removes impossible marks
3. Removes invalid grades
4. Removes duplicates
5. Detects same-mark grade conflicts
6. Looks at neighboring submissions to estimate likely local grade behavior
7. Flags suspicious rows
8. Estimates grade cutoffs using accepted rows only
9. Produces a confidence score

### Why these statistical methods are used

- **Mode of neighboring grades** gives a simple local expectation around a mark range
- **15th percentile** is more stable than the minimum because one unusually low row should not define a cutoff
- **Sample size factor** helps confidence rise when there are more rows
- **Boundary separation factor** helps confidence rise when grade groups are clearly separated

## 7. Deployment instructions fifth

### Local setup

#### Backend

```bash
cd backend
cp .env.example .env
npm install
npx prisma generate
npx prisma migrate dev --name init
node prisma/seed.js
npm run dev
```

#### Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

#### Python

```bash
cd python
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

#### PostgreSQL with Docker

```bash
docker compose up -d
```

### Production-friendly ideas already included

- separate frontend and backend folders
- environment variables
- Dockerfiles for both apps
- `docker-compose.yml` for PostgreSQL
- REST API structure
- route protection for admins
- validation and rate limiting

## 8. Security notes

- Passwords are hashed using `bcryptjs`
- JWT protects logged-in routes
- Admin routes require both authentication and admin role
- Request bodies are validated with Zod
- Rate limiting protects auth routes
- Prisma prevents raw string-based SQL from being the normal path

## 9. Future scalability

The current structure supports future upgrades such as:

- multi-college support
- historical semester comparisons
- professor analytics
- ML-based cutoff prediction
- grade prediction for current students
- more advanced anomaly detection

## 10. Important learning files

Read these in order:

1. `docs/FOLDER_GUIDE.md`
2. `docs/REQUEST_FLOW.md`
3. `backend/src/app.js`
4. `backend/src/routes/`
5. `backend/src/services/`
6. `frontend/src/App.jsx`
7. `frontend/src/pages/`
8. `python/grade_cleaner/main.py`

## 11. One rebuild tip

If you want to rebuild this yourself, start with just:

1. one React page
2. one Express server
3. one Prisma model
4. one submission form
5. one analytics endpoint

Then grow one layer at a time.
