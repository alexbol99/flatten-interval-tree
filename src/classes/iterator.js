'use strict';

import Node from './node.js';

/**
 * A stateful iterator for an interval tree <br/>
 * This implementation makes no guarantees in the case of insertions or removals from the underlying interval tree <br/>
 * @type {Iterator}
 */
class Iterator {
    /**
     * @param {IntervalTree}
     * @param {Interval} interval - may be null if the iterator is intended to start from the beginning or end
     * @param outputMapperFn(value,key) - optional function that maps (value, key) to custom output
     */
    constructor(tree, interval, outputMapperFn) {
        this.tree = tree;
        this.search_node = interval ? new Node(interval) : null;
        this.outputMapperFn = outputMapperFn;
        this.current_node = null;
    }

    /**
     * If there is no successor node, null is returned.
     * If there is no initial interval, returns the lowest node. 
     * @returns A successor node mapped through the outputMapperFn or null
     */
    next() {
        let node_successor;
        if (this.current_node) {
            node_successor = this.tree.tree_successor(this.current_node);
        } else if (this.search_node) {
            node_successor = this.tree.tree_search_nearest_forward(this.tree.root, this.search_node);
            // Prevent the iterator from starting back from the original interval when the iterator finishes
            this.search_node = null;
        } else if (this.tree.root) {
            // Get the minimum node of the tree
            node_successor = this.tree.local_minimum(this.tree.root);
        } else {
            // Do nothing. Fall through to return null
        }
        this.current_node = node_successor;
        return node_successor
            ? this.outputMapperFn(node_successor.item.value, node_successor.item.key)
            : null;
    }
};

export default Iterator;
