const assert = require('assert'); //improt Node assert module
const BeamMath = require('../beamSolver/beamMath');
const SingularityFunction = require('../beamSolver/singularityFunction');

describe("Beam Maths Library", function() {

    it("Add singularity functions", function() {

        let func1 = new SingularityFunction(3,0.5,1);
        let func2 = new SingularityFunction(3,-1,1);

        let result = BeamMath.addSingularityFunction(func1,func2);
        assert.equal(result.domainStart,3);
        assert.equal(result.scale,-0.5);
        assert.equal(result.exponent,1);
    });

    it("Add singularity functions, check error", function() {

        //check inconsistent domain
        let func1 = new SingularityFunction(3,0.5,1);
        let func2 = new SingularityFunction(4,-1,1);
        let func3 = new SingularityFunction(3,2,2);

        const inconsistentDomain = () => BeamMath.addSingularityFunction(func1,func2);
        const inconsistentExponent = () => BeamMath.addSingularityFunction(func1,func3);
        const inconsistentBoth = () => BeamMath.addSingularityFunction(func2,func3);
        
        assert.throws(
            inconsistentDomain, {
                name: 'Error',
                message: 'Singularity functions must have same domain start and exponent to be added'
            }
        );

        assert.throws(
            inconsistentExponent, {
                name: 'Error',
                message: 'Singularity functions must have same domain start and exponent to be added'
            }
        );

        assert.throws(
            inconsistentBoth, {
                name: 'Error',
                message: 'Singularity functions must have same domain start and exponent to be added'
            }
        );
    });

    it("Evaluate singularity function list", function() {

        let func1 = new SingularityFunction(3,0.5,1);
        let func2 = new SingularityFunction(5,-1,2);
        let func3 = new SingularityFunction(7,2,3);

        //denotes f(x) = 0.5<x-3> - <x-5>^2 + 2<x-7>^3
        let funcList = [func1,func2,func3];

        let result = BeamMath.evaluateSingularityFuncList(funcList,5.5);
        assert.equal(result,1);
    });

    it("Simplifying singularity function list", function() {

        let func1 = new SingularityFunction(3,1,2);//<x-3>^2
        let func2 = new SingularityFunction(2,2,1);//2<x-2>
        let func3 = new SingularityFunction(2,0,4);//0
        let func4 = new SingularityFunction(2,-3.5,1);//-4.5<x-2>
        let func5 = new SingularityFunction(4,1,2);//<x-4>^2

        let funcList = [func1,func2,func3,func4,func5];

        BeamMath.simplifySingularityFuncList(funcList);

        //expect result to contain in any order: <x-3>^2, -2.5<x-2>, <x-4>^2
        let res1 = new SingularityFunction(3,1,2);
        let res2 = new SingularityFunction(2,-2.5,1);
        let res3 = new SingularityFunction(4,1,2);
        let correct1 = false; //store states whethert each result has been verified
        let correct2 = false;
        let correct3 = false;
        
        const checkFunction = (singularityFunc1,singularityFunc2) => {
            let sameDomain = (singularityFunc1.domainStart == singularityFunc2.domainStart);
            let sameExponent = (singularityFunc1.exponent == singularityFunc2.exponent);
            let sameScale = (singularityFunc1.scale == singularityFunc1.scale);
            
            return (sameDomain && sameExponent && sameScale);
        }
        
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
    });

});