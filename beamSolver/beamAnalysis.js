const Support = require('./support.js');
const Force = require('./force.js');

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

    initialise(supportList,loadList,length) {
        this._supportList = supportList;
        this._loadList = loadList;
        this._length = length;
    }

    resetAnalysis() {
        this._mechanism = false;
        this._determinate = false;
        this._indeterminate = false;

        this._bendingMomentEquationList = [];
        this._slopeEquationList = [];
        this._displacementEquationList = [];
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

    calculateReactions(supportList,loadList) {

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
}

module.exports = BeamAnalysis;