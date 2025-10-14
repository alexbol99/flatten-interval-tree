# Release Notes: 2.0.0

Date: 2025-10-14

This document summarizes the changes included in the v2.0.0 release. It highlights breaking changes, new features, improvements, documentation updates, and migration guidance.

## TL;DR
- Breaking: Keys with identical intervals are now bucketed into one node; value equality is by identity (or custom `equal_to`).
- Refactor: New `IntervalBase` abstraction; comparisons moved to instance methods; augmentation uses `merge()` (no static helpers).
- Features: Additional interval types (`Interval2D`), iterator enhancements, better typings, BigInt support path.
- DX/Docs: TypeScript-first build, TypeDoc docs with a custom theme and live RunKit examples.

### Feedback and testing
Please try the alpha build and share your feedback in GitHub Discussions:
https://github.com/alexbol99/flatten-interval-tree/discussions

---

## Breaking Changes
1. Bucketed values per key (commit: cef6055)
   - Identical interval keys now share a single tree node that contains a bucket (array) of values.
   - `exist(key)` checks the presence of a node by key.
   - `exist(key, value)` checks if the specific value exists in the bucket by strict equality (`===`) unless the value implements `equal_to(other)`.
   - `remove(key)` removes the entire node (all values in the bucket).
   - `remove(key, value)` removes only that value; if the bucket becomes empty the node is removed.
   - Impact: If your code depends on having separate nodes for equal keys or on value comparator semantics, adjust accordingly.

2. Interval comparison and augmentation semantics
   - Removed static comparison helpers from the interval classes. Comparison is now delegated to instance-level methods on `IntervalBase` and its subclasses.
   - The augmented `max` field in nodes is computed using instance `merge()` rather than static helpers.
   - Impact: Custom interval types should extend `IntervalBase` and may override `less_than`, `equal_to`, `not_intersect`, `merge`, and `comparable_less_than` if needed.

## New Features
1. Multiple interval types (commits: 246bb11, docs updates)
   - `Interval` (default 1D comparable endpoints: number, bigint, string, Date)
   - `Interval2D` (lexicographic 2D intervals with endpoints as `[x, y]`)
   - The tree accepts either an `IntervalBase` instance or a numeric tuple `[low, high]` which is normalized and converted to `Interval`.

2. Iterator enhancements
   - `iterate()` with no arguments yields all values in ascending key order.
   - `iterate(interval)` finds the lowest intersecting or forward key and iterates forward.
   - Optional mapper `(value, key) => output` for both `search` and `iterate`.

3. BigInt compatibility
   - Default `Interval` supports BigInt endpoints; tests demonstrate mixed usage with numbers when explicitly typed/cast.

## Refactors & Internal Changes
1. Introduced `IntervalBase` and moved comparisons to instances (commit: 246bb11)
   - `Interval2D` overrides comparison and intersection logic.
   - `Node` and tree logic rely on interval instance methods for ordering and intersection, and on `merge()` for augmented `max`.

2. TypeScript-first codebase (commits: 34ebb63, ffa85bd)
   - Source migrated to TypeScript.
   - Build via Rollup; declaration maps emitted.
   - Tests migrated from JS to TS (commit: 4c71e30).

3. Typing improvements
   - Stronger generics across `IntervalTree<V>`.
   - Overloads for `search` and `iterate` to infer mapper output types.
   - Public types `Comparable` and `IntervalInput` exported.
   - Declaration shims added for bundle entry points (`dist/main*.d.ts`) so editors get accurate types when importing from `dist/main.mjs` during development.

## API Behavior Clarifications
- Insert
  - `insert(key, value?)` stores `value`; if omitted, stores the key itself as the value (so `search()` returns keys by default).
  - Inserting an already existing key appends `value` to its bucket.
- Exist
  - `exist(key)` checks key presence; `exist(key, value)` checks if that value is in the bucket.
- Remove
  - `remove(key)` removes the entire bucket/node.
  - `remove(key, value)` removes only the matching value; node is removed if bucket becomes empty.
- Search
  - `search(interval, mapper?)` returns matching values, or mapped outputs if a mapper is provided.
- Iterate
  - `iterate(interval?, mapper?)` yields values or mapped outputs in ascending key order.

## Documentation & DX
1. TypeDoc-based API docs with custom styling (commit: 7784fa2)
   - Hosted output under `docs/` with improved typography and auto dark mode via `typedoc.theme.css`.
   - Top navigation includes links to GitHub and live examples.
2. Live examples (RunKit) (commit: 7784fa2)
   - `docs/examples.html` contains two live notebooks: numeric intervals and `Interval2D`.
3. README updates
   - Reorganized and expanded sections: Interval types, usage examples, docs links.

## Performance
- The red-black tree properties and augmented max maintenance remain intact. Additional tests verify invariants after insertions and deletions under the new bucketed-node model.

## Migration Guide (from master to 2.0.0-alpha)
1. Equal keys now share a node
   - If you relied on distinct nodes for identical intervals, update logic to work with value buckets.
   - Use `exist(key, value)` and `remove(key, value)` to operate on individual values.
2. Custom intervals
   - If you had custom interval types, refactor them to extend `IntervalBase` and override instance methods instead of using/expecting static helpers.
3. TypeScript consumers
   - Prefer importing from the package root (`@flatten-js/interval-tree`) to pick up the main types.
   - If importing bundle paths during development (e.g. `../dist/main.mjs`), declaration shims are provided to preserve accurate type hints.
4. BigInt
   - `Interval` supports BigInt endpoints. When mixing types in tests or apps, ensure casting where necessary to satisfy TS.

## Known Issues / Notes
- Date endpoints are supported by the default `Interval`; no special class is required.
- 2D intervals (`Interval2D`) use lexicographic ordering; ensure that matches your spatial semantics before adopting for geometry tasks.

## Acknowledgements
- Thanks to contributors and issue reporters for:
  - Bucketed values per key (#56, #54) and related fixes.
  - BigInt support discussions (#51) and tests.
  - Documentation feedback and typedoc styling suggestions.

## Commits of interest (master..2.0.0-alpha)
- 4c71e30 test: migrate Red-Black Tree Node tests to TypeScript; convert IntervalTree tests to TypeScript; update dist outputs and declaration shims; update package scripts
- 7784fa2 docs: switch to TypeDoc with custom theme; add live examples page; align TypeScript (5.7.x) with TypeDoc 0.27; add docs build script
- 246bb11 refactor(Interval): introduce IntervalBase and instance-level comparison; remove static helpers; use merge() for augmentation
- cef6055 feat: bucket values per key; update APIs and tests; BREAKING CHANGE: equal keys share one node
- 34ebb63 chore: finalize TypeScript migration, build config, and CI
- ffa85bd TypeScript support
- cf3776b ci: run workflow on 2.0.0-alpha branch and enable manual dispatch
- e2e391f fix: unable to remove some key/value objects (#54)

---

If you want these notes included in the package distribution, keep this file in the repository root. Otherwise, we can move this content into a GitHub Release description upon tagging `v2.0.0-alpha`.