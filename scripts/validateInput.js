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
let beamLength;
let beamLengthUnit;
let inertia;
let inertiaUnit;
let modulus;
let modulusUnit;

let lengthValidated = false;
let inertiaValidated = false;
let modulusValidated = false;

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
        return "";
    }
}

function validateInertia(inertiaInput) {

    if(inertiaInput == "") {
        inertiaValidated = false;
        return "Moment of inertia cannot be empty";
    }
    else if(inertiaInput <= 0) {
        inertiaValidated = false;
        return "Moment of inertia must be positive";
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

/**
 * 
 * @param {boolean} validLengthInput 
 * @param {boolean} validateInertiaInput 
 * @param {boolean} validateModulusInput 
 */
function triggerVisualisation(validLengthInput,validateInertiaInput,validateModulusInput) {
    let validInput = validLengthInput && validateInertiaInput && validateModulusInput;
    if(validInput){
        let lengthSI = convertBeamLengthToSI(beamLength,beamLengthUnit);
        let inertiaSI = convertInertiaToSI(inertia,inertiaUnit);
        let modulusSI = convertModulusToSI(modulus,modulusUnit); 
        console.log(lengthSI,inertiaSI,modulusSI);
        //need to convert all values to SI units before sending to beam tracker
        sendDataToBeamTracker(validInput,lengthSI, inertiaSI, modulusSI); //tell visualisation to be turned on
    }
    else {
        sendDataToBeamTracker(validInput,NaN,NaN,NaN); //tell visualisation to be turned off
    }
}

/**
 * 
 * @param {boolean} validInputs 
 * @param {number} beamLength (SI units)
 * @param {number} inertia (SI units)
 * @param {number} modulus (SI units)
 */
function sendDataToBeamTracker(validInputs,beamLength,inertia,modulus) {
    const event = new CustomEvent('toggleBeam', {
        detail: {
            showBeam: validInputs,
            length: beamLength,
            momentOfInertia: inertia,
            modulusOfElasticity: modulus
        }
    });
    
    window.dispatchEvent(event);
}

function convertBeamLengthToSI(length,unit) {
    console.log(length,unit);
    switch(unit) {
        case "m":
            return length;
        case "cm":
            return length/100;
        case "mm":
            return length/1000;
        default:
            return NaN;
    }
}

function convertInertiaToSI(inertia,unit) {
    switch(unit) {
        case "m^4":
            return inertia;
        case "cm^4":
            return inertia/(100**4);
        case "mm^4":
            return inertia/(1000**4);
        default:
            return NaN;
    }
}

function convertModulusToSI(modulus,unit) {
    switch(unit) {
        case "GPa":
            return modulus*(10**9);
        case "MPa":
            return modulus*(10**6);
        case "kPa":
            return modulus*(1000);
        default:
            return NaN;
    }
}