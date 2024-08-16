//point force
class Force {

    //up taken as positive
    constructor(position,load) {
        this._position = position;
        this._load = load;
    };

    get load() {
        return this._load;
    };

    get position() {
        return this._position;
    };
}

module.exports = Force;