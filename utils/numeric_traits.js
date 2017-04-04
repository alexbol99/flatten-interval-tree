/**
 * Created by Alex Bol on 3/31/2017.
 */

/**
 * Default traits are integer number traits
 * @type {{less_than: module.exports.less_than, equal_to: module.exports.equal_to, intersect: module.exports.intersect, not_intersect: module.exports.not_intersect, maximal_of: module.exports.maximal_of, val_less_than: module.exports.val_less_than}}
 */
module.exports = {
    less_than: (item1, item2) => item1.key.less_than(item2.key),

    equal_to: (item1, item2) => item1.key.equal_to(item2.key),

    not_intersect: (item1, item2) => item1.key.not_intersect(item2.key),

    intersect: (item1, item2) => item1.key.intersect(item2.key),

    get_max: (item) => item.key.high,

    maximal_of: (max1, max2) =>         // trait to get maximum of two max properties
        Math.max(max1, max2),

    val_less_than: (val1, val2 ) =>     // trait to compare max property with item ?
        val1 < val2,

    copy_data: (item_dst, item_src) => {
        item_dst.key = item_src.key.clone();
        item_dst.value = item_src.value;
    }
};