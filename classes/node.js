/**
 * Created by Alex Bol on 4/1/2017.
 */

'use strict';

let defaultTraits = require('../utils/numeric_traits');
let Interval = require('../classes/interval');
let {RB_TREE_COLOR_RED, RB_TREE_COLOR_BLACK} = require('../utils/constants');

module.exports = function(traits=defaultTraits) {
    let Node = class Node {
        constructor(key = undefined, value = undefined,
                    left=null, right=null, parent=null, color=RB_TREE_COLOR_BLACK) {
            this.left = left;                     // reference to left child node
            this.right = right;                   // reference to right child node
            this.parent = parent;                 // reference to parent node
            this.color = color;

            this.item = {key:key, value:value};   // key is supposed to be       instance of Interval

            /* If not, this should by an array of two numbers */
            this.item.key == undefined;
            if (key && key instanceof Array && key.length == 2) {
                if ( !Number.isNaN(key[0]) && !Number.isNaN(key[1]) ) {
                    this.item.key = new Interval(Math.min(key[0], key[1]), Math.max(key[0], key[1]));
                }
            }
            this.max = this.item.key ? this.item.key.high : undefined;
        }

        less_than(other_node) {
            return traits.less_than(this.item, other_node.item);
        }

        equal_to(other_node) {
            return traits.equal_to(this.item, other_node.item);
        }

        intersect(other_node) {
            return traits.intersect(this.item, other_node.item);
        }

        copy_data(other_node) {
            traits.copy_data(this.item, other_node.item);
        }

        update_max() {
            this.max = this.item.key ? this.item.key.high : undefined;
            if (this.right && this.right.max) {
                this.max = traits.maximal_of(this.max, this.right.max);
            }
            if (this.left && this.left.max) {
                this.max = traits.maximal_of(this.max, this.left.max);
            }
        }

        // Other_node does not intersect any node of left subtree, if this.left.max < other_node.item.key.low
        not_intersect_left_subtree(other_node) {
            return traits.val_less_than(this.left.max, other_node.item.key.low);
        }

        // Other_node does not intersect right subtree if other_node.item.key.high < this.right.key.low
        not_intersect_right_subtree(other_node) {
            return traits.val_less_than(other_node.item.key.high, this.right.item.key.low);
        };


    };

    return Node;
};

