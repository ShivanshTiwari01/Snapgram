# Snapgram

> A full-stack **TypeScript** social media platform — React 19 frontend, NestJS backend, PostgreSQL with Prisma. Create posts, explore content, discover creators, and interact with a community in a sleek dark-themed UI.

---

## Tech Stack

### Frontend

- **React 19** — UI library with latest concurrent features
- **TypeScript** — End-to-end type safety
- **Vite** — Lightning-fast dev server and bundler
- **TanStack Query (React Query)** — Server state management, caching, and infinite scroll
- **shadcn/ui** — Accessible, composable component primitives
- **Tailwind CSS v4** — Utility-first styling
- **React Hook Form + Zod** — Form handling and schema validation
- **React Router v7** — Client-side routing

### Backend

- **NestJS** — Modular, scalable Node.js framework
- **PostgreSQL** — Relational database
- **Prisma ORM** — Type-safe database access and migrations
- **JWT** — Stateless authentication with token blacklisting on sign-out
- **Multer** — Local disk file uploads for post images and avatars

---

## Features

- **Authentication** — Secure sign up, sign in, and sign out with JWT sessions
- **Post Management** — Create, edit, delete posts with image uploads, captions, tags, and location
- **Photo Uploads** — Multer-based image uploads served as static files from `uploads/`
- **Feed** — Paginated infinite-scroll home feed ordered by recency
- **Explore** — Search posts by caption with real-time debounced results
- **Likes & Saves** — Like and bookmark posts; view saved posts in a dedicated page
- **User Profiles** — View any user's profile, their posts, and liked content
- **People Discovery** — Browse and discover all users on the platform; Top Creators on home feed
- **Responsive UI** — Optimized for mobile (bottom nav), tablet, and desktop (left sidebar + creator panel)

---

## Project Structure

```
├── frontend/                   # React + Vite application
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── forms/
│   │   │   ├── shared/
│   │   │   └── ui/             # shadcn/ui primitives
│   │   ├── context/            # Auth context / global state
│   │   ├── hooks/              # Custom React hooks
│   │   ├── lib/
│   │   │   ├── api.ts          # Axios API client
│   │   │   ├── queries.ts      # TanStack Query hooks
│   │   │   ├── utils.ts        # Utility functions
│   │   │   └── validation.ts   # Zod schemas
│   │   ├── _root/pages/        # Route-level page components
│   │   └── types/              # Shared TypeScript types
│   ├── nginx.conf              # Nginx config for Docker (SPA routing)
│   ├── Dockerfile
│   └── index.html
│
└── backend/                    # NestJS application
    ├── src/
    │   ├── auth/               # JWT auth, guards, sign up/in/out
    │   ├── users/              # User CRUD, profile, avatar upload
    │   ├── posts/              # Post CRUD, feed, search, file upload
    │   ├── saves/              # Save / unsave post
    │   ├── common/             # Guards, decorators, middleware
    │   └── prisma/             # Prisma service
    ├── prisma/
    │   └── schema.prisma
    ├── uploads/                # Uploaded images (gitignored; mounted as Docker volume)
    └── Dockerfile
```

---

## Getting Started (Local Development)

### Prerequisites

- Node.js 20+
- PostgreSQL 14+
- pnpm (`npm install -g pnpm`)

### 1. Clone the repository

```bash
git clone https://github.com/ShivanshTiwari01/snapgram.git
cd snapgram
```

### 2. Backend setup

```bash
cd backend
pnpm install
```

Create a `.env` file in `/backend`:

```env
PORT=3001
DATABASE_URL="postgresql://user:password@localhost:5432/snapgram"
JWT_SECRET=your_jwt_secret_here
APP_URL=http://localhost:3001
CORS_ORIGIN=http://localhost:5173
```

Run database migrations and start the server:

```bash
npx prisma migrate dev --name init
npx prisma generate
pnpm run dev
```

### 3. Frontend setup

```bash
cd frontend
pnpm install
```

Create a `.env` file in `/frontend`:

```env
VITE_API_URL=http://localhost:3001/api/v1
```

Start the development server:

```bash
pnpm run dev
```

The app will be available at `http://localhost:5173`.

---

## Docker / Containerisation

The project ships with Docker support for both services and a single `docker compose` command to run everything.

### Quick Start

