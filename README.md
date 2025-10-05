# Interval Tree
[![npm version](https://badge.fury.io/js/%40flatten-js%2Finterval-tree.svg)](https://badge.fury.io/js/%40flatten-js%2Finterval-tree)
[![@flatten-js/interval-tree](https://snyk.io/advisor/npm-package/@flatten-js/interval-tree/badge.svg)](https://snyk.io/advisor/npm-package/@flatten-js/interval-tree)

The package **@flatten-js/interval-tree** is an implementation of interval binary search tree according to Cormen et al. Introduction to Algorithms (2009, Section 14.3: Interval trees, pp. 348–354).
Cormen shows that insertion, deletion of nodes and range queries take *O(log(n))* time where n is the number of items
stored in the tree.

This package is a part of [flatten-js](https://github.com/alexbol99/flatten-js) library.
  
An earlier implementation, [flatten-interval-tree](https://www.npmjs.com/package/flatten-interval-tree), is deprecated.
Please use this package ([@flatten-js/interval-tree](https://www.npmjs.com/package/@flatten-js/interval-tree)) instead.

## Contacts

Follow me on Twitter [@alex_bol_](https://twitter.com/alex_bol_)

## Installation
```bash
npm install --save @flatten-js/interval-tree
```
## Usage
```javascript
import IntervalTree from '@flatten-js/interval-tree'
```

### Notes
Tree stores pairs `<key, value>` where key is an interval, and value is an object of any type.
If value is omitted, the tree stores the key itself as the value for convenience, so searches and iteration still return the key (you can always provide your own mapper).

Keys with the same interval are now bucketed into a single node. This means multiple values can be stored under one identical key without requiring values to be comparable.
No custom comparator is required for values. Equality for values is by strict equality (`===`) unless your value implements an `equal_to(other)` method.

**Interval** can be a pair of numbers `[low, high]` (numeric pairs are normalized so that low <= high), or an object that implements the Interval interface described in the TypeScript typings.

Axis aligned rectangle is an example of such interval.
We may look at rectangle as an interval between its low left and top right corners.
It makes possible to use interval tree in spatial queries.
See **Box** class in [flatten-js](https://github.com/alexbol99/flatten-js) library for such
implementation.

### Example

```javascript
let tree = new IntervalTree();

let intervals = [[6,8],[1,4],[5,12],[1,1],[5,7]];

// Insert interval as a key and string "val0", "val1" etc. as a value 
for (let i=0; i < intervals.length; i++) {
    tree.insert(intervals[i],"val"+i);
}

// Get array of keys sorted in ascendant order
let sorted_intervals = tree.keys;              //  expected array [[1,1],[1,4],[5,7],[5,12],[6,8]]

// Search items which keys intersect with given interval, and return array of values
let values_in_range = tree.search([2,3]);     //  expected array ['val1']
```

## Interval types
The library now supports multiple interval classes:
- Interval (default export): 1D interval whose endpoints are comparable (number, bigint, string, Date).
- TimeInterval: a 1D interval specialized for Date endpoints.
- Interval2D: a lexicographic 2D interval whose endpoints are points [x, y].

Notes:
- The default behavior remains unchanged: passing a numeric pair [low, high] will be normalized and converted into a default 1D Interval.
- To use custom types, construct and pass the concrete interval class instance:

```javascript
import IntervalTree, { TimeInterval, Interval2D } from '@flatten-js/interval-tree';

const tree = new IntervalTree();

// Time intervals
const a = new TimeInterval(new Date('2020-01-01'), new Date('2020-01-31'));
const b = new TimeInterval(new Date('2020-01-15'), new Date('2020-02-15'));

tree.insert(a, 'A');
tree.insert(b, 'B');

const hits = tree.search(new TimeInterval(new Date('2020-01-10'), new Date('2020-01-20')));
// hits -> ['A','B']

// 2D intervals (lexicographic ordering)
const r1 = new Interval2D([0, 0], [10, 10]);
const r2 = new Interval2D([5, 5], [15, 15]);

tree.insert(r1, 'R1');
tree.insert(r2, 'R2');
```

### Constructor
Create new instance of interval tree
```javascript
let tree = new IntervalTree()
```

### Insert(key[, value])
Insert a new item into the tree. Key is an interval object or a pair of numbers `[low, high]` (numeric pairs are normalized so that `low <= high`).
If `value` is omitted, the key itself is stored as the value for convenience.
If a node with an identical key already exists, the value is appended to that node’s bucket.
Returns a reference to the inserted node.
```javascript
let node = tree.insert(key, value)
```

### Exist(key[, value])
Returns `true` if the item exists in the tree.
- Called as `exist(key)`, it checks whether a node with the given key exists (bucket may contain one or more values).
- Called as `exist(key, value)`, it checks whether the specific value exists inside the bucket of that key (strict equality unless the value implements `equal_to`).
```javascript
let existsKey = tree.exist(key)
let existsPair = tree.exist(key, value)
```

### Remove(key[, value])
Removes entries from the tree.
- Called as `remove(key)`, it removes the entire node for that key (i.e., the whole bucket).
- Called as `remove(key, value)`, it removes a single matching value from the bucket; if the bucket becomes empty, the node is removed.
Returns the removed node if something was deleted, or `undefined` if nothing was found.
```javascript
let removedNode = tree.remove(key)
let removedPairNode = tree.remove(key, value)
```

### Search(interval[, outputMapperFn])
Returns array of values which keys intersected with given interval. <br/>
```javascript
let resp = tree.search(interval)
```
Optional *outputMapperFn(value, key)* enables to map search results into custom defined output.
Example:
```javascript
const composers = [
    {name: "Ludwig van Beethoven", period: [1770, 1827]},
    {name: "Johann Sebastian Bach", period: [1685, 1750]},
    {name: "Wolfgang Amadeus Mozart", period: [1756, 1791]},
    {name: "Johannes Brahms", period: [1833, 1897]},
    {name: "Richard Wagner", period: [1813, 1883]},
    {name: "Claude Debussy", period: [1862, 1918]},
    {name: "Pyotr Ilyich Tchaikovsky", period: [1840, 1893]},
    {name: "Frédéric Chopin", period: [1810, 1849]},
    {name: "Joseph Haydn", period: [1732, 1809]},
    {name: "Antonio Vivaldi", period: [1678, 1741]}
];
const tree = new IntervalTree();
for (let composer of composers)
    tree.insert(composer.period, composer.name);

// Great composers who lived in 17th century
const searchRes = tree.search( [1600,1700],
    (name, period) => {return `${name} (${period.low}-${period.high})`});

console.log(searchRes)

// expected to be 
// [ 'Antonio Vivaldi (1678-1741)', 'Johann Sebastian Bach (1685-1750)' ]
```

### Intersect_any(interval)
Returns true if intersection found between given interval and any of intervals stored in the tree

```javascript
let found = tree.intersect_any(interval)
```

### Size
Returns number of items stored in the tree (getter)
```javascript
let size = tree.size
```

### Keys
Returns tree keys in ascendant order (getter)
```javascript
let keys = tree.keys
```

### Values
Returns tree values in ascendant keys order (getter)
```javascript
let values = tree.values
``` 

### Items
Returns items in ascendant keys order (getter)
```javascript
let items = tree.items
```

### ForEach(visitor)
Enables to traverse the whole tree and perform operation for each item
```javascript
tree.forEach( (key, value) => console.log(value) )
```

### Map(callback)
Creates new tree with same keys using callback to transform (key,value) to a new value
```javascript
let tree1 = tree.map((value, key) => (key.high-key.low))
```

### Clear()
Clear tree
```javascript
tree.clear()
```

### Iterate([interval, outputMapperFn])
Returns an iterator (and iterable). <br/>
Call `next` on the iterator to navigate to successor tree nodes and return the corresponding values. <br/>
In the absence of a starting interval, the iterator will start with the lowest interval. <br/>
```javascript
let iterator = tree.iterate();
let next = iterator.next().value;
```
Optional *outputMapperFn(value, key)* enables to map search results into custom defined output. <br/>
Example:
```javascript
let iterator = tree.iterate([5,5], (value, key) => key);
let next_key = iterator.next().value;
```
Supports `for .. of` syntax. <br/>
Example:
```javascript
for (let key of tree.iterate([5,5], (value, key) => key)) {
    if (key[0] > 8) break;
    console.log(key);
}
```

## Documentation
Documentation may be found here: [https://alexbol99.github.io/flatten-interval-tree](https://alexbol99.github.io/flatten-interval-tree/)

## Tests
```bash
npm test
```
## Contributors

In lieu of a formal style guide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code.

## License

MIT

## Support

<a href="https://www.buymeacoffee.com/alexbol99" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-orange.png" alt="Buy Me A Coffee" height="41" width="174"></a>


