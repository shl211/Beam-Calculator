const assert = require('assert'); //improt Node assert module
const Force = require('../beamSolver/force');

describe("Point Force", function() {

    it("Check retrieval of data", function() {

        let position = 10.4;
        let load = -42; //down
        let forceType = "POINT";

        let force = new Force(position,forceType,load);

        assert.strictEqual(force.position,position);
        assert.strictEqual(force.load,load);
        assert.strictEqual(force.forceType,forceType);
    });
});
