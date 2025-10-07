---
name: "Alpha Testing Feedback"
title: "Call for testing: @flatten-js/interval-tree v2.0.0-alpha.1"
category: General
about: "Share your feedback about the @flatten-js/interval-tree 2.0.0-alpha release"
labels: ["alpha-testing"]
---

Thank you for helping us test the upcoming v2 release of @flatten-js/interval-tree!

We’ve just published an alpha build that includes bucketed values per key, an Interval2D type, and improved typings. This thread is for early feedback, bug reports, and general impressions when trying the alpha.

How to install the alpha
- npm install --save @flatten-js/interval-tree@alpha

Docs and examples
- API docs: https://alexbol99.github.io/flatten-interval-tree/
- Live examples: https://alexbol99.github.io/flatten-interval-tree/examples.html
- Release notes: https://github.com/alexbol99/flatten-interval-tree/blob/2.0.0-alpha/RELEASE_NOTES.md

What to test
- Insert/exist/remove semantics with bucketed values per identical key
- Search and iterate behavior (including starting from an interval)
- Custom interval types extending IntervalBase (e.g., Interval2D)
- TypeScript typings and developer experience in your editor/IDE
- BigInt and Date endpoints where relevant

How to report
Please include the following details where possible:
- Version: @flatten-js/interval-tree 2.0.0-alpha.1
- Runtime: Node version, OS, browser (if applicable)
- TypeScript version (if applicable)
- Reproduction steps and a minimal snippet
- Expected vs. actual behavior
- Any stack traces or screenshots

Example snippet
```ts
import IntervalTree, { Interval2D } from '@flatten-js/interval-tree';

const tree = new IntervalTree<string>();

// Bucketed values under the same key
tree.insert([2, 5], 'A');
tree.insert([2, 5], 'B');
console.log(tree.exist([2, 5], 'B')); // true

// 2D intervals
const r1 = new Interval2D([0, 0], [10, 10]);
const r2 = new Interval2D([5, 5], [15, 15]);
tree.insert(r1 as any, 'R1');
tree.insert(r2 as any, 'R2');
```

Known notes
- Keys with identical intervals are now grouped into a single node; removing with both key and value removes only that value.
- Custom values are compared by identity (===) unless your value implements equal_to(other).

Thank you for trying the alpha and sharing feedback! Your input will shape the 2.0.0 release. 🙏
