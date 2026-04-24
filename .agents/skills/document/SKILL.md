# document

> Generates clear, accurate, and developer-friendly documentation for code, APIs, and components.

## Overview

The `document` skill analyzes TypeScript source code and produces well-structured documentation including JSDoc comments, README sections, API references, and inline explanations. It prioritizes accuracy over verbosity and adapts tone to the target audience.

## Trigger Conditions

Use this skill when:
- A function, class, or module lacks JSDoc/TSDoc comments
- A new feature or API surface has been added
- Existing docs are stale or inconsistent with the implementation
- A README section needs to be written or updated
- Type signatures need human-readable explanations

## Behavior

### Input

The skill accepts:
- Raw TypeScript source files or snippets
- Function/class/interface definitions
- Existing partial documentation to extend
- Context about the intended audience (internal devs, OSS contributors, end users)

### Output

The skill produces:
- JSDoc/TSDoc block comments with `@param`, `@returns`, `@throws`, `@example` tags
- Markdown documentation sections (suitable for README or docs site)
- Inline comments for non-obvious logic
- A brief summary line for each exported symbol

### Rules

1. **Accuracy first** — Never invent behavior. If the implementation is ambiguous, note it explicitly.
2. **Match the code** — Parameter names, types, and descriptions must match the actual signature.
3. **Concise summaries** — The first line of a JSDoc block should be a single, complete sentence.
4. **Examples are required** for public-facing APIs unless the usage is trivially obvious.
5. **Avoid restating types** — Don't write `@param {string} name - A string representing the name`. Just write `@param name - The display name of the user`.
6. **Use present tense** — "Returns the current user" not "Will return the current user".
7. **Mark internal APIs** — Use `@internal` for symbols not intended for external consumption.
8. **Deprecation notices** — Use `@deprecated` with a migration path when applicable.

## Examples

### Input: Undocumented function

```typescript
export async function fetchJobListings(
  filters: JobFilters,
  options?: PaginationOptions
): Promise<PaginatedResult<JobListing>> {
  const query = buildQuery(filters);
  const page = options?.page ?? 1;
  const limit = options?.limit ?? 20;
  return db.jobs.findMany({ where: query, skip: (page - 1) * limit, take: limit });
}
```

### Output: Documented function

```typescript
/**
 * Fetches a paginated list of job listings matching the given filters.
 *
 * @param filters - Criteria used to narrow the result set (e.g. location, role, salary range).
 * @param options - Optional pagination controls. Defaults to page 1 with 20 results per page.
 * @returns A paginated result containing matched job listings and total count metadata.
 *
 * @example
 * const results = await fetchJobListings(
 *   { location: 'Remote', role: 'Engineer' },
 *   { page: 2, limit: 10 }
 * );
 * console.log(results.data); // JobListing[]
 */
export async function fetchJobListings(
  filters: JobFilters,
  options?: PaginationOptions
): Promise<PaginatedResult<JobListing>> {
  const query = buildQuery(filters);
  const page = options?.page ?? 1;
  const limit = options?.limit ?? 20;
  return db.jobs.findMany({ where: query, skip: (page - 1) * limit, take: limit });
}
```

---

### Input: Undocumented interface

```typescript
export interface JobFilters {
  location?: string;
  role?: string;
  salaryMin?: number;
  salaryMax?: number;
  remote?: boolean;
  tags?: string[];
}
```

### Output: Documented interface

```typescript
/** Criteria for filtering job listings in search and query operations. */
export interface JobFilters {
  /** City, region, or country to filter by. Partial matches are supported. */
  location?: string;

  /** Job title or role keyword (e.g. "Frontend Engineer", "Product Manager"). */
  role?: string;

  /** Minimum annual salary in the listing's base currency. */
  salaryMin?: number;

  /** Maximum annual salary in the listing's base currency. */
  salaryMax?: number;

  /** When `true`, restricts results to fully remote positions. */
  remote?: boolean;

  /** Skill or technology tags to match against (e.g. `["React", "TypeScript"]`). */
  tags?: string[];
}
```

---

## README Section Generation

When asked to produce a README section, format output as:

```markdown
## <Feature Name>

<One-paragraph overview of what the feature does and why it exists.>

### Usage

\`\`\`typescript
// Minimal working example
\`\`\`

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| ...    | ...  | ...     | ...         |

### Notes

- Any caveats, edge cases, or known limitations.
```

## Anti-Patterns to Avoid

- ❌ `// This function does what it says` — unhelpful tautology
- ❌ `@param data - The data` — restates the name without adding meaning
- ❌ Documenting implementation details that may change frequently
- ❌ Omitting `@throws` when a function can reject or throw
- ❌ Writing docs that contradict the type signature

## Integration Notes

- This skill pairs well with **audit** (to identify undocumented exports) and **clarify** (to resolve ambiguous logic before documenting it).
- When documentation requires explaining a design decision, defer to the original author or flag with `// TODO(docs): confirm intent`.
