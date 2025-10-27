# Release Strategy & CI/CD

## 🎯 Overview

This monorepo uses automated semantic versioning and NPM publishing through GitHub Actions. Both packages are versioned and released independently based on conventional commits.

## 📦 Packages

1. **@spacedevin/react-mui-multi-range-picker** - Free version
2. **@spacedevin/react-mui-pro-multi-range-picker** - Pro version

## 🔄 Workflow Strategy

### 1. Automated Release Workflow
**Trigger**: Push to `main` branch (including merged PRs)
**File**: `.github/workflows/release.yml`

**Process**:
1. **Change Detection**: Detect which packages have changes since last release
2. **Version Calculation**: Parse conventional commits to determine version bump (major/minor/patch)
3. **Build**: Compile TypeScript, generate ESM/CJS bundles
4. **Test**: Run tests (if configured)
5. **Version Update**: Update package.json versions
6. **Publish**: Deploy to NPM registry
7. **Tag & Release**: Create Git tags and GitHub releases
8. **Commit**: Push version updates back to main

### 2. Manual Release Workflow
**Trigger**: Manual dispatch from GitHub Actions UI
**File**: `.github/workflows/manual-release.yml`

**Purpose**: Override automation for specific releases or rollbacks

## 📝 Conventional Commits

### Commit Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types & Version Bumps

| Type | Version Bump | Example |
|------|--------------|---------|
| `feat` | **MINOR** (0.x.0) | `feat(picker): add drag threshold option` |
| `fix` | **PATCH** (0.0.x) | `fix(picker): resolve date range overlap` |
| `perf` | **PATCH** | `perf(picker): optimize range calculation` |
| `BREAKING CHANGE` | **MAJOR** (x.0.0) | See below |

### Breaking Changes
```bash
# In footer
feat(picker): redesign API

BREAKING CHANGE: onChange now returns DateRange[] instead of Range[]

# Or with ! suffix
feat(picker)!: redesign API
```

### Scopes (Optional)
- `picker` - Core picker component changes
- `free` - Free version specific (MuiMultiDateRangePicker)
- `pro` - Pro version specific (MuiMultiDateRangePickerPro)
- `deps` - Dependency updates
- `build` - Build/tooling changes

### Examples
```bash
# Patch release (0.1.0 → 0.1.1)
fix(picker): prevent duplicate range creation
docs(readme): update installation instructions

# Minor release (0.1.0 → 0.2.0)
feat(pro): add custom chip renderer
feat(picker): support keyboard navigation

# Major release (0.1.0 → 1.0.0)
feat(picker)!: redesign component API

BREAKING CHANGE: Removed deprecated mergeOverlapping prop
```

## 🔐 Required GitHub Secrets

Configure in **Settings → Secrets and variables → Actions**:

1. **`NPM_TOKEN`** (Required)
   - Type: Automation token (recommended) or Publish token
   - Create at: https://www.npmjs.com/settings/[username]/tokens
   - Scope: Publish access for both packages

2. **`GITHUB_TOKEN`** (Automatic)
   - Auto-provided by GitHub Actions
   - Used for: Creating releases, pushing tags

## 🎛️ Configuration

### Package Detection
Packages are detected based on changes in:
```
packages/MuiMultiDateRangePicker/**
packages/MuiMultiDateRangePickerPro/**
```

A package is released only if:
- Files in its directory changed since last tag
- Commits contain relevant conventional commit types

### Independent Versioning
Each package maintains its own version:
- **Free version**: Can be at 0.1.0 while Pro is at 0.3.5
- **Pro version**: Can be at 1.0.0 while Free is at 0.5.2

### Git Tags Format
```
@spacedevin/react-mui-multi-range-picker@0.1.2
@spacedevin/react-mui-pro-multi-range-picker@0.1.2
```

## 🚀 Release Process

### Automatic Release (Recommended)
```bash
# 1. Make changes with conventional commits
git checkout -b feature/new-feature
# Edit files in packages/MuiMultiDateRangePicker/

git add .
git commit -m "feat(free): add custom date formatter"

# 2. Create PR and merge to main
gh pr create --title "Add custom date formatter"
gh pr merge

# 3. GitHub Actions automatically:
#    - Detects changes in MuiMultiDateRangePicker
#    - Calculates new version (minor bump)
#    - Builds, tests, publishes to NPM
#    - Creates GitHub release
#    - Tags: @spacedevin/react-mui-multi-range-picker@0.2.0
```

### Manual Release
```bash
# 1. Go to GitHub Actions tab
# 2. Select "Manual Release" workflow
# 3. Click "Run workflow"
# 4. Select:
#    - Package: free, pro, or both
#    - Version bump: major, minor, patch, or specific version
# 5. Click "Run workflow"
```

### Local Development (No Release)
```bash
# Feature branches and non-conventional commits won't trigger releases
git checkout -b chore/update-docs
git commit -m "update README"  # Not a feat/fix, no release
```

## 📋 Release Checklist

### Before First Release
- [ ] Configure NPM_TOKEN in GitHub Secrets
- [ ] Update package.json repository URLs
- [ ] Update package.json author information
- [ ] Verify package names are available on NPM
- [ ] Test build process locally: `npm run build`
- [ ] Review LICENSE files (PIF for free, MIT for pro)

### For Each Release
- ✅ **Automated** - GitHub Actions handles everything:
  - Version bump calculation
  - package.json updates
  - Build process
  - NPM publishing
  - Git tagging
  - GitHub release creation
  - Changelog generation

### After Release
- Monitor GitHub Actions for success/failure
- Verify packages on NPM:
  - https://www.npmjs.com/package/@spacedevin/react-mui-multi-range-picker
  - https://www.npmjs.com/package/@spacedevin/react-mui-pro-multi-range-picker
- Check GitHub Releases page for created releases

## 🐛 Troubleshooting

### Release Failed - Build Error
```bash
# Fix the build locally first
cd packages/MuiMultiDateRangePicker
npm run build

# Then commit fix and push
git commit -m "fix(build): resolve TypeScript errors"
git push
```

### Release Failed - NPM Auth
- Verify NPM_TOKEN is valid: `npm token list`
- Ensure token has publish permission
- Check token hasn't expired
- Re-create token if needed and update GitHub Secret

### Wrong Version Published
```bash
# Use NPM deprecate (doesn't delete package)
npm deprecate @spacedevin/react-mui-multi-range-picker@0.1.5 "Accidentally published, use 0.1.6"

# Then trigger manual release with correct version
```

### Need to Release Both Packages with Same Version
```bash
# Commit changes that affect both packages
git commit -m "feat(picker): shared feature for both versions

This feature affects both free and pro packages"

# Or use manual release workflow with "both" option
```

## 🎓 Best Practices

1. **Commit Discipline**: Always use conventional commits
2. **Atomic Changes**: One feature/fix per commit
3. **Test Before Merge**: Ensure builds work locally
4. **Package Scope**: Use appropriate scopes (free/pro) in commits
5. **Breaking Changes**: Document thoroughly in commit body
6. **Version Strategy**: Follow semver strictly
7. **Changelog**: Auto-generated from conventional commits
8. **Dependencies**: Update peer dependencies carefully (can be breaking)

## 📚 Resources

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
- [NPM Publishing](https://docs.npmjs.com/cli/v10/commands/npm-publish)
- [GitHub Actions](https://docs.github.com/en/actions)
- [Changesets (Alternative)](https://github.com/changesets/changesets) - If current approach doesn't scale

