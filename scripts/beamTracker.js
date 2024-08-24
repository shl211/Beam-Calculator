const addSimpleSupportButton = document.getElementById('add-simple-support');
const addRollerSupportButton = document.getElementById('add-roller-support');
const addFixedSupportButton = document.getElementById('add-fixed-support');
const addPointForceButton = document.getElementById('add-point-force');

const simpleSupportInput = document.getElementById('simply-supported-position');
const rollerSupportInput = document.getElementById('roller-support-position');
const fixedSupportInput = document.getElementById('fixed-support-position');

const pointForcePositionInput = document.getElementById('point-force-position');
const pointForceLoadInput = document.getElementById('point-force-magnitude');

const canvas = document.getElementById('visualisation-block');

//beam states
let beamOn = false;
let supportList = [];//array of html elements denoting supports, id will convey info on position and support type
let forceList = [];//array of html elements denoting forces
let supportCount = 0;
let forceCount = 0;
let length = NaN;
let momentOfInertia = NaN;
let modulusOfElasticity = NaN;

//add a support onto canvas if support add button clicked
addSimpleSupportButton.addEventListener('click', function() {
    if(beamOn) addSupports('SIMPLE',simpleSupportInput.value);
});

addRollerSupportButton.addEventListener('click', function() {
    if(beamOn) addSupports('ROLLER',rollerSupportInput.value);
});

addFixedSupportButton.addEventListener('click', function() {
    if(beamOn) addSupports('FIXED',fixedSupportInput.value);
});

//check whether to display beam
//also update beam states
window.addEventListener('toggleBeam',function(e) {

    //if beam is to be shown and beam is not already shown, show beam
    if(e.detail.showBeam && !beamOn) {
        addBeam();
        beamOn = true;
    }
    //if beam is to be hidden and beam is already shown, hide beam
    else if(!e.detail.showBeam && beamOn) {
        eraseCanvas();
        beamOn = false;
    }

    //update beam states
    length = e.detail.length;
    momentOfInertia = e.detail.momentOfInertia;
    modulusOfElasticity = e.detail.modulusOfElasticity;
    //console.log(length,momentOfInertia,modulusOfElasticity);
})

//add a force onto canvas if force add button clicked
addPointForceButton.addEventListener('click', function() {
    if(beamOn) addLoads('POINT',pointForcePositionInput.value,pointForceLoadInput.value);
});

function addSupports(supportType,position) {
    let newButton = document.createElement('button');

    if(supportType === 'SIMPLE') {
        newButton.textContent = `Simple Support ${supportCount}`;
        newButton.id = `support-${supportCount}-type-simple-position-${position}`
    }
    else if(supportType === 'ROLLER') {
        newButton.textContent = `Roller ${supportCount}`;
        newButton.id = `support-${supportCount}-type-roller-position-${position}`
    }
    else if(supportType === 'FIXED') {
        newButton.textContent = `Fixed End ${supportCount}`;
        newButton.id = `support-${supportCount}-type-fixed-position-${position}`
    }

    newButton.id = `support-${supportCount}`;
    newButton.className = 'triangle-button';
    
    //add event listener to button to allow deletion
    newButton.addEventListener('click', function() {
        deleteElementFromList(this,supportList);
        canvas.removeChild(this);
    });

    //control position on screen
    let positionOnScreenHorizontal = position/length * canvas.offsetWidth + canvas.offsetLeft;
    let positionOnScreenVertical = canvas.offsetHeight + canvas.offsetTop;
    newButton.style.left = `${positionOnScreenHorizontal}px`;
    newButton.style.top = `${positionOnScreenVertical}px`

    supportList.push(newButton);
    canvas.appendChild(newButton);   
    supportCount++;
}

function addLoads(loadType,position,load) {

    let newButton = document.createElement('button');
    
    if(loadType === 'POINT') {
        newButton.textContent = `Force ${forceCount}`;
        newButton.id = `force-${forceCount}-type-point-position-${position}-load-${load}`;
    }
    
    newButton.className = 'point-load-object';

    //add event listener to button to allow deletion
    newButton.addEventListener('click', function() {
        deleteElementFromList(this,forceList);
        canvas.removeChild(this);
    });

    //control position on screen
    let positionOnScreenHorizontal = position/length * canvas.offsetWidth + canvas.offsetLeft;
    let positionOnScreenVertical = canvas.offsetHeight + canvas.offsetTop;
    newButton.style.left = `${positionOnScreenHorizontal}px`;
    newButton.style.top = `${positionOnScreenVertical}px`

    //taking positive load as up, if negative, flip the buttonn
    //if(load < 0) newButton.style.rotate(`180deg`); <----------------How to reflect in x axis??

    forceList.push(newButton);
    canvas.appendChild(newButton);   
    forceCount++;

}

function addBeam() {

    let newBeam = document.createElement('div');
    newBeam.className = 'beam-object';
    canvas.appendChild(newBeam);
}

function eraseCanvas() {
    supports = document.querySelectorAll('.triangle-button');
    forces = document.querySelectorAll('.point-load-object');

    supports.forEach((support) => {
        canvas.removeChild(support);
    });

    forces.forEach((force) => {
        canvas.removeChild(force);
    });

    canvas.removeChild(document.getElementsByClassName('beam-object')[0]);
}

/**
 * 
 * @param {HTMLButtonElement} element 
 * @param {HTMLButtonElement[]} list 
 */
function deleteElementFromList(element, list) {
    let index = list.indexOf(element);
    list.splice(index,1);
}