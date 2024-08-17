const BeamAnalysis = require('../beamSolver/beamAnalysis');
const Support = require('../beamSolver/support');
const Force = require('../beamSolver/force');
const assert = require('assert');
const { loadEnvFile } = require('process');
const SingularityFunction = require('../beamSolver/singularityFunction');

//function to compare whether two singualrity functions are the same
const checkFunction = (singularityFunc1,singularityFunc2) => {
    let sameDomain = (singularityFunc1.domainStart == singularityFunc2.domainStart);
    let sameExponent = (singularityFunc1.exponent == singularityFunc2.exponent);
    let sameScale = (singularityFunc1.scale == singularityFunc1.scale);
    
    return (sameDomain && sameExponent && sameScale);
}


describe("Determinate Pin-Roller Beam Analysis", function() {

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

    it("Check reaction forces", function() {

        determinateBeam.calculateReactions(supportList,forceList);

        //check support reactions
        assert.equal(support1.reactionForce,-0.4);
        assert.equal(support1.reactionMoment,0);
        assert.equal(support2.reactionForce,-0.6);
        assert.equal(support2.reactionMoment,0);
    });

    it("Check bending moments", function() {

        determinateBeam.computeBendingMoments(supportList,forceList);

        let funcList = determinateBeam._bendingMomentEquationList;

        //bending moment equation should be M = 0.4<x-0> + 0.6<x-5> - <x-3>
        let res1 = new SingularityFunction(0,0.4,1);
        let res2 = new SingularityFunction(5,0.6,1);
        let res3 = new SingularityFunction(3,-1,1);
        let correct1 = false;
        let correct2 = false;
        let correct3 = false;

        assert.equal(funcList.length,3); //first check correct length for list
        for(let i = 0; i < 3; ++i) {
            if(checkFunction(funcList[i],res1)) correct1 = true;
            if(checkFunction(funcList[i],res2)) correct2 = true;
            if(checkFunction(funcList[i],res3)) correct3 = true;
        }
        //since length is verified, and simplification gives unique values, if all bool are true, then correct
        assert.equal(correct1,true);
        assert.equal(correct2,true);
        assert.equal(correct3,true);
    })
});

describe("Determinate Cantilever Beam Analysis", function() {

    let determinateBeam = new BeamAnalysis();

    let support1 = new Support(0,"FIXED");
    let force = new Force(3,1);
    let length = 5;

    let supportList = [support1];
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

    it("Check reaction forces", function() {

        determinateBeam.calculateReactions(supportList,forceList);

        //check support reactions
        assert.equal(support1.reactionForce,-1);
        assert.equal(support1.reactionMoment,-3);
    });

    it("Check bending moments", function() {

        determinateBeam.computeBendingMoments(supportList,forceList);

        let funcList = determinateBeam._bendingMomentEquationList;

        //bending moment equation should be M = -<x-3> + <x-0> + <x-0>^0
        let res1 = new SingularityFunction(3,-1,1);
        let res2 = new SingularityFunction(0,1,1);
        let res3 = new SingularityFunction(0,1,0);
        let correct1 = false;
        let correct2 = false;
        let correct3 = false;

        assert.equal(funcList.length,3); //first check correct length for list
        for(let i = 0; i < 3; ++i) {
            if(checkFunction(funcList[i],res1)) correct1 = true;
            if(checkFunction(funcList[i],res2)) correct2 = true;
            if(checkFunction(funcList[i],res3)) correct3 = true;
        }
        //since length is verified, and simplification gives unique values, if all bool are true, then correct
        assert.equal(correct1,true);
        assert.equal(correct2,true);
        assert.equal(correct3,true);
    })
});

