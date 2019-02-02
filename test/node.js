/**
 * Created by Alex Bol on 3/30/2017.
 */

'use strict';

import { expect } from 'chai';
import Node from '../src/classes/node';

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
        let node = new Node();
        expect(node).to.be.an.instanceof(Node);
    });
    it('May create new instance of Node', function () {
        let node = new Node([1,3], "1");
        expect(node.item).to.be.deep.equal({key:{low:1, high:3}, value:"1"});
    });
    it('May compare intervals: [0,1] less than [1,3]', function () {
        let node1 = new Node([0,1]);
        let node2 = new Node([1,3]);
        expect(node1.less_than(node2)).to.equal(true);
    });
    it('May compare intervals: [0,5] less than [1,3]', function () {
        let node1 = new Node([0,5]);
        let node2 = new Node([1,3]);
        expect(node1.less_than(node2)).to.equal(true);
    });
    it('May compare intervals: [0,2] less than [0,3]', function () {
        let node1 = new Node([0,2]);
        let node2 = new Node([0,3]);
        expect(node1.less_than(node2)).to.equal(true);
    });
    it('May compare intervals: [1,4] is not less than [0,3]', function () {
        let node1 = new Node([1,4]);
        let node2 = new Node([0,3]);
        expect(node1.less_than(node2)).to.equal(false);
    });
    it('May compare intervals: [1,4] is not equal to [0,3]', function () {
        let node1 = new Node([1,4]);
        let node2 = new Node([0,3]);
        expect(node1.equal_to(node2)).to.equal(false);
    });
    it('May compare intervals: [0,3] equal to [0,3]', function () {
        let node1 = new Node([0,3]);
        let node2 = new Node([0,3]);
        expect(node1.equal_to(node2)).to.equal(true);
    });
    it('May compare {key, value}: {[0,3], "1"} is not equal to {[0,3], "2"', function () {
        let node1 = new Node([0,3],"1");
        let node2 = new Node([0,3], "2");
        expect(node1.equal_to(node2)).to.equal(false);
    });
});

