"""Seed data for the file manager demo."""

from pathlib import Path

SEED_CONTENTS: dict[str, str] = {
    "projects/README.md": """\
# My Project

A full-stack TypeScript application with modern tooling.

## Getting Started

```bash
pnpm install
pnpm dev
```

## Architecture

- **src/** — Application source code
- **docs/** — Project documentation
- **scripts/** — Build and deploy scripts
- **data/** — Configuration and data files

## Features

1. Type-safe API layer
2. Component-based UI
3. Automated builds
4. Comprehensive documentation

## Contributing

Please read `docs/guide.md` before submitting a pull request.
""",
    "projects/package.json": """\
{
  "name": "my-project",
  "version": "1.2.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "test": "vitest",
    "lint": "eslint src/"
  },
  "dependencies": {
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "zustand": "^5.0.0"
  },
  "devDependencies": {
    "typescript": "^5.8.0",
    "vite": "^6.3.0",
    "vitest": "^3.1.0",
    "eslint": "^9.0.0"
  }
}""",
    "projects/tsconfig.json": """\
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "outDir": "dist",
    "rootDir": "src",
    "paths": {
      "@/*": [
        "./src/*"
      ]
    }
  },
  "include": [
    "src"
  ]
}""",
    "projects/src/index.ts": """\
import { createApp } from './App'

const app = createApp({
  rootElement: document.getElementById('root')!,
  theme: 'light',
})

app.mount()

export type { AppConfig } from './App'
""",
    "projects/src/App.tsx": """\
import React, { useState, useEffect } from 'react'
import { fetchUsers } from './utils/helpers'

type AppProps = {
  rootElement: HTMLElement
  theme: 'light' | 'dark'
}

export function createApp(config: AppProps) {
  return {
    mount() {
      const root = createRoot(config.rootElement)
      root.render(<App theme={config.theme} />)
    },
  }
}

function App({ theme }: { theme: string }) {
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    fetchUsers().then(setUsers)
  }, [])

  return (
    <div className={`app app--${theme}`}>
      <h1>Dashboard</h1>
      <ul>
        {users.map((u) => (
          <li key={u.id}>{u.name}</li>
        ))}
      </ul>
    </div>
  )
}
""",
    "projects/src/styles.css": """\
/* Base styles */
:root {
  --color-primary: #3b82f6;
  --color-bg: #ffffff;
  --color-text: #1a1a1a;
  --radius: 8px;
}

.app {
  max-width: 960px;
  margin: 0 auto;
  padding: 2rem;
  font-family: system-ui, -apple-system, sans-serif;
}

.app--dark {
  --color-bg: #0a0a0a;
  --color-text: #f0f0f0;
}

h1 {
  color: var(--color-primary);
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
}
""",
    "projects/src/utils/helpers.ts": """\
export type User = {
  id: number
  name: string
  email: string
}

export async function fetchUsers(): Promise<User[]> {
  const response = await fetch('/api/users')
  if (!response.ok) {
    throw new Error(`Failed to fetch users: ${response.status}`)
  }
  return response.json()
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date)
}

export function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  ms: number,
): T {
  let timer: ReturnType<typeof setTimeout>
  return ((...args: unknown[]) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), ms)
  }) as T
}
""",
    "projects/docs/guide.md": """\
# Developer Guide

## Project Setup

### Prerequisites

- Node.js 20+
- pnpm 9+

### Installation

```bash
git clone https://github.com/example/my-project.git
cd my-project
pnpm install
```

## Development

Start the dev server:

```bash
pnpm dev
```

### Code Style

We use ESLint and Prettier for consistent formatting:

```bash
pnpm lint
pnpm format
```

### Testing

Run the test suite:

```bash
pnpm test           # run all tests
pnpm test:watch     # watch mode
pnpm test:coverage  # with coverage report
```

## API Reference

### `fetchUsers()`

Fetches the list of users from the API.

| Parameter | Type | Description |
|-----------|------|-------------|
| - | - | No parameters |

**Returns:** `Promise<User[]>`

### `formatDate(date)`

Formats a date for display.

| Parameter | Type | Description |
|-----------|------|-------------|
| date | Date | The date to format |

**Returns:** `string`
""",
    "projects/docs/changelog.md": """\
# Changelog

## [1.2.0] - 2025-12-15

### Added
- Dark theme support
- User list component
- API error handling

### Changed
- Updated TypeScript to 5.8
- Migrated to Vite 6

### Fixed
- Date formatting in non-US locales

## [1.1.0] - 2025-10-01

### Added
- Initial user dashboard
- Build scripts

## [1.0.0] - 2025-08-15

### Added
- Project scaffolding
- Basic React setup
""",
    "projects/data/config.yaml": """\
# Application Configuration
app:
  name: my-project
  port: 3000
  environment: development

database:
  host: localhost
  port: 5432
  name: mydb
  pool:
    min: 2
    max: 10

logging:
  level: debug
  format: json

features:
  darkMode: true
  analytics: false
  betaFeatures: false
""",
    "projects/data/users.csv": """\
id,name,email,role,created_at
1,Alice Johnson,alice@example.com,admin,2025-01-15
2,Bob Smith,bob@example.com,editor,2025-02-20
3,Carol Williams,carol@example.com,viewer,2025-03-10
4,David Brown,david@example.com,editor,2025-04-05
5,Eva Martinez,eva@example.com,admin,2025-05-12
6,Frank Lee,frank@example.com,viewer,2025-06-01
7,Grace Kim,grace@example.com,editor,2025-07-18
8,Henry Chen,henry@example.com,viewer,2025-08-22
""",
    "projects/data/notes.txt": """\
Meeting Notes — Sprint Planning
================================

Date: 2025-12-01
Attendees: Alice, Bob, Carol, David

Action Items:
  - [ ] Alice: Set up CI pipeline
  - [ ] Bob: Draft API spec for v2
  - [ ] Carol: Review authentication flow
  - [x] David: Update dependencies

Discussion:
  We discussed moving to a monorepo structure. The team
  agreed to evaluate Turborepo and Nx over the next sprint.

  Performance benchmarks showed a 30% improvement after
  the last optimization pass. We should document the
  approach in the developer guide.

Next meeting: 2025-12-15
""",
    "projects/scripts/build.sh": """\
#!/bin/bash
set -euo pipefail

echo "=== Building project ==="

# Clean previous build
rm -rf dist/

# Type check
echo "Running type check..."
npx tsc --noEmit

# Build
echo "Building with Vite..."
npx vite build

# Verify output
if [ -d "dist" ]; then
  echo "Build successful!"
  echo "Output size: $(du -sh dist | cut -f1)"
else
  echo "Build failed: dist/ not found"
  exit 1
fi
""",
    "projects/scripts/deploy.py": '''\
"""Deployment script for my-project."""

import subprocess
import sys
from pathlib import Path


def run(cmd: str) -> None:
    """Run a shell command and exit on failure."""
    result = subprocess.run(cmd, shell=True, check=False)
    if result.returncode != 0:
        print(f"Command failed: {cmd}")
        sys.exit(1)


def deploy(environment: str = "staging") -> None:
    """Deploy the application to the target environment."""
    dist = Path("dist")
    if not dist.exists():
        print("Error: dist/ not found. Run build first.")
        sys.exit(1)

    print(f"Deploying to {environment}...")
    run(f"rsync -avz dist/ deploy@server:/app/{environment}/")
    print(f"Deployment to {environment} complete!")


if __name__ == "__main__":
    env = sys.argv[1] if len(sys.argv) > 1 else "staging"
    deploy(env)
''',
    "notes/todo.md": """\
# To-Do

- [x] Set up project structure
- [x] Add TypeScript configuration
- [ ] Implement authentication
- [ ] Add unit tests for helpers
- [ ] Set up CI/CD pipeline
- [ ] Write API documentation
- [ ] Add error boundary component
""",
    "notes/ideas.md": """\
# Ideas

## Feature Ideas

### Smart Search
Full-text search across all project files with fuzzy matching
and result ranking. Could use Fuse.js or a custom trie.

### Collaboration Mode
Real-time editing with conflict resolution using CRDTs.
Look into Yjs or Automerge.

### Plugin System
Allow third-party plugins to extend the UI with custom
preview renderers and actions.

## Technical Debt

- Migrate remaining class components to hooks
- Replace legacy context API with Zustand
- Add proper error boundaries
""",
    "notes/meeting-notes.txt": """\
Weekly Sync — 2025-11-28
========================

Present: Full team

Updates:
  - Frontend: Completed dark mode implementation
  - Backend: API v2 endpoints ready for review
  - DevOps: Staging environment configured

Blockers:
  - Waiting on design approval for new dashboard
  - Need access to production logs

Decisions:
  - Adopt Vitest for unit testing
  - Ship dark mode in next release
  - Schedule security audit for Q1
""",
}

SEED_DIRS: list[str] = [
    "projects/assets",
    "archives",
]


def seed_if_needed(base_dir: Path) -> None:
    """Create seed files and directories if the base dir is empty or missing."""
    if base_dir.exists() and any(base_dir.iterdir()):
        return

    base_dir.mkdir(parents=True, exist_ok=True)

    for rel_path, content in SEED_CONTENTS.items():
        file_path = base_dir / rel_path
        file_path.parent.mkdir(parents=True, exist_ok=True)
        file_path.write_text(content, encoding="utf-8")

    for rel_dir in SEED_DIRS:
        (base_dir / rel_dir).mkdir(parents=True, exist_ok=True)
