const assert = require('assert'); //improt Node assert module
const SingularityFunction = require('../beamSolver/singularityFunction');

describe("Singularity Function", function() {
    
    it('Getters return internal variables',function() {
        let domainStart = 1;
        let scale = 2;
        let exponent = 3;
    
        let equation = new SingularityFunction(domainStart,scale,exponent);
        
        assert.strictEqual(equation.domainStart,domainStart);
        assert.strictEqual(equation.scale,scale);
        assert.strictEqual(equation.exponent,exponent);
    });

    it('Setters should change equation',function() {
        let equation = new SingularityFunction(1,2,3);
        equation.domainStart = -3;
        equation.scale = -2.3;
        equation.exponent = 24;

        assert.strictEqual(equation.domainStart,-3);
        assert.strictEqual(equation.scale,-2.3);
        assert.strictEqual(equation.exponent,24);
    });

    it('String formatted correctly for f(x) = 0', function() {
        let domainStart = 2834;
        let scale = 0;
        let exponent = 23;
        
        let equation = new SingularityFunction(domainStart,scale,exponent);

        assert.strictEqual(equation.equationText,"0");
    });

    it('String formatted correctly for f(x) = k', function() {
        let domainStart = 0;
        let scale = 42;
        let exponent = 0;
        
        let equation = new SingularityFunction(domainStart,scale,exponent);

        assert.strictEqual(equation.equationText,"42");
    });
});