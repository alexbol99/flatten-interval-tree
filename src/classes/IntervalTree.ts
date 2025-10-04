/**
 * Created by Alex Bol on 3/31/2017.
 */

import Node from './Node';
import Interval from './Interval';
import { RB_TREE_COLOR_BLACK, RB_TREE_COLOR_RED } from '../utils/constants';
import type { IntervalInput } from '../types';

/**
 * Implementation of interval binary search tree
 * Interval tree stores items which are couples of {key:interval, value: value}
 * Interval is an object with high and low properties or simply pair [low,high] of numeric values
 */
class IntervalTree<V = any> {
    root: Node<V> | null;
    nil_node: Node<V>;

    /**
     * Construct new empty instance of IntervalTree
     */
    constructor() {
        this.root = null;
        this.nil_node = new Node<V>();
    }

    /**
     * Returns number of items stored in the interval tree
     * @returns {number}
     */
    get size(): number {
        let count = 0;
        this.tree_walk(this.root, (node) => count += node.item.values.length);
        return count;
    }

    /**
     * Returns array of sorted keys in the ascending order
     * @returns {Array}
     */
    get keys(): any[] {
        const res: any[] = [];
        this.tree_walk(this.root, (node) =>
            res.push(node.item.key.output ? node.item.key.output() : node.item.key)
        );
        return res;
    }

    /**
     * Return array of values in the ascending keys order
     * @returns {Array}
     */
    get values(): V[] {
        const res: V[] = [];
        this.tree_walk(this.root, (node) => {
            for (const v of node.item.values) res.push(v);
        });
        return res;
    }

    /**
     * Returns array of items (<key,value> pairs) in the ascended keys order
     * @returns {Array}
     */
    get items(): Array<{ key: any; value: V }> {
        const res: Array<{ key: any; value: V }> = [];
        this.tree_walk(this.root, (node) => {
            const keyOut = node.item.key.output ? node.item.key.output() : node.item.key;
            for (const v of node.item.values) {
                res.push({ key: keyOut, value: v });
            }
        });
        return res;
    }

    /**
     * Returns true if tree is empty
     * @returns {boolean}
     */
    isEmpty(): boolean {
        return this.root == null || this.root === this.nil_node;
    }

    /**
     * Clear tree
     */
    clear(): void {
        this.root = null;
    }

    /**
     * Insert new item into interval tree
     * @param key - interval object or array of two numbers [low, high]
     * @param value - value representing any object (optional)
     * @returns returns reference to inserted node
     */
    insert(key: IntervalInput, value: V = key as any): Node<V> | undefined {
        if (key === undefined) return;
        // If node with the same key exists, append value to its bucket
        const existing = this.tree_search(this.root, new Node<V>(key));
        if (existing) {
            existing.item.values.push(value as any);
            return existing;
        }
        const insert_node = new Node<V>(key, value, this.nil_node, this.nil_node, null, RB_TREE_COLOR_RED);
        this.tree_insert(insert_node);
        this.recalc_max(insert_node);
        return insert_node;
    }

    /**
     * Returns true if item {key,value} exist in the tree
     * @param key - interval correspondent to keys stored in the tree
     * @param value - value object to be checked
     * @returns true if item {key, value} exist in the tree, false otherwise
     */
    exist(key: IntervalInput, value: V = key as any): boolean {
        const node = this.tree_search(this.root, new Node<V>(key));
        if (!node) return false;
        // If value is omitted (or equals key by default), treat as key existence
        if (arguments.length < 2 || value === (key as any)) return true;
        // Check if value exists in the bucket
        return node.item.values.some((v: any) => (v && (v as any).equal_to ? (v as any).equal_to(value) : v === value));
    }

    /**
     * Remove entry {key, value} from the tree
     * @param key - interval correspondent to keys stored in the tree
     * @param value - value object
     * @returns deleted node or undefined if not found
     */
    remove(key: IntervalInput, value: V = key as any): Node<V> | undefined {
        const node = this.tree_search(this.root, new Node<V>(key));
        if (!node) return undefined;
        // If value omitted, remove entire node
        if (arguments.length < 2) {
            this.tree_delete(node);
            return node;
        }
        // Remove one matching value from bucket
        const idx = node.item.values.findIndex((v: any) => (v && (v as any).equal_to ? (v as any).equal_to(value) : v === value));
        if (idx >= 0) {
            node.item.values.splice(idx, 1);
            // If bucket is now empty, remove node from tree
            if (node.item.values.length === 0) {
                this.tree_delete(node);
            }
            return node;
        }
        return undefined;
    }

