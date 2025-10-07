/**
 * Created by Alex Bol on 4/1/2017.
 */

import Interval, { IntervalBase } from './Interval';
import { RB_TREE_COLOR_BLACK, type NodeColor } from '../utils/constants';

class Node<V = any> {
    left: Node<V> | null;
    right: Node<V> | null;
    parent: Node<V> | null;
    color: NodeColor;
    item: { key: IntervalBase; values: V[] };
    max: IntervalBase | undefined;

    constructor(
        key: IntervalBase | [number, number] | undefined = undefined,
        value: V | undefined = undefined as any,
        left: Node<V> | null = null,
        right: Node<V> | null = null,
        parent: Node<V> | null = null,
        color: NodeColor = RB_TREE_COLOR_BLACK
    ) {
        this.left = left;
        this.right = right;
        this.parent = parent;
        this.color = color;

        this.item = { key: key as any, values: [] };
        if (value !== undefined) {
            this.item.values.push(value as any);
        }

        /* If key is an array of two numbers, convert to Interval */
        if (key && Array.isArray(key) && key.length === 2) {
            if (!Number.isNaN(key[0]) && !Number.isNaN(key[1])) {
                let [low, high] = key;
                if (low > high) [low, high] = [high, low];
                this.item.key = new Interval(low, high);
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


    less_than(other_node: Node<V>): boolean {
        // Compare nodes by key only; values are stored in a bucket
        return this.item.key.less_than(other_node.item.key);
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
        return this.item.key.equal_to(other_node.item.key);
    }

    intersect(other_node: Node<V>): boolean {
        return this.item.key.intersect(other_node.item.key);
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
        const high = (this.left!.max as any).high !== undefined
            ? (this.left!.max as any).high
            : this.left!.max;
        return this.item.key.comparable_less_than(high as any, search_node.item.key.low as any);
    }

    // Other_node does not intersect right subtree
    not_intersect_right_subtree(search_node: Node<V>): boolean {
        const low = (this.right!.max as any).low !== undefined
            ? (this.right!.max as any).low
            : this.right!.item.key.low;
        return this.item.key.comparable_less_than(search_node.item.key.high as any, low as any);
    }
}

export default Node;
