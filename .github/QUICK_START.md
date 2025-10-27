# Quick Start Guide - CI/CD Setup

This guide will help you set up automated releases for your MUI Date Picker packages in under 10 minutes.

## ✅ Prerequisites Checklist

Before starting, ensure you have:

- [ ] GitHub repository with admin access
- [ ] NPM account (create at https://www.npmjs.com if needed)
- [ ] Two packages ready to publish:
  - `@spacedevin/react-mui-multi-range-picker`
  - `@spacedevin/react-mui-pro-multi-range-picker`

## 🚀 Setup Steps

### Step 1: Create NPM Token (2 minutes)

1. Go to https://www.npmjs.com/settings/[your-username]/tokens
2. Click "Generate New Token" → "Automation"
3. Name it: `mui-date-dragger-github-actions`
4. **Copy the token** (starts with `npm_`)

### Step 2: Add Token to GitHub (1 minute)

**Option A: GitHub Web UI**
1. Go to your repo → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Name: `NPM_TOKEN`
4. Value: Paste your NPM token
5. Click "Add secret"

**Option B: GitHub CLI**
```bash
gh secret set NPM_TOKEN
# Paste token when prompted
```

### Step 3: Verify Package Configuration (2 minutes)

Check both package.json files have correct settings:

```json
{
  "name": "@spacedevin/react-mui-multi-range-picker",
  "version": "0.1.0",
  "repository": {
    "type": "git",
    "url": "https://github.com/spacedevin/react-mui-multi-range-picker.git",
    "directory": "packages/MuiMultiDateRangePicker"
  },
  "publishConfig": {
    "access": "public"
  }
}
```

**Update if needed:**
- ✅ Correct package names
- ✅ Correct repository URL
- ✅ `publishConfig.access: "public"`

### Step 4: Test Locally (3 minutes)

```bash
# Build both packages
cd packages/MuiMultiDateRangePicker
npm install
npm run build

cd ../MuiMultiDateRangePickerPro
npm install
npm run build

# Verify builds succeeded
ls -la dist/
```

### Step 5: First Release (2 minutes)

**Option A: Merge a PR (Recommended)**
```bash
# Create a feature branch
git checkout -b feat/initial-release

# Make a small change (or use existing changes)
echo "Initial release" >> README.md

# Commit with conventional format
git add .
git commit -m "feat(picker): initial release

Add multi-range date picker components for MUI"

# Push and create PR
git push origin feat/initial-release
gh pr create --title "feat(picker): Initial release" --fill

# Merge the PR
gh pr merge --squash
```

**Option B: Manual Workflow**
1. Go to Actions tab in GitHub
2. Select "Release" workflow
3. Click "Run workflow"
4. Select "both" packages, "auto" bump
5. Click "Run workflow"

### Step 6: Verify Release (1 minute)

1. **Check GitHub Actions**
   - Go to Actions tab
   - Watch "Release" workflow complete (2-3 minutes)

2. **Verify on NPM**
   - Free: https://www.npmjs.com/package/@spacedevin/react-mui-multi-range-picker
   - Pro: https://www.npmjs.com/package/@spacedevin/react-mui-pro-multi-range-picker

3. **Check GitHub Releases**
   - Go to Releases page
   - Should see new releases with tags

## ✅ You're Done!

Your automated release system is now active! 🎉

## 🎓 Next Steps

### Using Conventional Commits

From now on, use this format for all commits:

```bash
# Feature (minor version bump)
git commit -m "feat(free): add custom formatter"

# Bug fix (patch version bump)
git commit -m "fix(pro): resolve chip issue"

# Breaking change (major version bump)
git commit -m "feat(picker)!: redesign API"
```

### How Releases Work

1. **You**: Push commits with conventional format
2. **GitHub Actions**: Automatically detects changes
3. **GitHub Actions**: Calculates version bump
4. **GitHub Actions**: Builds, tests, publishes to NPM
5. **GitHub Actions**: Creates GitHub release and tags

**No manual intervention needed!**

## 📚 Learn More

- **[Release Strategy](./.github/RELEASE_STRATEGY.md)** - Complete documentation
- **[Contributing Guide](./.github/CONTRIBUTING.md)** - Commit guidelines
- **[NPM Setup](./.github/NPM_SETUP.md)** - Detailed token setup
- **[Package Structure](../PACKAGE_STRUCTURE.md)** - Development guide

## 🐛 Troubleshooting

### Release didn't trigger
- ✅ Check commit message format (must be conventional)
- ✅ Verify changes are in `packages/` directory
- ✅ Ensure pushed to `main` branch

### NPM publish failed
- ✅ Verify NPM_TOKEN is correct
- ✅ Check token has publish permissions
- ✅ Ensure package names are available

### Build failed
- ✅ Test build locally: `npm run build`
- ✅ Check GitHub Actions logs for errors
- ✅ Fix TypeScript errors

## 🆘 Get Help

- Check [Release Strategy](./.github/RELEASE_STRATEGY.md) for detailed docs
- Review [GitHub Actions logs](../../actions)
- Open an issue with the `ci/cd` label

## 📋 Quick Reference

### Essential Commands
```bash
# Conventional commit types
feat:   # New feature (0.x.0)
fix:    # Bug fix (0.0.x)
feat!:  # Breaking change (x.0.0)

# Useful commands
npm run build          # Build package
npm publish --dry-run  # Test publish
gh pr create           # Create PR
gh pr merge            # Merge PR
```

### Package Names
- Free: `@spacedevin/react-mui-multi-range-picker`
- Pro: `@spacedevin/react-mui-pro-multi-range-picker`

### GitHub Workflows
- **Release** - Automatic releases on push to main
- **CI** - Build and test on PRs
- **PR Validation** - Validate PR titles and commits
- **Dependency Updates** - Weekly dependency checks

---

**Total Setup Time**: ~10 minutes
**Maintenance**: Zero - fully automated! 🚀

