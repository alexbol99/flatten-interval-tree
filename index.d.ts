// Type definitions for flatten-interval-tree library v1.0.2
// Project: https://github.com/alexbol99/flatten-js
// Definitions by: Alex Bol

export = IntervalTree;

type Comparable = any;      // any object that implements operators '<' and '==' and  method'max'

declare class Interval {
  low: Comparable;
  high: Comparable;

  readonly  max: Comparable;

  clone(): Interval;
  less_than(other_interval: Interval) : boolean;
  equal_to(other_interval: Interval) : boolean;
  intersect(other_interval: Interval) : boolean;
  not_intersect(other_interval: Interval) : boolean;
  toArray() : [number, number];
}

type Item = {key: Interval, value: any}

declare class Node {
  constructor(key?: Interval, value?: any )

  left: Node;
  right: Node;
  parent: Node;
  color: 1 | 0;
  item: Item;

  isNil() : boolean;
  less_than(other_node: Node) : boolean;
  equal_to(other_node: Node) : boolean;
  intersect(other_node: Node) : boolean;
  copy_data(other_node: Node) : void;
  update_max() : void;
}

declare class IntervalTree {
  constructor()

  root: Node;

  readonly size: number;
  readonly keys: Node[];
  readonly values: any[]
  readonly entries: Item[];
  readonly isEmpty: boolean;

  insert(key: Interval, value?: any): Node;
  exist(key: Interval, value?: any): boolean;
  remove(key: Interval, value?: any): Node;
  search(interval: Interval): Array<any>;     // Array of value's or key.output()'s
  forEach(callbackFn: (key: Interval, value: any) => void, thisArg?: any ): void;
  map(callbackFn: (value: any) => any, thisArg?: any ): IntervalTree;
}
