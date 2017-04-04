/**
 * Created by Alex Bol on 3/31/2017.
 */

let expect = require('chai').expect;
let IntervalTree = require('../index')();

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
        for (let int of ints) tree.insert(int)
        expect(tree.size).to.equal(5);
    });
    it('May return array of keys sorted', function () {
        let tree = new IntervalTree();
        let ints = [[6,8],[1,4],[5,12],[1,1],[5,7]];
        for (let int of ints) tree.insert(int)
        expect(tree.keys).to.deep.equal([[1,1],[1,4],[5,7],[5,12],[6,8]]);
    });
    it('May find value by key', function () {
        let tree = new IntervalTree();
        let ints = [[6,8],[1,4],[5,12],[1,1],[5,7]];
        for (let i=0; i < ints.length; i++) tree.insert(ints[i],"val"+i)
        expect(tree.keys).to.deep.equal([[1,1],[1,4],[5,7],[5,12],[6,8]]);
        expect(tree.find([1,1])).to.deep.equal("val3");
    });
    it('May not find value when key was not inserted', function () {
        let tree = new IntervalTree();
        let ints = [[6,8],[1,4],[5,12],[1,1],[5,7]];
        for (let i=0; i < ints.length; i++) tree.insert(ints[i],"val"+i)
        expect(tree.find([2,4])).to.be.undefined;
    });
    it('May not find after key was deleted', function () {
        let tree = new IntervalTree();
        let ints = [[6,8],[1,4],[5,12],[1,1],[5,7]];
        for (let i=0; i < ints.length; i++) tree.insert(ints[i],"val"+i)
        tree.remove([1,4]);

        expect(tree.size).to.equal(4);
        expect(tree.keys).to.deep.equal([[1,1],[5,7],[5,12],[6,8]]);
        expect(tree.find([1,4])).to.be.undefined;
    });
    it('May search interval and return array of values', function () {
        let tree = new IntervalTree();
        let ints = [[6,8],[1,4],[5,12],[1,1],[5,7]];
        for (let i=0; i < ints.length; i++) tree.insert(ints[i],"val"+i)
        expect(tree.search_interval([2,3])).to.deep.equal(['val1']);
    });
    it('May search interval and return array of values', function () {
        let tree = new IntervalTree();
        let ints = [[6,8],[1,2],[7,12],[1,1],[5,7]];
        for (let i=0; i < ints.length; i++) tree.insert(ints[i],"val"+i)
        expect(tree.search_interval([3,4])).to.deep.equal([]);
    });
    it('May return empty array when search interval does not intersect any', function () {
        let tree = new IntervalTree();
        let ints = [[6,8],[1,2],[7,12],[1,1],[5,7]];
        for (let i=0; i < ints.length; i++) tree.insert(ints[i],"val"+i)
        expect(tree.search_interval([3,4])).to.deep.equal([]);
    });
});