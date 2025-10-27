# CI/CD

## Workflows

**`pr.yml`** - Validates PR title, builds & type checks packages
**`main.yml`** - Builds, releases changed packages to NPM

## Setup

1. **Create NPM token** (Automation type)
   - https://www.npmjs.com/settings/[username]/tokens

2. **Add to GitHub**
   ```bash
   gh secret set NPM_TOKEN
   ```

3. **Test locally**
   ```bash
   cd packages/MuiMultiDateRangePicker
   npm run test:release
   # Shows what would be published without actually publishing
   ```

## Usage

```bash
# Create PR with conventional title
gh pr create --title "feat: add feature"

# Merge to main
gh pr merge --squash

# Auto-releases if packages changed
```

## Manual Release

Actions → Main → Run workflow
- Select package (free/pro)
- Enter version (e.g., `0.2.0`)

## Commit Types

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `chore:` - Maintenance
- `ci:` - CI/CD changes

Title must be lowercase: `feat: add thing` ✅ not `feat: Add thing` ❌

## How It Works

Push to main → Check if packages changed → Parse commit for version bump → Build → Publish to NPM → Tag → GitHub release

**Version Bumps** (from commit message):
- `feat:` → minor (0.x.0)
- `feat!:` or `BREAKING CHANGE:` → major (x.0.0)
- `fix:`, `chore:`, `docs:` → patch (0.0.x)

Manual: specify any version
