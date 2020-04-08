/**
 * Created by Alex Bol on 3/31/2017.
 */

import { expect } from 'chai';
import IntervalTree from '../index';
import {Interval} from "../index";

// import IntervalTree from '../dist/interval-tree.esm';

describe('#IntervalTree', function() {
    it('Create new instanse of IntervalTree ', function () {
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
        let h;
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
});
