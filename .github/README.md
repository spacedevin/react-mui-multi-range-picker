# GitHub Actions

**2 workflows. That's it.**

## 📄 Files

### `pr.yml` - Pull Request Validation
**Trigger**: Pull requests to main

**Does**:
1. Validates PR title (conventional commits format)
2. Builds both packages
3. Runs TypeScript type check

**Format**: `type: lowercase description`

Examples:
- ✅ `feat: add new feature`
- ✅ `fix(free): resolve bug`
- ❌ `feat: Add new feature` (uppercase)

### `main.yml` - Build & Release
**Trigger**: Push to main

**Does**:
1. Builds both packages
2. Type checks
3. Releases changed packages:
   - Checks if package changed since last tag
   - Auto-bumps patch version (0.1.0 → 0.1.1)
   - Publishes to NPM
   - Creates git tag
   - Creates GitHub release

**Manual Release**: Actions → Main → Run workflow
- Select package (free/pro)
- Enter version (e.g., `0.2.0`)

## 🚀 Setup

### 1. NPM Token
```bash
# Create at: https://www.npmjs.com/settings/[username]/tokens
# Type: Automation

gh secret set NPM_TOKEN
```

### 2. Package Config
Both `package.json` need:
```json
{
  "publishConfig": {
    "access": "public"
  }
}
```

### 3. Use It
```bash
# Make changes
git checkout -b my-changes

# Commit however you want
git commit -m "stuff"

# PR with conventional title
gh pr create --title "feat: add feature"

# Merge
gh pr merge --squash

# Releases automatically!
```

## 📊 How It Works

```
Push to main
    ↓
Build & test packages
    ↓
Check if changed since last tag
    ↓ (yes)
Bump patch version
    ↓
npm ci
    ↓
npm run build
    ↓
npm publish
    ↓
git tag
    ↓
GitHub release
    ↓
Done! (~3 min)
```

## 🐛 Troubleshooting

**Release didn't run?**
- Check if files in `packages/` changed
- Verify pushed to `main` branch

**NPM publish failed?**
```bash
# Recreate NPM token
gh secret set NPM_TOKEN
```

**Build failed?**
```bash
# Test locally
cd packages/MuiMultiDateRangePicker
npm ci && npm run build
```

**Wrong version?**
```bash
# Manual release with correct version
# Actions → Main → Run workflow → Enter version
```

## 💡 Tips

- **Squash merge PRs** - Keeps history clean
- **Test locally** - `npm run build` before pushing
- **Manual releases** - Use workflow dispatch for specific versions
- **Version strategy**: Auto-bump patch, manual for minor/major

---

**Simple. Works. Done.** 🎯
