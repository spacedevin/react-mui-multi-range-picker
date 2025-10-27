# CI/CD Architecture

This document describes the technical architecture of the automated release system.

## 🏗️ System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         Developer                                │
│                    (Makes Commits)                               │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            │ git push
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                       GitHub Repository                          │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                   Feature Branch                          │  │
│  │  • Conventional commits                                   │  │
│  │  • Code changes in packages/                              │  │
│  └──────────────────────────────────────────────────────────┘  │
│                            │                                     │
│                            │ Pull Request                        │
│                            ▼                                     │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                  PR Validation                            │  │
│  │  • Validate PR title (conventional format)                │  │
│  │  • Validate commit messages                               │  │
│  │  • Check PR size                                          │  │
│  │  • Preview release impact                                 │  │
│  │  • Comment with release info                              │  │
│  └──────────────────────────────────────────────────────────┘  │
│                            │                                     │
│                            ▼                                     │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                   CI Workflow                             │  │
│  │  • Build both packages                                    │  │
│  │  • TypeScript type checking                               │  │
│  │  • Lint code                                              │  │
│  │  • Upload build artifacts                                 │  │
│  └──────────────────────────────────────────────────────────┘  │
│                            │                                     │
│                            │ All checks pass                     │
│                            ▼                                     │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                 Merge to Main                             │  │
│  └──────────────────────────────────────────────────────────┘  │
│                            │                                     │
│                            │ Triggers                            │
│                            ▼                                     │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Release Workflow                             │  │
│  │                                                            │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │ 1. Detect Changes                                   │  │  │
│  │  │    • Get last tag for each package                  │  │  │
│  │  │    • Check files changed since last tag             │  │  │
│  │  │    • Determine which packages need release          │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  │                      │                                     │  │
│  │                      ▼                                     │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │ 2. Analyze Commits                                  │  │  │
│  │  │    • Parse conventional commit messages             │  │  │
│  │  │    • Determine version bump type:                   │  │  │
│  │  │      - feat! or BREAKING CHANGE → major            │  │  │
│  │  │      - feat → minor                                 │  │  │
│  │  │      - fix/perf → patch                            │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  │                      │                                     │  │
│  │                      ▼                                     │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │ 3. Calculate Version                                │  │  │
│  │  │    • Read current version from package.json         │  │  │
│  │  │    • Apply semver bump                              │  │  │
│  │  │    • Generate new version number                    │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  │                      │                                     │  │
│  │                      ▼                                     │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │ 4. Update & Build                                   │  │  │
│  │  │    • Update package.json version                    │  │  │
│  │  │    • npm ci (install dependencies)                  │  │  │
│  │  │    • npm run build (compile)                        │  │  │
│  │  │    • Verify build output                            │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  │                      │                                     │  │
│  │                      ▼                                     │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │ 5. Publish to NPM                                   │  │  │
│  │  │    • Authenticate with NPM_TOKEN                    │  │  │
│  │  │    • npm publish --access public                    │  │  │
│  │  │    • Verify publication                             │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  │                      │                                     │  │
│  │                      ▼                                     │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │ 6. Create Git Tag & Release                         │  │  │
│  │  │    • Commit version update                          │  │  │
│  │  │    • Create annotated tag                           │  │  │
│  │  │    • Push tag to repository                         │  │  │
│  │  │    • Generate changelog                             │  │  │
│  │  │    • Create GitHub release                          │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┴───────────────────┐
        │                                       │
        ▼                                       ▼
