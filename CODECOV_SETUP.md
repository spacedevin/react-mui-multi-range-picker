# Codecov Integration

This repository uses [Codecov](https://codecov.io) to track and visualize code coverage across both packages.

## Setup Complete ✅

### Configuration

**Coverage is collected from:**
- 🆓 `@spacedevin/react-mui-multi-range-picker` (Free Package)
- 💎 `@spacedevin/react-mui-pro-multi-range-picker` (Pro Package)

**When coverage runs:**
- ✅ Every Pull Request
- ✅ Every push to `main` branch (before release)

### How It Works

1. **Matrix Strategy:** Both packages run tests in parallel using GitHub Actions matrix
2. **Coverage Generation:** Bun generates LCOV coverage reports for each package
3. **Upload:** Each package uploads its coverage with a unique flag
4. **Combination:** Codecov automatically combines coverage from both packages
5. **Reporting:** Coverage reports appear on PRs and in Codecov dashboard

### Coverage Targets

| Package | Target | Current | Threshold |
|---------|--------|---------|-----------|
| Free    | 75%    | ~84%    | ±2%       |
| Pro     | 75%    | ~74%    | ±2%       |
| Combined| 75%    | ~79%    | ±2%       |

### GitHub Actions Integration

**PR Workflow:**
```yaml
- name: Run Tests with Coverage
  run: bun test --coverage --coverage-reporter=lcov

- name: Upload Coverage to Codecov
  uses: codecov/codecov-action@v5
  with:
    token: ${{ secrets.CODECOV_TOKEN }}
    files: ./packages/${{ matrix.package }}/coverage/lcov.info
    flags: ${{ matrix.package }}
    name: ${{ matrix.package }}-coverage
```

**Main Workflow:** Same as PR, runs before release

### Flags

Each package has its own flag for separate tracking:
- `MuiMultiDateRangePicker` - Free package coverage
- `MuiMultiDateRangePickerPro` - Pro package coverage

View coverage by flag in Codecov dashboard to see individual package metrics.

## Local Coverage

### Generate Coverage Reports

```bash
# Free package
cd packages/MuiMultiDateRangePicker
bun test --coverage --coverage-reporter=lcov

# Pro package
cd packages/MuiMultiDateRangePickerPro
bun test --coverage --coverage-reporter=lcov
```

### View Coverage

Coverage files are generated in:
- `packages/MuiMultiDateRangePicker/coverage/lcov.info`
- `packages/MuiMultiDateRangePickerPro/coverage/lcov.info`

**VS Code:** Install "Coverage Gutters" extension to visualize coverage inline

**Browser:** 
```bash
# Generate HTML report
bun test --coverage --coverage-reporter=html
open coverage/index.html
```

### Terminal Output

```bash
# Text summary (default)
bun test --coverage

# Example output:
------------------------------|---------|---------|-------------------
File                          | % Funcs | % Lines | Uncovered Line #s
------------------------------|---------|---------|-------------------
All files                     |   81.25 |   83.71 |
 lib/MultiRangeDatePicker.tsx |   43.75 |   51.14 | 31-38,47-63...
 lib/index.ts                 |  100.00 |  100.00 | 
------------------------------|---------|---------|-------------------
```

## Codecov Badge

Add to README.md:

```markdown
[![codecov](https://codecov.io/gh/YOUR_USERNAME/mui-date-dragger/branch/main/graph/badge.svg)](https://codecov.io/gh/YOUR_USERNAME/mui-date-dragger)
```

## Configuration

Coverage rules are defined in `codecov.yml`:

- **Project Coverage:** Must maintain ≥75% overall
- **Patch Coverage:** New code must have ≥70% coverage
- **Ignored Files:** Tests, examples, build artifacts
- **Carryforward:** Previous coverage is preserved if CI fails

## Troubleshooting

### Coverage not appearing on PR

1. **Check workflow ran:** Look for "Run Tests" job in Actions tab
2. **Verify CODECOV_TOKEN:** Ensure secret is set in repository settings
3. **Check Codecov dashboard:** Login to codecov.io to see upload status
4. **Workflow permissions:** Ensure workflow has read/write permissions

### Coverage seems low

Coverage is intentionally lower for complex interaction handlers (drag/drop, pointer events) due to test environment limitations. See `TEST_COVERAGE_SUMMARY.md` for details.

### Multiple coverage reports

This is expected! Each package uploads separately:
- First upload: Free package (~84% coverage)
- Second upload: Pro package (~74% coverage)
- Combined: Weighted average of both

### Failed upload

If `fail_ci_if_error: false` is set, the build continues even if Codecov upload fails. This prevents CI failures due to Codecov service issues.

## Advanced Usage

### Compare branches

```bash
# In Codecov dashboard
# Navigate to: Settings → Pull Request Comments
# Enable "Show detailed diff"
```

### Download coverage reports

```bash
# From GitHub Actions artifacts
gh run download <run-id>
```

### Custom coverage thresholds

Edit `codecov.yml` to adjust targets:
```yaml
coverage:
  status:
    project:
      default:
        target: 80%  # Increase to 80%
```

## Resources

- [Codecov Documentation](https://docs.codecov.com)
- [GitHub Actions Integration](https://docs.codecov.com/docs/github-actions-integration)
- [Bun Coverage](https://bun.sh/docs/cli/test#coverage)
- [LCOV Format](https://github.com/linux-test-project/lcov)

## Support

If you encounter issues:
1. Check GitHub Actions logs
2. Check Codecov dashboard
3. Review `codecov.yml` configuration
4. See `TESTING.md` for test setup

