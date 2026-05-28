# Test: Preserved Patterns (must NEVER be removed)

## P-1: TODO comment
```ts
// TODO: add pagination when user list grows large
```
**Expected:** NEVER removed, even if it looks generic.

## P-2: Linter directive
```ts
// eslint-disable-next-line @typescript-eslint/no-explicit-any
// @ts-ignore
// prettier-ignore
```
**Expected:** NEVER removed.

## P-3: Business logic comment
```ts
// Fee waived for users with plan > Pro — business rule
```
**Expected:** NEVER removed — contains domain knowledge.

## P-4: Edge case / workaround
```ts
// Safari bug: reflow needed before measuring
```
**Expected:** NEVER removed.

## P-5: License header
```ts
// Copyright (c) 2024 NicoENDYs
```
**Expected:** NEVER removed.

## P-6: Commented-out code
```ts
// const x = oldValue;
```
**Expected:** NEVER removed automatically.

## P-7: JSX emoji
```tsx
<button>Submit 🚀</button>
```
**Expected:** NEVER removed.
