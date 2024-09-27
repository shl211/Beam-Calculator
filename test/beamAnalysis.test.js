const BeamAnalysis = require('../beamSolver/beamAnalysis');
const Support = require('../beamSolver/support');
const Force = require('../beamSolver/force');
const assert = require('assert');
const { loadEnvFile } = require('process');
const SingularityFunction = require('../beamSolver/singularityFunction');

//function to compare whether two singualrity functions are the same
const checkFunction = (singularityFunc1,singularityFunc2) => {
    let tolerance = 1e-6;
    let sameDomain = (Math.abs(singularityFunc1.domainStart - singularityFunc2.domainStart) <  tolerance);
    let sameExponent = (Math.abs(singularityFunc1.exponent - singularityFunc2.exponent) < tolerance);
    let sameScale = (Math.abs(singularityFunc1.scale - singularityFunc2.scale) < tolerance);
    
    return (sameDomain && sameExponent && sameScale);
}


describe("Determinate Pin-Roller Beam Analysis", function() {

    let determinateBeam = new BeamAnalysis();

    let support1 = new Support(0,"PIN");
    let support2 = new Support(5,"ROLLER");
    let force = new Force(3,"POINT",1);
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

        determinateBeam.calculateDeterminateReactions(supportList,forceList);

        //check support reactions
        assert.equal(support1.reactionForce,-0.4);
        assert.equal(support1.reactionMoment,0);
        assert.equal(support2.reactionForce,-0.6);
        assert.equal(support2.reactionMoment,0);
    });

    it("Check bending moments", function() {

        let funcList = determinateBeam.computeDeterminateBendingMoments(supportList,forceList);

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

    it("Test determinate boundary conditions", function() {

        let result = determinateBeam.findDeterminateBoundaryConditions(supportList);

        let expectedType = 2;
        let expectedBC1 = [support1.position,0];
        let expectedBC2 = [support2.position,0];

        assert.equal(result[0],expectedType);
        assert.deepStrictEqual(result[1],expectedBC1);
        assert.deepStrictEqual(result[2],expectedBC2);
    })

    it("Check deflection equation", function() {

        let BCType = 2;
        let BC1 = [support1.position,0];
        let BC2 = [support2.position,0];
        let bendingMoment1 = new SingularityFunction(0,0.4,1);
        let bendingMoment2 = new SingularityFunction(5,0.6,1);
        let bendingMoment3 = new SingularityFunction(3,-1,1);
        let bendingMomentList = [bendingMoment1,bendingMoment2,bendingMoment3];

        let funcList = determinateBeam.computeDeterminateDeflection(bendingMomentList,BCType,BC1,BC2);

        //expect deflection to be v = -1/15<x-0>^3 - 0.1 <x-5>^3 + 1/6 <x-3>^3 + 7/5 <x-0>
        let expectedFunc1 = new SingularityFunction(0,-1/15,3);
        let expectedFunc2 = new SingularityFunction(5,-0.1,3);
        let expectedFunc3 = new SingularityFunction(3,1/6,3);
        let expectedFunc4 = new SingularityFunction(0,7/5,1);

        let correct1 = false;
        let correct2 = false;
        let correct3 = false;
        let correct4 = false;
        
        assert.equal(funcList.length,4); //first check correct length for list
        for(let i = 0; i < 4; ++i) {
            if(checkFunction(funcList[i],expectedFunc1)) correct1 = true;
            if(checkFunction(funcList[i],expectedFunc2)) correct2 = true;
            if(checkFunction(funcList[i],expectedFunc3)) correct3 = true;
            if(checkFunction(funcList[i],expectedFunc4)) correct4 = true;
        }
        //since length is verified, and simplification gives unique values, if all bool are true, then correct
        assert.equal(correct1,true);
        assert.equal(correct2,true);
        assert.equal(correct3,true);
        assert.equal(correct4,true);
    })
});

describe("Determinate Cantilever Beam Analysis", function() {

    let determinateBeam = new BeamAnalysis();

    let support1 = new Support(0,"FIXED");
    let force = new Force(3,"POINT",1);
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

        determinateBeam.calculateDeterminateReactions(supportList,forceList);

        //check support reactions
        assert.equal(support1.reactionForce,-1);
        assert.equal(support1.reactionMoment,-3);
    });

    it("Check bending moments", function() {

        let funcList = determinateBeam.computeDeterminateBendingMoments(supportList,forceList);

        //bending moment equation should be M = -<x-3> + <x-0> + 3<x-0>^0
        let res1 = new SingularityFunction(3,-1,1);
        let res2 = new SingularityFunction(0,1,1);
        let res3 = new SingularityFunction(0,3,0);
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
        assert.equal(correct3,true);;
    })

    it("Test determinate boundary conditions", function() {

        let result = determinateBeam.findDeterminateBoundaryConditions(supportList);

        let expectedType = 1;
        let expectedBC1 = [support1.position,0];
        let expectedBC2 = [support1.position,0];

        assert.equal(result[0],expectedType);
        assert.deepStrictEqual(result[1],expectedBC1);
        assert.deepStrictEqual(result[2],expectedBC2);
    })

    it("Check deflection equation", function() {

        let BCType = 1;
        let BC1 = [support1.position,0];
        let BC2 = [support1.position,0];
        let bendingMoment1 = new SingularityFunction(3,-1,1);
        let bendingMoment2 = new SingularityFunction(0,1,1);
        let bendingMoment3 = new SingularityFunction(0,3,0);
        let bendingMomentList = [bendingMoment1,bendingMoment2,bendingMoment3];

        let funcList = determinateBeam.computeDeterminateDeflection(bendingMomentList,BCType,BC1,BC2);

        //expect deflection to be v = 1/6 <x-3>^3 - 1/6 <x-0>^3 - 3/2<x-0>^2
        let expectedFunc1 = new SingularityFunction(3,1/6,3);
        let expectedFunc2 = new SingularityFunction(0,-1/6,3);
        let expectedFunc3 = new SingularityFunction(0,-1.5,2);

        let correct1 = false;
        let correct2 = false;
        let correct3 = false;
        
        assert.equal(funcList.length,3); //first check correct length for list
        for(let i = 0; i < 3; ++i) {
            if(checkFunction(funcList[i],expectedFunc1)) correct1 = true;
            if(checkFunction(funcList[i],expectedFunc2)) correct2 = true;
            if(checkFunction(funcList[i],expectedFunc3)) correct3 = true;
        }
        //since length is verified, and simplification gives unique values, if all bool are true, then correct
        assert.equal(correct1,true);
        assert.equal(correct2,true);
        assert.equal(correct3,true);
    })
});