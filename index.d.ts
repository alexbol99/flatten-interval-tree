// Type definitions for flatten-interval-tree library v1.0.2
// Project: https://github.com/alexbol99/flatten-js
// Definitions by: Alex Bol

type Comparable = any;      // any object that implements operators '<' and '==' and  method'max'
type Value = any;
type NumericTuple = [number,number];
type MappedItem = any;
type SearchOutput = Array<Value> | Array<Interval> | Array<MappedItem>

interface IntervalInterface {
    low: Comparable;
    high: Comparable;

    readonly  max: Comparable;

    clone(): Interval;
    less_than(other_interval: Interval) : boolean;
    equal_to(other_interval: Interval) : boolean;
    intersect(other_interval: Interval) : boolean;
    not_intersect(other_interval: Interval) : boolean;
    output() : any;
}

declare class Interval implements IntervalInterface {
    low: Comparable;
    high: Comparable;

    readonly  max: Interval;

    clone(): Interval;
    less_than(other_interval: Interval) : boolean;
    equal_to(other_interval: Interval) : boolean;
    intersect(other_interval: Interval) : boolean;
    not_intersect(other_interval: Interval) : boolean;
    merge(other_interval: Interval) : Interval;
    output() : NumericTuple;

    static comparable_max(arg1: Interval, arg2: Interval) : Interval;
    static comparable_less_than(arg1: Comparable, arg2: Comparable ) : boolean;
}

type Item = {key: Interval, value: Value}

declare class Node {
    constructor(key?: Interval | NumericTuple, value?: Value )

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
    readonly values: Value[];
    readonly items: Array<{key:Interval, value:Value}>;

    isEmpty(): boolean;
    insert(key: Interval | NumericTuple, value?: Value) : Node;
    exist(key: Interval | NumericTuple, value?: Value): boolean;
    remove(key: Interval | NumericTuple, value?: Value) : Node;
    search(interval: Interval | NumericTuple, outputMapperFn?: (value: Value, key: Interval) => MappedItem) : SearchOutput;
    forEach(callbackfn: (key: Interval, value: Value) => void, thisArg?: any ) : void;
    map(callbackFn: (value: Value, key?: Interval) => any, thisArg?: any ): IntervalTree;
}

export default IntervalTree;

