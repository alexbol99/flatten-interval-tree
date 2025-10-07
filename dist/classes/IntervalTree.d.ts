/**
 * Created by Alex Bol on 3/31/2017.
 */
import Node from './Node';
import { IntervalBase } from './Interval';
import type { IntervalInput } from '../types';
/**
 * Implementation of interval binary search tree
 * Interval tree stores items which are couples of {key:interval, value: value}
 * Interval is an object with high and low properties or simply pair [low,high] of numeric values
 */
declare class IntervalTree<V = unknown> {
    root: Node<V> | null;
    nil_node: Node<V>;
    /**
     * Construct new empty instance of IntervalTree
     */
    constructor();
    /**
     * Returns number of items stored in the interval tree
     * @returns {number}
     */
    get size(): number;
    /**
     * Returns array of sorted keys in the ascending order
     * @returns {Array}
     */
    get keys(): any[];
    /**
     * Return array of values in the ascending keys order
     * @returns {Array}
     */
    get values(): V[];
    /**
     * Returns array of items (<key,value> pairs) in the ascended keys order
     * @returns {Array}
     */
    get items(): Array<{
        key: any;
        value: V;
    }>;
    /**
     * Returns true if tree is empty
     * @returns {boolean}
     */
    isEmpty(): boolean;
    /**
     * Clear tree
     */
    clear(): void;
    /**
     * Insert new item into interval tree
     * @param key - interval object or array of two numbers [low, high]
     * @param value - value representing any object (optional)
     * @returns returns reference to inserted node
     */
    insert(key: IntervalInput, value?: V): Node<V> | undefined;
    /**
     * Returns true if item {key,value} exist in the tree
     * @param key - interval correspondent to keys stored in the tree
     * @param value - value object to be checked
     * @returns true if item {key, value} exist in the tree, false otherwise
     */
    exist(key: IntervalInput, value?: V): boolean;
    /**
     * Remove entry {key, value} from the tree
     * @param key - interval correspondent to keys stored in the tree
     * @param value - value object
     * @returns deleted node or undefined if not found
     */
    remove(key: IntervalInput, value?: V): Node<V> | undefined;
    /**
     * Returns array of entry values which keys intersect with given interval
     * If no values stored in the tree, returns array of keys which intersect given interval
     * @param interval - search interval, or tuple [low, high]
     * @param outputMapperFn - optional function that maps (value, key) to custom output
     * @returns {Array}
     */
    search(interval: IntervalInput): V[];
    search<T>(interval: IntervalInput, outputMapperFn: (value: V, key: IntervalBase) => T): T[];
    /**
     * Returns true if intersection between given and any interval stored in the tree found
     * @param interval - search interval or tuple [low, high]
     * @returns {boolean}
     */
    intersect_any(interval: IntervalInput): boolean;
    /**
     * Tree visitor. For each node implement a callback function.
     * Method calls a callback function with two parameters (key, value)
     * @param visitor - function to be called for each tree item
     */
    forEach(visitor: (key: IntervalBase, value: V) => void): void;
    /**
     * Value Mapper. Walk through every node and map node value to another value
     * @param callback - function to be called for each tree item
     */
    map<U>(callback: (value: V, key: IntervalBase) => U): IntervalTree<U>;
    /**
     * Iterator
     * @param interval - optional if the iterator is intended to start from the beginning
     * @param outputMapperFn - optional function that maps (value, key) to custom output
     * @returns {Iterator}
     */
    iterate(): IterableIterator<V>;
    iterate(interval: IntervalInput): IterableIterator<V>;
    iterate<T>(interval: IntervalInput | undefined, outputMapperFn: (value: V, key: IntervalBase) => T): IterableIterator<T>;
    /**
     * Recalculate max property upward from given node to root
     * @param node - starting node
     */
    recalc_max(node: Node<V>): void;
    /**
     * Insert node into tree and rebalance
     * @param insert_node - node to insert
     */
    tree_insert(insert_node: Node<V>): void;
    /**
     * Restore red-black tree properties after insertion
     * @param insert_node - inserted node
     */
    insert_fixup(insert_node: Node<V>): void;
    /**
     * Delete node from tree and rebalance
     * @param delete_node - node to delete
     */
    tree_delete(delete_node: Node<V>): void;
    /**
     * Restore red-black tree properties after deletion
     * @param fix_node - node to fix from
     */
    delete_fixup(fix_node: Node<V>): void;
    /**
     * Search for node with given key and value
     * @param node - starting node
     * @param search_node - node to search for
     * @returns found node or undefined
     */
    tree_search(node: Node<V> | null, search_node: Node<V>): Node<V> | undefined;
    /**
     * Find nearest forward node from given interval
     * @param node - starting node
     * @param search_node - search interval as node
     * @returns nearest forward node or null
     */
    tree_search_nearest_forward(node: Node<V> | null, search_node: Node<V>): Node<V> | null;
    /**
     * Search all intervals intersecting given interval
     * @param node - starting node
     * @param search_node - search interval as node
     * @param res - result array to collect found nodes
     */
    tree_search_interval(node: Node<V> | null, search_node: Node<V>, res: Node<V>[]): void;
    /**
     * Check if any interval intersects with given interval
     * @param node - starting node
     * @param search_node - search interval as node
     * @returns true if intersection found
     */
    tree_find_any_interval(node: Node<V> | null, search_node: Node<V>): boolean;
    /**
     * Find node with minimum key in subtree
     * @param node - root of subtree
     * @returns node with minimum key
     */
    local_minimum(node: Node<V>): Node<V>;
    /**
     * Find node with maximum key in subtree
     * @param node - root of subtree
     * @returns node with maximum key
     */
    local_maximum(node: Node<V>): Node<V>;
    /**
     * Find successor node (next in sorted order)
     * @param node - current node
     * @returns successor node or null
     */
    tree_successor(node: Node<V>): Node<V> | null;
    /**
     * Left rotation around node x
     * @param x - node to rotate
     */
    rotate_left(x: Node<V>): void;
    /**
     * Right rotation around node y
     * @param y - node to rotate
     */
    rotate_right(y: Node<V>): void;
    /**
     * Performs in-order traversal of the tree
     * Applies action callback to each node in ascending order of keys
     * @param node - starting node for traversal (typically root)
     * @param action - callback function to be executed for each node
     */
    tree_walk(node: Node<V> | null, action: (node: Node<V>) => void): void;
    /**
     * Test red-black tree property: all red nodes have exactly two black child nodes
     * @returns true if property holds
     */
    testRedBlackProperty(): boolean;
    /**
     * Test red-black tree property: every path from root to leaf has same black height
     * @param node - starting node
     * @returns black height
     * @throws Error if property is violated
     */
    testBlackHeightProperty(node: Node<V>): number;
}
export default IntervalTree;
//# sourceMappingURL=IntervalTree.d.ts.map