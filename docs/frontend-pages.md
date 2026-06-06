# Addis Tesfa - Frontend Pages Documentation

## Overview

The Addis Tesfa frontend is a React-based single-page application (SPA) built with Vite, TypeScript, and TailwindCSS. It features a calm, professional design system optimized for mental health community engagement.

## Architecture

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS with custom CSS variables
- **Routing**: React Router v6
- **State Management**: React Context API + Hooks
- **Icons**: Lucide React
- **API**: Axios with interceptors

## Page Structure

All pages are located in `frontend/src/pages/` and follow a consistent pattern:
- TypeScript `.tsx` files with strict typing
- Custom hooks for data fetching (`useEffect` + API services)
- Responsive design with mobile-first approach
- Loading states with skeleton components
- Error handling with toast notifications

---

## Public Pages (No Authentication Required)

### 1. LandingPage.tsx
**Route**: `/welcome`

The marketing landing page for the platform.

**Features**:
- Fixed navigation bar with glassmorphism effect
- Animated hero section with staggered fade-in effects
- Statistics display (10K+ users, 50+ professionals, etc.)
- 4 feature cards with hover lift animations
- Testimonials section with star ratings
- Trust badges (Anonymous, Free Forever, Verified Professionals)
- Call-to-action sections
- Professional footer with navigation links

**Key Components Used**:
- `Button` - Primary and secondary CTAs
- `Link` from react-router-dom
- Custom animations (fadeIn, slideIn)

**Animations**:
- Staggered entrance animations on page load
- Hover effects on feature cards
- Smooth scroll behavior

---

### 2. LoginPage.tsx
**Route**: `/login`

User authentication page with form validation.

**Features**:
- Email and password inputs with validation
- Password visibility toggle (show/hide)
- Form submission with loading states
- Error message display
- Link to registration page
- Link to "Forgot Password" (placeholder)
- Redirects authenticated users to home

**Key Components Used**:
- `Input` - Form fields with error states
- `Button` - Submit with loading spinner
- `Eye`, `EyeOff` icons for password toggle
- `Heart` icon for branding

**State Management**:
- Form state with `useState`
- Authentication via `useAuth` hook
- Navigation with `useNavigate`

---

### 3. RegisterPage.tsx
**Route**: `/register`

New user registration with anonymous option.

**Features**:
- Email, password, and confirm password fields
- Password strength indicator (visual)
- Anonymous posting toggle option
- Form validation (password match, email format)
- Terms of service agreement checkbox
- Success redirect to login or home
- Link to login for existing users

**Key Components Used**:
- `Input` - Form fields
- `Button` - Submit button
- `Eye`, `EyeOff` icons
- Custom checkbox for anonymous option

**State Management**:
- Form state with multiple fields
- Password confirmation validation
- `useAuth` for registration API call

---

### 4. HomePage.tsx
**Route**: `/community`

Main feed displaying all community posts.

**Features**:
- Filter tabs: Trending, Latest, With Professional Response
- Search bar for filtering posts
- Create post CTA button (authenticated users only)
- List of `PostCard` components
- Empty state when no posts
- Infinite scroll or pagination ready
- Professional badge indicators

**Key Components Used**:
- `PostCard` - Individual post display
- `Button` - Create post CTA
- `Badge` - Filter indicators
- `Plus`, `TrendingUp`, `Clock`, `Stethoscope` icons

**Data Fetching**:
- Fetches posts from `postsApi.getAll()`
- Filters posts based on selected tab
- Real-time updates on mount

---

### 5. PostDetailPage.tsx
**Route**: `/post/:id`

Detailed view of a single post with comments.

**Features**:
- Full post content display
- Author information (respects anonymity)
- Like, save, share actions
- Comment section with nested replies
- Comment form (authenticated users)
- Professional responses highlighted
- Related posts sidebar
- View count display

**Key Components Used**:
- `PostCard` or custom post display
- Comment form with `Input` and `Button`
- `Heart`, `MessageCircle`, `Bookmark`, `Share` icons
- `ArrowLeft` for back navigation

**Data Fetching**:
- Post data: `postsApi.getById(id)`
- Comments: `commentsApi.getByPost(postId)`
- Real-time comment updates

---

### 6. BlogsPage.tsx
**Route**: `/blogs`

Educational articles written by professionals.

**Features**:
- Grid layout of blog cards
- Search/filter by tags
- "Write Article" button (professionals only)
- Blog card with cover image, title, excerpt
- Author information
- Publication date
- Read more links

**Key Components Used**:
- `BookOpen`, `Calendar`, `Search`, `Plus` icons
- `Button` - Write article CTA
- `Badge` - Tags display
- Custom blog cards

**Role-Based Rendering**:
- Uses `useIsProfessional()` hook
- Shows "Write Article" only to verified professionals

