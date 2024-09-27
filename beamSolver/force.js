//point force
class Force {

    //up taken as positive
    constructor(position,forceType,load) {
        const validForceTypes = ['POINT','MOMENT','UNIFORM','TRIANGLE'];
        if(!validForceTypes.includes(forceType)) {
            throw new Error('Invalid forceType: must be POINT, MOMENT, UNIFORM, or TRIANGLE');
        }
        
        this._position = position;
        this._forceType = forceType;
        this._load = load;
    };

    get load() {
        return this._load;
    };

    get position() {
        return this._position;
    };

    get forceType() {
        return this._forceType;
    }
}

module.exports = Force;