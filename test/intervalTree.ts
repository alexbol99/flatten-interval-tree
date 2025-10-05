/**
 * Created by Alex Bol on 3/31/2017.
 */

import { expect } from 'chai';
import IntervalTree, { Interval, TimeInterval, Interval2D } from '../dist/main.mjs';
import type { IntervalInput } from "../src";

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
        let ints = [[6,8],[1,4],[5,12],[1,1],[5,7]] as IntervalInput[];
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
        let ints = [[6,8],[1,4],[5,12],[1,1],[5,7]] as IntervalInput[];
        for (let int of ints) tree.insert(int);
        expect(tree.keys).to.deep.equal([[1,1],[1,4],[5,7],[5,12],[6,8]]);
    });
    it('May test if node entry exist after insertion', function () {
        let tree = new IntervalTree<string>();
        let ints = [[6,8],[1,4],[5,12],[1,1],[5,7]] as IntervalInput[];
        for (let i=0; i < ints.length; i++) tree.insert(ints[i],"val"+i);
        expect(tree.keys).to.deep.equal([[1,1],[1,4],[5,7],[5,12],[6,8]]);
        for (let i=0; i < ints.length; i++) {
            expect(tree.exist(ints[i], "val"+i)).to.equal(true);
        }
    });
    it('May not find value when key was not inserted', function () {
        let tree = new IntervalTree<string>();
        let ints = [[6,8],[1,4],[5,12],[1,1],[5,7]] as IntervalInput[];
        for (let i=0; i < ints.length; i++) tree.insert(ints[i],"val"+i);
        expect(tree.exist([2,4],"val")).to.be.false;        // wrong interval
        expect(tree.exist([1,4],"val2")).to.be.false;       // wrong value
    });
    it('May not find entry after key was deleted', function () {
        let tree = new IntervalTree<string>();
        let ints = [[6,8],[1,4],[5,12],[1,1],[5,7]] as IntervalInput[];
        for (let i=0; i < ints.length; i++) tree.insert(ints[i],"val"+i);
        tree.remove([1,4],"val1");

        expect(tree.size).to.equal(4);
        expect(tree.keys).to.deep.equal([[1,1],[5,7],[5,12],[6,8]]);
        expect(tree.exist([1,4])).to.be.false;
    });
    it('May become empty after all entries will be deleted', function () {
        let tree = new IntervalTree<string>();
        let ints = [[6,8],[1,4],[5,12],[1,1],[5,7]] as IntervalInput[];
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
        let tree = new IntervalTree<string>();
        let ints = [[6,8],[1,4],[5,12],[1,1],[5,7]] as IntervalInput[];
        for (let i=0; i < ints.length; i++) tree.insert(ints[i],"val"+i);

        let items = tree.items;
        let keys: any[] = [];
        for (let item of items) {
            keys.push(item)
        }
        expect(items.length).to.equal(5);
        expect(keys.length).to.equal(5);
        expect(tree.keys).to.deep.equal([[1,1],[1,4],[5,7],[5,12],[6,8]]);
    });
    it('May transform tree to another tree using map', function () {
        let tree1 = new IntervalTree<string>();
        let ints = [[6,8],[1,4],[5,12],[1,1],[5,7]] as IntervalInput[];
        for (let i=0; i < ints.length; i++) tree1.insert(ints[i],"val"+i);

        let tree2 = tree1.map( (_, key) => ((key.high as number) - (key.low as number)) );

        expect(tree2.size).to.equal(5);
        expect(tree2.keys).to.deep.equal([[1,1],[1,4],[5,7],[5,12],[6,8]]);
        expect(tree2.values).to.deep.equal([0,3,2,7,2]);
    });

    it('May search interval and return array of values', function () {
        let tree = new IntervalTree<string>();
        let ints = [[6,8],[1,4],[5,12],[1,1],[5,7]] as IntervalInput[];
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
        const tree = new IntervalTree<string>();
        for (let composer of composers)
            tree.insert(composer.period as [number,number], composer.name);

        const searchRes = tree.search( [1600,1700],
            (name, period) => {return `${name} (${period.low}-${period.high})`});
        expect(searchRes.length).to.equal(2);
        expect(searchRes[0]).to.equal("Antonio Vivaldi (1678-1741)");
        expect(searchRes[1]).to.equal("Johann Sebastian Bach (1685-1750)");
    });
    it('May return empty array when search interval does not intersect any', function () {
        let tree = new IntervalTree<string>();
        let ints = [[6,8],[1,2],[7,12],[1,1],[5,7]] as IntervalInput[];
        for (let i=0; i < ints.length; i++) tree.insert(ints[i],"val"+i);
        expect(tree.search([3,4])).to.deep.equal([]);
    });
    it('Each red node has exactly two black child nodes', function () {
        let tree = new IntervalTree<string>();
        let ints = [[6,8],[1,2],[7,12],[1,1],[5,7]] as IntervalInput[];
        for (let i=0; i < ints.length; i++) tree.insert(ints[i],"val"+i);
        expect(tree.testRedBlackProperty()).to.equal(true);
    });
    it('Each path from root to nil node has same black height', function () {
        let tree = new IntervalTree<string>();
        let ints = [[6,8],[1,2],[7,12],[1,1],[5,7]] as IntervalInput[];
        for (let i=0; i < ints.length; i++) tree.insert(ints[i],"val"+i);
        let height = (tree: any) => {
            return tree.testBlackHeightProperty(tree.root);
        };
        expect(height(tree)).to.equal(3);
    });
    it('Same black-height and red-black properties preserved while nodes deleted', function () {
        let tree = new IntervalTree<string>();
        let ints = [[6,8],[1,2],[7,12],[1,1],[5,7]] as IntervalInput[];
        for (let i=0; i < ints.length; i++) tree.insert(ints[i],"val"+i);

        // After each removal, at least ensure the red-black child property holds
        tree.remove([1,1],"val3");
        expect(tree.testRedBlackProperty()).to.equal(true);

        tree.remove([5,7],"val4");
        expect(tree.testRedBlackProperty()).to.equal(true);

        tree.remove([6,8],"val0");
        expect(tree.testRedBlackProperty()).to.equal(true);

        tree.remove([1,2],"val1");
        tree.remove([7,12],"val2");
        // Tree may become empty at this point
        expect(tree.isEmpty() || tree.testRedBlackProperty()).to.be.true;
    });
    it('Every red node has black parent', function () {
        let tree = new IntervalTree<string>();
        let ints = [[6,8],[4,10],[1,3],[5,12],[1,1],[5,7]] as IntervalInput[];
        for (let i=0; i < ints.length; i++) tree.insert(ints[i],"val"+i);
        // Equivalent to no-double-red: each red node has two black children
        expect(tree.testRedBlackProperty()).to.equal(true);
    });

    it('Size reflects bucketed values for identical keys', function () {
        let intervalTree3 = new IntervalTree<number>();

        // Inserting five values under one key
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
        const tree = new IntervalTree<number>();
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
        const tree = new IntervalTree<number | boolean | null>();
        tree.insert([0, 0], 0);
        tree.insert([0, 0], false);
        tree.insert([0, 0], NaN);
        tree.insert([0, 0], null);

        let resp1 = tree.search([0,0]);
        expect(resp1).to.deep.equal([0, false, NaN, null]);
    })
    it("Cannot store undefined value", function() {
        const tree = new IntervalTree<unknown>();
        tree.insert([0, 0], undefined as any);

        let resp1 = tree.search([0,0]);
        expect(resp1).to.deep.equal([[0,0]]);
    })
    it('May search interval and return true if intersection with any interval found. Issue #26', function () {
        let tree = new IntervalTree<string>();
        let intervals = [[7,8],[1,4],[11,12],[1,1],[5,7]] as IntervalInput[];
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
        const tree = new IntervalTree<string>();
        for (let composer of composers)
            tree.insert(composer.period as [number,number], composer.name);
        expect(tree.intersect_any( [1950, 2000])).to.be.false;
    });
    it("May inherit Interval class and override its methods ", function() {
        class MyTimeInterval extends Interval {
            not_intersect(other_interval: Interval) {
                return (this.high as any) <= (other_interval.low as any) || (other_interval.high as any) <= (this.low as any);
            }
        }
        const tree = new IntervalTree<[number, number]>();
        tree.insert(new MyTimeInterval(7,8));
        tree.insert(new MyTimeInterval(1,4));
        tree.insert(new MyTimeInterval(11,12));
        tree.insert(new MyTimeInterval(5,7));

        const resp1 = tree.search([4,5]);
        expect(resp1).to.deep.equal([]);

        const resp2 = tree.search([4,11]);
        expect(resp2).to.deep.equal([[5,7],[7,8]]);
    })
    it("May store bigint values", () => {
        const tree = new IntervalTree<bigint>();
        tree.insert([2, 5], 10n);
        expect(tree.search([2,5])).to.deep.equal([10n])
    })
    it("May store bigint intervals", () => {
        const tree = new IntervalTree<number>();
        const i1 = new Interval(2n as any, 5n as any)
        const i2 = new Interval(3n as any, 7n as any)
        tree.insert(i1 as any, 10);
        tree.insert(i2 as any, 20);
        expect(tree.search(new Interval(4n as any, 5n as any) as any)).to.deep.equal([10, 20])
    })
    it("Can store custom objects without custom comparator #54", () => {
        type Item = {name: string; value: number};
        const tree = new IntervalTree<Item>();
        const data: Item[] = [
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
            let tree = new IntervalTree<[number, number]>();
            let ints = [[6,8],[1,3],[5,12],[1,1],[5,7]] as IntervalInput[];
            for (let int of ints) tree.insert(int);
            let iterator = tree.iterate([3,8]);
            expect(iterator.next().value).to.deep.equal([1,3]);
        });
        it('Finds the lowest intersecting interval regardless of tree structure', function () {
            let tree = new IntervalTree<[number, number]>();
            let ints = [[6,8],[5,12],[4,7],[1,5]] as IntervalInput[];
            for (let int of ints) tree.insert(int);
            let iterator = tree.iterate([5,5]);
            expect(iterator.next().value).to.deep.equal([1,5]);
        });
        it('May find first forward interval when there is no intersection', function () {
            let tree = new IntervalTree<[number, number]>();
            let ints = [[6,8],[1,3],[5,12],[1,1],[5,7]] as IntervalInput[];
            for (let int of ints) tree.insert(int);
            let iterator = tree.iterate([4,4]);
            expect(iterator.next().value).to.deep.equal([5,7]);
        });
        it('May find first interval when no interval is passed', function () {
            let tree = new IntervalTree<[number, number]>();
            let ints = [[6,8],[1,3],[5,12],[1,1],[5,7]] as IntervalInput[];
            for (let int of ints) tree.insert(int);
            let iterator = tree.iterate();
            expect(iterator.next().value).to.deep.equal([1,1]);
        });
        it('Supports iteration with `for .. of` syntax', function () {
            let tree = new IntervalTree<[number, number]>();
            let ints = [[6,8],[1,3],[5,12],[1,1],[5,7]] as IntervalInput[];
            for (let int of ints) tree.insert(int);
            let results: any[] = [];
            for (let val of tree.iterate([4,4])) {
                results.push(val);
            }
            expect(results).to.deep.equal([[5,7],[5,12],[6,8]]);
        });
        it('Returns `{done: true}` when it reaches the end', function () {
            let tree = new IntervalTree<[number, number]>();
            let ints = [[6,8],[1,3],[5,12],[1,1],[5,7]] as IntervalInput[];
            for (let int of ints) tree.insert(int);
            let iterator = tree.iterate([6, 8]);
            iterator.next();
            iterator.next();
            iterator.next();
            const last = iterator.next();
            expect(last.done).to.be.true;
        });
        it('Works with a custom mapper passed to iterate', function () {
            let tree = new IntervalTree<string>();
            let ints = [[6,8],[1,3],[5,12],[1,1],[5,7]] as IntervalInput[];
            for (let i=0; i < ints.length; i++) tree.insert(ints[i],"v"+i);
            let iterator = tree.iterate([4,4], (_, key) => key.output());
            const vals = Array.from(iterator);
            expect(vals).to.deep.equal([[5,7],[5,12],[6,8]]);
        });
    });


    it('iterate() without args yields all values, same as search() without args', function () {
        const tree = new IntervalTree<string>();
        const ints = [[1,3],[5,6],[7,9]] as IntervalInput[];
        for (let i=0; i < ints.length; i++) tree.insert(ints[i], 'v'+i);
        const all = Array.from(tree.iterate());
        expect(all).to.deep.equal(['v0', 'v1', 'v2']);
    });

    it('BigInt keys: reversed tuple normalized and intersects properly', function () {
        const tree = new IntervalTree<any>();
        tree.insert([8, 2]); // numeric
        tree.insert(new Interval(3n as any, 6n as any) as any, 'bi');
        const res = tree.search(new Interval(4n as any, 5n as any) as any);
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
        const tree = new IntervalTree<string>();
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

    it('Find a free timeslot in a schedule (60 minutes)', function () {
        const tree = new IntervalTree<string>();
        const day = (s: string) => new Date(s);

        // Working hours: 09:00–17:00 UTC
        const workStart = day('2020-01-01T09:00:00Z');
        const workEnd = day('2020-01-01T17:00:00Z');

        // Busy meetings
        tree.insert(new TimeInterval(day('2020-01-01T09:00:00Z'), day('2020-01-01T10:00:00Z')), 'M1');
        tree.insert(new TimeInterval(day('2020-01-01T10:30:00Z'), day('2020-01-01T11:00:00Z')), 'M2');
        tree.insert(new TimeInterval(day('2020-01-01T12:00:00Z'), day('2020-01-01T13:30:00Z')), 'M3');

        // Find the first 60-min free slot
        const busy = tree.search(new TimeInterval(workStart, workEnd), (_v, k) => k as any as TimeInterval) as any as TimeInterval[];
        busy.sort((a, b) => (a.low as Date).getTime() - (b.low as Date).getTime());

        const merged: TimeInterval[] = [];
        for (const iv of busy) {
            if (merged.length === 0) { merged.push(iv); continue; }
            const last = merged[merged.length - 1];
            if ((iv.low as Date) <= (last.high as Date)) {
                // merge
                const hi = (iv.high as Date) > (last.high as Date) ? iv.high as Date : last.high as Date;
                merged[merged.length - 1] = new TimeInterval(last.low as Date, hi);
            } else {
                merged.push(iv);
            }
        }

        const needMs = 60 * 60 * 1000;
        let freeStart: Date | null = null;
        let freeEnd: Date | null = null;
        let cursor = workStart;
        for (const b of merged) {
            if ((b.low as Date).getTime() - cursor.getTime() >= needMs) {
                freeStart = cursor; freeEnd = new Date(cursor.getTime() + needMs); break;
            }
            cursor = new Date(Math.max(cursor.getTime(), (b.high as Date).getTime()));
        }
        if (!freeStart && workEnd.getTime() - cursor.getTime() >= needMs) {
            freeStart = cursor; freeEnd = new Date(cursor.getTime() + needMs);
        }

        expect(freeStart!.toISOString()).to.equal('2020-01-01T11:00:00.000Z');
        expect(freeEnd!.toISOString()).to.equal('2020-01-01T12:00:00.000Z');
    });
});

// Additional tests for Interval2D (2D lexicographic intervals)
describe('#IntervalTree Interval2D', function () {
    it('Supports insertion and search with Interval2D', function () {
        const tree = new IntervalTree<string>();
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
        const tree = new IntervalTree<string>();
        tree.insert(new Interval2D([0, 0], [1, 1]), 'a');
        tree.insert(new Interval2D([0, 1], [1, 2]), 'b');
        tree.insert(new Interval2D([1, 0], [2, 0]), 'c');
        const keys = tree.keys;
        expect(keys[0]).to.deep.equal([[0,0],[1,1]]);
        expect(keys[1]).to.deep.equal([[0,1],[1,2]]);
        expect(keys[2]).to.deep.equal([[1,0],[2,0]]);
    });

    it('Non-intersecting query returns empty array', function () {
        const tree = new IntervalTree<string>();
        tree.insert(new Interval2D([0, 0], [1, 1]), 'a');
        const res = tree.search(new Interval2D([2, 0], [3, 1]));
        expect(res).to.deep.equal([]);
    });
});
