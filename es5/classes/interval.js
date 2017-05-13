"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by Alex Bol on 4/1/2017.
 */

var Interval = function () {
    function Interval(low, high) {
        _classCallCheck(this, Interval);

        this.low = low;
        this.high = high;
    }

    _createClass(Interval, [{
        key: "interval",
        value: function interval(low, high) {
            return new Interval(low, high);
        }
    }, {
        key: "clone",
        value: function clone() {
            return new Interval(this.low, this.high);
        }
    }, {
        key: "less_than",
        value: function less_than(other_interval) {
            return this.low < other_interval.low || this.low == other_interval.low && this.high < other_interval.high;
        }
    }, {
        key: "equal_to",
        value: function equal_to(other_interval) {
            return this.low == other_interval.low && this.high == other_interval.high;
        }
    }, {
        key: "intersect",
        value: function intersect(other_interval) {
            return !this.not_intersect(other_interval);
        }
    }, {
        key: "not_intersect",
        value: function not_intersect(other_interval) {
            return this.high < other_interval.low || other_interval.high < this.low;
        }
    }, {
        key: "output",
        value: function output() {
            return [this.low, this.high];
        }
    }, {
        key: "maximal_val",
        value: function maximal_val(val1, val2) {
            return Math.max(val1, val2);
        }
    }, {
        key: "val_less_than",
        value: function val_less_than(val1, val2) {
            // trait to compare max property with item ?
            return val1 < val2;
        }
    }, {
        key: "max",
        get: function get() {
            return this.high;
        }
    }]);

    return Interval;
}();

module.exports = Interval;