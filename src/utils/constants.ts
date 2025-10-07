/**
 * Created by Alex Bol on 3/28/2017.
 */

'use strict';

// module.exports = {
//     RB_TREE_COLOR_RED: 0,
//     RB_TREE_COLOR_BLACK: 1
// };

/**
 * Red-Black Tree color constants
 */
export const RB_TREE_COLOR_RED = 1;
export const RB_TREE_COLOR_BLACK = 0;

export type NodeColor = typeof RB_TREE_COLOR_RED | typeof RB_TREE_COLOR_BLACK;

