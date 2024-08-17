//suite of static methods to perform maths operations required for beam solver
//contains custom methods to manipulate singularityFunction, integration and some matrix solvers
const SingularityFunction = require('./singularityFunction.js');

class BeamMath {
    
    /**
     * 
     * @param {SingularityFunction} singularityFunction1 
     * @param {SingularityFunction} singularityFunction2 
     * @returns {SingularityFunction} Result of addition of two singularity functions
     */
    static addSingularityFunction(singularityFunction1,singularityFunction2) {
        
        //make sure domain and exponents consistent for additionn
        if (singularityFunction1.domainStart != singularityFunction2.domainStart || singularityFunction1.exponent != singularityFunction2.exponent) {
            throw new Error("Singularity functions must have same domain start and exponent to be added");
        };

        let exponent = singularityFunction1.exponent;
        let domainStart = singularityFunction1.domainStart;
        let newScale = singularityFunction1.scale + singularityFunction2.scale;
        
        return new SingularityFunction(domainStart,newScale,exponent);
    }

    /**
     * 
     * @param {SingularityFunction[]} singularityFuncList 
     * @param {number} x 
     * @returns {number}
     */
    static evaluateSingularityFuncList(singularityFuncList,x) {

        let result = 0;
        for(let i = 0; i < singularityFuncList.length; ++i) {
            result += singularityFuncList[i].evaluate(x);
        }

        return result;
    }

    /**
     * 
     * @param {SingularityFunction[]} singularityFuncList 
     */
    static simplifySingularityFuncList(singularityFuncList) {

        let tolerance = 1e-6;

        for(let i = 0; i < singularityFuncList.length; ++i) {

            let currentFunc = singularityFuncList[i];

            if (currentFunc.scale == 0) {
                singularityFuncList.splice(i,1);
                --i; //removed vlaue from list, readjust incrementor to not skip values
                continue;
            }

            //check whether every function in front of it can be summed, all functions behind it already checked
            for(let j = i + 1; j < singularityFuncList.length; ++j) {
                let nextFunc = singularityFuncList[j];

                let checkDomainFloatTolerance = ((currentFunc.domainStart < nextFunc.domainStart + tolerance && currentFunc.domainStart > nextFunc.domainStart - tolerance));

                let checkExponentFloatTolerance = ((currentFunc.exponent < nextFunc.exponent + tolerance && currentFunc.exponent > nextFunc.exponent - tolerance));
                
                if( checkDomainFloatTolerance && checkExponentFloatTolerance) {
                    let summedFunc = this.addSingularityFunction(currentFunc,nextFunc);
                    singularityFuncList.splice(j,1);
                    singularityFuncList[i] = summedFunc;
                    --j;
                }
            }
        }
    }

    /**
     * Indefinite integration of a singularity function
     * @param {SingularityFunction} 
     * @returns {SingularityFunction}
     */
    static integrateSingularityFunction(singularityFunction) {
        
        let newExponent = singularityFunction.exponent + 1;
        let newScale = singularityFunction.scale / newExponent;

        return new SingularityFunction(singularityFunction.domainStart,newScale,newExponent);
    }

    
    /**
     * 
     * @param {SingularityFunction[]} singularityFuncList 
     * @returns {SingularityFunction[]}
     */
    static integrateSingularityFuncList(singularityFuncList) {
        
        let integratedFuncList = new Array(singularityFuncList.length);

        for(let i = 0; i < singularityFuncList.length; ++i) {
            integratedFuncList[i] = this.integrateSingularityFunction(singularityFuncList[i]);
        }

        return integratedFuncList;
    }

