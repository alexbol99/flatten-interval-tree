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
export declare abstract class IntervalBase {
    low: Comparable;
    high: Comparable;
    constructor(low: Comparable, high: Comparable);
    abstract clone(): IntervalBase;
    get max(): IntervalBase;
    less_than(other_interval: IntervalBase): boolean;
    equal_to(other_interval: IntervalBase): boolean;
    intersect(other_interval: IntervalBase): boolean;
    not_intersect(other_interval: IntervalBase): boolean;
    merge(other_interval: IntervalBase): IntervalBase;
    output(): [Comparable, Comparable];
    value_less_than(val1: Comparable, val2: Comparable): boolean;
}
declare class Interval extends IntervalBase {
    clone(): Interval;
}
export declare class TimeInterval extends IntervalBase {
    constructor(low: Date, high: Date);
    clone(): TimeInterval;
}
export declare class Interval2D extends IntervalBase {
    constructor(low: [number, number], high: [number, number]);
    private static pointLess;
    private static pointEq;
    clone(): Interval2D;
    less_than(other: IntervalBase): boolean;
    equal_to(other: IntervalBase): boolean;
    not_intersect(other: IntervalBase): boolean;
    merge(other: IntervalBase): Interval2D;
    value_less_than(val1: [number, number], val2: [number, number]): boolean;
    output(): [[number, number], [number, number]];
}
export default Interval;
//# sourceMappingURL=Interval.d.ts.map