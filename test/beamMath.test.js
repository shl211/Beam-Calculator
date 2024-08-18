const assert = require('assert'); //improt Node assert module
const BeamMath = require('../beamSolver/beamMath');
const SingularityFunction = require('../beamSolver/singularityFunction');

const checkFunction = (singularityFunc1,singularityFunc2) => {
    let tolerance = 1e-6;
    let sameDomain = (Math.abs(singularityFunc1.domainStart - singularityFunc2.domainStart) <  tolerance);
    let sameExponent = (Math.abs(singularityFunc1.exponent - singularityFunc2.exponent) < tolerance);
    let sameScale = (Math.abs(singularityFunc1.scale - singularityFunc2.scale) < tolerance);
    
    return (sameDomain && sameExponent && sameScale);
}


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
        let func4 = new SingularityFunction(2,-4.5,1);//-4.5<x-2>
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

    it("Indefinite integration of singularity function", function() {

        let func1 = new SingularityFunction(3,1,2);//<x-3>^2
        let func1integral = new SingularityFunction(3,1/3,3);//1/3<x-3>^3
        
        let result = BeamMath.integrateSingularityFunction(func1);
        assert.equal(checkFunction(result,func1integral),true);
    });


    it("Indefinite integration of list of singularity functions", function() {
    
        let func1 = new SingularityFunction(3,1,2);//<x-3>^2
        let func2 = new SingularityFunction(2,2,1);//2<x-2>
        let func3 = new SingularityFunction(2,0,4);//0

        let funcList = [func1,func2,func3];

        let func1integral = new SingularityFunction(3,1/3,3);//1/3<x-3>^3
        let func2integral = new SingularityFunction(2,1,2);//<x-2>^2
        let func3integral = new SingularityFunction(2,0,5);//0
    
        let result = BeamMath.integrateSingularityFuncList(funcList);

        assert.equal(checkFunction(result[0],func1integral),true);
        assert.equal(checkFunction(result[1],func2integral),true);
        assert.equal(checkFunction(result[2],func3integral),true);

    });

    it("Definite integration of list of singularity functions", function() {
        
        let func1 = new SingularityFunction(3,1,2);//<x-3>^2
        let funcList = [func1];
        let boundaryCondition = [5,2];

        let res1 = BeamMath.integrateWithConstantSingularityFuncList(funcList,boundaryCondition);
        let res1expected = new SingularityFunction(3,1/3,3);//1/3<x-3>^3
        let res1expectedConstant = new SingularityFunction(0,-2/3,0);//-2/3

        assert.equal(checkFunction(res1[0],res1expected),true);
        assert.equal(checkFunction(res1[1],res1expectedConstant),true);
        //more complex exmaple, with more functions
        let func2 = new SingularityFunction(2,2,1);//2<x-2>
        let func3 = new SingularityFunction(3,1,2);//<x-3>^2
        let func4 = new SingularityFunction(4,-1,1);//-<x-4>
        boundaryCondition = [3,-2];

        funcList = [func2,func3,func4];

        let res2 = BeamMath.integrateWithConstantSingularityFuncList(funcList,boundaryCondition);
        let res2expected = new SingularityFunction(2,1,2);//<x-2>^2
        let res3expected = new SingularityFunction(3,1/3,3);//1/3<x-3>^3
        let res4expected = new SingularityFunction(4,-1/2,2);//-1/2<x-4>^2
        let res2expectedConstant = new SingularityFunction(0,-3,0);//-3

        assert.equal(checkFunction(res2[0],res2expected),true);
        assert.equal(checkFunction(res2[1],res3expected),true);
        assert.equal(checkFunction(res2[2],res4expected),true);
        assert.equal(checkFunction(res2[3],res2expectedConstant),true);
    });

    it("Indefinite double integration of singularity function", function() {

        let func1 = new SingularityFunction(3,1,2);//<x-3>^2
        let func1doubleintegral = new SingularityFunction(3,1/12,4);//1/12<x-3>^4
        
        let result = BeamMath.doubleIntegrateSingularityFunction(func1);
        assert.equal(checkFunction(result,func1doubleintegral),true);
    });

    it("Indefinite double integration of list of singularity functions", function() {
        
            let func1 = new SingularityFunction(3,1,2);//<x-3>^2
            let func2 = new SingularityFunction(2,2,1);//2<x-2>
            let func3 = new SingularityFunction(2,-4,4);//-4<x-2>^4
    
            let funcList = [func1,func2,func3];
    
            let func1doubleintegral = new SingularityFunction(3,1/12,4);//1/12<x-3>^4
            let func2doubleintegral = new SingularityFunction(2,1/3,3);//1/3<x-2>^3
            let func3doubleintegral = new SingularityFunction(2,-2/15,6);//-2/15<x-2>^6
            
            let result = BeamMath.doubleIntegrateSingularityFuncList(funcList);
    
            assert.equal(checkFunction(result[0],func1doubleintegral),true);
            assert.equal(checkFunction(result[1],func2doubleintegral),true);
            assert.equal(checkFunction(result[2],func3doubleintegral),true);
        });

    it("Double integration of list of singularity functions where boundary conditions are [x1,y1],[x2,y2]", function() {

        let func1 = new SingularityFunction(3,1,2);//<x-3>^2
        let func2 = new SingularityFunction(2,2,1);//2<x-2>
        let func3 = new SingularityFunction(1,4,1);//4<x-1>

        let funcList = [func1,func2,func3];
        let boundaryCondition1 = [1,2];
        let boundaryCondition2 = [4,1.5];

        let res = BeamMath.doubleIntegrateWithTwoConstants(funcList,boundaryCondition1,boundaryCondition2);
        
        let res1expected = new SingularityFunction(3,1/12,4);//1/12<x-3>^4
        let res2expected = new SingularityFunction(2,1/3,3);//1/3<x-2>^3
        let res3expected = new SingularityFunction(1,2/3,3);//2/3<x-1>^3
        let res1expectedConstant = new SingularityFunction(0,-85/12,1);//-85/12
        let res2expectedConstant = new SingularityFunction(0,109/12,0);//109/12

        assert.equal(checkFunction(res[0],res1expected),true);
        assert.equal(checkFunction(res[1],res2expected),true);
        assert.equal(checkFunction(res[2],res3expected),true);
        assert.equal(checkFunction(res[3],res1expectedConstant),true);
        assert.equal(checkFunction(res[4],res2expectedConstant),true);
    });

    it("Double integration of list of singularity functions where boundary conditions are [x1,y'1],[x2,y2]", function() {

        let func1 = new SingularityFunction(3,1,2);//<x-3>^2
        let func2 = new SingularityFunction(2,2,1);//2<x-2>
        let func3 = new SingularityFunction(0.5,4,1);//4<x-0.5>

        let funcList = [func1,func2,func3];
        let boundaryCondition1 = [1,2]; //y'(1) = 2
        let boundaryCondition2 = [4,1.5]; //y(4) = 1.5

        let res = BeamMath.doubleIntegrateWithOneConstant(funcList,boundaryCondition1,boundaryCondition2);

        let res1expected = new SingularityFunction(3,1/12,4);//1/12<x-3>^4
        let res2expected = new SingularityFunction(2,1/3,3);//1/3<x-2>^3
        let res3expected = new SingularityFunction(0.5,2/3,3);//2/3<x-0.5>^3
        let res1expectedConstant = new SingularityFunction(0,23/12,1);//23/12x
        let res2expectedConstant = new SingularityFunction(0,-75/2,0);//-75/2
    });
});