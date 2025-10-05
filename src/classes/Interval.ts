/**
 * Created by Alex Bol on 4/1/2017.
 */

/**
 * Interval abstractions used by the interval tree.
 *
 * This module defines an abstract IntervalBase and several concrete interval types.
 * An interval represents a closed range [low, high] over a comparable domain. The base
 * class provides default semantics for 1D comparable endpoints (number, bigint, string, Date):
 * - Ordering: lexicographic by (low, then high) via less_than and equal_to.
 * - Intersection: two intervals intersect if neither ends strictly before the other.
 * - Augmentation: merge(other) returns a new interval spanning the union of ranges; this is
 *   used by the tree to maintain augmented "max" values (computed by merging), not via any
 *   static helpers.
 * - Serialization: output() returns a tuple [low, high] for external APIs.
 *
 * Specializations can override comparison and other behaviors:
 * - Interval (default export): 1D interval with default comparable endpoints.
 * - TimeInterval: 1D interval whose endpoints are Date objects.
 * - Interval2D: lexicographic 2D interval with endpoints as points [x, y]; overrides
 *   comparison and intersection in the lexicographic plane.
 *
 * Consumers may pass either:
 * - A concrete IntervalBase instance (e.g., new TimeInterval(...), new Interval2D(...)), or
 * - A numeric pair [low, high], which the tree converts to the default 1D Interval.
 *
 * See the TypeScript types in src/types.ts for Comparable and accepted IntervalInput forms.
 */

import type { Comparable } from '../types';

// Abstract base for intervals. Concrete variants extend this.
export abstract class IntervalBase {
    low: Comparable;
    high: Comparable;

    constructor(low: Comparable, high: Comparable) {
        this.low = low;
        this.high = high;
    }

    // Each concrete interval should implement clone to keep its own type
    abstract clone(): IntervalBase;

    get max(): IntervalBase {
        return this.clone();
    }

    // Default numeric/date comparison (lexicographic by low then high)
    less_than(other_interval: IntervalBase): boolean {
        return (this.low as any) < (other_interval.low as any) ||
            ((this.low as any) === (other_interval.low as any) && (this.high as any) < (other_interval.high as any));
    }

    equal_to(other_interval: IntervalBase): boolean {
        return (this.low as any) === (other_interval.low as any) && (this.high as any) === (other_interval.high as any);
    }

    intersect(other_interval: IntervalBase): boolean {
        return !this.not_intersect(other_interval);
    }

    not_intersect(other_interval: IntervalBase): boolean {
        return ((this.high as any) < (other_interval.low as any) || (other_interval.high as any) < (this.low as any));
    }

    merge(other_interval: IntervalBase): IntervalBase {
        // By default choose min low, max high using < and >
        const low = (this.low === undefined)
            ? other_interval.low
            : (((this.low as any) < (other_interval.low as any)) ? this.low : other_interval.low);
        const high = (this.high === undefined)
            ? other_interval.high
            : (((this.high as any) > (other_interval.high as any)) ? this.high : other_interval.high);
        // Return instance of the same concrete class
        const cloned = this.clone();
        cloned.low = low;
        cloned.high = high;
        return cloned;
    }

    output(): [Comparable, Comparable] {
        return [this.low, this.high];
    }
    
    // Instance-level comparator so child classes can customize value comparison semantics
    value_less_than(val1: Comparable, val2: Comparable): boolean {
        return (val1 as any) < (val2 as any);
    }
}

// 1D numeric/date interval (default)
class Interval extends IntervalBase {
    clone(): Interval {
        return new Interval(this.low, this.high);
    }
}

// Time interval using JS Date (inherits default behavior as Date supports < and >)
export class TimeInterval extends IntervalBase {
    constructor(low: Date, high: Date) {
        super(low, high);
    }
    clone(): TimeInterval {
        return new TimeInterval(this.low as Date, this.high as Date);
    }
}

// 2D interval with lexicographic comparison for points [x, y]
export class Interval2D extends IntervalBase {
    constructor(low: [number, number], high: [number, number]) {
        super(low, high);
    }

    private static pointLess(a: [number, number], b: [number, number]): boolean {
        return a[0] < b[0] || (a[0] === b[0] && a[1] < b[1]);
    }

    private static pointEq(a: [number, number], b: [number, number]): boolean {
        return a[0] === b[0] && a[1] === b[1];
    }

    clone(): Interval2D {
        return new Interval2D(this.low as [number, number], this.high as [number, number]);
    }

    less_than(other: IntervalBase): boolean {
        const a = this.low as [number, number];
        const b = other.low as [number, number];
        if (Interval2D.pointLess(a, b)) return true;
        if (Interval2D.pointEq(a, b)) {
            const ah = this.high as [number, number];
            const bh = other.high as [number, number];
            return Interval2D.pointLess(ah, bh);
        }
        return false;
    }

    equal_to(other: IntervalBase): boolean {
        return Interval2D.pointEq(this.low as [number, number], other.low as [number, number]) &&
            Interval2D.pointEq(this.high as [number, number], other.high as [number, number]);
    }

    not_intersect(other: IntervalBase): boolean {
        // Non-intersection in lexicographic 2D ordering (simplistic): treat ranges in the ordered space
        const highLess = Interval2D.pointLess(this.high as [number, number], other.low as [number, number]);
        const otherHighLess = Interval2D.pointLess(other.high as [number, number], this.low as [number, number]);
        return highLess || otherHighLess;
    }

    merge(other: IntervalBase): Interval2D {
        const lowA = this.low as [number, number];
        const lowB = other.low as [number, number];
        const highA = this.high as [number, number];
        const highB = other.high as [number, number];
        const low = Interval2D.pointLess(lowA, lowB) ? lowA : lowB;
        const high = Interval2D.pointLess(highA, highB) ? highB : highA;
        return new Interval2D(low, high);
    }

    // Override value comparator to handle 2D points lexicographically
    value_less_than(val1: [number, number], val2: [number, number]): boolean {
        return Interval2D.pointLess(val1, val2);
    }

    output(): [[number, number], [number, number]] {
        return [this.low as [number, number], this.high as [number, number]];
    }
}

export default Interval;

