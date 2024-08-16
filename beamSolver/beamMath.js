//suite of static methods to perform maths operations required for beam solver
//contains custom methods to manipulate singularityFunction, integration and some matrix solvers
const SingularityFunction = require('./SingularityFunction');

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
     * @returns 
     */
    static evaluateSingularityFuncList(singularityFuncList,x) {

        let result = 0;
        for(let i = 0; i < singularityFuncList.length; ++i) {
            result += singularityFuncList[i].evaluate(x);
        }

        return result;
    }


}

module.exports = BeamMath;