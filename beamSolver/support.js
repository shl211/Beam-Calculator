class Support {

    constructor(position,supportType) {
        
        const validSupportTypes = ['PIN','ROLLER','FIXED'];
        if(!validSupportTypes.includes(supportType)) {
            throw new Error('Invalid supportType: must be PIN, ROLLER, or FIXED');
        }

        this._position = position;
        this._supportType = supportType;
    }

    get position() {
        return this._position;
    }

    get supportType() {
        return this._supportType;
    }
}

module.exports = Support;