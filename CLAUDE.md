# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ClassTranscribe is a React.js frontend for searchable transcribed video lectures, serving both instructors and students at the University of Illinois.

## Commands

```bash
yarn start          # Dev server (port 3000)
yarn build          # Production build to /build
yarn test           # Run Jest tests
yarn test -- --watch                    # Run tests in watch mode
yarn test -- path/to/file.test.js       # Run single test file
yarn lint           # ESLint check
yarn lint:fix       # Auto-fix lint errors
yarn prettier:fix   # Format code
yarn backend        # Switch backend API URL
```

## Architecture

**Stack**: React 16, Redux Toolkit, React Router v6, Webpack 4

**Directory Structure**:
- `src/screens/` - Page components (lazy-loaded routes)
- `src/components/` - Reusable components (prefixed with "CT", e.g., CTPlayer, CTNavHeader)
- `src/utils/cthttp/` - API layer with entity-based endpoints
- `src/utils/user/` - Authentication and role management
- `src/hooks/` - Custom React hooks
- `src/entities/` - Data models (EPubs, Playlists, UserEvent)

**State Management**:
- Redux slices per screen/feature in `src/screens/*/xxxSlice.js`
- Store configuration in `src/store.js`
- Async thunks registered in `src/model/thunks.js`

**Routing** (`src/App.js`):
- Admin routes: `/admin/*` (requires `user.isAdmin`)
- Instructor routes: `/instructor/*`, `/offering/:id/*`, `/media-settings/:id/*`
- Student/Public: `/`, `/video`, `/search`, `/history`, `/offering/:id`

## Code Conventions

**Imports**: Use absolute imports from `src/` (configured in `jsconfig.json`)
```javascript
// Good
import { api } from 'utils/cthttp';
// Avoid
import { api } from '../../../utils/cthttp';
```

**Component Naming**: Custom components use "CT" prefix (CTPlayer, CTMarkdown, CTForm)

**Max Line Length**: 200 characters (ESLint configured)

**Redux Pattern**: Legacy code uses `dispatch({type: "slice/action"})`, newer code uses direct function dispatch

## Key Files

- `src/App.js` - Main routing
- `src/store.js` - Redux store configuration
- `src/utils/env.js` - Environment variables (Auth0, CILogon, API URLs)
- `config/webpack.config.js` - Build configuration

## Node Version

v18.20.4 (see `.nvmrc`)
