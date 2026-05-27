# Test: Emoji Removal [Category E]

## Case E-1: Emoji in console.log
**Input:** `console.log("User fetched 🔥", user);`
**Expected:** `console.log("User fetched", user);`

## Case E-2: Emoji in comment
**Input:** `// 🚀 Auth module setup`
**Expected:** `// Auth module setup`

## Case E-3: Emoji preserved in JSX
**Input:** `<button>Submit 🚀</button>`
**Expected:** unchanged — UI-facing string.

## Case E-4: Emoji preserved in user-facing string
**Input:** `toast.success("Profile saved! 🎉")`
**Expected:** unchanged — user-facing message.

## Case E-5: Emoji in thrown Error
**Input:** `throw new Error("Auth failed 💀")`
**Expected:** `throw new Error("Auth failed")`
