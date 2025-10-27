# Contributing to MUI Multi-Range Date Picker

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to this project.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Release Process](#release-process)

## Code of Conduct

This project follows a standard code of conduct. Be respectful, inclusive, and constructive in all interactions.

## Getting Started

### Prerequisites

- **Node.js** 18+ (20+ recommended)
- **npm** 9+
- **Git**

### Initial Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/mui-date-dragger.git
cd mui-date-dragger

# Install dependencies for a package
cd packages/MuiMultiDateRangePicker
npm install

# Build the package
npm run build

# Run the demo
npm run dev
```

### Repository Structure

```
packages/
  MuiMultiDateRangePicker/    # Free version
    lib/                       # Source code
    examples/demo/             # Demo app
  MuiMultiDateRangePickerPro/ # Pro version
    lib/                       # Source code
    examples/demo/             # Demo app
```

## Development Workflow

### 1. Create a Branch

```bash
# Feature branch
git checkout -b feat/add-feature-name

# Bug fix branch
git checkout -b fix/resolve-issue-name

# Documentation branch
git checkout -b docs/update-readme
```

### 2. Make Changes

- Edit files in `packages/*/lib/` for library code
- Edit files in `packages/*/examples/demo/` for demo changes
- Follow existing code style and conventions

### 3. Test Your Changes

```bash
# Build the package
npm run build

# Run the demo to test visually
npm run dev

# Build the demo
npm run demo:build
```

### 4. Commit Your Changes

**IMPORTANT**: This project uses [Conventional Commits](https://www.conventionalcommits.org/) for automated versioning and releases.

## Commit Guidelines

### Commit Message Format

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

### Types

| Type | Description | Version Bump |
|------|-------------|--------------|
| `feat` | New feature | Minor (0.x.0) |
| `fix` | Bug fix | Patch (0.0.x) |
| `perf` | Performance improvement | Patch (0.0.x) |
| `docs` | Documentation only | None |
| `style` | Formatting, missing semicolons, etc. | None |
| `refactor` | Code refactoring | None |
| `test` | Adding tests | None |
| `build` | Build system or dependencies | None |
| `ci` | CI configuration | None |
| `chore` | Other changes | None |
| `revert` | Revert previous commit | None |

### Scopes

- `free` - Free package specific
- `pro` - Pro package specific
- `picker` - Both packages / shared functionality
- `deps` - Dependency updates
- `build` - Build system changes
- `ci` - CI/CD changes

### Examples

#### Feature (Minor Version Bump)
```bash
git commit -m "feat(free): add custom date formatter option"
git commit -m "feat(pro): add chip customization callback"
git commit -m "feat(picker): support keyboard navigation"
```

#### Bug Fix (Patch Version Bump)
```bash
git commit -m "fix(free): prevent duplicate range creation"
git commit -m "fix(pro): resolve chip rendering issue in dark mode"
git commit -m "fix(picker): handle invalid date input gracefully"
```

#### Breaking Change (Major Version Bump)
```bash
# Method 1: Using footer
git commit -m "feat(picker): redesign onChange API

BREAKING CHANGE: onChange now returns DateRange[] instead of Range[]
Migration: Update your onChange handler to use the new DateRange type"

# Method 2: Using ! suffix
git commit -m "feat(picker)!: redesign onChange API"
```

#### Documentation (No Version Bump)
```bash
git commit -m "docs: update installation instructions"
git commit -m "docs(free): add usage examples to README"
```

#### Chores (No Version Bump)
```bash
git commit -m "chore(deps): update Material-UI to v7.4.0"
git commit -m "chore(build): improve TypeScript configuration"
```

### Multi-line Commits

For more detailed commits:

```bash
git commit -m "feat(pro): add range validation callback

Add onValidateRange prop that allows custom validation logic.
Returns error message string or null if valid.

Closes #123"
```

### Commit Tips

1. **Write clear, descriptive subjects** (50 chars or less)
2. **Use imperative mood**: "add feature" not "added feature"
3. **Reference issues**: Use "Closes #123" in commit body
4. **One logical change per commit**
5. **Use the body to explain WHY, not WHAT** (code shows what)

## Pull Request Process

### 1. Create Pull Request

```bash
# Push your branch
git push origin feat/add-feature-name

# Create PR via GitHub UI or CLI
gh pr create --title "feat(picker): add feature name" --body "Description"
```

### 2. PR Title Format

PR titles should also follow Conventional Commits:

```
feat(picker): Add drag threshold option
fix(pro): Resolve chip rendering issue
docs: Update README installation section
```

### 3. PR Description

Use the provided PR template to:
- Describe your changes
- Check relevant boxes
- Link related issues
- Note breaking changes

### 4. Automated Checks

Your PR will be automatically checked for:
- ✅ Commit message format
- ✅ Build success
- ✅ Type checking
- ✅ Release impact preview

### 5. Review Process

- Address reviewer feedback
- Keep commits conventional
- Squash if requested
- Ensure all checks pass

### 6. Merge

Once approved, maintainers will merge your PR. **Automated releases will handle versioning and publishing.**

## Release Process

### Automated Releases (Default)

Releases are **fully automated** when PRs are merged to `main`:

1. ✅ GitHub Actions detects changes
2. ✅ Analyzes conventional commits
3. ✅ Calculates new version (major/minor/patch)
4. ✅ Builds packages
5. ✅ Publishes to NPM
6. ✅ Creates GitHub releases
7. ✅ Tags repository

**You don't need to do anything!** Just follow conventional commits.

### What Gets Released

- **Package changes**: Only packages with actual file changes are released
- **Independent versions**: Free and Pro packages have independent version numbers
- **Automatic changelog**: Generated from commit messages

### Version Calculation

```
fix: ... → 0.1.0 → 0.1.1 (patch)
feat: ... → 0.1.0 → 0.2.0 (minor)
feat!: ... → 0.1.0 → 1.0.0 (major)
```

### Manual Releases

Maintainers can trigger manual releases via GitHub Actions if needed.

## Development Tips

### Package-Specific Work

```bash
# Work on free package
cd packages/MuiMultiDateRangePicker
npm run dev

# Work on pro package
cd packages/MuiMultiDateRangePickerPro
npm run dev
```

### Testing Both Packages

```bash
# Terminal 1 - Free version
cd packages/MuiMultiDateRangePicker
npm run dev

# Terminal 2 - Pro version
cd packages/MuiMultiDateRangePickerPro
npm run dev
```

### Using Local Package in Another Project

```bash
# In package directory
cd packages/MuiMultiDateRangePicker
npm link

# In your test project
npm link @spacedevin/react-mui-multi-range-picker
```

### Common Issues

#### Demo not reflecting changes
```bash
# Re-sync library code to demo
npm run demo:sync
```

#### Type errors
```bash
# Rebuild types
npm run build:types
```

#### Stale build
```bash
# Clean and rebuild
npm run clean
npm run build
```

## Questions?

- 📖 Read the [Release Strategy](./.github/RELEASE_STRATEGY.md)
- 📦 Check [Package Structure](../PACKAGE_STRUCTURE.md)
- 🐛 Open an issue for bugs
- 💬 Start a discussion for questions

## Quick Reference

### Essential Commands
```bash
npm run build          # Build package
npm run dev            # Run demo with auto-sync
npm run demo:sync      # Sync lib to demo manually
npm run clean          # Clean build artifacts
```

### Essential Commit Types
```bash
feat:      # New feature (minor version)
fix:       # Bug fix (patch version)
feat!:     # Breaking change (major version)
docs:      # Documentation (no release)
chore:     # Maintenance (no release)
```

### Example Workflow
```bash
# 1. Create branch
git checkout -b feat/my-feature

# 2. Make changes
# Edit packages/MuiMultiDateRangePicker/lib/MultiRangeDatePicker.tsx

# 3. Test
cd packages/MuiMultiDateRangePicker
npm run build
npm run dev

# 4. Commit (conventional format)
git add .
git commit -m "feat(free): add my awesome feature"

# 5. Push and create PR
git push origin feat/my-feature
gh pr create

# 6. Merge (maintainer)
# → Automatic release happens! 🎉
```

---

Thank you for contributing! 🚀

