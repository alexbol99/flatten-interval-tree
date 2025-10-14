/**
 * Created by Alex Bol on 4/1/2017.
 */

import Interval, { IntervalBase } from './Interval';
import { RB_TREE_COLOR_BLACK, type NodeColor } from '../utils/constants';
import type {IntervalInput} from '../types';

class Node<V = any> {
    left: Node<V> | null;
    right: Node<V> | null;
    parent: Node<V> | null;
    color: NodeColor;
    item: { key?: IntervalBase; values: V[] };
    max: IntervalBase | undefined;

    constructor(
        key?: IntervalInput,
        value?: V,
        left: Node<V> | null = null,
        right: Node<V> | null = null,
        parent: Node<V> | null = null,
        color: NodeColor = RB_TREE_COLOR_BLACK
    ) {
        this.left = left;
        this.right = right;
        this.parent = parent;
        this.color = color;

        this.item = { key: undefined, values: [] };
        if (value !== undefined) {
            this.item.values.push(value);
        }

        // Initialize key if provided
        if (key !== undefined) {
            if (Array.isArray(key)) {
                const [rawLow, rawHigh] = key;
                if (!Number.isNaN(rawLow) && !Number.isNaN(rawHigh)) {
                    let low = rawLow;
                    let high = rawHigh;
                    if (low > high) [low, high] = [high, low];
                    this.item.key = new Interval(low, high);
                }
            } else {
                // Assume a concrete IntervalBase implementation was passed
                this.item.key = key as IntervalBase;
            }
        }

        this.max = this.item.key ? this.item.key.max : undefined;
    }

    isNil(): boolean {
        return (
            this.item.key === undefined &&
            this.item.values.length === 0 &&
            this.left === null &&
            this.right === null &&
            this.color === RB_TREE_COLOR_BLACK
        );
    }

    private requireKey(): IntervalBase {
        if (!this.item.key) {
            throw new Error('Node key is undefined (nil/sentinel). Operation is not applicable.');
        }
        return this.item.key;
    }

    less_than(other_node: Node<V>): boolean {
        // Compare nodes by key only; values are stored in a bucket
        const a = this.requireKey();
        const b = other_node.requireKey();
        return a.less_than(b);
    }

    _value_equal(other_node: Node<V>): boolean {
        // Deprecated in bucket mode; kept for backward compatibility if ever used
        // Compare first elements if exist
        const a = this.item.values[0] as any;
        const b = other_node.item.values[0] as any;
        return a && b && a.equal_to ? a.equal_to(b) : a === b;
    }

    equal_to(other_node: Node<V>): boolean {
        // Nodes are equal if keys are equal; values are kept in a bucket
        const a = this.requireKey();
        const b = other_node.requireKey();
        return a.equal_to(b);
    }

    intersect(other_node: Node<V>): boolean {
        const a = this.requireKey();
        const b = other_node.requireKey();
        return a.intersect(b);
    }

    copy_data(other_node: Node<V>): void {
        this.item.key = other_node.item.key;
        this.item.values = other_node.item.values.slice();
    }

    update_max(): void {
        // use key (Interval) max property instead of key.high
        this.max = this.item.key ? this.item.key.max : undefined;

        if (this.right && this.right.max) {
            this.max = this.max ? this.max.merge(this.right.max) : this.right.max;
        }

        if (this.left && this.left.max) {
            this.max = this.max ? this.max.merge(this.left.max) : this.left.max;
        }
    }

    // Other_node does not intersect any node of left subtree
    not_intersect_left_subtree(search_node: Node<V>): boolean {
        if (!this.left) return true;
        const high = this.left.max ? this.left.max.high : this.left.item.key!.high;
        const selfKey = this.requireKey();
        const searchKey = search_node.requireKey();
        return selfKey.comparable_less_than(high, searchKey.low);
    }

    // Other_node does not intersect right subtree
    not_intersect_right_subtree(search_node: Node<V>): boolean {
        if (!this.right) return true;
        const low = this.right.max ? this.right.max.low : this.right.item.key!.low;
        const selfKey = this.requireKey();
        const searchKey = search_node.requireKey();
        return selfKey.comparable_less_than(searchKey.high, low);
    }
}

export default Node;