---

## Protected Pages (Authentication Required)

### 7. CreatePostPage.tsx
**Route**: `/create-post`

Form for creating new community posts.

**Features**:
- Title and content inputs
- Tags input (comma-separated, converts to array)
- Anonymous toggle option
- Preview mode
- Character count for content
- Form validation (required fields)
- Success redirect to post or home

**Key Components Used**:
- `Input` - Title field
- `textarea` for content (large input)
- `Button` - Submit with loading state
- `ArrowLeft` - Back navigation
- `Eye`, `EyeOff` - Anonymous toggle

**Permissions**:
- Protected by `ProtectedRoute`
- Redirects to `/login` if not authenticated

---

### 8. SavedPostsPage.tsx
**Route**: `/saved`

Collection of user's saved/bookmarked posts.

**Features**:
- Grid of saved post cards
- Remove/unsave functionality
- Empty state with CTA to browse
- Search within saved posts
- Organized by save date

**Key Components Used**:
- `PostCard` with saved state
- `Bookmark` icon for header
- `Button` - Browse more CTA
- `Search` icon for filtering

**Data Fetching**:
- `postsApi.getSaved()` - Fetch user's saved posts
- `postsApi.unsave(id)` - Remove from saved

---

## Role-Based Pages

### 9. AdminDashboardPage.tsx
**Route**: `/admin`
**Access**: ADMIN role only

Administration panel for platform management.

**Features**:
- Statistics overview cards:
  - Total users
  - Total posts
  - Pending verifications
  - Pending reports
- Professional verification queue
  - Approve/reject buttons
  - License and credential display
- Recent reports list
- User management search
- Content moderation tools

**Key Components Used**:
- `Shield`, `Users`, `FileText`, `AlertTriangle` icons
- `CheckCircle`, `XCircle` for actions
- `Button` with variants
- `Badge` for status indicators

**Permissions**:
- Protected by `AdminRoute`
- Checks `useIsAdmin()` hook
- 403 redirect for non-admins

---

### 10. ProfessionalDashboardPage.tsx
**Route**: `/professional`
**Access**: PROFESSIONAL role only

Dashboard for verified professionals.

**Features**:
- Personal stats cards:
  - Total responses given
  - Helpful responses count
  - Reputation score
  - Badge level display
- Unanswered posts queue
  - Filtered posts needing professional input
  - Quick response buttons
- Recent activity feed
- Guidelines reminder section
- Link to write blog articles

**Key Components Used**:
- `Stethoscope`, `MessageSquare`, `Heart`, `Award`, `TrendingUp` icons
- `Badge` for badge level display
- `Button` - Respond CTAs

**Permissions**:
- Protected by `ProfessionalRoute`
- Checks `useIsProfessional()` hook
- Shows application prompt for non-professionals

---

## Layout Components

### Layout.tsx
Main layout wrapper for authenticated routes.

**Structure**:
- `Sidebar` - Left navigation
- `Topbar` - Header with search and user menu
- `main` content area with `Outlet` for child routes

### Sidebar.tsx
Navigation sidebar with role-based sections.

**Sections**:
- Main: Home, Community, Blogs
- Personal: Saved Posts (authenticated)
- Professional: Dashboard, My Responses (professionals only)
- Admin: Dashboard, Moderation (admins only)
- Bottom: Settings, Logout

**Features**:
- Collapsible on mobile
- Active state highlighting
- Icon + label navigation items
- User role indicators

### Topbar.tsx
Header bar with global search and user actions.

**Features**:
- Search input (global search)
- Notification bell with badge
- User dropdown menu:
  - Profile link
  - Settings link
  - Logout action
- Mobile menu toggle

---

## Component Library

### Button.tsx
Reusable button component with variants.

**Props**:
- `variant`: 'primary' | 'secondary' | 'ghost' | 'danger'
- `size`: 'sm' | 'md' | 'lg'
- `isLoading`: boolean - Shows spinner
- `leftIcon`, `rightIcon`: ReactNode
- Standard button attributes

### Input.tsx
Form input with label and error handling.

**Props**:
- `label`: string
- `error`: string - Error message display
- `helperText`: string - Helper text below input
- Standard input attributes

### Badge.tsx
Status and category badges.

**Variants**:
- `primary` - Main brand color
- `secondary` - Neutral
- `success` - Green
- `warning` - Amber
- `danger` - Red
- `default` - Gray

### PostCard.tsx
Community post preview card.

**Features**:
- Author avatar (respects anonymity)
- Title and content preview
- Tags display
- Like, comment, save counts
- Professional response indicator
- Timestamp
- Action buttons

### Skeleton.tsx
Loading state placeholders.

**Types**:
- `Skeleton` - Generic skeleton block
- `PostCardSkeleton` - Post card layout
- `BlogCardSkeleton` - Blog card layout

