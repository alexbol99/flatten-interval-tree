/**
 * Created by Alex Bol on 4/1/2017.
 */

let Interval = class Interval {
    constructor(low, high) {
        this.low = low;
        this.high = high;
    }

    get max() {
        return this.high;
    }

    interval(low, high) {
        return new Interval(low, high);
    }

    clone() {
        return new Interval(this.low, this.high);
    }

    less_than(other_interval) {
        return this.low < other_interval.low ||
            this.low == other_interval.low && this.high < other_interval.high;
    }

    equal_to(other_interval) {
        return this.low == other_interval.low && this.high == other_interval.high;
    }

    intersect(other_interval) {
        return !this.not_intersect(other_interval);
    }

    not_intersect(other_interval) {
        return (this.high < other_interval.low || other_interval.high < this.low);
    }

    output() {
        return [this.low, this.high];
    }

    maximal_val(val1, val2) {
        return Math.max(val1, val2);
    }

    val_less_than(val1, val2 ) {     // trait to compare max property with item ?
        return val1 < val2;
    }
};

// module.exports = Interval;
export default Interval;