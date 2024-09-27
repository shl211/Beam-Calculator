const Support = require('./support.js');
const Force = require('./force.js');
const SingularityFunction = require('./singularityFunction.js');
const BeamMath = require('./beamMath.js');
const { interfaces } = require('mocha');


const subBeams = (determinateSupportList,virtualSupportList,boundaryType,boundaryCondition1,boundaryCondition2) => {
    return {
        determinateSupportList: determinateSupportList,
        virtualSupportList: virtualSupportList,
        boundaryType: boundaryType,
        boundaryCondition1: boundaryCondition1,
        boundaryCondition2: boundaryCondition2
    };
}

class BeamAnalysis {
    
    constructor() {
        this._supportList = [];
        this._loadList = [];
        this._length = null;

        this._mechanism = false;
        this._determinate = false;
        this._indeterminate = false;

        this._bendingMomentEquationList = [];
        this._slopeEquationList = [];
        this._displacementEquationList = [];

        this._modulus = 1;
        this._density = 1;
        this._inertia = 1;
    };

    /**
     * 
     * @param {SingularityFunction[]} supportList 
     * @param {SingularityFunction[]} loadList 
     * @param {number} length 
     */
    initialise(supportList,loadList,length) {
        this._supportList = supportList;
        this._loadList = loadList;
        this._length = length;
    }

    analyse() {
        this.checkDeterminacy();
        
        if(this._determinate) {
            this.analyseDeterminate();
        }   
        else if(this._indeterminate) {
            this.analyseIndeterminate();
        }
    }
    
    resetAnalysis() {
        this._mechanism = false;
        this._determinate = false;
        this._indeterminate = false;
        
        this._bendingMomentEquationList = [];
        this._slopeEquationList = [];
        this._displacementEquationList = [];
    }
    
    get deflectionEquation() {
        return this._displacementEquationList;
    }

    get slopeEquation() {
        return this._slopeEquationList;
    }

    get bendingMomentEquation() {
        return this._bendingMomentEquationList;
    }

    //TODO - missing slope equation, easiest way is to differentiate displacement equation ----------------------------------------------
    analyseDeterminate() {
        this.calculateDeterminateReactions(this._supportList,this._loadList);
        this._bendingMomentEquationList = this.computeDeterminateBendingMoments(this._supportList,this._loadList);
        let BCs = this.findDeterminateBoundaryConditions(this._supportList);
        this._displacementEquationList = this.computeDeterminateDeflection(this._bendingMomentEquationList,BCs[0],BCs[1],BCs[2])
    }

    //TODO - missing slope equation ----------------------------------------------
    analyseIndeterminate() {

        const decomposedBeams = this.removeIndeterminacies();
        let determinateSupportList = decomposedBeams.determinateSupportList;
        let virtualSupportList = decomposedBeams.virtualSupportList;
        const boundaryType = decomposedBeams.boundaryType;
        const BC1 = decomposedBeams.boundaryCondition1;
        const BC2 = decomposedBeams.boundaryCondition2;

        //calculate determinate bending moments
        this.calculateDeterminateReactions(determinateSupportList,this._loadList);
        let determinateBendingMomentList = this.computeDeterminateBendingMoments(determinateSupportList,this._loadList);

        //compute virtual bending moments
        //calculate reactions writes forces into supports, shouldn't really matter at this point
        let virtualBendingMomentList = [];
        for(let i = 0; i < virtualSupportList.length; ++i) {
            this.calculateDeterminateReactions(determinateSupportList,virtualSupportList[i]);
            virtualBendingMomentList.push(
                this.computeDeterminateBendingMoments(determinateBendingMomentList,virtualSupportList[i]));
        }

        //now compute bending moment due to each virtual loads and construct a matrix of unkowns to solve
        const N = virtualSupportList.length;
        let M = Array.from({ length: N }, () => Array(N).fill(0));
        let B = [];

        for (let i = 0; i < N; ++i) {
            for(let j = i; j < N; ++j) {
                M[i][j] = M[j][i] = BeamMath.virtualWorkSymbolic(virtualBendingMomentList[i],virtualBendingMomentList[j]);
            }
            // NEED TO CHECK IF PLUS OR MINUS -----------------------------------------------------------
            B.push([BeamMath.virtualWorkSymbolic(determinateBendingMomentList,virtualBendingMomentList[i],this._length)]);
        }

        let redundantReactions = BeamMath.solveMatrix(M,B);//Nx1 array

        //write reaction forces into all redundant supports
        for(let i = 0; i < virtualSupportList.length; ++i) {
            let supportIndex = virtualIndexList[i];
            if(virtualSupportList[i].supportType == "POINT") {
                this._supportList[supportIndex].reactionForce = redundantReactions[i][0];
            }
            else if(virtualSupportList[i].supportType == "MOMENT") {
                this._supportList[supportIndex].reactionMoment = redundantReactions[i][0];
            }
        }

        //perform linear superposition
        let bendingMomentList = determinateBendingMomentList;
        for(let i = 0; i < virtualBendingMomentList.length; ++i) {
            BeamMath.scaleSingularityFuncList(virtualBendingMomentList[i],redundantReactions[i][0]);
            bendingMomentList = BeamMath.addRangeSingularityFunction(bendingMomentList,virtualBendingMomentList[i]);
        }

        //compute all values and assign to member variables
        this._bendingMomentEquationList = bendingMomentList;
        BeamMath.simplifySingularityFuncList(this._bendingMomentEquationList);
        
        //cantilever boundary conditions
        if(boundaryType == 1) {
            this._displacementEquationList = BeamMath.doubleIntegrateWithOneConstant(this._bendingMomentEquationList,BC1,BC2);
        }
        else {
            this._displacementEquationList = BeamMath.doubleIntegrateWithTwoConstants(this._bendingMomentEquationList,BC1,BC2);
        }

        BeamMath.simplifySingularityFuncList(this._displacementEquationList);
    }


