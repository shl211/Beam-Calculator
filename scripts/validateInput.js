const BEAMLENGTHMESSAGE = document.getElementById('beam-length-error');
const INERTIAMESSAGE = document.getElementById('moment-of-inertia-error'); 
const MODULUSMESSAGE = document.getElementById('modulus-of-elasticity-error'); 
const VISUALISATIONMESSAGE = document.getElementById('visualisation-block')

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

var lengthValidated = false;
var inertiaValidated = false;
var modulusValidated = false;

//validate inputs, outputting error message if invalid
beamLengthInput.addEventListener('input', function() {  
    let errorMessage = validateBeamLength(beamLengthInput.value);
    BEAMLENGTHMESSAGE.textContent = errorMessage;

    triggerVisualisation(lengthValidated,inertiaValidated,modulusValidated);

});

beamLengthUnitsInput.addEventListener('change', function() {
    let errorMessage = validateBeamLength(beamLengthInput.value);
    BEAMLENGTHMESSAGE.textContent = errorMessage;
    triggerVisualisation(lengthValidated,inertiaValidated,modulusValidated);
});

inertiaInput.addEventListener('input', function() {  
    let errorMessage = validateInertia(inertiaInput.value);
    INERTIAMESSAGE.textContent = errorMessage;
    triggerVisualisation(lengthValidated,inertiaValidated,modulusValidated);
});

inertiaUnitsInput.addEventListener('change', function() {
    let errorMessage = validateInertia(inertiaInput.value);
    INERTIAMESSAGE.textContent = errorMessage;
    triggerVisualisation(lengthValidated,inertiaValidated,modulusValidated);
});

modulusInput.addEventListener('input', function() {  
    let errorMessage = validateModulus(modulusInput.value);
    MODULUSMESSAGE.textContent = errorMessage;
    triggerVisualisation(lengthValidated,inertiaValidated,modulusValidated);
});

modulusUnitsInput.addEventListener('change', function() {
    let errorMessage = validateModulus(modulusInput.value);
    MODULUSMESSAGE.textContent = errorMessage;
    triggerVisualisation(lengthValidated,inertiaValidated,modulusValidated);
});


//checks if the beam length is valid and return suitable message
function validateBeamLength(lengthInput) {

    if(lengthInput == "") {
        lengthValidated = false;
        return "Beam length cannot be empty";
    }
    else if(lengthInput <= 0) {
        lengthValidated = false;
        return "Beam length must be positive";
    }
    else {
        lengthValidated = true;
        beamLength = lengthInput;
        beamLengthUnit = beamLengthUnitsInput.value;
        //return `Beam Length is ${beamLength} ${beamLengthUnit}`;
        return "";
    }
}

function validateInertia(inertiaInput) {

    if(inertiaInput == "") {
        inertiaValidated = false;
        return "Beam length cannot be empty";
    }
    else if(inertiaInput <= 0) {
        inertiaValidated = false;
        return "Beam length must be positive";
    }
    else {
        inertiaValidated = true;
        inertia = inertiaInput;
        inertiaUnit = inertiaUnitsInput.value;
        //return `Beam Length is ${inertia} ${inertiaUnit}`;
        return ""; 
    }
}

function validateModulus(modulusInput) {

    if(modulusInput == "") {
        modulusValidated = false;
        return "Young's Modulus cannot be empty";
    }
    else if(modulusInput <= 0) {
        modulusValidated = false;
        return "Young's Modulus must be positive";
    }
    else {
        modulusValidated = true;
        modulus = modulusInput;
        modulusUnit = modulusUnitsInput.value;
        //return `Young's Modulus is ${modulus} ${modulusUnit}`;
        return ""; 
    }
}

function triggerVisualisation(validLengthInput,validateInertiaInput,validateModulusInput) {
    
    if(validLengthInput && validateInertiaInput && validateModulusInput){
        VISUALISATIONMESSAGE.textContent = "READY";
    }
    else {
        VISUALISATIONMESSAGE.textContent = "";
    }
}