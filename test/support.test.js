const assert = require('assert'); //improt Node assert module
const Support = require('../beamSolver/support');

describe("Supports", function() {

    it("Fixed Support", function() {

        let position = 10.4;
        let supportType = "FIXED";

        let fixedSupport = new Support(position,supportType);

        assert.strictEqual(fixedSupport.position,position);
        assert.strictEqual(fixedSupport.supportType,supportType);
    });

    it("Pin Support", function() {

        let position = 10.4;
        let supportType = "PIN";

        let pinSupport = new Support(position,supportType);

        assert.strictEqual(pinSupport.position,position);
        assert.strictEqual(pinSupport.supportType,supportType);
    });

    it("Roller Support", function() {

        let position = 10.4;
        let supportType = "ROLLER";

        let rollerSupport = new Support(position,supportType);

        assert.strictEqual(rollerSupport.position,position);
        assert.strictEqual(rollerSupport.supportType,supportType);
    });

    it("Other supports should be rejected", function() {
        
        let position = 10.4;
        let supportType = "OTHER";

        //class to check for error
        const incorrectSupport = () => new Support(position,supportType);

        assert.throws(
            incorrectSupport, {
                name: 'Error',
                message: 'Invalid supportType: must be PIN, ROLLER, or FIXED'
            }
        );
    });
});