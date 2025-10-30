# MUI Multi-Range Date Picker

🚧 Initial

A monorepo containing React date picker components that allow selecting multiple non-contiguous date ranges with click-and-drag support. Built on top of Material-UI's date picker components with full theme integration.

## 📦 Packages

### [MuiMultiDateRangePicker](./packages/MuiMultiDateRangePicker) (Free)

[![npm version](https://img.shields.io/npm/v/@spacedevin/react-mui-multi-range-picker.svg)](https://www.npmjs.com/package/@spacedevin/react-mui-multi-range-picker)
[![npm downloads](https://img.shields.io/npm/dm/@spacedevin/react-mui-multi-range-picker.svg)](https://www.npmjs.com/package/@spacedevin/react-mui-multi-range-picker)

A free multi-range date picker built on `@mui/x-date-pickers`.

**Features:**
- ✅ Multi-range selection with drag support
- ✅ Simple calendar-only interface
- ✅ No commercial license required
- ✅ Perfect for basic multi-range needs

**Links:**
- 📦 [NPM Package](https://www.npmjs.com/package/@spacedevin/react-mui-multi-range-picker)
- 📖 [Documentation](./packages/MuiMultiDateRangePicker/README.md)

### [MuiMultiDateRangePickerPro](./packages/MuiMultiDateRangePickerPro) (Pro)

[![npm version](https://img.shields.io/npm/v/@spacedevin/react-mui-pro-multi-range-picker.svg)](https://www.npmjs.com/package/@spacedevin/react-mui-pro-multi-range-picker)
[![npm downloads](https://img.shields.io/npm/dm/@spacedevin/react-mui-pro-multi-range-picker.svg)](https://www.npmjs.com/package/@spacedevin/react-mui-pro-multi-range-picker)

An enhanced version built on `@mui/x-date-pickers-pro` with professional UI features.

**Features:**
- ✅ All features from the free version
- ✅ Text input field for manual date entry
- ✅ Visual chip-based range management
- ✅ Delete ranges with chip close buttons
- ⚠️ Requires MUI X Pro license for production

**Links:**
- 📦 [NPM Package](https://www.npmjs.com/package/@spacedevin/react-mui-pro-multi-range-picker)
- 📖 [Documentation](./packages/MuiMultiDateRangePickerPro/README.md)

## 🚀 Quick Start

### Installation

```bash
# Free version
npm install @spacedevin/react-mui-multi-range-picker

# Pro version (requires MUI X Pro license)
npm install @spacedevin/react-mui-pro-multi-range-picker
```

### Usage

```typescript
import React, { useState } from 'react';
import { MultiRangeDatePicker } from '@spacedevin/react-mui-multi-range-picker';
import type { DateRange } from '@spacedevin/react-mui-multi-range-picker';

function App() {
  const [ranges, setRanges] = useState<DateRange[]>([]);

  return (
    <MultiRangeDatePicker
      onChange={setRanges}
      mergeRanges={false}
    />
  );
}
```

### Running Demos Locally

```bash
# Free version demo
cd packages/MuiMultiDateRangePicker
bun install
bun run dev

# Pro version demo
cd packages/MuiMultiDateRangePickerPro
bun install
bun run dev

# Root-level demos (pull from NPM)
cd examples/esm  # Vite + ESM
bun install && bun run dev

cd examples/cjs  # Webpack + CJS
bun install && bun run dev
```

**Live Demos:** [View on GitHub Pages](https://spacedevin.github.io/mui-date-dragger/)

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

## ✨ Key Features

### Multi-Range Selection
Select multiple separate date ranges on a single calendar - perfect for vacation booking, availability calendars, or any scenario requiring non-contiguous date selection.

### Click & Drag Support
Intuitive drag-to-select interaction works seamlessly on both desktop (mouse) and mobile (touch) devices.

### Range Management
- **Add ranges**: Click/drag or use text input (Pro)
- **Remove ranges**: Drag over existing ranges or use chip close buttons (Pro)
- **Auto-merge**: Optional automatic merging of adjacent/overlapping ranges

### MUI Integration
Built as extensions of MUI's date picker components, maintaining full compatibility with:
- Theme system (light/dark mode)
- Localization
- Accessibility features
- Responsive design

## 🎯 Use Cases

- **Booking Systems**: Multi-night hotel or rental reservations
- **Availability Calendars**: Mark multiple unavailable date ranges
- **Event Planning**: Select multiple event or blackout dates
- **Project Management**: Highlight multiple milestone or sprint periods
- **Time Off Requests**: Select multiple vacation periods

## 🔧 Technology Stack

- **React** 19+ with TypeScript
- **Material-UI** 7+ (`@mui/material`)
- **MUI X Date Pickers** 8+ (`@mui/x-date-pickers`)
- **MUI X Date Pickers Pro** 8+ (`@mui/x-date-pickers-pro`) - Pro version only
- **date-fns** 4+ for date manipulation
- **Emotion** for styling

## 📋 Comparison

| Feature | Free | Pro |
|---------|------|-----|
| Multi-range selection | ✅ | ✅ |
| Drag to select | ✅ | ✅ |
| Calendar view | ✅ | ✅ |
| Theme support | ✅ | ✅ |
| Touch support | ✅ | ✅ |
| Auto-merge ranges | ✅ | ✅ |
| Text input field | ❌ | ✅ |
| Range chips UI | ❌ | ✅ |
| Click to delete chips | ❌ | ✅ |
| License required | ❌ Free | ⚠️ MUI X Pro |

## 🤝 Contributing

This is a monorepo project. Each package is self-contained with its own dependencies and build configuration.

### Development Setup

**Prerequisites:**
- [Bun](https://bun.sh) - Fast all-in-one JavaScript runtime
- Node.js 20+ (for npm publish only)

**Install Bun:**
```bash
# macOS/Linux
curl -fsSL https://bun.sh/install | bash

# Windows
powershell -c "irm bun.sh/install.ps1 | iex"
```

**Setup Project:**
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

**Why Bun?**
- ⚡ 10-20x faster installs than npm
- 🧪 Built-in test runner (no Jest/Vitest needed)
- 📦 Better dependency resolution
- 🔒 Binary lockfiles (fewer merge conflicts)

**Troubleshooting:**

If you encounter errors:
```bash
# Clean install
rm -rf node_modules bun.lock
bun install

# If you accidentally used npm
rm -rf node_modules package-lock.json
bun install
```

### Commit Conventions

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

### Release Process

**Automatic (Recommended):**
1. Create PR with conventional commit title
2. Merge to `main` branch
3. GitHub Actions automatically:
   - Runs all tests (93 tests)
   - Builds packages
   - Publishes to NPM
   - Creates GitHub release
   - Deploys demos to GitHub Pages

**Manual Release:**
```bash
# Via GitHub Actions
# Go to: Actions → Main → Run workflow
# - Select package (free/pro)
# - Enter version (e.g., 0.2.0)
```

### CI/CD Setup

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

### Workflows

**`.github/workflows/pr.yml` - Pull Request Checks**
Runs on every PR:
- Validates conventional commit title
- Runs all 93 tests with coverage
- Builds both packages (ESM + CJS + types)
- Type checks with TypeScript
- Dry-run npm publish
- Uploads coverage to Codecov

**`.github/workflows/main.yml` - Release & Deploy**
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

### Test Coverage

**Current Stats:**
- ✅ **93 total tests** (49 Free + 44 Pro)
- ✅ **~79% average coverage** (84% Free, 74% Pro)
- ✅ **All tests passing**
- ✅ Tracked via [Codecov](https://codecov.io)

**Coverage by Package:**
- Free: `lib/MultiRangeDatePicker.tsx`, `lib/types.ts`, `lib/index.ts`
- Pro: Same files + additional Pro features

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

### CI/CD Integration

Tests automatically run on:
- ✅ Every pull request
- ✅ Every push to main (before release)
- ✅ Coverage uploaded to Codecov

**Codecov Setup:**
```yaml
# .github/workflows/pr.yml
- run: bun test --coverage --coverage-reporter=lcov
- uses: codecov/codecov-action@v5
  with:
    token: ${{ secrets.CODECOV_TOKEN }}
```

## 📄 License

PIF (Note: Pro version requires MUI X Pro license for production use)

## 🔗 Links

- [MUI Documentation](https://mui.com/)
- [MUI X Date Pickers](https://mui.com/x/react-date-pickers/)
- [MUI X Pricing](https://mui.com/x/introduction/licensing/)
