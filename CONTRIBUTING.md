# Contributing to MUI Multi-Range Date Picker

Thank you for your interest in contributing! This is a monorepo project with two packages that share identical APIs.

## 📋 Table of Contents

- [Development Setup](#development-setup)
- [Commit Conventions](#commit-conventions)
- [Release Process](#release-process)
- [CI/CD Setup](#cicd-setup)
- [Workflows](#workflows)
- [Testing](#testing)

## 🚀 Development Setup

### Prerequisites

- [Bun](https://bun.sh) - Fast all-in-one JavaScript runtime
- Node.js 20+ (for npm publish only)

### Install Bun

```bash
# macOS/Linux
curl -fsSL https://bun.sh/install | bash

# Windows
powershell -c "irm bun.sh/install.ps1 | iex"
```

### Setup Project

```bash
# Clone repository
git clone https://github.com/spacedevin/mui-date-dragger.git
cd mui-date-dragger

# Install dependencies (use Bun, not npm!)
cd packages/MuiMultiDateRangePicker
bun install

# Run tests
bun test
bun test --coverage

# Build packages
bun run build
```

### Why Bun?

- ⚡ 10-20x faster installs than npm
- 🧪 Built-in test runner (no Jest/Vitest needed)
- 📦 Better dependency resolution
- 🔒 Binary lockfiles (fewer merge conflicts)

### Troubleshooting

If you encounter errors:

```bash
# Clean install
rm -rf node_modules bun.lock
bun install

# If you accidentally used npm
rm -rf node_modules package-lock.json
bun install
```

## 📝 Commit Conventions

We use [Conventional Commits](https://www.conventionalcommits.org/) for automatic versioning:

- `feat:` - New feature (minor version bump)
- `fix:` - Bug fix (patch version bump)
- `docs:` - Documentation changes (patch version bump)
- `chore:` - Maintenance tasks (patch version bump)
- `ci:` - CI/CD changes (patch version bump)
- `feat!:` or `BREAKING CHANGE:` - Breaking changes (major version bump)

**Format:** `type: description` (lowercase, no period at end)

**Examples:**
- ✅ `feat: add keyboard navigation`
- ✅ `fix: resolve drag selection bug`
- ❌ `feat: Add feature` (uppercase)
- ❌ `feat: add feature.` (period at end)

## 🚀 Release Process

### Automatic (Recommended)

1. Create PR with conventional commit title
2. Merge to `main` branch
3. GitHub Actions automatically:
   - Runs all tests (93 tests)
   - Builds packages
   - Publishes to NPM
   - Creates GitHub release
   - Deploys demos to GitHub Pages

### Manual Release

```bash
# Via GitHub Actions
# Go to: Actions → Main → Run workflow
# - Select package (free/pro)
# - Enter version (e.g., 0.2.0)
```

## 🔧 CI/CD Setup

**For Maintainers:**

1. **Create NPM token** (Automation type)
   - Visit: https://www.npmjs.com/settings/[username]/tokens

2. **Add to GitHub Secrets**
   ```bash
   gh secret set NPM_TOKEN
   gh secret set CODECOV_TOKEN
   ```

3. **Test locally before publishing**
   ```bash
   cd packages/MuiMultiDateRangePicker
   npm publish --dry-run
   ```

## ⚙️ Workflows

### `.github/workflows/pr.yml` - Pull Request Checks

Runs on every PR:
- Validates conventional commit title
- Runs all 93 tests with coverage
- Builds both packages (ESM + CJS + types)
- Type checks with TypeScript
- Dry-run npm publish
- Uploads coverage to Codecov

### `.github/workflows/main.yml` - Release & Deploy

Runs on push to main:
- Checks if release needed (skips release commits)
- Runs all tests with coverage
- Determines version from commit message
- Builds packages
- Publishes to NPM (both packages same version)
- Creates Git tag and GitHub release
- Deploys demos to GitHub Pages

## 🧪 Testing

We use [Bun](https://bun.sh) as the test runner with [@testing-library/react](https://testing-library.com/) for component testing.

### Running Tests

```bash
# Run all tests
cd packages/MuiMultiDateRangePicker
bun test

# With coverage report
bun test --coverage

# Watch mode for development
bun test --watch
```

### Test Environment

- **Runner:** Bun (fast, built-in TypeScript support)
- **DOM:** happy-dom (lightweight DOM implementation)
- **Testing Library:** @testing-library/react v16
- **Coverage Format:** LCOV (for Codecov integration)

### Writing Tests

Tests are colocated with source files:
- `lib/MultiRangeDatePicker.test.tsx` - Component tests
- `lib/types.test.ts` - Type tests
- `lib/index.test.ts` - Export tests

## 📦 Package Structure

This monorepo contains two npm packages with identical APIs:

```
mui-date-dragger/
├── packages/
│   ├── MuiMultiDateRangePicker/     # Free version
│   │   ├── lib/                      # Source code
│   │   ├── dist/                     # Built ESM + CJS + types
│   │   └── examples/demo/            # Local demo app
│   └── MuiMultiDateRangePickerPro/  # Pro version
│       ├── lib/                      # Source code
│       ├── dist/                     # Built ESM + CJS + types
│       └── examples/demo/            # Local demo app
└── examples/                         # Root-level demos
    ├── esm/                          # Vite demo (pulls from NPM)
    └── cjs/                          # Webpack demo (pulls from NPM)
```

**Package Features:**
- ✅ Tree-shakeable exports (ESM + CJS)
- ✅ Full TypeScript support with declarations
- ✅ Peer dependencies (no duplicate MUI/React)
- ✅ Zero side effects for optimal bundling
- ✅ Separate demo apps (not included in published package)

## 💬 Questions?

Feel free to open an issue for any questions or concerns!

