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

});