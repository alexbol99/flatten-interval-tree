/**
 * Created by Alex Bol on 3/31/2017.
 */

let expect = require('chai').expect;
let IntervalTree = require('../index');

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
    it('May test if node entry exist after insertion', function () {
        let tree = new IntervalTree();
        let ints = [[6,8],[1,4],[5,12],[1,1],[5,7]];
        for (let i=0; i < ints.length; i++) tree.insert(ints[i],"val"+i)
        expect(tree.keys).to.deep.equal([[1,1],[1,4],[5,7],[5,12],[6,8]]);
        for (let i=0; i < ints.length; i++) {
            expect(tree.exist(ints[i], "val"+i)).to.equal(true);
        }
    });
    it('May not find value when key was not inserted', function () {
        let tree = new IntervalTree();
        let ints = [[6,8],[1,4],[5,12],[1,1],[5,7]];
        for (let i=0; i < ints.length; i++) tree.insert(ints[i],"val"+i)
        expect(tree.exist([2,4],"val")).to.be.false;        // wrong interval
        expect(tree.exist([1,4],"val2")).to.be.false;       // wrong value
    });
    it('May not find entry after key was deleted', function () {
        let tree = new IntervalTree();
        let ints = [[6,8],[1,4],[5,12],[1,1],[5,7]];
        for (let i=0; i < ints.length; i++) tree.insert(ints[i],"val"+i)
        tree.remove([1,4],"val1");

        expect(tree.size).to.equal(4);
        expect(tree.keys).to.deep.equal([[1,1],[5,7],[5,12],[6,8]]);
        expect(tree.exist([1,4])).to.be.false;
    });
    it('May search interval and return array of values', function () {
        let tree = new IntervalTree();
        let ints = [[6,8],[1,4],[5,12],[1,1],[5,7]];
        for (let i=0; i < ints.length; i++) tree.insert(ints[i],"val"+i)
        expect(tree.search([2,3])).to.deep.equal(['val1']);
    });
    it('May return empty array when search interval does not intersect any', function () {
        let tree = new IntervalTree();
        let ints = [[6,8],[1,2],[7,12],[1,1],[5,7]];
        for (let i=0; i < ints.length; i++) tree.insert(ints[i],"val"+i)
        expect(tree.search([3,4])).to.deep.equal([]);
    });
});