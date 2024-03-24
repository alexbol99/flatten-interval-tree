/**
 * Created by Alex Bol on 3/31/2017.
 */

import { expect } from 'chai';
import IntervalTree from '../index';
import {Interval} from "../index";

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