┌──────────────────┐                  ┌──────────────────┐
│   NPM Registry   │                  │ GitHub Releases  │
│                  │                  │                  │
│  Published       │                  │  • Release notes │
│  packages with   │                  │  • Changelog     │
│  new versions    │                  │  • Git tags      │
└──────────────────┘                  └──────────────────┘
```

## 🔄 Workflow Details

### 1. Change Detection

**File**: `.github/workflows/release.yml` (Job: `detect-changes`)

**Process**:
1. Fetch complete git history with tags
2. Find last tag for each package:
   - Free: `@spacedevin/react-mui-multi-range-picker@x.x.x`
   - Pro: `@spacedevin/react-mui-pro-multi-range-picker@x.x.x`
3. Compare files changed since last tag
4. Determine which packages need release

**Outputs**:
- `free_changed`: boolean
- `pro_changed`: boolean
- `free_commits`: commit messages
- `pro_commits`: commit messages

### 2. Version Calculation

**Algorithm**:
```javascript
function determineVersionBump(commits) {
  if (commits.match(/BREAKING CHANGE:|!:/)) {
    return 'major';
  } else if (commits.match(/^feat(\(|:)/)) {
    return 'minor';
  } else {
    return 'patch';
  }
}

function calculateNewVersion(currentVersion, bumpType) {
  const [major, minor, patch] = currentVersion.split('.');
  
  switch (bumpType) {
    case 'major':
      return `${major + 1}.0.0`;
    case 'minor':
      return `${major}.${minor + 1}.0`;
    case 'patch':
      return `${major}.${minor}.${patch + 1}`;
  }
}
```

### 3. Parallel Package Processing

Both packages are released in parallel jobs:
- `release-free`: Handles free package
- `release-pro`: Handles pro package

**Benefits**:
- Faster releases
- Independent failures
- Parallel NPM publishing

### 4. Git Tag Format

Tags follow npm package naming convention:
```
@scope/package-name@version
```

Examples:
- `@spacedevin/react-mui-multi-range-picker@0.2.0`
- `@spacedevin/react-mui-pro-multi-range-picker@1.0.0`

**Why this format?**
- Clearly identifies which package
- Supports monorepo structure
- Compatible with npm version scheme
- Easy to query: `git tag -l "@scope/package@*"`

## 🔐 Security Architecture

### Token Management

```
┌─────────────────────────────────────────┐
│         GitHub Secrets                  │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ NPM_TOKEN                          │ │
│  │ • Type: Automation token           │ │
│  │ • Scope: Publish access            │ │
│  │ • Encrypted at rest                │ │
│  │ • Only accessible in workflows     │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ GITHUB_TOKEN                       │ │
│  │ • Auto-provided by GitHub          │ │
│  │ • Scoped to repository             │ │
│  │ • Creates releases, pushes tags    │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
                    │
                    │ Injected at runtime
                    ▼
        ┌────────────────────────┐
        │  GitHub Actions Runner │
        │  • Isolated environment│
        │  • Temporary secrets   │
        │  • Logged (redacted)   │
        └────────────────────────┘
```

### Permission Model

**Workflow permissions**:
```yaml
permissions:
  contents: write      # Push tags, commit version updates
  packages: write      # Publish packages
  pull-requests: write # Comment on PRs
```

## 📊 State Management

### Package State Tracking

State is tracked via Git tags:

```
Timeline:
  
  Commit A → Commit B → Commit C → Tag v0.1.0 → Commit D → Commit E
                                        │
                                        └─ Last Release
  
  Next Release Scope: Commit D + Commit E
```

**Query**:
```bash
# Get last tag
git tag -l "@scope/package@*" | sort -V | tail -1

# Get commits since tag
git log $LAST_TAG..HEAD --pretty=format:"%s"

# Get changed files
git diff --name-only $LAST_TAG HEAD -- packages/PackageName
```

## 🎯 Decision Trees

### Should Release Package?

```
Has package directory changed?
  ├─ No → Skip release
  └─ Yes → Check commit types
              ├─ Only docs/chore/style/test?
              │   └─ Skip release (no version bump)
              └─ Has feat/fix/perf/breaking?
                  └─ Proceed with release
```

### Which Version Bump?

```
Check commit messages:
  ├─ Contains "BREAKING CHANGE:" or "feat!"
  │   └─ MAJOR bump (x.0.0)
  ├─ Contains "feat:"
  │   └─ MINOR bump (0.x.0)
  └─ Contains "fix:" or "perf:"
      └─ PATCH bump (0.0.x)
```

## 🔍 Monitoring & Observability

### Workflow Outputs

Each workflow provides detailed logs:

```
Release Workflow:
├─ Change Detection
│  ├─ Last tags found
│  ├─ Files changed count
│  └─ Affected packages
├─ Version Calculation
│  ├─ Current version
│  ├─ Bump type
│  └─ New version
├─ Build Process
│  ├─ Dependency installation
│  ├─ TypeScript compilation
│  └─ Output verification
├─ Publication
│  ├─ NPM authentication
│  ├─ Publish result
│  └─ Package URL
└─ Release Creation
   ├─ Tag created
   ├─ Changelog generated
   └─ Release URL
```

### Failure Recovery

**Scenario**: Build succeeds, NPM publish fails

**State**:
- ✅ Code built successfully
- ❌ Not published to NPM
- ❌ No tag created
- ❌ No version updated

**Recovery**:
1. Fix NPM authentication issue
2. Re-run workflow (manual dispatch)
3. Workflow retries from beginning
4. State remains consistent

**Scenario**: NPM publish succeeds, tag creation fails

**State**:
- ✅ Published to NPM
- ❌ No tag created
- ❌ Version not committed

**Recovery**:
1. Package is on NPM (can't unpublish easily)
2. Manually create tag
3. Manually commit version update
4. Next release will work normally

## 🔧 Technical Stack

### GitHub Actions
- **Runner**: `ubuntu-latest`
- **Node.js**: v20 (defined in `.nvmrc`)
- **Checkout**: `actions/checkout@v4`
- **Node Setup**: `actions/setup-node@v4`

### Tools & Utilities
- **Git**: Version control, tagging
- **npm**: Package management, publishing
- **TypeScript**: Compilation, type checking
- **jq**: JSON parsing in bash scripts
- **GitHub CLI**: Optional for manual operations

### NPM Configuration
```json
{
  "publishConfig": {
    "access": "public",
    "registry": "https://registry.npmjs.org"
  }
}
```

## 📈 Performance Characteristics

### Typical Release Time

```
Total: ~3-5 minutes per package

Breakdown:
├─ Change Detection: ~10s
├─ Dependency Installation: ~30-60s
├─ Build Process: ~30-60s
├─ NPM Publish: ~10-20s
└─ Git Operations: ~10-20s
```

### Parallel Processing

When both packages change:
- Sequential: ~6-10 minutes
- Parallel: ~3-5 minutes
- **Improvement**: ~50% faster

## 🎓 Design Decisions

### Why Conventional Commits?

**Alternatives Considered**:
1. **Manual versioning**: Error-prone, requires discipline
2. **Changesets**: More overhead, separate files
3. **Conventional commits**: ✅ Standard, automated, low overhead

### Why Independent Package Versions?

**Rationale**:
- Packages have different features and release cycles
- Avoid unnecessary version bumps
- Clearer changelog per package
- Users can pin specific package versions

### Why Tag Format `@scope/package@version`?

**Rationale**:
- Standard npm convention
- Clearly identifies package
- Easy to parse and query
- Supports multiple packages in monorepo

### Why Not semantic-release?

**Comparison**:
| Feature | semantic-release | Custom Script |
|---------|------------------|---------------|
| Setup complexity | High | Low |
| Customization | Limited | Full control |
| Monorepo support | Plugin required | Built-in |
| Dependencies | Many | None (bash) |
| Learning curve | Steep | Minimal |

**Decision**: Custom scripts for better control and simplicity

## 🔮 Future Enhancements

### Potential Improvements

1. **Pre-release versions**
   - Alpha/beta releases
   - Release candidates

2. **Enhanced changelog**
   - Group by category
   - Include PR links
   - Add contributors

3. **Automated rollback**
   - Detect failed releases
   - Automatically revert

4. **Release approval**
   - Manual approval gate
   - Review releases before publish

5. **Test integration**
   - Run tests before publish
   - E2E testing

6. **Slack/Discord notifications**
   - Notify team of releases
   - Alert on failures

---

For implementation details, see the workflow files in `.github/workflows/`.