    checkDeterminacy() {
        let determinacy = 0;
        let roller = 0;
        let pin = 0;
        let fixedEnd = 0;

        //use Maxwell's equations to compute determinacy
        for(let i = 0; i < this._supportList.length; ++i) {
            if(this._supportList[i].supportType == "ROLLER") {
                determinacy++;
                roller++;
            } 
            else if(this._supportList[i].supportType == "PIN") {
                determinacy += 2;
                pin++;
            } 
            else if(this._supportList[i].supportType == "FIXED") {
                determinacy += 3;
                fixedEnd++;
            }
        }

        //toggle determinacy
        if (determinacy < 3 || (roller == 3 && pin == 0 && fixedEnd == 0)) {
            this._mechanism = true;
            this._determinate = false;
            this._indeterminate = false;
        }
        else if (determinacy == 3) {
            this._determinate = true;
            this._mechanism = false;
            this._indeterminate = false;
        }
        else {
            this._indeterminate = true;
            this._mechanism = false;
            this._determinate = false;
        }
        
        return determinacy;
    }

    /**
     * 
     * @param {Support[]} supportList 
     * @param {Force[]} loadList 
     */
    calculateDeterminateReactions(supportList,loadList) {

        let forceSum = 0;
        let momentSum = 0;

        //sum forces and moments
        for(let i = 0; i < loadList.length; ++i) {
            forceSum += loadList[i].load;
            momentSum += loadList[i].load * loadList[i].position;
        }

        //only 2 real cases of determinate beams
        let pinJoint = (supportList.length == 2);

        //case 1 of 2: pin-roller beam
        //vertical and moment equation equilibrium and solve
        if(pinJoint) {
            let reactionForce1 = (supportList[1].position * forceSum - momentSum) / (supportList[0].position - supportList[1].position);
            let reactionForce2 = - reactionForce1 - forceSum;
            
            //assign properties to supports
            supportList[0].reactionForce = reactionForce1;
            supportList[1].reactionForce = reactionForce2;
            supportList[0].reactionMoment = 0;
            supportList[1].reactionMoment = 0;
        }
        //case 2 of 2: cantilever beam
        else {
            let reactionForce1 = - forceSum;
            let reactionMoment2 = - reactionForce1 * supportList[0].position - momentSum;

            //assign properties to supports
            supportList[0].reactionForce = reactionForce1;
            supportList[0].reactionMoment = reactionMoment2;
        }
    }

    /**
     * 
     * @param {Support[]} supportList 
     * @param {Force[]} loadList
     * @returns {SingularityFunction[]} List of bending moment equations 
     */
    computeDeterminateBendingMoments(supportList,loadList) {
        let bendingMomentEquationList = [];
        //add support reactions as singularity
        //all are point loads, giving bending moment of form BM = -F<x-a>
        //reaction moments are constant, and can be denoted as point moments using BM = c = M <x - a> ^ 0 (i.e. a step function)
        for(let i = 0; i < supportList.length; ++i) {
            bendingMomentEquationList.push(new SingularityFunction(supportList[i].position,-supportList[i].reactionForce,1));
            bendingMomentEquationList.push(new SingularityFunction(supportList[i].position,-supportList[i].reactionMoment,0));
        }

        //add load list as singularity functions, currently only consider point loads
        for(let i = 0; i < loadList.length; ++i) {
            bendingMomentEquationList.push(new SingularityFunction(loadList[i].position,-loadList[i].load,1));
        }

        //now simplify this list, remove repeats and eliminate zeros
        BeamMath.simplifySingularityFuncList(bendingMomentEquationList);
        return bendingMomentEquationList;
    }

