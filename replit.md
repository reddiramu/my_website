# Exploring India - Travel Discovery Platform

## Overview

Exploring India is a full-stack web application designed to help travelers discover and explore popular destinations across India. The platform enables users to browse curated travel destinations, leave reviews, track places they've visited or plan to visit, and connect with the community through a contact system. Built with a minimalist design approach inspired by modern travel platforms, it prioritizes clean aesthetics and intuitive user experience for international visitors exploring India's diverse landscapes and cultural heritage.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- **React 18** with TypeScript for type-safe component development
- **Vite** as the build tool and development server, configured with custom middleware mode for Express integration
- **Wouter** for lightweight client-side routing (landing, login, register, dashboard pages)
- **TanStack Query v5** for server state management, data fetching, and caching with pessimistic updates

**UI Component System**
- **shadcn/ui** component library (New York style variant) with Radix UI primitives for accessible, unstyled components
- **Tailwind CSS** for utility-first styling with custom design tokens matching the India travel theme
- Custom color palette: warm cream background (#FFFDF2), pure black text, saffron-orange primary actions, muted green accents
- Typography system: Inconsolata (headings), Poppins (subheadings/labels), Antic (body text) loaded via Google Fonts CDN

**Design Philosophy**
- Minimalist elegance with purposeful white space
- Cultural authenticity in representing India's destinations
- Accessibility-first approach through Radix UI primitives
- Mobile-responsive layouts with Tailwind breakpoints

### Backend Architecture

**Server Framework**
- **Express.js** with TypeScript running on Node.js
- Session-based authentication using `express-session` with configurable secret
- Custom middleware for request logging and error handling
- Development/production environment separation

**API Design**
- RESTful API endpoints under `/api` namespace:
  - `/api/auth/*` - User authentication (register, login, logout, current user)
  - `/api/places` - Places CRUD operations
  - `/api/reviews/*` - Review management
  - `/api/user-places` - User's explored/upcoming places
  - `/api/contact` - Contact form submissions
- JSON request/response format with Zod schema validation
- Error responses with appropriate HTTP status codes

**Authentication & Security**
- **bcrypt** for password hashing (10 salt rounds)
- Session cookies with HTTP-only flag and secure flag in production
- 7-day session expiration
- Authentication middleware (`requireAuth`) protecting user-specific endpoints

### Data Storage

**Database**
- **PostgreSQL** via Neon serverless with WebSocket connections
- **Drizzle ORM** for type-safe database queries and schema management
- Connection pooling through `@neondatabase/serverless`

**Database Schema**
- `users` - User accounts (id, username, hashed password, timestamps)
- `places` - Travel destinations (id, name, description, importance, location, category, image URL)
- `reviews` - User reviews (id, user_id, place_id, rating 1-5, comment, timestamps)
- `user_places` - User place tracking (id, user_id, place_id, status: "explored"/"upcoming", timestamps)
- `contact_messages` - Contact form submissions (id, name, email, message, timestamps)

**Data Relationships**
- One-to-many: Users → Reviews, Users → UserPlaces
- Many-to-one: Reviews → Places, UserPlaces → Places
- Cascade deletes on user removal to maintain referential integrity

**Seeding Strategy**
- Pre-populated places data for popular Indian destinations (Taj Mahal, Jaipur, Kerala Backwaters, Varanasi, Goa, Himalayas, etc.)
- Categories: Historical, Cultural, Nature, Spiritual, Beach, Adventure
- Generated placeholder images stored in `/generated_images/` directory

### External Dependencies

**Development Tools**
- **Replit-specific plugins**: Vite runtime error modal, cartographer, dev banner (development only)
- **TypeScript** with strict mode and path aliases (`@/`, `@shared/`, `@assets/`)
- **ESBuild** for server-side production bundling

**UI Libraries**
- **Radix UI** collection (25+ component primitives): Dialog, Dropdown, Select, Tooltip, Toast, etc.
- **React Hook Form** with Zod resolver for form validation
- **class-variance-authority (CVA)** for component variant management
- **clsx** and **tailwind-merge** for conditional class composition
- **Lucide React** for consistent iconography

**Database & Session Management**
- **Drizzle Kit** for schema migrations and database push operations
- **connect-pg-simple** for PostgreSQL-backed session storage (referenced but not actively configured)
- **date-fns** for date formatting and manipulation

**Image Assets**
- Pre-generated destination images in `attached_assets/generated_images/` directory
- Vite alias (`@assets`) for simplified asset imports in React components

**Environment Configuration**
- `DATABASE_URL` - Required PostgreSQL connection string (Neon serverless)
- `SESSION_SECRET` - Session encryption key (defaults to development value, should be set in production)
- `NODE_ENV` - Environment flag (development/production)
- `REPL_ID` - Replit-specific identifier for dev tooling enablement