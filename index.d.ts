// Type definitions for flatten-interval-tree library v1.0.2
// Project: https://github.com/alexbol99/flatten-js
// Definitions by: Alex Bol

export = IntervalTree;

type Comparable = any;      // any object that implements operators '<' and '==' and  method'max'
type Value = any;

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

type Item = {key: Interval, value: Value}

declare class Node {
    constructor(key?: Interval | number[], value?: Value )

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
    readonly isEmpty: boolean;

    insert(key: Interval | number[], value?: Value) : Node;
    exist(key: Interval | number[], value?: Value): boolean;
    remove(key: Interval | number[], value?: Value) : Node;
    search(interval: Interval | number[]) : Array<Value>;     // Array of value's or key.output()'s
    forEach(callbackfn: (key: Interval, value: Value) => void, thisArg?: any ) : void;
    map(callbackFn: (value: Value) => any, thisArg?: any ): IntervalTree;
}