    /**
     * 
     * @param {Support[]} supportList 
     * @returns {Array[]} Array of [BCtype,BC1,BC2]
     */
    findDeterminateBoundaryConditions (supportList) {

        //if cantilever
        if (supportList.length == 1) {
            let BC1 = [supportList[0].position,0];
            let BC2 = [supportList[0].position,0];
            return [1,BC1,BC2];
        }
        //for pin-roller
        else {
            let BC1 = [supportList[0].position,0];
            let BC2 = [supportList[1].position,0];
            return [2,BC1,BC2];
        }
    }

    /**
     * 
     * @param {SingularityFunction[]} bendingMomentList 
     * @param {number} BCType 
     * @param {Array[]} BC1 
     * @param {Array[]} BC2 
     * @return {SingularityFunction[]} List of deflection equations
     */
    computeDeterminateDeflection(bendingMomentList,BCType,BC1,BC2) {
        let displacementEquationList = [];

        //for cantilever
        if (BCType == 1) {
            displacementEquationList = BeamMath.doubleIntegrateWithOneConstant(bendingMomentList,BC1,BC2);
        }

        //for pin-roller
        else {
            //technically, this does v' = f(x) + c1, v = g(x) + c1x + c2, but we actually do -v' = f(x) + c1, -v = g(x) + c1x + c2
            //so if constant is non-zero, there would be an error, but in beam context, the constant should collapse to zero for most cases
            displacementEquationList = BeamMath.doubleIntegrateWithTwoConstants(bendingMomentList,BC1,BC2);
        }

        //right now, have  negative deflection, flip
        for(let i = 0; i < displacementEquationList.length; ++i) {
            displacementEquationList[i].scale *= -1;
        }

        BeamMath.simplifySingularityFuncList(displacementEquationList);
        return displacementEquationList;
    }

    /**
     * 
     * @param {Support[]} supportList 
     * @param {Number} fixedSupportCount 
     * @returns {subBeams} Consists of determinateSupportList,virtualSupportList,boundaryType,boundaryCondition1,boundaryCondition2
     * determinateSupportList - supports for determinate sub-beam
     * virtualSupportList - virtual loads for all other supports
     * boundaryType - 1 for cantilever, 2 for pin-roller or pin-pin determinate
     * boundaryCondition1 - [x,y] for first boundary condition
     * boundaryCondition2 - [x,y'] for second boundary condition if boundaryType is 1, else [x,y] for second boundary condition
     */
    removeIndeterminacies(supportList,fixedSupportCount) {

        let determinateSupportList = [];
        let virtualLoadList = [];
        let virtualIndexList = [];//which support each virtual load is associated with
        let boundaryType = 1; //1 for cantilever, 2 for pin-roller or pin-pin determinate
        let boundaryCondition1 = [0,0];
        let boundaryCondition2 = [0,0];

        //only 4 permutations of determinate beams
        //try to find a cantilever beam, otherwise, pin-roller or pin-pin, as don't care about horizontal indeterminacies
        if(fixedSupportCount > 0) {
            let fixedSupportFound = false;
            for(let i = 0; i < supportList.length; ++i) {
                if(!fixedSupportFound && supportList[i].supportType == "FIXED") {
                    determinateSupportList.push(supportList[i]);
                    boundaryCondition1 = [supportList[i].position,0];
                    boundaryCondition2 = [supportList[i].position,0];
                }
                else {
                    virtualLoadList.push(new Force(supportList[i].position,"POINT",1));
                    virtualIndexList.push(i);

                    if(supportList[i].supportType == "FIXED") {
                        virtualLoadList.push(new Force(supportList[i].position,"MOMENT",1));
                        virtualIndexList.push(i);
                    }
                }
            }
        }
        else {
            let support1Found = false;
            let support2Found = false;
            boundaryType = 2;

            for(let i = 0; i < supportList.length; ++i) { 
                if(!(support1Found && support2Found) && supportList[i].position != "FIXED") {
                    determinateSupportList.push(supportList[i]);
                    if(!support1Found) {
                        support1Found = true;
                        boundaryCondition1 = [supportList[i].position,0];
                    }
                    else {
                        support2Found = true;
                        boundaryCondition2 = [supportList[i].position,0];
                    }
                }
                else {
                    virtualLoadList.push(new Force(supportList[i].position,"POINT",1));
                    virtualIndexList.push(i);

                    if(supportList[i].supportType == "FIXED") {
                        virtualLoadList.push(new Force(supportList[i].position,"MOMENT",1));
                        virtualIndexList.push(i);
                    }
                }
            }
        }

        const results = subBeams(determinateSupportList,virtualLoadList,
            boundaryType,boundaryCondition1,boundaryCondition2);

        return results;
    }

    

}

module.exports = BeamAnalysis;