    /**
     * Returns array of entry values which keys intersect with given interval
     * If no values stored in the tree, returns array of keys which intersect given interval
     * @param interval - search interval, or tuple [low, high]
     * @param outputMapperFn - optional function that maps (value, key) to custom output
     * @returns {Array}
     */
    search(
        interval: IntervalInput,
        outputMapperFn: (value: V, key: Interval) => any = (value, key) =>
            value === (key as any) ? key.output() : value
    ): any[] {
        const search_node = new Node<V>(interval);
        const resp_nodes: Node<V>[] = [];
        this.tree_search_interval(this.root, search_node, resp_nodes);
        const res: any[] = [];
        for (const node of resp_nodes) {
            for (const v of node.item.values) {
                res.push(outputMapperFn(v, node.item.key));
            }
        }
        return res;
    }

    /**
     * Returns true if intersection between given and any interval stored in the tree found
     * @param interval - search interval or tuple [low, high]
     * @returns {boolean}
     */
    intersect_any(interval: IntervalInput): boolean {
        const search_node = new Node<V>(interval);
        return this.tree_find_any_interval(this.root, search_node);
    }

    /**
     * Tree visitor. For each node implement a callback function.
     * Method calls a callback function with two parameters (key, value)
     * @param visitor - function to be called for each tree item
     */
    forEach(visitor: (key: Interval, value: V) => void): void {
        this.tree_walk(this.root, (node) => {
            for (const v of node.item.values) visitor(node.item.key, v);
        });
    }

    /**
     * Value Mapper. Walk through every node and map node value to another value
     * @param callback - function to be called for each tree item
     */
    map<U>(callback: (value: V, key: Interval) => U): IntervalTree<U> {
        const tree = new IntervalTree<U>();
        this.tree_walk(this.root, (node) => {
            for (const v of node.item.values) {
                tree.insert(node.item.key, callback(v, node.item.key));
            }
        });
        return tree;
    }

    /**
     * Iterator
     * @param interval - optional if the iterator is intended to start from the beginning
     * @param outputMapperFn - optional function that maps (value, key) to custom output
     * @returns {Iterator}
     */
    *iterate(
        interval?: IntervalInput,
        outputMapperFn: (value: V, key: Interval) => any = (value, key) =>
            value === (key as any) ? key.output() : value
    ): IterableIterator<any> {
        let node: Node<V> | null = null;
        if (interval) {
            node = this.tree_search_nearest_forward(this.root, new Node<V>(interval));
        } else if (this.root) {
            node = this.local_minimum(this.root);
        }
        while (node) {
            for (const v of node.item.values) {
                yield outputMapperFn(v, node.item.key);
            }
            node = this.tree_successor(node);
        }
    }

    /**
     * Recalculate max property upward from given node to root
     * @param node - starting node
     */
    recalc_max(node: Node<V>): void {
        let node_current = node;
        while (node_current.parent != null) {
            node_current.parent.update_max();
            node_current = node_current.parent;
        }
    }

    /**
     * Insert node into tree and rebalance
     * @param insert_node - node to insert
     */
    tree_insert(insert_node: Node<V>): void {
        let current_node: Node<V> | null = this.root;
        let parent_node: Node<V> | null = null;

        if (this.root == null || this.root === this.nil_node) {
            this.root = insert_node;
        } else {
            while (current_node !== this.nil_node) {
                parent_node = current_node!;
                if (insert_node.less_than(current_node!)) {
                    current_node = current_node!.left;
                } else {
                    current_node = current_node!.right;
                }
            }

            insert_node.parent = parent_node;

            if (insert_node.less_than(parent_node!)) {
                parent_node!.left = insert_node;
            } else {
                parent_node!.right = insert_node;
            }
        }

        this.insert_fixup(insert_node);
    }

