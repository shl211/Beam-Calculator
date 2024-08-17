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
     * @returns 
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
}

module.exports = BeamMath;