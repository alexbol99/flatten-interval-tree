/**
 * Created by Alex Bol on 3/30/2017.
 */

import { expect } from 'chai';
import { Node } from '../dist/main.mjs';

// Basic unit tests for the red-black tree Node wrapper used by IntervalTree
// Ported from node.js to TypeScript.

describe('#RedBlackTree Node', function() {
    it('Node class exist when required', function () {
        expect(Node).to.exist;
    });
    it('Node class required without traits has default traits defined', function () {
        expect(Node.prototype.less_than).to.be.a('function');
        expect(Node.prototype.equal_to).to.be.a('function');
        expect(Node.prototype.copy_data).to.be.a('function');
        expect(Node.prototype.update_max).to.be.a('function');
    });
    it('May create new default instance of Node', function () {
        const node = new Node();
        expect(node).to.be.an.instanceof(Node);
    });
    it('May create new instance of Node', function () {
        const node = new Node([1,3], '1');
        // key is an Interval instance; deep equal checks its enumerable props (low/high)
        expect(node.item).to.be.deep.equal({ key: { low: 1, high: 3 }, values: ['1'] });
    });
    it('May compare intervals: [0,1] less than [1,3]', function () {
        const node1 = new Node([0,1]);
        const node2 = new Node([1,3]);
        expect(node1.less_than(node2)).to.be.true;
    });
    it('May compare intervals: [0,5] less than [1,3]', function () {
        const node1 = new Node([0,5]);
        const node2 = new Node([1,3]);
        expect(node1.less_than(node2)).to.be.true;
    });
    it('May compare intervals: [0,2] less than [0,3]', function () {
        const node1 = new Node([0,2]);
        const node2 = new Node([0,3]);
        expect(node1.less_than(node2)).to.be.true;
    });
    it('May compare intervals: [1,4] is not less than [0,3]', function () {
        const node1 = new Node([1,4]);
        const node2 = new Node([0,3]);
        expect(node1.less_than(node2)).to.be.false;
    });
    it('May compare intervals: [1,4] is not equal to [0,3]', function () {
        const node1 = new Node([1,4]);
        const node2 = new Node([0,3]);
        expect(node1.equal_to(node2)).to.be.false;
    });
    it('May compare intervals: [0,3] equal to [0,3]', function () {
        const node1 = new Node([0,3]);
        const node2 = new Node([0,3]);
        expect(node1.equal_to(node2)).to.be.true;
    });
    it('May compare {key, value}: {[0,3], "1"} is equal to {[0,3], "2"} when comparing by key only', function () {
        const node1 = new Node([0,3], '1');
        const node2 = new Node([0,3], '2');
        expect(node1.equal_to(node2)).to.be.true;
    });
});