    /**
     * Restore red-black tree properties after insertion
     * @param insert_node - inserted node
     */
    insert_fixup(insert_node: Node<V>): void {
        let current_node: Node<V>;
        let uncle_node: Node<V>;

        current_node = insert_node;
        while (current_node !== this.root && current_node.parent!.color === RB_TREE_COLOR_RED) {
            if (current_node.parent === current_node.parent!.parent!.left) {
                uncle_node = current_node.parent!.parent!.right!;
                if (uncle_node.color === RB_TREE_COLOR_RED) {
                    current_node.parent!.color = RB_TREE_COLOR_BLACK;
                    uncle_node.color = RB_TREE_COLOR_BLACK;
                    current_node.parent!.parent!.color = RB_TREE_COLOR_RED;
                    current_node = current_node.parent!.parent!;
                } else {
                    if (current_node === current_node.parent!.right) {
                        current_node = current_node.parent!;
                        this.rotate_left(current_node);
                    }
                    current_node.parent!.color = RB_TREE_COLOR_BLACK;
                    current_node.parent!.parent!.color = RB_TREE_COLOR_RED;
                    this.rotate_right(current_node.parent!.parent!);
                }
            } else {
                uncle_node = current_node.parent!.parent!.left!;
                if (uncle_node.color === RB_TREE_COLOR_RED) {
                    current_node.parent!.color = RB_TREE_COLOR_BLACK;
                    uncle_node.color = RB_TREE_COLOR_BLACK;
                    current_node.parent!.parent!.color = RB_TREE_COLOR_RED;
                    current_node = current_node.parent!.parent!;
                } else {
                    if (current_node === current_node.parent!.left) {
                        current_node = current_node.parent!;
                        this.rotate_right(current_node);
                    }
                    current_node.parent!.color = RB_TREE_COLOR_BLACK;
                    current_node.parent!.parent!.color = RB_TREE_COLOR_RED;
                    this.rotate_left(current_node.parent!.parent!);
                }
            }
        }

        this.root!.color = RB_TREE_COLOR_BLACK;
    }

    /**
     * Delete node from tree and rebalance
     * @param delete_node - node to delete
     */
    tree_delete(delete_node: Node<V>): void {
        let cut_node: Node<V>;
        let fix_node: Node<V>;

        if (delete_node.left === this.nil_node || delete_node.right === this.nil_node) {
            cut_node = delete_node;
        } else {
            cut_node = this.tree_successor(delete_node)!;
        }

        if (cut_node.left !== this.nil_node) {
            fix_node = cut_node.left!;
        } else {
            fix_node = cut_node.right!;
        }

        fix_node.parent = cut_node.parent;

        if (cut_node === this.root) {
            this.root = fix_node;
        } else {
            if (cut_node === cut_node.parent!.left) {
                cut_node.parent!.left = fix_node;
            } else {
                cut_node.parent!.right = fix_node;
            }
            cut_node.parent!.update_max();
        }

        this.recalc_max(fix_node);

        if (cut_node !== delete_node) {
            delete_node.copy_data(cut_node);
            delete_node.update_max();
            this.recalc_max(delete_node);
        }

        if (cut_node.color === RB_TREE_COLOR_BLACK) {
            this.delete_fixup(fix_node);
        }
    }

