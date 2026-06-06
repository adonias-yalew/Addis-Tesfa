# Addis Tesfa (አዲስ ተስፋ) - Mental Health Peer Support Platform

A scalable, production-ready mental health peer support platform connecting users with shared experiences and mental health professionals.

## 🏗️ Architecture

**Backend:** Modular monolith with clean separation of concerns
- **Framework:** Express + TypeScript
- **Database:** Supabase (PostgreSQL) with Row Level Security
- **Authentication:** JWT-based with role-based access control
- **Structure:** `modules/{feature}/{controller,service,routes,types}.ts`

**Frontend:** Modern React SPA
- **Framework:** React + Vite + TypeScript
- **Styling:** TailwindCSS with custom design tokens
- **State Management:** Context API + React hooks
- **Routing:** React Router with protected routes

## 📁 Project Structure

```
addis-tesfa-platform/
├── backend/                    # Express API
│   ├── src/
│   │   ├── modules/           # Feature modules (auth, posts, etc.)
│   │   ├── config/            # Environment configuration
│   │   ├── db/                # Database client
│   │   ├── middleware/        # Express middleware
│   │   ├── types/             # Shared types
│   │   └── utils/             # Utility functions
│   ├── .env                   # Environment variables (not in git)
│   └── package.json
│
├── frontend/                   # React SPA
│   ├── src/
│   │   ├── pages/             # Route components
│   │   ├── components/        # Reusable UI components
│   │   ├── layouts/           # Layout components
│   │   ├── hooks/             # Custom React hooks
│   │   ├── services/          # API service layer
│   │   └── types/             # TypeScript types
│   ├── .env                   # Environment variables (not in git)
│   └── package.json
│
├── database/                   # SQL migrations
│   └── migrations/
│       ├── 001_initial_schema.sql
│       └── 002_rls_policies.sql
│
└── shared/                     # Shared types between FE/BE
    └── types/
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Supabase project

### 1. Environment Setup

**Backend** (`backend/.env`):
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
JWT_SECRET=your-super-secret-key
```

**Frontend** (`frontend/.env`):
```env
VITE_API_URL=http://localhost:3000/api
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 2. Database Setup
Run migrations in Supabase SQL Editor:
1. `database/migrations/001_initial_schema.sql`
2. `database/migrations/002_rls_policies.sql`

### 3. Install & Run

```bash
# Install all dependencies
npm run install:all

# Start both frontend and backend
npm run dev

# Or separately:
npm run dev:backend   # Backend on http://localhost:3000
npm run dev:frontend  # Frontend on http://localhost:5173
```

## 🔐 Authentication & Roles

- **USER** - Regular users who can create posts, comment, save content
- **PROFESSIONAL** - Verified mental health professionals
- **ADMIN** - Platform administrators

## 🛡️ Security Features

- JWT-based authentication
- Row Level Security (RLS) on all database tables
- Password hashing with bcrypt
- CORS configuration
- Input validation
- XSS protection through React's built-in escaping

## 📱 Features

- **Anonymous posting** - Users can share without revealing identity
- **Professional responses** - Verified professionals can answer posts
- **Reputation system** - Users earn badges for engagement
- **Content moderation** - Report system with admin oversight
- **Saved posts** - Bookmark content for later
- **Blogs** - Professional-written articles

## 🛠️ Development

### Code Style
- TypeScript strict mode
- ESLint + Prettier configuration
- Consistent naming: `camelCase` for variables, `PascalCase` for types/components

### Module Pattern
Each backend module follows:
```
modules/{name}/
├── controller.ts   # HTTP handlers
├── service.ts      # Business logic
├── routes.ts       # Route definitions
└── types.ts        # Module-specific types
```

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

**Addis Tesfa** - "New Hope" in Amharic. Building a supportive community for mental wellness.
