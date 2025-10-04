/**
 * Shared type definitions for the interval-tree library
 */

import type Interval from './classes/Interval';

// Primitive values that can be compared with < and === in this library
export type Comparable = number | bigint | string;

// Input type accepted by IntervalTree methods where an interval can be either
// an Interval instance or a tuple [low, high]
export type IntervalInput = Interval | [number, number];