```bash
# 1. Copy and configure environment
cp .env.example .env
# Edit .env and set a strong JWT_SECRET

# 2. Build and start all services
docker compose up --build

# 3. Run database migrations (first time only)
docker compose exec backend npx prisma migrate deploy
```

Services will be available at:
- **Frontend** — http://localhost:80
- **Backend API** — http://localhost:3001/api/v1
- **PostgreSQL** — localhost:5432

### Environment Variables (Docker)

Copy `.env.example` to `.env` in the project root and configure:

| Variable | Description | Default |
|---|---|---|
| `POSTGRES_USER` | PostgreSQL username | `snapgram` |
| `POSTGRES_PASSWORD` | PostgreSQL password | `snapgram_secret` |
| `POSTGRES_DB` | Database name | `snapgram` |
| `JWT_SECRET` | Secret for signing JWT tokens | `change_me_in_production` |
| `APP_URL` | Backend public URL (used to build image URLs) | `http://localhost:3001` |
| `CORS_ORIGIN` | Allowed frontend origin for CORS | `http://localhost:80` |
| `VITE_API_URL` | API URL baked into the frontend build | `http://localhost:3001/api/v1` |

### Volumes

| Volume | Purpose |
|---|---|
| `postgres_data` | PostgreSQL data persistence |
| `uploads_data` | Uploaded images persistence (mounted at `/app/uploads`) |

### Useful Docker Commands

```bash
# Stop all services
docker compose down

# Stop and remove volumes (wipes data)
docker compose down -v

# View logs
docker compose logs -f backend
docker compose logs -f frontend

# Open a shell in the backend container
docker compose exec backend sh

# Run Prisma Studio
docker compose exec backend npx prisma studio
```

---

## API Overview

All endpoints are prefixed with `/api/v1`.

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/signup` | Public | Register a new user |
| `POST` | `/auth/signin` | Public | Sign in, returns `access_token` |
| `POST` | `/auth/signout` | ✓ | Invalidate current session |
| `GET` | `/auth/me` | ✓ | Get current authenticated user |
| `GET` | `/posts` | ✓ | Get paginated posts (`?page=1&limit=10`) |
| `POST` | `/posts` | ✓ | Create a new post (multipart/form-data) |
| `GET` | `/posts/search?q=` | ✓ | Search posts by caption |
| `GET` | `/posts/:id` | ✓ | Get a post by ID |
| `PATCH` | `/posts/:id` | ✓ | Update a post (multipart/form-data) |
| `DELETE` | `/posts/:id` | ✓ | Delete a post |
| `PATCH` | `/posts/:id/like` | ✓ | Like or unlike a post |
| `POST` | `/saves` | ✓ | Save a post |
| `DELETE` | `/saves/:id` | ✓ | Remove a saved post |
| `GET` | `/saves` | ✓ | Get current user's saved posts |
| `GET` | `/users` | ✓ | Get all users |
| `GET` | `/users/:id` | ✓ | Get a user by ID |
| `GET` | `/users/:id/posts` | ✓ | Get posts by a user |
| `PATCH` | `/users/:id` | ✓ | Update user profile (multipart/form-data) |

### Post pagination response shape

```json
{
  "data": [ /* IPost[] */ ],
  "meta": { "total": 100, "page": 1, "limit": 10, "totalPages": 10 }
}
```

---

## Scripts

### Frontend

| Command | Description |
|---|---|
| `pnpm run dev` | Start development server |
| `pnpm run build` | Production build |
| `pnpm run preview` | Preview production build |
| `pnpm run lint` | Run ESLint |

### Backend

| Command | Description |
|---|---|
| `pnpm run dev` | Start with hot reload |
| `pnpm run start:prod` | Start production build |
| `pnpm run build` | Compile TypeScript |
| `npx prisma studio` | Open Prisma visual editor |
| `npx prisma migrate dev` | Run pending migrations |

---

## Environment Variables

### Backend (`.env`)

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret for signing access tokens |
| `PORT` | Port for the NestJS server |
| `APP_URL` | Public URL of the backend (used to form upload URLs) |
| `CORS_ORIGIN` | Allowed origin for CORS |

### Frontend (`.env`)

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the NestJS API |

---

## License

This project is licensed under the [MIT License](LICENSE).
