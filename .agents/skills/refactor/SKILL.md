# Skill: Refactor

## Purpose
Improve the internal structure, readability, and maintainability of existing code without changing its external behavior. Identify code smells, reduce complexity, and apply best practices.

## When to Use
- Code is difficult to read or understand
- Functions or components are too long or do too many things
- There is duplicated logic across files
- Variable or function names are unclear
- Nesting is too deep or logic is convoluted
- Tests are hard to write because code is tightly coupled

## Behavior

### 1. Analyze Before Acting
Before making changes, understand:
- What the code currently does (its contract)
- What tests exist (if any)
- What the refactor goal is (readability, performance, decoupling)

Do **not** change behavior. If behavior needs to change, that is a separate task.

### 2. Common Refactor Patterns

#### Extract Function
Move a block of logic into a named function with a clear, descriptive name.

```ts
// Before
const result = items.filter(i => i.status === 'active' && i.createdAt > cutoff);

// After
const isRecentlyActive = (item: Item, cutoff: Date) =>
  item.status === 'active' && item.createdAt > cutoff;

const result = items.filter(i => isRecentlyActive(i, cutoff));
```

#### Rename for Clarity
Use names that express intent, not implementation.

```ts
// Before
const d = new Date();
const u = users.find(x => x.id === id);

// After
const now = new Date();
const matchedUser = users.find(user => user.id === id);
```

#### Flatten Nesting
Reduce deep nesting using early returns or guard clauses.

```ts
// Before
function process(job: Job) {
  if (job) {
    if (job.status === 'pending') {
      if (job.applicants.length > 0) {
        return job.applicants[0];
      }
    }
  }
  return null;
}

// After
function process(job: Job) {
  if (!job) return null;
  if (job.status !== 'pending') return null;
  if (job.applicants.length === 0) return null;
  return job.applicants[0];
}
```

#### Remove Magic Values
Replace inline literals with named constants.

```ts
// Before
if (score > 85) { ... }

// After
const PASSING_SCORE_THRESHOLD = 85;
if (score > PASSING_SCORE_THRESHOLD) { ... }
```

#### Consolidate Duplicate Logic
Find repeated patterns and unify them into a shared utility or hook.

```ts
// Before (repeated in 3 components)
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

// After
const { loading, error, run } = useAsync();
```

### 3. TypeScript-Specific Improvements
- Replace `any` with proper types or generics
- Use discriminated unions instead of optional fields
- Prefer `interface` for object shapes, `type` for unions/aliases
- Add return types to exported functions
- Use `readonly` where mutation is not intended

### 4. Component Refactoring (React)
- Split large components into smaller, focused ones
- Move data-fetching logic out of render into hooks or loaders
- Avoid inline functions in JSX that recreate on every render
- Separate concerns: UI, state, side effects

## Output Format
When refactoring, produce:
1. The refactored file(s) with clean, improved code
2. A brief summary of what changed and why
3. Confirmation that behavior is preserved

Example summary:
```
Refactored `JobCard.tsx`:
- Extracted `formatSalaryRange` into a shared utility
- Replaced nested ternaries with a `getStatusLabel` function
- Renamed `d` → `postedDate` for clarity
- No behavior changes; existing tests should pass unchanged
```

## Constraints
- Do **not** add new features during a refactor
- Do **not** change function signatures unless explicitly asked
- Do **not** remove code that appears unused without confirming it is safe to delete
- Keep diffs minimal and focused — prefer many small refactors over one large one

## Related Skills
- **audit** — identify issues before refactoring
- **document** — add or update docs after refactoring
- **critique** — evaluate code quality that may need refactoring
