/**
 * Created by Alex Bol on 4/1/2017.
 */

'use strict';

// let Interval = require('../classes/interval');
// let {RB_TREE_COLOR_RED, RB_TREE_COLOR_BLACK} = require('../utils/constants');
import Interval from './interval';
import colors from '../utils/constants';

let {RB_TREE_COLOR_RED, RB_TREE_COLOR_BLACK} = colors;

const Node = class Node {
    constructor(key = undefined, value = undefined,
                left = null, right = null, parent = null, color = RB_TREE_COLOR_BLACK) {
        this.left = left;                     // reference to left child node
        this.right = right;                   // reference to right child node
        this.parent = parent;                 // reference to parent node
        this.color = color;

        this.item = {key: key, value: value};   // key is supposed to be       instance of Interval

        /* If not, this should by an array of two numbers */
        if (key && key instanceof Array && key.length == 2) {
            if (!Number.isNaN(key[0]) && !Number.isNaN(key[1])) {
                this.item.key = new Interval(Math.min(key[0], key[1]), Math.max(key[0], key[1]));
            }
        }
        this.max = this.item.key ? this.item.key.max : undefined;
    }

    isNil() {
        return (this.item.key === undefined && this.item.value === undefined &&
            this.left === null && this.right === null && this.color === RB_TREE_COLOR_BLACK);
    }

    less_than(other_node) {
        return this.item.key.less_than(other_node.item.key);
    }

    equal_to(other_node) {
        let value_equal = true;
        if (this.item.value && other_node.item.value) {
            value_equal = this.item.value.equal_to ? this.item.value.equal_to(other_node.item.value) :
                this.item.value == other_node.item.value;
        }
        return this.item.key.equal_to(other_node.item.key) && value_equal;
    }

    intersect(other_node) {
        return this.item.key.intersect(other_node.item.key);
    }

    copy_data(other_node) {
        this.item.key = other_node.item.key.clone();
        this.item.value = other_node.item.value;
    }

    update_max() {
        // use key (Interval) max property instead of key.high
        this.max = this.item.key ? this.item.key.max : undefined;
        if (this.right && this.right.max) {
            let maximal_val = this.item.key.maximal_val;
            this.max = maximal_val(this.max, this.right.max);
        }
        if (this.left && this.left.max) {
            let maximal_val = this.item.key.maximal_val;
            this.max = maximal_val(this.max, this.left.max);
        }
    }

    // Other_node does not intersect any node of left subtree, if this.left.max < other_node.item.key.low
    not_intersect_left_subtree(search_node) {
        let val_less_than = this.item.key.val_less_than;
        let high = this.left.max.high ? this.left.max.high : this.left.max;
        return val_less_than(high, search_node.item.key.low);
    }

    // Other_node does not intersect right subtree if other_node.item.key.high < this.right.key.low
    not_intersect_right_subtree(search_node) {
        let val_less_than = this.item.key.val_less_than;
        let low = this.right.max.low ? this.right.max.low : this.right.item.key.low;
        return val_less_than(search_node.item.key.high, low);
    }
};

// module.exports = Node;
export default Node;
