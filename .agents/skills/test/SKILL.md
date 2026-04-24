# Skill: Test

Generate or improve tests for TypeScript/JavaScript code in the job-ops project.

## Purpose

Ensure code correctness, prevent regressions, and document expected behavior through well-structured tests.

## Triggers

- User asks to "add tests", "write tests", "test this", or "improve test coverage"
- A new module or utility has been added without tests
- A bug was fixed and needs a regression test
- Code review requests test coverage

## Behavior

### 1. Identify What to Test

- Scan the target file for exported functions, classes, and hooks
- Identify edge cases: empty input, null/undefined, boundary values, error paths
- Check for existing tests to avoid duplication and maintain consistency

### 2. Choose the Right Test Type

| Scenario | Test Type |
|---|---|
| Pure utility function | Unit test |
| React component rendering | Component test (React Testing Library) |
| API route handler | Integration test |
| Multi-step user flow | E2E test (Playwright/Cypress) |
| Database query | Integration test with test DB |

### 3. File Naming Conventions

```
src/utils/formatDate.ts        → src/utils/formatDate.test.ts
src/components/JobCard.tsx     → src/components/JobCard.test.tsx
src/app/api/jobs/route.ts      → src/app/api/jobs/route.test.ts
```

### 4. Test Structure

Follow the **Arrange → Act → Assert** pattern:

```typescript
describe('functionName', () => {
  it('should <expected behavior> when <condition>', () => {
    // Arrange
    const input = ...;

    // Act
    const result = functionName(input);

    // Assert
    expect(result).toEqual(...);
  });
});
```

### 5. Mocking Guidelines

- Mock external services (APIs, databases) — never hit real endpoints in unit tests
- Use `vi.mock()` (Vitest) or `jest.mock()` depending on project config
- Mock Next.js router with `next-router-mock` where needed
- Prefer `vi.spyOn` over full module mocks when only one method needs intercepting

### 6. Coverage Goals

- All exported functions: ≥ 1 happy-path test
- Error handling: at least one test per `try/catch` or error branch
- Edge cases: null, empty string, empty array, zero where applicable
- Do NOT aim for 100% coverage at the expense of test quality

## Output Format

Return a complete `.test.ts` or `.test.tsx` file. Include:

1. Necessary imports
2. Any required mocks declared at the top
3. Grouped `describe` blocks per exported symbol
4. Descriptive `it`/`test` labels in plain English
5. Cleanup in `afterEach`/`afterAll` if side effects are introduced

## Example

**Input file** (`src/utils/formatSalary.ts`):
```typescript
export function formatSalary(amount: number, currency = 'GBP'): string {
  if (amount < 0) throw new Error('Salary cannot be negative');
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency }).format(amount);
}
```

**Generated test** (`src/utils/formatSalary.test.ts`):
```typescript
import { describe, it, expect } from 'vitest';
import { formatSalary } from './formatSalary';

describe('formatSalary', () => {
  it('should format a positive GBP amount by default', () => {
    expect(formatSalary(50000)).toBe('£50,000.00');
  });

  it('should format a USD amount when currency is specified', () => {
    expect(formatSalary(75000, 'USD')).toBe('US$75,000.00');
  });

  it('should handle zero salary', () => {
    expect(formatSalary(0)).toBe('£0.00');
  });

  it('should throw when salary is negative', () => {
    expect(() => formatSalary(-1)).toThrow('Salary cannot be negative');
  });
});
```

## Anti-Patterns to Avoid

- ❌ Testing implementation details (internal variable names, private methods)
- ❌ Assertions like `expect(result).toBeTruthy()` — be specific
- ❌ Skipped tests (`it.skip`) left in the codebase without a TODO comment
- ❌ Tests that depend on execution order
- ❌ Hardcoded dates/times without mocking `Date`

## Integration with CI

Tests must pass in the existing CI pipeline. Do not introduce new test dependencies without updating `package.json` and noting the change in the commit message.
