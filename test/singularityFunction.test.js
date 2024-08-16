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

    it('String formatted correctly for general case f(x) = k <x-a>^n', function() {
        
        let domainStart = 23;
        let scale = 2.5;
        let exponent = 4;

        let equation = new SingularityFunction(domainStart,scale,exponent);

        assert.strictEqual(equation.equationText,'2.5<x-23>^4');

        domainStart = -23;
        scale = -2.5;
        exponent = -4;

        equation = new SingularityFunction(domainStart,scale,exponent);

        assert.strictEqual(equation.equationText,'-2.5<x+23>^-4');
    });

    it('String formatted correctly for f(x) = kx', function() {
        let domainStart = 0;
        let scale = 2.5;
        let exponent = 1;

        let equation = new SingularityFunction(domainStart,scale,exponent);

        assert.strictEqual(equation.equationText,'2.5x');
    });

    it('String formatted correctly for f(x) = <x-k> and -<x-k>', function() {
        let domainStart = 1;
        let scale = 1;
        let exponent = 1;

        let equation = new SingularityFunction(domainStart,scale,exponent);

        assert.strictEqual(equation.equationText,'<x-1>');

        domainStart = 1;
        scale = -1;
        exponent = 1;

        equation = new SingularityFunction(domainStart,scale,exponent);

        assert.strictEqual(equation.equationText,'-<x-1>');
    });
    
    it("Correct function evaluations", function() {
        let domainStart = 3.4;
        let scale = -2;
        let exponent = 3;

        let equation = new SingularityFunction(domainStart,scale,exponent);
        assert.equal(equation.evaluate(0),0);
        assert.equal(equation.evaluate(3.4),0);
        assert.strictEqual(equation.evaluate(6.8),-2 * (6.8 - 3.4) ** 3);
    });

});