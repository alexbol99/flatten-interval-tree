/**
 * Created by Alex Bol on 4/1/2017.
 */

'use strict';

// let defaultTraits = require('../utils/numeric_traits');

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Interval = require('../classes/interval');

var _require = require('../utils/constants'),
    RB_TREE_COLOR_RED = _require.RB_TREE_COLOR_RED,
    RB_TREE_COLOR_BLACK = _require.RB_TREE_COLOR_BLACK;

var Node = function () {
    function Node() {
        var key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
        var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
        var left = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
        var right = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
        var parent = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
        var color = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : RB_TREE_COLOR_BLACK;

        _classCallCheck(this, Node);

        this.left = left; // reference to left child node
        this.right = right; // reference to right child node
        this.parent = parent; // reference to parent node
        this.color = color;

        this.item = { key: key, value: value }; // key is supposed to be       instance of Interval

        /* If not, this should by an array of two numbers */
        this.item.key == undefined;
        if (key && key instanceof Array && key.length == 2) {
            if (!Number.isNaN(key[0]) && !Number.isNaN(key[1])) {
                this.item.key = new Interval(Math.min(key[0], key[1]), Math.max(key[0], key[1]));
            }
        }
        this.max = this.item.key ? this.item.key.max : undefined;
    }

    _createClass(Node, [{
        key: 'less_than',
        value: function less_than(other_node) {
            return this.item.key.less_than(other_node.item.key);
        }
    }, {
        key: 'equal_to',
        value: function equal_to(other_node) {
            var value_equal = true;
            if (this.item.value && other_node.item.value) {
                value_equal = this.item.value.equal_to ? this.item.value.equal_to(other_node.item.value) : this.item.value == other_node.item.value;
            }
            return this.item.key.equal_to(other_node.item.key) && value_equal;
        }
    }, {
        key: 'intersect',
        value: function intersect(other_node) {
            return this.item.key.intersect(other_node.item.key);
        }
    }, {
        key: 'copy_data',
        value: function copy_data(other_node) {
            this.item.key = other_node.item.key.clone();
            this.item.value = other_node.item.value;
        }
    }, {
        key: 'update_max',
        value: function update_max() {
            // use key (Interval) max property instead of key.high
            this.max = this.item.key ? this.item.key.max : undefined;
            if (this.right && this.right.max) {
                var maximal_val = this.item.key.maximal_val;
                this.max = maximal_val(this.max, this.right.max);
            }
            if (this.left && this.left.max) {
                var _maximal_val = this.item.key.maximal_val;
                this.max = _maximal_val(this.max, this.left.max);
            }
        }

        // Other_node does not intersect any node of left subtree, if this.left.max < other_node.item.key.low

    }, {
        key: 'not_intersect_left_subtree',
        value: function not_intersect_left_subtree(search_node) {
            var val_less_than = this.item.key.val_less_than;
            var high = this.left.max.high ? this.left.max.high : this.left.max;
            return val_less_than(high, search_node.item.key.low);
        }

        // Other_node does not intersect right subtree if other_node.item.key.high < this.right.key.low

    }, {
        key: 'not_intersect_right_subtree',
        value: function not_intersect_right_subtree(search_node) {
            var val_less_than = this.item.key.val_less_than;
            var low = this.right.max.low ? this.right.max.low : this.right.item.key.low;
            return val_less_than(search_node.item.key.high, low);
        }
    }]);

    return Node;
}();

module.exports = Node;