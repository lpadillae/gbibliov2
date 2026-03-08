# GBiblio Implementation Plan

## 1. Project Structure (Next.js App Router)

```text
/
├── app/
│   ├── (auth)/             # Authentication routes (login, register)
│   ├── (dashboard)/        # Protected dashboard routes
│   │   ├── library/        # Main library view
│   │   ├── scanner/        # Barcode scanner view
│   │   ├── statistics/     # Reading statistics charts
│   │   ├── incidences/     # Failed ISBN scans log
│   │   └── settings/       # User settings
│   ├── u/
│   │   └── [username]/     # Public profile routes
│   ├── api/                # Next.js API routes
│   │   ├── auth/           # NextAuth endpoints
│   │   ├── books/          # Book CRUD operations
│   │   ├── metadata/       # Smart Metadata Engine (ISBN lookup)
│   │   └── incidences/     # Failed scans logging
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Landing page
├── components/
│   ├── ui/                 # Reusable UI components (buttons, inputs, cards)
│   ├── books/              # Book cards, lists, forms
│   ├── scanner/            # html5-qrcode integration
│   ├── charts/             # Chart.js wrappers
│   └── layout/             # Navigation, sidebars, headers
├── lib/
│   ├── db.ts               # Prisma client initialization
│   ├── metadata/           # Metadata fetchers (Google, OpenLibrary, ITBookstore, Wikidata)
│   └── utils.ts            # Helper functions
├── prisma/                 # Prisma schema and migrations
│   └── schema.prisma
├── public/                 # Static assets (PWA manifest, icons)
└── styles/                 # Additional global styles (Tailwind is main)
```

## 2. Database Schema (Prisma)

*Note: We will use SQLite for the local preview environment, which can be easily swapped to PostgreSQL for the Railway deployment by changing the provider in `schema.prisma`.*

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite" // Use "postgresql" for Railway
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  password      String?   // For credentials auth
  image         String?
  username      String?   @unique
  
  // Settings
  isPublic      Boolean   @default(false)
  primarySource String    @default("google") // google, openlibrary, etc.
  
  books         Book[]
  incidences    Incidence[]
}

model Book {
  id          String    @id @default(cuid())
  userId      String
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  title       String
  author      String
  isbn        String?
  coverUrl    String?
  description String?
  pageCount   Int?
  
  status      String    @default("POR_LEER") // POR_LEER, LEYENDO, LEIDO, ABANDONADO
  isPublic    Boolean   @default(true)
  
  rating      Int?
  review      String?
  
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  readAt      DateTime? // Timestamp when marked as read
  
  notes       Note[]
}

model Note {
  id        String   @id @default(cuid())
  bookId    String
  book      Book     @relation(fields: [bookId], references: [id], onDelete: Cascade)
  
  content   String   // Rich text or markdown
  pageRef   Int?     // Optional page reference
  isQuote   Boolean  @default(false)
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Incidence {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  isbn      String
  errorLog  String?
  resolved  Boolean  @default(false)
  
  createdAt DateTime @default(now())
}
```

## 3. Task Breakdown

### Phase 1: Setup & Foundation
- [x] Initialize Next.js project with Tailwind CSS and TypeScript.
- [ ] Setup Prisma ORM and SQLite database (proxy for PostgreSQL).
- [ ] Configure NextAuth.js for authentication (Credentials provider for MVP).
- [ ] Define branding tokens (Deep Blue, Tech Teal) in Tailwind config.

### Phase 2: Core Library & UI
- [ ] Build Dashboard layout (Sidebar, Header).
- [ ] Implement Book CRUD API routes.
- [ ] Create Book list/grid views with filtering and status tabs.
- [ ] Build Book detail view with status toggle and `readAt` tracking.

### Phase 3: Smart Metadata Engine & Scanner
- [ ] Implement `html5-qrcode` scanner component.
- [ ] Build Metadata Service with fallback logic:
  - Google Books -> Open Library -> IT Bookstore -> Wikidata.
- [ ] Integrate scanner with Metadata Service to auto-fill book forms.
- [ ] Implement Incidences logging for failed scans.

### Phase 4: Content Enrichment & Insights
- [ ] Implement Notes & Quotes system for books.
- [ ] Integrate `recharts` or `chart.js` for reading statistics.
- [ ] Build Public Profile pages (`/u/[username]`).

### Phase 5: Polish & Deployment
- [ ] PWA configuration (Manifest, Service Worker).
- [ ] Final UI polish (Glassmorphism, animations).
- [ ] Railway.app deployment steps.
