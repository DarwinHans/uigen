# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run Vitest tests
- `npm run setup` - Install dependencies, generate Prisma client, and run migrations
- `npm run db:reset` - Reset database with force migration

## Architecture Overview

UIGen is an AI-powered React component generator built with Next.js 15 and React 19. The application creates a virtual development environment where users can generate and edit React components through AI chat interactions.

### Core Systems

**Virtual File System**
- In-memory file system (`src/lib/file-system.ts`) that simulates a real filesystem
- Files are stored as `FileNode` objects with path, content, and metadata
- Supports all basic operations: create, read, update, delete, rename, and directory traversal
- Files are NOT written to disk - everything exists in memory only
- Context provided through `FileSystemProvider` in `src/lib/contexts/file-system-context.tsx`

**Project Management**
- Projects are persisted in SQLite via Prisma ORM
- Project data includes serialized file system state and chat messages
- Anonymous users get temporary projects; authenticated users get persistent projects
- Project actions in `src/actions/` handle CRUD operations

**AI Integration**
- Chat interface in `src/components/chat/` handles AI conversations
- API route at `src/app/api/chat/route.ts` processes AI requests
- Uses Anthropic Claude via Vercel AI SDK
- AI can manipulate the virtual file system through tool calls

**Authentication**
- Session-based auth using jose for JWT handling
- User management with bcrypt password hashing
- Auth actions in `src/actions/` and auth utilities in `src/lib/auth.ts`

### Component Structure

- `src/components/chat/` - Chat interface components for AI interaction
- `src/components/editor/` - Code editor and file tree components using Monaco Editor
- `src/components/preview/` - Live React component preview system
- `src/components/auth/` - Authentication forms and dialogs

### Database Schema

- `User` model with email/password authentication
- `Project` model storing serialized file system data and chat history
- Projects can be anonymous (no userId) or owned by authenticated users

### Key Libraries

- Next.js 15 with App Router and React 19
- Tailwind CSS v4 for styling
- Prisma with SQLite for data persistence
- Monaco Editor for code editing
- Anthropic Claude via Vercel AI SDK
- Radix UI components for accessible UI elements

### Testing

- Vitest with jsdom environment for component testing
- Tests use React Testing Library
- Test files located alongside source files in `__tests__/` directories