# Game Vault

A modern video game collection manager built with Next.js 15. Browse, favorite, and track games you want to play.

[Live Demo](https://game-vault-1.vercel.app)

## Tech Stack

### Core

- Next.js 14 with TurboPack
- React 19
- TypeScript
- Tailwind CSS
- Supabase

### Authentication & Data

- Clerk Authentication
- TanStack Query
- PostgreSQL

### UI Components

- Radix UI (Select, Slot, Tabs)
- Lucide Icons
- Tailwind Animations

## Features

- 🎮 Browse and search games
- 👤 User authentication
- ❤️ Favorite games
- 📑 Wishlist management
- 🔍 Advanced filtering
- 📱 Responsive design

## Getting Started

### Prerequisites

- Node.js 18+
- NPM or Yarn
- Supabase account
- Clerk account

### Environment Setup

Create `.env.local`:

```bash
# Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Database
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

### Installation

Clone and install:

```bash
git clone https://github.com/SB17Codes/game-vault-1.git
cd game-vault-1
npm install
```

### Start development:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── app/                # Next.js app router pages
├── components/         # React components
├── lib/               # Utility functions
├── server/            # Server-side code
└── types/             # TypeScript definitions
```

## Database Schema

### Tables

#### `favorites`

Stores user's favorite games.

#### `wishlist`

Stores user's wishlisted games.
