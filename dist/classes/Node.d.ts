/**
 * Created by Alex Bol on 4/1/2017.
 */
import Interval from './Interval';
import { type NodeColor } from '../utils/constants';
declare class Node<V = any> {
    left: Node<V> | null;
    right: Node<V> | null;
    parent: Node<V> | null;
    color: NodeColor;
    item: {
        key: Interval;
        value: V;
    };
    max: Interval | undefined;
    constructor(key?: Interval | [number, number] | undefined, value?: V | undefined, left?: Node<V> | null, right?: Node<V> | null, parent?: Node<V> | null, color?: NodeColor);
    isNil(): boolean;
    _value_less_than(other_node: Node<V>): boolean;
    less_than(other_node: Node<V>): boolean;
    _value_equal(other_node: Node<V>): boolean;
    equal_to(other_node: Node<V>): boolean;
    intersect(other_node: Node<V>): boolean;
    copy_data(other_node: Node<V>): void;
    update_max(): void;
    not_intersect_left_subtree(search_node: Node<V>): boolean;
    not_intersect_right_subtree(search_node: Node<V>): boolean;
}
export default Node;
//# sourceMappingURL=Node.d.ts.map