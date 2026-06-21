<!--
title: Iterative Binary Search
description: A clean and bug-free implementation of binary search in TypeScript using iterative pointers.
languages: TypeScript
tags: algorithm, search, binary-search
createdAt: 3 Hours ago
-->

# Binary Search Implementation

Classical binary search algorithm. It runs in `O(log N)` worst-case time complexity, providing an optimal search technique on sorted indices.

## Algorithm Correctness
- Avoid integer overflow when calculating midpoint: `left + Math.floor((right - left) / 2)`
- Correctly update pointers relative to target matches.

```typescript
class BinarySearch {
  static search(nums: number[], target: number): number {
    let left = 0;
    let right = nums.length - 1;
    while (left <= right) {
      const mid = left + Math.floor((right - left) / 2);
      if (nums[mid] === target) return mid;
      if (nums[mid] < target) left = mid + 1;
      else right = mid - 1;
    }
    return -1;
  }
}
```