    /**
     * Restore red-black tree properties after deletion
     * @param fix_node - node to fix from
     */
    delete_fixup(fix_node: Node<V>): void {
        let current_node = fix_node;
        let brother_node: Node<V>;

        while (
            current_node !== this.root &&
            current_node.parent != null &&
            current_node.color === RB_TREE_COLOR_BLACK
            ) {
            if (current_node === current_node.parent!.left) {
                brother_node = current_node.parent!.right!;
                if (brother_node.color === RB_TREE_COLOR_RED) {
                    brother_node.color = RB_TREE_COLOR_BLACK;
                    current_node.parent!.color = RB_TREE_COLOR_RED;
                    this.rotate_left(current_node.parent!);
                    brother_node = current_node.parent!.right!;
                }
                if (
                    brother_node.left!.color === RB_TREE_COLOR_BLACK &&
                    brother_node.right!.color === RB_TREE_COLOR_BLACK
                ) {
                    brother_node.color = RB_TREE_COLOR_RED;
                    current_node = current_node.parent!;
                } else {
                    if (brother_node.right!.color === RB_TREE_COLOR_BLACK) {
                        brother_node.color = RB_TREE_COLOR_RED;
                        brother_node.left!.color = RB_TREE_COLOR_BLACK;
                        this.rotate_right(brother_node);
                        brother_node = current_node.parent!.right!;
                    }
                    brother_node.color = current_node.parent!.color;
                    current_node.parent!.color = RB_TREE_COLOR_BLACK;
                    brother_node.right!.color = RB_TREE_COLOR_BLACK;
                    this.rotate_left(current_node.parent!);
                    current_node = this.root!;
                }
            } else {
                brother_node = current_node.parent!.left!;
                if (brother_node.color === RB_TREE_COLOR_RED) {
                    brother_node.color = RB_TREE_COLOR_BLACK;
                    current_node.parent!.color = RB_TREE_COLOR_RED;
                    this.rotate_right(current_node.parent!);
                    brother_node = current_node.parent!.left!;
                }
                if (
                    brother_node.left!.color === RB_TREE_COLOR_BLACK &&
                    brother_node.right!.color === RB_TREE_COLOR_BLACK
                ) {
                    brother_node.color = RB_TREE_COLOR_RED;
                    current_node = current_node.parent!;
                } else {
                    if (brother_node.left!.color === RB_TREE_COLOR_BLACK) {
                        brother_node.color = RB_TREE_COLOR_RED;
                        brother_node.right!.color = RB_TREE_COLOR_BLACK;
                        this.rotate_left(brother_node);
                        brother_node = current_node.parent!.left!;
                    }
                    brother_node.color = current_node.parent!.color;
                    current_node.parent!.color = RB_TREE_COLOR_BLACK;
                    brother_node.left!.color = RB_TREE_COLOR_BLACK;
                    this.rotate_right(current_node.parent!);
                    current_node = this.root!;
                }
            }
        }

        current_node.color = RB_TREE_COLOR_BLACK;
    }

    /**
     * Search for node with given key and value
     * @param node - starting node
     * @param search_node - node to search for
     * @returns found node or undefined
     */
    tree_search(node: Node<V> | null, search_node: Node<V>): Node<V> | undefined {
        if (node == null || node === this.nil_node) return undefined;

        if (search_node.equal_to(node)) {
            return node;
        }
        if (search_node.less_than(node)) {
            return this.tree_search(node.left, search_node);
        } else {
            return this.tree_search(node.right, search_node);
        }
    }

    /**
     * Find nearest forward node from given interval
     * @param node - starting node
     * @param search_node - search interval as node
     * @returns nearest forward node or null
     */
    tree_search_nearest_forward(node: Node<V> | null, search_node: Node<V>): Node<V> | null {
        let best: Node<V> | null = null;
        let curr = node;
        while (curr && curr !== this.nil_node) {
            if (curr.less_than(search_node)) {
                if (curr.intersect(search_node)) {
                    best = curr;
                    curr = curr.left;
                } else {
                    curr = curr.right;
                }
            } else {
                if (!best || curr.less_than(best)) best = curr;
                curr = curr.left;
            }
        }
        return best || null;
    }

    /**
     * Search all intervals intersecting given interval
     * @param node - starting node
     * @param search_node - search interval as node
     * @param res - result array to collect found nodes
     */
    tree_search_interval(node: Node<V> | null, search_node: Node<V>, res: Node<V>[]): void {
        if (node != null && node !== this.nil_node) {
            if (node.left !== this.nil_node && !node.not_intersect_left_subtree(search_node)) {
                this.tree_search_interval(node.left, search_node, res);
            }
            if (node.intersect(search_node)) {
                res.push(node);
            }
            if (node.right !== this.nil_node && !node.not_intersect_right_subtree(search_node)) {
                this.tree_search_interval(node.right, search_node, res);
            }
        }
    }

    /**
     * Check if any interval intersects with given interval
     * @param node - starting node
     * @param search_node - search interval as node
     * @returns true if intersection found
     */
    tree_find_any_interval(node: Node<V> | null, search_node: Node<V>): boolean {
        let found = false;
        if (node != null && node !== this.nil_node) {
            if (node.left !== this.nil_node && !node.not_intersect_left_subtree(search_node)) {
                found = this.tree_find_any_interval(node.left, search_node);
            }
            if (!found) {
                found = node.intersect(search_node);
            }
            if (!found && node.right !== this.nil_node && !node.not_intersect_right_subtree(search_node)) {
                found = this.tree_find_any_interval(node.right, search_node);
            }
        }
        return found;
    }

