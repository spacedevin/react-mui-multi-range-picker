# NPM Token Setup Guide

This guide explains how to set up NPM authentication for automated publishing via GitHub Actions.

## 📋 Prerequisites

- NPM account with publishing permissions
- Access to the GitHub repository settings
- Packages should be scoped under your NPM organization or username

## 🔑 Step 1: Create NPM Token

### Option A: Using NPM Website (Recommended)

1. **Log in to NPM**
   - Go to https://www.npmjs.com/
   - Sign in to your account

2. **Navigate to Tokens**
   - Click your profile icon (top right)
   - Select "Access Tokens"
   - Or go directly to: https://www.npmjs.com/settings/[your-username]/tokens

3. **Generate New Token**
   - Click "Generate New Token"
   - Choose "Automation" (recommended for CI/CD)
   - Or "Publish" if Automation is not available

4. **Configure Token**
   - **Name**: `mui-date-dragger-github-actions` (or similar)
   - **Token Type**: 
     - ✅ **Automation** (recommended): No 2FA prompts, perfect for CI/CD
     - ⚠️ **Publish**: Requires 2FA, less ideal for automation
     - ❌ **Read-only**: Cannot publish packages
   
5. **Copy Token**
   - ⚠️ **IMPORTANT**: Copy the token immediately
   - You won't be able to see it again!
   - Token format: `npm_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### Option B: Using NPM CLI

```bash
# Login to NPM
npm login

# Create automation token
npm token create --type=automation --read-only=false

# Copy the token that's displayed
```

## 🔐 Step 2: Add Token to GitHub Secrets

### Via GitHub Web UI

1. **Navigate to Repository Settings**
   - Go to your repository on GitHub
   - Click "Settings" tab
   - Go to "Secrets and variables" → "Actions"

2. **Add New Secret**
   - Click "New repository secret"
   - **Name**: `NPM_TOKEN` (must be exactly this)
   - **Value**: Paste your NPM token (starts with `npm_`)
   - Click "Add secret"

### Via GitHub CLI

```bash
# Set the secret
gh secret set NPM_TOKEN

# When prompted, paste your NPM token
# Or pipe it directly:
echo "npm_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx" | gh secret set NPM_TOKEN
```

## 📦 Step 3: Verify Package Configuration

### Check package.json Settings

```json
{
  "name": "@spacedevin/react-mui-multi-range-picker",
  "version": "0.1.0",
  "publishConfig": {
    "access": "public"
  }
}
```

Ensure:
- ✅ Package name is scoped (`@scope/package-name`)
- ✅ `publishConfig.access` is `"public"` (for public packages)
- ✅ `repository` field points to correct GitHub repo

### Verify NPM Organization Access

If using a scoped package (`@scope/package-name`):

1. **Check Organization Membership**
   ```bash
   npm org ls @spacedevin
   ```

2. **Verify Publishing Rights**
   - You need at least "Developer" role
   - "Owner" or "Admin" for full control

3. **Add Collaborators** (if needed)
   ```bash
   npm org add @spacedevin username
   ```

## ✅ Step 4: Test the Setup

### Test NPM Token Locally

```bash
# Set token in environment
export NODE_AUTH_TOKEN=npm_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Try to view package info (should work)
npm view @spacedevin/react-mui-multi-range-picker

# Dry run publish (doesn't actually publish)
cd packages/MuiMultiDateRangePicker
npm publish --dry-run
```

### Test GitHub Action

Create a test PR with a conventional commit:

```bash
git checkout -b test/verify-release
echo "# Test" >> README.md
git add README.md
git commit -m "fix(picker): test release automation"
git push origin test/verify-release
gh pr create --title "fix(picker): test release automation"
```

Merge the PR and watch GitHub Actions:
- Go to "Actions" tab
- Watch "Release" workflow
- Verify it completes successfully

## 🔍 Troubleshooting

### Error: "Unable to authenticate need: Basic realm="npm""

**Cause**: Invalid or expired NPM token

**Solution**:
```bash
# Create new token
npm token create --type=automation

