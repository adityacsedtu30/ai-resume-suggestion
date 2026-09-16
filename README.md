# AI Resume Suggestion

Upload a resume (or type a short self-description) plus a job description, and the
app uses Google Gemini to generate an interview prep report: a match score,
technical + behavioral questions with model answers, skill gaps, and a day-by-day
prep plan. You can also download an AI-tailored resume PDF.

- **Frontend:** React 19 + Vite + React Router + SCSS
- **Backend:** Node + Express 5 + MongoDB (Mongoose)
- **AI:** `@google/genai` (Gemini) for reports, Puppeteer for the resume PDF
- **Auth:** JWT stored in an httpOnly cookie, with a logout token blacklist

---

## How a request flows

```
Browser (React page)
  → src/api/*.api.js         one function per endpoint (axios)
  → Express route            src/routes/*.routes.js
  → auth middleware          checks the JWT cookie, sets req.user
  → controller               src/controllers/*.controller.js  (validates input, sends response)
  → service / model          src/services/ai.service.js  •  Mongoose models
```

Errors thrown anywhere in a controller are caught by `asyncHandler` and formatted
by one `error.middleware.js` — controllers don't need their own try/catch.

---

## Frontend structure (`Frontend/src`)

| Folder / file        | What lives here |
|----------------------|-----------------|
| `main.jsx`           | React entry point, imports global styles |
| `App.jsx`            | Wraps the router in `<AuthProvider>` |
| `routes.jsx`         | All routes in one place; protected ones are wrapped in `<ProtectedRoute>` |
| `context/AuthContext.jsx` | Holds the logged-in `user`. Calls `getMe()` **once** on app start. Exposes `login` / `register` / `logout` and the `useAuth()` helper |
| `components/ProtectedRoute.jsx` | Shows a "checking session" message, then renders the page or redirects to `/login` |
| `api/client.js`      | The single configured axios instance (base URL + send cookies) |
| `api/auth.api.js`    | `register`, `login`, `logout`, `getMe` |
| `api/interview.api.js` | `createReport`, `getReports`, `getReportById`, `downloadResumePdf` |
| `api/cache.js`       | Tiny in-memory cache so navigating back to a page doesn't refetch |
| `pages/`             | `Login`, `Register`, `Home`, `Interview` — each page fetches its own data with `useState` + `useEffect` |
| `styles/`            | `global`, `button`, `auth`, `home`, `interview` SCSS |

**Key idea:** only the *user* is global state. Interview reports are page-local —
`Home` loads the list, `Interview` loads one report by the id in the URL. No
shared interview context, no hook that secretly refetches on every mount.

---

## Backend structure (`Backend/src`)

| Folder / file            | What lives here |
|--------------------------|-----------------|
| `server.js` (root)       | Load env → connect DB → start listening |
| `app.js`                 | Express app: middleware, mount routes, error handler |
| `config/db.js`           | Mongoose connection (exits the process if it fails) |
| `routes/`                | URL → controller mapping, one file per feature |
| `controllers/`           | Read the request, validate, call a service/model, send JSON |
| `services/ai.service.js` | All Gemini + Puppeteer logic |
| `models/`                | `user`, `interviewReport`, `blacklistToken` schemas |
| `middlewares/`           | `auth` (JWT cookie), `upload` (multer, resume in memory), `error` (central handler) |
| `utils/asyncHandler.js`  | Wraps async controllers so errors reach the error middleware |

### API endpoints

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| POST | `/api/auth/register` | – | Create account, set cookie |
| POST | `/api/auth/login` | – | Log in, set cookie |
| GET  | `/api/auth/logout` | – | Blacklist token, clear cookie |
| GET  | `/api/auth/get-me` | ✓ | Current user |
| POST | `/api/interview/` | ✓ | Generate a report (multipart: `resume` file + fields) |
| GET  | `/api/interview/` | ✓ | List my reports (summary fields only) |
| GET  | `/api/interview/report/:interviewId` | ✓ | One full report |
| POST | `/api/interview/resume/pdf/:interviewReportId` | ✓ | Download tailored resume PDF |

---

## Running locally

**Backend** — create `Backend/.env`:

```
PORT=3000
MONGO_URI=mongodb://localhost:27017/ai-resume
JWT_SECRET=some-long-random-string
GOOGLE_GENAI_API_KEY=your-gemini-key
FRONTEND_URL=http://localhost:5173
```

```bash
cd Backend && npm install && npm run dev
```

**Frontend** — optionally create `Frontend/.env` with
`VITE_API_URL=http://localhost:3000` (defaults to the deployed backend otherwise):

```bash
cd Frontend && npm install && npm run dev
```
