const BEAMLENGTHMESSAGE = document.getElementById('beam-length-error');
const INERTIAMESSAGE = document.getElementById('moment-of-inertia-error'); 
const MODULUSMESSAGE = document.getElementById('modulus-of-elasticity-error'); 

const beamLengthInput = document.getElementById('beam-length');
const beamLengthUnitsInput = document.getElementById('beam-length-unit');

const inertiaInput = document.getElementById('moment-of-inertia');
const inertiaUnitsInput = document.getElementById('moment-of-inertia-unit');

const modulusInput = document.getElementById('modulus-of-elasticity');
const modulusUnitsInput = document.getElementById('modulus-of-elasticity-unit');

//track following states
var beamLength;
var beamLengthUnit;
var inertia;
var inertiaUnit;
var modulus;
var modulusUnit;


//validate inputs, outputting error message if invalid
beamLengthInput.addEventListener('input', function() {  
    let errorMessage = validateBeamLength(beamLengthInput.value);
    BEAMLENGTHMESSAGE.textContent = errorMessage;
});

beamLengthUnitsInput.addEventListener('change', function() {
    let errorMessage = validateBeamLength(beamLengthInput.value);
    BEAMLENGTHMESSAGE.textContent = errorMessage;
});

inertiaInput.addEventListener('input', function() {  
    let errorMessage = validateInertia(inertiaInput.value);
    INERTIAMESSAGE.textContent = errorMessage;
});

inertiaUnitsInput.addEventListener('change', function() {
    let errorMessage = validateInertia(inertiaInput.value);
    INERTIAMESSAGE.textContent = errorMessage;
});

modulusInput.addEventListener('input', function() {  
    let errorMessage = validateModulus(modulusInput.value);
    MODULUSMESSAGE.textContent = errorMessage;
});

modulusUnitsInput.addEventListener('change', function() {
    let errorMessage = validateModulus(modulusInput.value);
    MODULUSMESSAGE.textContent = errorMessage;
});


//checks if the beam length is valid and return suitable message
function validateBeamLength(lengthInput) {

    if(lengthInput == "") {
        return "Beam length cannot be empty";
    }
    else if(lengthInput <= 0) {
        return "Beam length must be positive";
    }
    else {
        beamLength = lengthInput;
        beamLengthUnit = beamLengthUnitsInput.value;
        return `Beam Length is ${beamLength} ${beamLengthUnit}`;
    }
}

function validateInertia(inertiaInput) {

    if(inertiaInput == "") {
        return "Beam length cannot be empty";
    }
    else if(inertiaInput <= 0) {
        return "Beam length must be positive";
    }
    else {
        inertia = inertiaInput;
        inertiaUnit = inertiaUnitsInput.value;
        return `Beam Length is ${inertia} ${inertiaUnit}`;
    }
}

function validateModulus(modulusInput) {

    if(modulusInput == "") {
        return "Young's Modulus cannot be empty";
    }
    else if(modulusInput <= 0) {
        return "Young's Modulus must be positive";
    }
    else {
        modulus = modulusInput;
        modulusUnit = modulusUnitsInput.value;
        return `Young's Modulus is ${modulus} ${modulusUnit}`;
    }
}
