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

    it("Checking assignment of reaction forces and moments", function() {
        let position = 10.4;
        let supportType = "ROLLER";

        let rollerSupport = new Support(position,supportType);

        //should be null if nothing assigned
        assert.equal(rollerSupport.reactionForce,null);
        assert.equal(rollerSupport.reactionMoment,null);

        let newForce = -20.4;
        let newMoment = 2.4;
        rollerSupport.reactionForce = newForce;
        rollerSupport.reactionMoment = newMoment;

        assert.equal(rollerSupport.reactionForce,newForce);
        assert.equal(rollerSupport.reactionMoment,newMoment);
    });
});