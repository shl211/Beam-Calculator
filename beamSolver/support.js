class Support {

    constructor(position,supportType) {
        
        const validSupportTypes = ['PIN','ROLLER','FIXED'];
        if(!validSupportTypes.includes(supportType)) {
            throw new Error('Invalid supportType: must be PIN, ROLLER, or FIXED');
        }

        this._position = position;
        this._supportType = supportType;
        this._reactionForce = null;
        this._reactionMoment = null;
    }

    get position() {
        return this._position;
    }

    get supportType() {
        return this._supportType;
    }

    set reactionForce(verticalForce) {
        this._reactionForce = verticalForce;
    }

    get reactionForce() {
        return this._reactionForce;
    }

    set reactionMoment(newMoment) {
        this._reactionMoment = newMoment;
    }

    get reactionMoment() {
        return this._reactionMoment;
    }
}

module.exports = Support;