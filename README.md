# Interval Tree

[![npm version](https://badge.fury.io/js/flatten-interval-tree.svg)](https://badge.fury.io/js/flatten-interval-tree)
[![Build Status](https://travis-ci.org/alexbol99/flatten-js.svg?branch=master)](https://travis-ci.org/alexbol99/flatten-js)

Interval Tree implementation as it is described in Cormen et al. (2009, Section 14.3: Interval trees, pp. 348–354).

## Important note

#### This package is not supported and will be deprecated soon. Consider moving to the scoped version [@flatten-js/interval-tree](https://www.npmjs.com/package/@flatten-js/interval-tree).

## Contacts

Follow me on Twitter [@alex_bol_](https://twitter.com/alex_bol_)


## Installation

```bash
npm install flatten-interval-tree -save
```

## Usage

```js
let IntervalTree = require('flatten-interval-tree');
```

## API Reference

### Constructor
Create new instance of interval tree
```js
let tree = new IntervalTree();
```
### Insert(key, value)
Insert new item into the tree. Key is and interval object or an array of [low, high] numeric values. <br/>
Value may represent any value or refer to any object. If value omitted, tree will store and retrieve keys only. <br/>
If key is an object, it should expose <i>low</i> and <i>high</i> properties and implement the following methods:
<i>less_than, equal_to, intersect, clone, output, maximal_val, val_less_than</i>. <br/>
Method returns reference to the inserted node
```js
let node = tree.insert(key, value);
```
### Exist(key,value)
Method returns true if entry {key, value} exists in the tree. <br/>
Method may be useful if need to support unique items.
```js
let exist = tree.exist(key,value);
```
### Remove(key, value)
Removes item from the tree. Returns true if item was actually deleted, false if not found
```js
let removed = tree.remove(key, value);
```
### Search(interval)
Returns array of values which keys intersected with given interval. <br/>
If tree stores only keys with no values, search returns array of keys which intersect given interval
```js
let resp = tree.search(interval);
```
### Size (getter)
Returns number of items stored in the tree
```js
let size = tree.size;
```
### ForEach(visitor)
Enables to traverse the whole tree and perform operation for each item
```js
tree.forEach( (key, value) => console.log(value) )
```
## Tests
```bash
npm test
```
## Contributors

In lieu of a formal style guide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code.

## License

MIT