    /**
     * 
     * @param {singularityFunction[]} singularityFuncList 
     * @param {number[]} boundaryCondition - in form [x,f(x)]
     * @returns {SingularityFunction[]}
     */
    static integrateWithConstantSingularityFuncList(singularityFuncList,boundaryCondition) {
        
        let integratedFuncList = this.integrateSingularityFuncList(singularityFuncList);

        //y'(x) integrates to y(x) = integral(y'(x)) + c
        //BC is y(x1) = f(x1) -> rearrange to solve for c = y(x1) - integral(y'(x1))
        let c = boundaryCondition[1] - this.evaluateSingularityFuncList(integratedFuncList,boundaryCondition[0]);
        
        //c is the same as c<x-0>^0
        let constant = new SingularityFunction(0,c,0);
        integratedFuncList.push(constant); //add to list

        return integratedFuncList;
    }


    /**
     * Indefinite double integration of singularity function
     * @param {SingularityFunction} singularityFuncList 
     * @returns {SingularityFunction}
     */
    static doubleIntegrateSingularityFunction(singularityFunction) {
            
        let exponentPlusOne = singularityFunction.exponent + 1;
        let newExponent = singularityFunction.exponent + 2;
        let newScale = singularityFunction.scale / (newExponent * exponentPlusOne);

        return new SingularityFunction(singularityFunction.domainStart,newScale,newExponent);
    }

    /**
     * 
     * @param {SingularityFunction[]} singularityFuncList 
     * @returns {SingularityFunction[]}
     */
    static doubleIntegrateSingularityFuncList(singularityFuncList) {
        
        let doubleIntegratedFuncList = new Array(singularityFuncList.length);

        for(let i = 0; i < singularityFuncList.length; ++i) {
            doubleIntegratedFuncList[i] = this.doubleIntegrateSingularityFunction(singularityFuncList[i]);
        }

        return doubleIntegratedFuncList;
    }

    
    /**
     * Double integration, computes constants where both boundary conditions are of form [x,f(x)]
     * @param {SingularityFunction[]} singularityFuncList
     * @param {number[]} boundaryCondition1 - in form [x1,f(x1)]
     * @param {number[]} boundaryCondition2 - in form [x2,f(x2)]
     * @returns {SingularityFunction[]}
     */
    static doubleIntegrateWithTwoConstants(singularityFuncList,boundaryCondition1,boundaryCondition2) {
        
        let doubleIntegratedFuncList = this.doubleIntegrateSingularityFuncList(singularityFuncList);

        //y''(x) integrates to y(x) = integral(integral(y''(x))) + c1x + c2
        //set of simultaneous equations to solve for c1 and c2, use rearranged format to avoid matrix operations
        let [x1,y1] = boundaryCondition1;
        let [x2,y2] = boundaryCondition2;
        let y1Indefinite = this.evaluateSingularityFuncList(doubleIntegratedFuncList,x1);
        let y2Indefinite = this.evaluateSingularityFuncList(doubleIntegratedFuncList,x2);

        let c1 = ((y2 - y1) + (y1Indefinite - y2Indefinite)) / (x2 - x1);
        let c2 = y1 - y1Indefinite - c1 * x1;

        //c1 is the same as c1<x-0>^1 and c2 is the same as c2<x-0>^0
        let constant1 = new SingularityFunction(0,c1,1);
        let constant2 = new SingularityFunction(0,c2,0);

        doubleIntegratedFuncList.push(constant1);
        doubleIntegratedFuncList.push(constant2);

        return doubleIntegratedFuncList;
    }


    /**
     * Double integration, computes constants where first boundary conditions is form [x,f'(x)] and second of form [x,f(x)]
     * @param {SingularityFunction[]} singularityFuncList
     * @param {number[]} boundaryCondition1 - in form [x1,f(x1)]
     * @param {number[]} boundaryCondition2 - in form [x2,f(x2)]
     * @returns {SingularityFunction[]}
     */ 
    static doubleIntegrateWithOneConstant(singularityFuncList,boundaryCondition1,boundaryCondition2) { 

        let integratedFuncList = this.integrateWithConstantSingularityFuncList(singularityFuncList,boundaryCondition1);
        let doubleIntegratedFuncList = this.integrateWithConstantSingularityFuncList(integratedFuncList,boundaryCondition2);

        return doubleIntegratedFuncList;
    }

}

module.exports = BeamMath;