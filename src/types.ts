/**
 * Shared type definitions for the interval-tree library
 */

import type { IntervalBase } from './classes/Interval';

// Values that can be compared in this library
// Includes primitives, Date, and simple tuple used by Interval2D
export type Comparable = number | bigint | string | Date | [number, number];

// Input type accepted by IntervalTree methods where an interval can be either
// an Interval instance (any concrete variant) or a tuple [low, high] for default 1D
export type IntervalInput = IntervalBase | [number, number];