# Update GitHub secret
gh secret set NPM_TOKEN
```

### Error: "You do not have permission to publish"

**Cause**: Token doesn't have publish permissions or package name is taken

**Solution**:
1. Verify token type is "Automation" or "Publish"
2. Check package name availability:
   ```bash
   npm view @spacedevin/react-mui-multi-range-picker
   ```
3. If name is taken, choose a different scope/name

### Error: "Package name too similar to existing package"

**Cause**: NPM prevents similarly named packages to avoid confusion

**Solution**:
1. Choose a more unique package name
2. Or request NPM support to allow the name

### Error: "You cannot publish over the previously published version"

**Cause**: Version already exists on NPM

**Solution**:
1. Increment version manually
2. Or wait for automatic version bump
3. Check current version:
   ```bash
   npm view @spacedevin/react-mui-multi-range-picker version
   ```

### Workflow Fails but Token is Valid

**Possible causes**:
1. Package name doesn't match organization
2. Build fails before publish
3. 2FA required (shouldn't happen with Automation token)

**Debug steps**:
```bash
# Check workflow logs in GitHub Actions
# Look for specific error messages

# Test locally
cd packages/MuiMultiDateRangePicker
npm run build
npm publish --dry-run
```

## 🔒 Security Best Practices

### Token Management

1. **Use Automation Tokens**
   - No 2FA prompts
   - Designed for CI/CD
   - Can be restricted to specific packages

2. **Rotate Tokens Regularly**
   - Create new token every 6-12 months
   - Delete old tokens
   - Update GitHub secret

3. **Limit Token Scope**
   - Use package-specific tokens if possible
   - Don't use personal tokens in CI/CD
   - Never commit tokens to repository

### Token Rotation

```bash
# List all tokens
npm token list

# Revoke old token
npm token revoke [token-id]

# Create new token
npm token create --type=automation

# Update GitHub secret
gh secret set NPM_TOKEN
```

### Monitoring

1. **Check Token Usage**
   ```bash
   npm token list
   ```
   Shows last used date for each token

2. **Watch for Suspicious Activity**
   - Monitor package download stats
   - Check for unexpected versions
   - Review GitHub Actions logs

3. **Enable NPM 2FA** (for manual operations)
   ```bash
   npm profile enable-2fa auth-and-writes
   ```
   Note: Use "auth-only" for CI/CD compatibility

## 📚 Additional Resources

### NPM Documentation
- [Creating and Viewing Access Tokens](https://docs.npmjs.com/creating-and-viewing-access-tokens)
- [Publishing Packages](https://docs.npmjs.com/cli/v10/commands/npm-publish)
- [Using Private Packages](https://docs.npmjs.com/using-private-packages-in-a-ci-cd-workflow)

### GitHub Documentation
- [Encrypted Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Security Hardening for GitHub Actions](https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions)

### Project Documentation
- [Release Strategy](./RELEASE_STRATEGY.md)
- [Contributing Guide](./CONTRIBUTING.md)

## 🆘 Getting Help

If you encounter issues:

1. Check troubleshooting section above
2. Review GitHub Actions logs
3. Verify NPM token permissions
4. Test locally with `npm publish --dry-run`
5. Open an issue with error details

## ✅ Verification Checklist

Before going live:

- [ ] NPM token created (Automation type)
- [ ] GitHub secret `NPM_TOKEN` configured
- [ ] Package names available on NPM
- [ ] `publishConfig.access: "public"` in package.json
- [ ] Organization permissions verified
- [ ] Test PR merged successfully
- [ ] Packages published to NPM
- [ ] GitHub releases created
- [ ] Git tags pushed

---

**Security Note**: Never share your NPM token or commit it to the repository. Store it only in GitHub Secrets.

