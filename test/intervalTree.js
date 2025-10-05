/**
 * Created by Alex Bol on 3/31/2017.
 */

import { expect } from 'chai';
import IntervalTree, { Interval, TimeInterval, Interval2D } from '../dist/main.mjs';

// import IntervalTree from '../dist/interval-tree.esm';

describe('#IntervalTree', function() {
    it('Create new instance of IntervalTree ', function () {
        let tree = new IntervalTree();
        expect(tree).to.be.an.instanceof(IntervalTree);
    });
    it('Size of empty tree will be 0', function () {
        let tree = new IntervalTree();
        expect(tree.size).to.equal(0);
    });
    it('May insert one entry with key - array of numbers', function () {
        let tree = new IntervalTree();
        tree.insert([1,2]);
        expect(tree.size).to.equal(1);
    });
    it('May insert many entries with key - array of numbers', function () {
        let tree = new IntervalTree();
        let ints = [[6,8],[1,4],[5,12],[1,1],[5,7]];
        for (let int of ints) tree.insert(int);
        expect(tree.size).to.equal(5);
    });
    it('May insert entries while transforming numeric pair into Interval', function () {
        let tree = new IntervalTree();
        let pairs = [[6,8],[1,4],[5,12],[1,1],[5,7]];
        for (let pair of pairs) tree.insert(new Interval(pair[0], pair[1]));
        expect(tree.size).to.equal(5);
        expect(tree.keys).to.deep.equal([[1,1],[1,4],[5,7],[5,12],[6,8]]);
    });
    it('May return array of keys sorted', function () {
        let tree = new IntervalTree();
        let ints = [[6,8],[1,4],[5,12],[1,1],[5,7]];
        for (let int of ints) tree.insert(int);
        expect(tree.keys).to.deep.equal([[1,1],[1,4],[5,7],[5,12],[6,8]]);
    });
    it('May test if node entry exist after insertion', function () {
        let tree = new IntervalTree();
        let ints = [[6,8],[1,4],[5,12],[1,1],[5,7]];
        for (let i=0; i < ints.length; i++) tree.insert(ints[i],"val"+i);
        expect(tree.keys).to.deep.equal([[1,1],[1,4],[5,7],[5,12],[6,8]]);
        for (let i=0; i < ints.length; i++) {
            expect(tree.exist(ints[i], "val"+i)).to.equal(true);
        }
    });
    it('May not find value when key was not inserted', function () {
        let tree = new IntervalTree();
        let ints = [[6,8],[1,4],[5,12],[1,1],[5,7]];
        for (let i=0; i < ints.length; i++) tree.insert(ints[i],"val"+i);
        expect(tree.exist([2,4],"val")).to.be.false;        // wrong interval
        expect(tree.exist([1,4],"val2")).to.be.false;       // wrong value
    });
    it('May not find entry after key was deleted', function () {
        let tree = new IntervalTree();
        let ints = [[6,8],[1,4],[5,12],[1,1],[5,7]];
        for (let i=0; i < ints.length; i++) tree.insert(ints[i],"val"+i);
        tree.remove([1,4],"val1");

        expect(tree.size).to.equal(4);
        expect(tree.keys).to.deep.equal([[1,1],[5,7],[5,12],[6,8]]);
        expect(tree.exist([1,4])).to.be.false;
    });
    it('May become empty after all entries will be deleted', function () {
        let tree = new IntervalTree();
        let ints = [[6,8],[1,4],[5,12],[1,1],[5,7]];
        for (let i=0; i < ints.length; i++) tree.insert(ints[i],"val"+i);
        tree.remove([6,8],"val0");
        tree.remove([1,4],"val1");
        tree.remove([5,12],"val2");
        tree.remove([1,1],"val3");
        tree.remove([5,7],"val4");

        expect(tree.size).to.equal(0);
        expect(tree.isEmpty()).to.be.true;
    });
    it('May return array of items', function () {
        let tree = new IntervalTree();
        let ints = [[6,8],[1,4],[5,12],[1,1],[5,7]];
        for (let i=0; i < ints.length; i++) tree.insert(ints[i],"val"+i);

        let items = tree.items;
        let keys = [];
        for (let item of items) {
            keys.push(item)
        }
        expect(items.length).to.equal(5);
        expect(keys.length).to.equal(5);
        expect(tree.keys).to.deep.equal([[1,1],[1,4],[5,7],[5,12],[6,8]]);
    });
    it('May transform tree to another tree using map', function () {
        let tree1 = new IntervalTree();
        let ints = [[6,8],[1,4],[5,12],[1,1],[5,7]];
        for (let i=0; i < ints.length; i++) tree1.insert(ints[i],"val"+i);

        let tree2 = tree1.map( (value, key) => (key.high-key.low) );

        expect(tree2.size).to.equal(5);
        expect(tree2.keys).to.deep.equal([[1,1],[1,4],[5,7],[5,12],[6,8]]);
        expect(tree2.values).to.deep.equal([0,3,2,7,2]);
    });

    it('May search interval and return array of values', function () {
        let tree = new IntervalTree();
        let ints = [[6,8],[1,4],[5,12],[1,1],[5,7]];
        for (let i=0; i < ints.length; i++) tree.insert(ints[i],"val"+i);
        expect(tree.search([2,3])).to.deep.equal(['val1']);
    });
    it('May search interval and return array of custom transformed objects', function () {
        const composers = [
            {name: "Ludwig van Beethoven", period: [1770,1827]},
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

        const searchRes = tree.search( [1600,1700],
            (name, period) => {return `${name} (${period.low}-${period.high})`});
        expect(searchRes.length).to.equal(2);
        expect(searchRes[0]).to.equal("Antonio Vivaldi (1678-1741)");
        expect(searchRes[1]).to.equal("Johann Sebastian Bach (1685-1750)");
    });
    it('May return empty array when search interval does not intersect any', function () {
        let tree = new IntervalTree();
        let ints = [[6,8],[1,2],[7,12],[1,1],[5,7]];
        for (let i=0; i < ints.length; i++) tree.insert(ints[i],"val"+i);
        expect(tree.search([3,4])).to.deep.equal([]);
    });
    it('Each red node has exactly two black child nodes', function () {
        let tree = new IntervalTree();
        let ints = [[6,8],[1,2],[7,12],[1,1],[5,7]];
        for (let i=0; i < ints.length; i++) tree.insert(ints[i],"val"+i);
        expect(tree.testRedBlackProperty()).to.equal(true);
    });
    it('Each path from root to nil node has same black height', function () {
        let tree = new IntervalTree();
        let ints = [[6,8],[1,2],[7,12],[1,1],[5,7]];
        for (let i=0; i < ints.length; i++) tree.insert(ints[i],"val"+i);
        let height = (tree) => {
            return tree.testBlackHeightProperty(tree.root);
        };
        expect(height(tree)).to.equal(3);
    });
    it('Same black height property preserved while nodes deleted', function () {
        let tree = new IntervalTree();
        let ints = [[6,8],[1,2],[7,12],[1,1],[5,7]];
        for (let i=0; i < ints.length; i++) tree.insert(ints[i],"val"+i);
        let height = (tree) => {
            return tree.testBlackHeightProperty(tree.root);
        };

        tree.remove([1,1],"val3");
        // h = height(tree);
        expect(height(tree)).to.equal(3);
        expect(tree.testRedBlackProperty()).to.equal(true);

        tree.remove([5,7],"val4");
        expect(height(tree)).to.equal(3);
        expect(tree.testRedBlackProperty()).to.equal(true);

        tree.remove([1,2],"val1");
        expect(tree.testRedBlackProperty()).to.equal(true);
        expect(height(tree)).to.equal(2);

        tree.remove([6,8],"val0");
        expect(tree.testRedBlackProperty()).to.equal(true);
        expect(height(tree)).to.equal(2);

        tree.remove([7,12],"val2");
        expect(tree.testRedBlackProperty()).to.equal(true);
    });
    it("Fix issue #9", function() {
        function setupTreeAndSearch(intervals, searchInterval) {
            let tree = new IntervalTree();

            for (let i=0; i < intervals.length; i++) {
                tree.insert(intervals[i],"val"+i);
            }

            return tree.search(searchInterval);
        }

        let resp1 = setupTreeAndSearch(
            [[1,1], [1,4], [5,6], [5.5,7], [7,8]],
            [5.5, 5.7]
        );
        expect(resp1).to.be.deep.equal(["val2", "val3"]);

        let resp2 = setupTreeAndSearch(
            [[1,1], [1,4], [5,6], [6,7], [7,8]],
            [5.5, 5.7]
        );
        expect(resp2).to.be.deep.equal(["val2"]);
    });
    it('Low or high can be 0', function () {
        let tree = new IntervalTree();
        let ints = [[0,0],[0,0],[1,1],[0,0]];
        for (let i=0; i < ints.length; i++) tree.insert(ints[i],"val"+i);
        expect(tree.search([0,0])).to.deep.equal(['val0','val1','val3']);
    });
    it("Fix issue #15 Unable to remove/find some of the nodes", function() {
        const intervalTree3 = new IntervalTree();

        intervalTree3.insert([2, 5], 10);
        intervalTree3.insert([2, 5], 20);
        intervalTree3.insert([2, 5], 30);
        intervalTree3.insert([2, 5], 40);
        intervalTree3.insert([2, 5], 50);

        expect(intervalTree3.exist([2, 5], 10)).to.be.true;
        expect(intervalTree3.exist([2, 5], 20)).to.be.true;
        expect(intervalTree3.exist([2, 5], 30)).to.be.true;
        expect(intervalTree3.exist([2, 5], 40)).to.be.true;
        expect(intervalTree3.exist([2, 5], 50)).to.be.true;
        expect(intervalTree3.exist([2, 5], 25)).to.be.false;
    });
    it("Fix issue #16 Storing '0' as a key value will return a key pair when searching ", function() {
        const tree = new IntervalTree();
        tree.insert([0, 0], 0);
        tree.insert([0, 0], 1);

        let resp1 = tree.search([0, 0])
        expect(resp1).to.deep.equal([0,1])

        tree.remove([0, 0], 1);

        expect(tree.exist([0, 0], 0)).to.be.true;
        expect(tree.exist([0, 0], 1)).to.be.false;

        let resp2 = tree.search([0, 0])

        expect(resp2).to.deep.equal([0])
    })
    it("May store any falsy values: 0, false, NaN, null ", function() {
        const tree = new IntervalTree();
        tree.insert([0, 0], 0);
        tree.insert([0, 0], false);
        tree.insert([0, 0], NaN);
        tree.insert([0, 0], null);

        let resp1 = tree.search([0,0]);
        expect(resp1).to.deep.equal([0, false, NaN, null]);
    })
    it("Cannot store undefined value", function() {
        const tree = new IntervalTree();
        tree.insert([0, 0], undefined);

        let resp1 = tree.search([0,0]);
        expect(resp1).to.deep.equal([[0,0]]);
    })
    it('May search interval and return true if intersection with any interval found. Issue #26', function () {
        let tree = new IntervalTree();
        let intervals = [[7,8],[1,4],[11,12],[1,1],[5,7]];
        for (let i=0; i < intervals.length; i++) tree.insert(intervals[i],"val"+i);
        expect(tree.intersect_any([2,3])).to.be.true;
        expect(tree.intersect_any([4,4])).to.be.true;
        expect(tree.intersect_any([4,10])).to.be.true;
        expect(tree.intersect_any([9,10])).to.be.false;
        expect(tree.intersect_any([-1,0])).to.be.false;
        expect(tree.intersect_any([15,20])).to.be.false;
    });
    it('May test if any of great composers lived in second half of XX century', function () {
        const composers = [
            {name: "Ludwig van Beethoven", period: [1770,1827]},
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
        expect(tree.intersect_any( [1950, 2000])).to.be.false;
    });
    it("May inherit Interval class and override its methods ", function() {
        class TimeInterval extends Interval {
            not_intersect(other_interval) {
                return (this.high <= other_interval.low || other_interval.high <= this.low);
            }
        }
        const tree = new IntervalTree();
        tree.insert(new TimeInterval(7,8));
        tree.insert(new TimeInterval(1,4));
        tree.insert(new TimeInterval(11,12));
        tree.insert(new TimeInterval(5,7));

        const resp1 = tree.search([4,5]);
        expect(resp1).to.deep.equal([]);

        const resp2 = tree.search([4,11]);
        expect(resp2).to.deep.equal([[5,7],[7,8]]);
    })
    it("May store bigint values", () => {
        const tree = new IntervalTree();
        tree.insert([2, 5], 10n);
        expect(tree.search([2,5])).to.deep.equal([10n])
    })
    it("May store bigint intervals", () => {
        const tree = new IntervalTree();
        const i1 = new Interval(2n, 5n)
        const i2 = new Interval(3n, 7n)
        tree.insert(i1, 10);
        tree.insert(i2, 20);
        expect(tree.search(new Interval(4n, 6n))).to.deep.equal([10, 20])
    })
    it("Can store custom objects without custom comparator #54", () => {
        const tree = new IntervalTree();
        const data = [
            {name: "A", value: 111},
            {name: "B", value: 333},
            {name: "C", value: 222},
        ];

        // Insert multiple objects with the same key; they should bucket under a single node
        tree.insert([2, 5], data[0]);
        tree.insert([2, 5], data[1]);
        tree.insert([2, 5], data[2]);

        // Existence checks by object identity (no less_than required)
        expect(tree.exist([2, 5], data[1])).to.be.true;
        expect(tree.exist([2, 5], data[2])).to.be.true;
        expect(tree.exist([2, 5], data[0])).to.be.true;

        // Remove a specific object from the bucket, others remain
        tree.remove([2,5], data[0]);
        expect(tree.exist([2, 5], data[0])).to.be.false;
    })
    describe('##Iterator', function() {
        it('May find first intersecting interval', function () {
            let tree = new IntervalTree();
            let ints = [[6,8],[1,3],[5,12],[1,1],[5,7]];
            for (let int of ints) tree.insert(int);
            let iterator = tree.iterate([3,8]);
            expect(iterator.next().value).to.deep.equal([1,3]);
        });
        it('Finds the lowest intersecting interval regardless of tree structure', function () {
            let tree = new IntervalTree();
            let ints = [[6,8],[5,12],[4,7],[1,5]];
            for (let int of ints) tree.insert(int);
            let iterator = tree.iterate([5,5]);
            expect(iterator.next().value).to.deep.equal([1,5]);
        });
        it('May find first forward interval when there is no intersection', function () {
            let tree = new IntervalTree();
            let ints = [[6,8],[1,3],[5,12],[1,1],[5,7]];
            for (let int of ints) tree.insert(int);
            let iterator = tree.iterate([4,4]);
            expect(iterator.next().value).to.deep.equal([5,7]);
        });
        it('May find first interval when no interval is passed', function () {
            let tree = new IntervalTree();
            let ints = [[6,8],[1,3],[5,12],[1,1],[5,7]];
            for (let int of ints) tree.insert(int);
            let iterator = tree.iterate();
            expect(iterator.next().value).to.deep.equal([1,1]);
        });
        it('Supports iteration with `for .. of` syntax', function () {
            let tree = new IntervalTree();
            let ints = [[6,8],[1,3],[5,12],[1,1],[5,7]];
            for (let int of ints) tree.insert(int);
            let results = [];
            for (let val of tree.iterate([4,4])) {
                results.push(val);
            }
            expect(results).to.deep.equal([[5,7],[5,12],[6,8]]);
        });
        it('Returns `{done: true}` when it reaches the end', function () {
            let tree = new IntervalTree();
            let ints = [[6,8],[1,3],[5,12],[1,1],[5,7]];
            for (let int of ints) tree.insert(int);
            let iterator = tree.iterate([8,8]);
            expect(iterator.next().value).to.deep.equal([5,12]);
            expect(iterator.next().value).to.deep.equal([6,8]);
            let res = iterator.next();
            expect(res.value).to.equal(undefined);
            expect(res.done).to.equal(true);
        });
        it('Supports custom transformed objects', function () {
            const composers = [
                {name: "Ludwig van Beethoven", period: [1770,1827]},
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
            let iterator = tree.iterate([1600, 1700],
                (name, period) => {return `${name} (${period.low}-${period.high})`});
            expect(iterator.next().value).to.equal("Antonio Vivaldi (1678-1741)");
            expect(iterator.next().value).to.equal("Johann Sebastian Bach (1685-1750)");
        });
    });
});



// Edge cases merged from former test/edgeCases.js
describe('#IntervalTree edge cases', function () {
  it('Buckets multiple values for the same key and counts size across bucket', function () {
    const tree = new IntervalTree();
    tree.insert([2, 5], 'a');
    tree.insert([2, 5], 'b');
    tree.insert([2, 5], 'c');
    // Inserting key only adds key as value
    tree.insert([7, 9]);

    expect(tree.size).to.equal(4); // 3 values under [2,5] + 1 value equal to key [7,9]
    expect(tree.keys).to.deep.equal([[2,5],[7,9]]);

    // Items should include each value paired with the same key
    const items = tree.items;
    const bucketVals = items.filter(it => it.key[0] === 2 && it.key[1] === 5).map(it => it.value);
    expect(bucketVals).to.have.members(['a','b','c']);
  });

  it('Removal: remove(key, value) removes a single occurrence; remove(key) deletes entire node when bucket empty', function () {
    const tree = new IntervalTree();
    tree.insert([2, 5], 'x');
    tree.insert([2, 5], 'y');
    tree.insert([2, 5], 'y'); // duplicate value

    expect(tree.exist([2,5], 'x')).to.be.true;
    expect(tree.exist([2,5], 'y')).to.be.true;
    expect(tree.exist([2,5])).to.be.true; // key existence

    // Remove one y
    tree.remove([2,5], 'y');
    expect(tree.exist([2,5], 'x')).to.be.true;
    expect(tree.exist([2,5], 'y')).to.be.true; // one y remains

    // Remove node entirely
    tree.remove([2,5]);
    expect(tree.exist([2,5])).to.be.false;
    expect(tree.size).to.equal(0);
  });

  it('Iteration yields values in key order and preserves insertion order within a bucket', function () {
    const tree = new IntervalTree();
    tree.insert([5, 7], 'a1');
    tree.insert([1, 3], 'b1');
    tree.insert([5, 7], 'a2');
    tree.insert([1, 3], 'b2');

    const results = [];
    for (const v of tree.iterate()) {
      results.push(v);
    }
    // Key order: [1,3] then [5,7]; insertion order within each bucket
    expect(results).to.deep.equal(['b1','b2','a1','a2']);
  });

  it('Normalizes reversed numeric interval input [high, low] -> [low, high]', function () {
    const tree = new IntervalTree();
    tree.insert([9, 2], 'v');
    expect(tree.keys).to.deep.equal([[2,9]]);
    expect(tree.search([2,9])).to.deep.equal(['v']);
  });

  it('insert(undefined) is ignored and does not modify the tree', function () {
    const tree = new IntervalTree();
    // @ts-ignore intentionally pass undefined at runtime
    const res = tree.insert(undefined);
    expect(res).to.equal(undefined);
    expect(tree.size).to.equal(0);
    expect(tree.keys).to.deep.equal([]);
  });

  it('clear() empties the tree and allows subsequent inserts', function () {
    const tree = new IntervalTree();
    tree.insert([2, 3], 'a');
    tree.insert([4, 5], 'b');
    expect(tree.size).to.equal(2);

    tree.clear();
    expect(tree.isEmpty()).to.be.true;
    expect(tree.size).to.equal(0);

    tree.insert([7, 8], 'c');
    expect(tree.isEmpty()).to.be.false;
    expect(tree.keys).to.deep.equal([[7,8]]);
  });

  it('search with custom mapper receives both value and key', function () {
    const tree = new IntervalTree();
    tree.insert([10, 12], { id: 1 });
    tree.insert([11, 13], { id: 2 });
    const out = tree.search([11, 11.5], (value, key) => ({ id: value.id, len: Number(key.high) - Number(key.low) }));
    expect(out).to.deep.equal([{ id: 1, len: 2 }, { id: 2, len: 2 }]);
  });

  it('BigInt keys: reversed tuple normalized and intersects properly', function () {
    const tree = new IntervalTree();
    tree.insert([8, 2]); // numeric
    tree.insert(new Interval(3n, 6n), 'bi');
    const res = tree.search(new Interval(4n, 5n));
    // Default mapper returns the original value. For the numeric key inserted without a value,
    // the stored value is the original array [8,2], while the node key is normalized to [2,8].
    // So we expect the numeric key array and the bigint-tagged value.
    expect(res).to.deep.equal([[8,2], 'bi']);
    expect(tree.keys[0]).to.deep.equal([2,8]);
  });
});


// Additional tests for TimeInterval (Date-based intervals)
describe('#IntervalTree TimeInterval', function () {
    it('Supports insertion and search with TimeInterval (Date)', function () {
        const tree = new IntervalTree();
        const a1 = new Date('2020-01-01T00:00:00Z');
        const a2 = new Date('2020-01-31T00:00:00Z');
        const b1 = new Date('2020-01-15T00:00:00Z');
        const b2 = new Date('2020-02-15T00:00:00Z');
        tree.insert(new TimeInterval(a1, a2), 'A');
        tree.insert(new TimeInterval(b1, b2), 'B');

        const q1 = new Date('2020-01-10T00:00:00Z');
        const q2 = new Date('2020-01-20T00:00:00Z');
        const res = tree.search(new TimeInterval(q1, q2));
        expect(res).to.deep.equal(['A', 'B']);
    });
});

// Additional tests for Interval2D (2D lexicographic intervals)
describe('#IntervalTree Interval2D', function () {
    it('Supports insertion and search with Interval2D', function () {
        const tree = new IntervalTree();
        const r1 = new Interval2D([0, 0], [10, 10]);
        const r2 = new Interval2D([5, 5], [15, 15]);
        const r3 = new Interval2D([20, 0], [25, 5]);
        tree.insert(r1, 'R1');
        tree.insert(r2, 'R2');
        tree.insert(r3, 'R3');

        const q = new Interval2D([7, 7], [8, 8]);
        const res = tree.search(q);
        expect(res).to.deep.equal(['R1', 'R2']);
    });

    it('Outputs keys as pairs of 2D points and preserves order', function () {
        const tree = new IntervalTree();
        tree.insert(new Interval2D([0, 0], [1, 1]), 'a');
        tree.insert(new Interval2D([0, 1], [1, 2]), 'b');
        tree.insert(new Interval2D([1, 0], [2, 0]), 'c');
        const keys = tree.keys;
        expect(keys[0]).to.deep.equal([[0,0],[1,1]]);
        expect(keys[1]).to.deep.equal([[0,1],[1,2]]);
        expect(keys[2]).to.deep.equal([[1,0],[2,0]]);
    });

    it('Non-intersecting query returns empty array', function () {
        const tree = new IntervalTree();
        tree.insert(new Interval2D([0, 0], [1, 1]), 'a');
        const res = tree.search(new Interval2D([2, 0], [3, 1]));
        expect(res).to.deep.equal([]);
    });
});
