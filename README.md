# @flatten-js/interval-tree

[![npm version](https://badge.fury.io/js/flatten-interval-tree.svg)](https://badge.fury.io/js/flatten-interval-tree)
[![Build Status](https://travis-ci.org/alexbol99/flatten-js.svg?branch=master)](https://travis-ci.org/alexbol99/flatten-js)

Implementation of the interval binary search tree according to Cormen et al. Introduction to Algorithms (2009, Section 14.3: Interval trees, pp. 348–354).
Cormen shows that insertion, deletion of nodes and range queries take *O(log(n))* time where n is the number of items
stored in the tree.

This package is a part of [flatten-js](https://github.com/alexbol99/flatten-js) library.
The previously used package **flatten-interval-tree** will be deprecated soon.

## Installation
```bash
npm install --save @flatten-js/interval-tree
```
## Usage
```javascript
import IntervalTree from '@flatten-js/interval-tree'
```

### What is interval
Tree stores pairs <key, value> where key is an interval, and value is any value<br/>
Interval is a pair of numbers or a pair of any comparable objects on which may be defined predicates
*equal*, *less* and method *max(p1, p1)* that returns maximum in a pair. 

When interval is an object rather than pair of numbers, this object should have properties *low*, *high*, *max*
and implement methods *less_than(), equal_to(), intersect(), not_intersect(), clone(), output()*.
Two static methods *comparable_max(), comparable_less_than()* define how to compare values in pair. <br/>
This interface is described in typescript definition file *index.d.ts*

Axis aligned rectangle is an example of such interval.
We may look at rectangle as an interval between its low left and top right corners.
See **Box** class in [flatten-js](https://github.com/alexbol99/flatten-js) library as the example 
of Interval interface implementation

### Example

```javascript
import IntervalTree from 'flatten-interval-tree'

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

### Constructor
Create new instance of interval tree
```javascript
let tree = new IntervalTree()
```



### Insert(key[, value])
Insert new item into the tree. Key is an interval object or pair of numbers [low, high]. <br/>
Value may represent any value or reference to any object. If value omitted, tree will store and retrieve keys as values. <br/>
Method returns reference to the inserted node
```javascript
let node = tree.insert(key, value)
```

### Exist(key,value)
Method returns true if item {key, value} exists in the tree. <br/>
Method may be useful if need to support unique items.
```javascript
let exist = tree.exist(key, value)
```

### Remove(key, value)
Removes item from the tree. Returns true if item was actually deleted, false if not found
```javascript
let removed = tree.remove(key, value)
```

### Search(interval)
Returns array of values which keys intersected with given interval. <br/>
```javascript
let resp = tree.search(interval)
```

### Size (getter)
Returns number of items stored in the tree
```javascript
let size = tree.size
```

### Keys (getter)
Returns tree keys in ascendant order
```javascript
let keys = tree.keys
```

### Values (getter)
Returns tree values in ascendant keys order
```javascript
let values = tree.values
``` 

### Items (getter)
Returns items in ascendant keys order
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
