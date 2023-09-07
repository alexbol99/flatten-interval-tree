'use strict';

/**
 * A stateful, bi-directional cursor for an interval tree <br/>
 * This implementation makes no guarantees in the case of insertions or removals from the underlying interval tree <br/>
 * @type {Cursor}
 */
class Cursor {
    /**
     * @param {IntervalTree}
     * @param {Interval} interval - may be null if the cursor is intended to start from the beginning or end
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
            // Get the minimum node that overlaps the search bounds
            let resp_nodes = [];
            this.tree_search_interval(this.root, search_node, resp_nodes);
            node_successor = resp_nodes[0];
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

    /**
     * If there is no precursor node, null is returned.
     * If there is no initial interval, returns the highest node. 
     * @returns A precursor node mapped through the outputMapperFn or null
     */
    prev() {
        let node_precursor;
        if (this.current_node) {
            node_precursor = this.tree.tree_precursor(this.current_node);
        } else if (this.search_node) {
            // Get the maximum node that overlaps the search bounds
            let resp_nodes = [];
            this.tree_search_interval(this.root, search_node, resp_nodes);
            node_precursor = resp_nodes.at(-1);
        } else if (this.tree.root) {
            // Get the maximum node of the tree
            node_precursor = this.tree.local_maximum(this.tree.root);
        } else {
            // Do nothing. Fall through to return null
        }
        this.current_node = node_precursor;
        return node_precursor
            ? this.outputMapperFn(node_precursor.item.value, node_precursor.item.key)
            : null;
    }
};

export default Cursor;