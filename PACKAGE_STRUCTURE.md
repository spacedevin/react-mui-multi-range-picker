# Package Structure & Development Guide

## 📁 New Package Structure

The monorepo has been refactored into publishable npm packages with tree-shakeable exports:

```
packages/
  MuiMultiDateRangePicker/
    lib/                          # 📦 Library source code (published)
      MultiRangeDatePicker.tsx    # Component implementation
      types.ts                    # TypeScript type definitions
      index.ts                    # Main export entry point
    examples/
      demo/                       # 🎨 Demo app (NOT published)
        src/
          App.tsx                 # Demo application
          index.tsx               # Demo entry point
        public/                   # Static assets
        package.json              # Demo dependencies
        tsconfig.json             # Demo TS config
    dist/                         # 🏗️ Build output (gitignored, published)
      index.js                    # CommonJS bundle
      index.mjs                   # ES Module bundle
      index.d.ts                  # TypeScript declarations
    package.json                  # Library package config
    tsconfig.json                 # Base TypeScript config
    tsconfig.build.json           # Library build config
    .gitignore                    # Ignore dist, node_modules
    README.md                     # Package documentation
```

## 🎯 Key Improvements

### 1. **Tree-Shakeable Exports**
```json
{
  "exports": {
    ".": {
      "import": "./dist/index.mjs",   // ESM for modern bundlers
      "require": "./dist/index.js",   // CJS for older tools
      "types": "./dist/index.d.ts"    // TypeScript declarations
    }
  },
  "sideEffects": false                // Enables tree-shaking
}
```

### 2. **Peer Dependencies**
All MUI and React dependencies are now peer dependencies, meaning:
- ✅ Smaller bundle size (no duplicate dependencies)
- ✅ Users control versions
- ✅ Better compatibility with existing projects

### 3. **Separate Demo Apps**
Demo code is isolated in `examples/demo/` and NOT included in published packages:
- ✅ Cleaner npm package
- ✅ Faster installs
- ✅ Examples available in GitHub repo

## 🔨 Development Workflow

### Building the Library

```bash
cd packages/MuiMultiDateRangePicker

# Build all formats (ESM + CJS + Types)
npm run build

# Clean build artifacts
npm run clean

# Build before publishing (automatic)
npm run prepublishOnly
```

### Running the Demo

```bash
cd packages/MuiMultiDateRangePicker

# Option 1: Use convenience script (auto-syncs)
npm run dev

# Option 2: Manual sync + run
npm run demo:sync
cd examples/demo
npm start
```

**Note**: The demo automatically syncs the library code from `lib/` to `examples/demo/src/lib/` before starting. This is necessary because Create React App doesn't allow imports outside the `src/` directory.

### Installing Demo Dependencies

```bash
cd packages/MuiMultiDateRangePicker

# Install demo dependencies from root
npm run demo:install
```

## 📦 Using the Packages

### Installation

```bash
# Free version
npm install @mui-date-dragger/multi-range-picker

# Pro version
npm install @mui-date-dragger/multi-range-picker-pro
```

### Importing (Tree-Shakeable)

```typescript
// Named import (recommended for tree-shaking)
import { MultiRangeDatePicker } from '@mui-date-dragger/multi-range-picker';
import type { DateRange, MultiRangeDatePickerProps } from '@mui-date-dragger/multi-range-picker';

// Or default import
import MultiRangeDatePicker from '@mui-date-dragger/multi-range-picker';
```

### Usage Example

```typescript
import React, { useState } from 'react';
import { MultiRangeDatePicker } from '@mui-date-dragger/multi-range-picker';
import type { DateRange } from '@mui-date-dragger/multi-range-picker';

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

## 🏗️ Build Output

The build process generates three files in `dist/`:

1. **`index.mjs`** - ES Module (for modern bundlers with tree-shaking)
2. **`index.js`** - CommonJS (for older Node.js and tools)
3. **`index.d.ts`** - TypeScript type declarations

Modern bundlers (Webpack 5+, Vite, Rollup) will automatically use the ESM version and tree-shake unused code.

## 📝 Publishing Checklist

Before publishing to npm:

1. ✅ Update version in `package.json`
2. ✅ Run `npm run build` to ensure it compiles
3. ✅ Test in a separate project: `npm link`
4. ✅ Update `CHANGELOG.md` (if you have one)
5. ✅ Commit all changes
6. ✅ Run `npm publish` (build runs automatically via `prepublishOnly`)

## 🔍 What Gets Published

Only these files/folders are included in the npm package:

- `dist/` - Compiled JavaScript and TypeScript declarations
- `lib/` - Source code (for source maps and debugging)
- `README.md` - Documentation
- `package.json` - Package metadata

**NOT included:**
- `examples/` - Demo apps
- `node_modules/` - Dependencies
- `src/` - Old source location (removed)
- `*.log` - Log files

## 🎨 Demo App Details

Each package has its own demo app in `examples/demo/`:

- **Separate `package.json`**: Demo has its own dependencies
- **Separate `tsconfig.json`**: Demo uses `jsx: react-jsx`
- **Synced library source**: `lib/` is copied to `examples/demo/src/lib/` during development
- **Create React App restriction**: CRA doesn't allow imports outside `src/`, so we sync the library code
- **Auto-sync on dev**: Running `npm run dev` automatically syncs before starting
- **Can be run independently**: `cd examples/demo && npm start` (after syncing)

### Why Sync Instead of Direct Import?

Create React App (CRA) has a security restriction that prevents importing files outside the `src/` directory. To work around this:

1. The library source (`lib/`) is copied to `examples/demo/src/lib/`
2. Demo imports from `./lib` (inside src/)
3. The `demo:sync` script handles the copying
4. `examples/demo/src/lib/` is gitignored (it's generated)

**Important**: When you modify `lib/` files, run `npm run demo:sync` or restart `npm run dev` to see changes in the demo.

## 🚀 Migration from Old Structure

If you were importing from the old structure:

```typescript
// ❌ Old (won't work anymore)
import MultiRangeDatePicker from './components/MultiRangeDatePicker';

// ✅ New (from published package)
import { MultiRangeDatePicker } from '@mui-date-dragger/multi-range-picker';

// ✅ New (in demo apps - synced to src/)
import { MultiRangeDatePicker } from './lib';
```

## 📚 Additional Resources

- [TypeScript Module Resolution](https://www.typescriptlang.org/docs/handbook/module-resolution.html)
- [Package.json Exports Field](https://nodejs.org/api/packages.html#exports)
- [Tree Shaking](https://webpack.js.org/guides/tree-shaking/)
