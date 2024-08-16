const BeamAnalysis = require('../beamSolver/beamAnalysis');
const Support = require('../beamSolver/support');
const Force = require('../beamSolver/force');
const assert = require('assert');

describe("Determinate Beam Analysis", function() {

    let determinateBeam = new BeamAnalysis();

    let support1 = new Support(0,"PIN");
    let support2 = new Support(5,"ROLLER");
    let force = new Force(3,1);
    let length = 5;

    let supportList = [support1,support2];
    let forceList = [force];

    determinateBeam.initialise(supportList,forceList,length);

    it("Check determinacy", function() {
        let res = determinateBeam.checkDeterminacy();

        //check internal states
        assert.equal(determinateBeam._determinate,true);
        assert.equal(determinateBeam._indeterminate,false);
        assert.equal(determinateBeam._mechanism,false);
        assert.equal(res,3);
    });



});
