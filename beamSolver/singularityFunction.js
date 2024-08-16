
//symbolically define singularity function
//i.e. f(x) = k <x-a>^n. This equals 0 for x < a, and equals k (x-a)^n for x>=a
//domain basically starts at a
class SingularityFunction {
    
    constructor(domainStart,scale,exponent) {
        this._domainStart = domainStart;
        this._scale = scale;
        this._exponent = exponent;
    }

    //manipulate properties
    get domainStart() {
        return this._domainStart;
    }

    set domainStart(newDomainStart) {
        this._domainStart = newDomainStart;
    }

    get scale() {
        return this._scale;
    }

    set scale(newScale) {
        this._scale = newScale;
    }

    get exponent() {
        return this._exponent;
    }

    set exponent(newExponent) {
        this._exponent = newExponent;
    }

    //give user string output of equation
    get equationText() {

        let domainString = "";
        let scaleString = "";
        let exponentString = "";
        let sigFig = 5;

        //special cases for f(x) = k <x-a>^n where output is just scalar
        if (this._scale == 0) {
            let equation = "0";
            return equation;
        } 

        if (this._exponent == 0 && this._domainStart == 0) {
            let formattedScale = parseFloat(this._scale.toPrecision(sigFig));
            let equation = `${formattedScale}`;
            return equation;
        }

        //for general cases, first extract expression relating to <x-a>
        if (this._domain == 0) {
            //simplify as <x-0> = x 
            domainString = `x`
        } 
        else {
            let formattedDomain = parseFloat(this._domainStart.toPrecision(sigFig));
            domainString = `<x-${formattedDomain}>`;
        }

        //extract exponent
        if (this._exponent == 1) {
            exponentString = "";
        }
        else {
            let formattedExponent = parseFloat(this._exponent.toPrecision(sigFig));
            exponentString = `${formattedExponent}`
        }

        //extract scale for equation, taking care of special cases of +- 1 where text format is different
        if(this._scale == 1) {
            scaleString = "";
        }
        else if (scale == -1) {
            scaleString = "-";
        }
        else {
            let formattedScale = parseFloat(this._scale.toPrecision(sigFig));
            scaleString = `${formattedScale}`;
        }

        let equationString = `${scaleString,domainString,exponentString}`;

        return equationString;
    }
}