    /**
     * Find node with minimum key in subtree
     * @param node - root of subtree
     * @returns node with minimum key
     */
    local_minimum(node: Node<V>): Node<V> {
        let node_min = node;
        while (node_min.left != null && node_min.left !== this.nil_node) {
            node_min = node_min.left;
        }
        return node_min;
    }

    /**
     * Find node with maximum key in subtree
     * @param node - root of subtree
     * @returns node with maximum key
     */
    local_maximum(node: Node<V>): Node<V> {
        let node_max = node;
        while (node_max.right != null && node_max.right !== this.nil_node) {
            node_max = node_max.right;
        }
        return node_max;
    }

    /**
     * Find successor node (next in sorted order)
     * @param node - current node
     * @returns successor node or null
     */
    tree_successor(node: Node<V>): Node<V> | null {
        let node_successor: Node<V> | null;
        let current_node: Node<V>;
        let parent_node: Node<V> | null;

        if (node.right !== this.nil_node) {
            node_successor = this.local_minimum(node.right!);
        } else {
            current_node = node;
            parent_node = node.parent;
            while (parent_node != null && parent_node.right === current_node) {
                current_node = parent_node;
                parent_node = parent_node.parent;
            }
            node_successor = parent_node;
        }
        return node_successor;
    }

    /**
     * Left rotation around node x
     * @param x - node to rotate
     */
    rotate_left(x: Node<V>): void {
        const y = x.right!;

        x.right = y.left;

        if (y.left !== this.nil_node) {
            y.left!.parent = x;
        }
        y.parent = x.parent;

        if (x === this.root) {
            this.root = y;
        } else {
            if (x === x.parent!.left) {
                x.parent!.left = y;
            } else {
                x.parent!.right = y;
            }
        }
        y.left = x;
        x.parent = y;

        if (x !== null && x !== this.nil_node) {
            x.update_max();
        }

        if (y != null && y !== this.nil_node) {
            y.update_max();
        }
    }

    /**
     * Right rotation around node y
     * @param y - node to rotate
     */
    rotate_right(y: Node<V>): void {
        const x = y.left!;

        y.left = x.right;

        if (x.right !== this.nil_node) {
            x.right!.parent = y;
        }
        x.parent = y.parent;

        if (y === this.root) {
            this.root = x;
        } else {
            if (y === y.parent!.left) {
                y.parent!.left = x;
            } else {
                y.parent!.right = x;
            }
        }
        x.right = y;
        y.parent = x;

        if (y !== null && y !== this.nil_node) {
            y.update_max();
        }

        if (x != null && x !== this.nil_node) {
            x.update_max();
        }
    }

    /**
     * Performs in-order traversal of the tree
     * Applies action callback to each node in ascending order of keys
     * @param node - starting node for traversal (typically root)
     * @param action - callback function to be executed for each node
     */
    tree_walk(node: Node<V> | null, action: (node: Node<V>) => void): void {
        if (node != null && node !== this.nil_node) {
            this.tree_walk(node.left, action);
            action(node);
            this.tree_walk(node.right, action);
        }
    }

    /**
     * Test red-black tree property: all red nodes have exactly two black child nodes
     * @returns true if property holds
     */
    testRedBlackProperty(): boolean {
        let res = true;
        this.tree_walk(this.root, function (node) {
            if (node.color === RB_TREE_COLOR_RED) {
                if (
                    !(
                        node.left!.color === RB_TREE_COLOR_BLACK &&
                        node.right!.color === RB_TREE_COLOR_BLACK
                    )
                ) {
                    res = false;
                }
            }
        });
        return res;
    }

    /**
     * Test red-black tree property: every path from root to leaf has same black height
     * @param node - starting node
     * @returns black height
     * @throws Error if property is violated
     */
    testBlackHeightProperty(node: Node<V>): number {
        let height = 0;
        let heightLeft = 0;
        let heightRight = 0;
        if (node.color === RB_TREE_COLOR_BLACK) {
            height++;
        }
        if (node.left !== this.nil_node) {
            heightLeft = this.testBlackHeightProperty(node.left!);
        } else {
            heightLeft = 1;
        }
        if (node.right !== this.nil_node) {
            heightRight = this.testBlackHeightProperty(node.right!);
        } else {
            heightRight = 1;
        }
        if (heightLeft !== heightRight) {
            throw new Error('Red-black height property violated');
        }
        height += heightLeft;
        return height;
    }
}

export default IntervalTree;
