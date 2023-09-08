import { expect } from 'chai';
import IntervalTree from '../index';

describe('#Cursor', function() {
    it('May find first intersecting interval', function () {
        let tree = new IntervalTree();
        let ints = [[6,8],[1,3],[5,12],[1,1],[5,7]];
        for (let int of ints) tree.insert(int);
        let cursor = tree.cursor([3,8])
        expect(cursor.next()).to.deep.equal([1,3])
    });
    it('May find first forward interval when there is no intersection', function () {
        let tree = new IntervalTree();
        let ints = [[6,8],[1,3],[5,12],[1,1],[5,7]];
        for (let int of ints) tree.insert(int);
        let cursor = tree.cursor([4,4])
        expect(cursor.next()).to.deep.equal([5,7])
    });
    it('May find first interval when no interval is passed', function () {
        let tree = new IntervalTree();
        let ints = [[6,8],[1,3],[5,12],[1,1],[5,7]];
        for (let int of ints) tree.insert(int);
        let cursor = tree.cursor()
        expect(cursor.next()).to.deep.equal([1,1])
    });
    it('Returns `null` when it reaches the end', function () {
        let tree = new IntervalTree();
        let ints = [[6,8],[1,3],[5,12],[1,1],[5,7]];
        for (let int of ints) tree.insert(int);
        let cursor = tree.cursor([8,8])
        expect(cursor.next()).to.deep.equal([5,12])
        expect(cursor.next()).to.deep.equal([6,8])
        expect(cursor.next()).to.deep.equal(null)
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
        let cursor = tree.cursor([1600, 1700],
            (name, period) => {return `${name} (${period.low}-${period.high})`});
        expect(cursor.next()).to.equal("Antonio Vivaldi (1678-1741)");
        expect(cursor.next()).to.equal("Johann Sebastian Bach (1685-1750)");
    });
});
