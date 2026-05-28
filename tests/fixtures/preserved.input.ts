// TODO: add pagination when the user list grows beyond 100 entries
// FIXME: search is case-sensitive, must fix before v2 launch
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function legacyAdapter(data: any): User {
  // Fee waived for users with plan > Pro — business rule from contracts/pricing.md
  // Safari 15 bug: getBoundingClientRect returns stale values after DOM reflow
  // WORKAROUND: force a reflow by reading offsetHeight before measuring
  const height = element.offsetHeight;
  return transform(data);
}

// Copyright (c) 2024 Nico — MIT License

export function sum(a: number, b: number): number {
  return a + b;
}
