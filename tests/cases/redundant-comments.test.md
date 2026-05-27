# Test: Redundant Comments [Category A]

## Case A-1: Mirror comment
**Input:**
```ts
// increment counter
counter++;
```
**Expected:** comment removed, `counter++` preserved.
**Should NOT trigger on:**
```ts
// Fee waived for users with plan > Pro
counter++;
```

## Case A-2: Return mirror
**Input:**
```ts
// return the result
return counter;
```
**Expected:** comment removed, `return counter` preserved.

## Case A-3: Await mirror
**Input:**
```ts
// call the API
await fetchUser(id);
```
**Expected:** comment removed.
