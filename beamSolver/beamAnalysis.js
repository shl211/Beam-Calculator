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

        


    }

}

module.exports = BeamAnalysis;