### Toast.tsx
Notification system.

**Usage**:
```tsx
const { showToast } = useToast();
showToast('Message', 'success' | 'error' | 'warning' | 'info');
```

---

## Routing Configuration

All routes are defined in `App.tsx`:

```tsx
Public Routes:
  /welcome         -> LandingPage
  /login           -> LoginPage (redirects if auth)
  /register        -> RegisterPage (redirects if auth)

Protected Routes (with Layout):
  /                -> Redirects to /welcome
  /community       -> HomePage
  /post/:id        -> PostDetailPage
  /blogs           -> BlogsPage
  
  Authenticated Only:
    /create-post   -> CreatePostPage
    /saved         -> SavedPostsPage
  
  Admin Only:
    /admin         -> AdminDashboardPage
  
  Professional Only:
    /professional  -> ProfessionalDashboardPage
```

---

## State Management

### Auth Context (`useAuth.tsx`)
Global authentication state.

**Provides**:
- `user` - Current user object
- `token` - JWT token
- `isAuthenticated` - Boolean
- `isLoading` - Auth loading state
- `login()`, `logout()` - Auth actions

### Role Hooks
- `useIsAdmin()` - Check ADMIN role
- `useIsProfessional()` - Check PROFESSIONAL role

---

## API Integration

All API calls are centralized in `services/api.ts`:

**Services**:
- `authApi` - Login, register, get current user
- `postsApi` - CRUD operations, likes, saves
- `commentsApi` - Comment CRUD
- `blogsApi` - Blog articles
- `professionalsApi` - Verification, stats
- `adminApi` - Admin operations
- `reportsApi` - Content reporting

**Interceptors**:
- Automatic JWT token injection
- 401 unauthorized handling (redirect to login)

---

## Design System

### Colors
- `--primary`: #3A7D5C (Main brand - calming green)
- `--background`: #F7F3EE (Warm beige background)
- `--beige`: #E8E0D5 (Borders, dividers)
- `--text-primary`: #2D3436 (Main text)
- `--text-secondary`: #636E72 (Secondary text)

### Typography
- Font: Inter (Google Fonts)
- Hierarchy: h1 (4xl-7xl), h2 (3xl-4xl), h3 (xl-2xl), body (base)

### Spacing
- Base unit: 4px (0.25rem)
- Sections: px-6 (mobile), max-w-6xl (desktop container)
- Card padding: p-5, p-6

### Shadows
- `--shadow-soft`: Subtle elevation
- `--shadow-card`: Card elevation
- `--shadow-hover`: Hover state
- `--shadow-elevated`: Modal/dropdown

### Animations
- `fadeIn`: 0.4s ease-out
- `slideIn`: 0.3s ease-out
- `scaleIn`: 0.3s ease-out
- `shimmer`: 1.5s infinite (skeleton)

---

## Responsive Breakpoints

- **Mobile**: Default (< 640px)
- **Tablet**: sm (640px+)
- **Desktop**: md (768px+), lg (1024px+), xl (1280px+)

### Mobile Adaptations
- Stacked layouts instead of grids
- Full-width buttons
- Collapsed sidebar (hamburger menu)
- Simplified navigation

---

## Accessibility

- Semantic HTML (header, nav, main, footer)
- ARIA labels on interactive elements
- Focus visible states
- Reduced motion support (`prefers-reduced-motion`)
- Color contrast compliant
- Keyboard navigation support

---

## Performance Optimizations

- Code splitting by route
- Lazy loading for heavy components
- Image optimization placeholders
- Skeleton loading states
- Debounced search inputs
- Memoized components where appropriate

---

## Future Enhancements

Planned improvements:
- Dark mode support
- Real-time notifications (WebSockets)
- PWA capabilities
- Offline support
- Advanced search with filters
- User profile pages
- Direct messaging between users
- Video/audio support in posts

---

## File Structure

```
frontend/src/
├── pages/
│   ├── LandingPage.tsx
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── HomePage.tsx
│   ├── PostDetailPage.tsx
│   ├── CreatePostPage.tsx
│   ├── BlogsPage.tsx
│   ├── SavedPostsPage.tsx
│   ├── AdminDashboardPage.tsx
│   └── ProfessionalDashboardPage.tsx
├── components/
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Badge.tsx
│   ├── PostCard.tsx
│   ├── Skeleton.tsx
│   └── Toast.tsx
├── layouts/
│   ├── Layout.tsx
│   ├── Sidebar.tsx
│   └── Topbar.tsx
├── hooks/
│   └── useAuth.tsx
├── services/
│   └── api.ts
└── types/
    └── index.ts
```

---

*Documentation generated for Addis Tesfa Platform*
*Last updated: April 2024*
