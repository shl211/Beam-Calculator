const addSimpleSupportButton = document.getElementById('add-simple-support');
const addRollerSupportButton = document.getElementById('add-roller-support');
const addFixedSupportButton = document.getElementById('add-fixed-support');
const addPointForceButton = document.getElementById('add-point-force');

const canvas = document.getElementById('visualisation-block');

//beam states
var beamOn = false;
var supportList = [];//array of html elements denoting supports
var forceList = [];//array of html elements denoting forces
var supportCount = 0;
var forceCount = 0;
var beamLength = NaN;
var momentOfInertia = NaN;
var modulusOfElasticity = NaN;

//add a support onto canvas if support add button clicked
addSimpleSupportButton.addEventListener('click', function() {
    if(beamOn) addSupports('SIMPLE',0);
});

addRollerSupportButton.addEventListener('click', function() {
    if(beamOn) addSupports('ROLLER',0);
});

addFixedSupportButton.addEventListener('click', function() {
    if(beamOn) addSupports('FIXED',0);
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
    beamLength = e.detail.length;
    momentOfInertia = e.detail.momentOfInertia;
    modulusOfElasticity = e.detail.modulusOfElasticity;
})

//add a force onto canvas if force add button clicked
addPointForceButton.addEventListener('click', function() {
    if(beamOn) addLoads('POINT',0,0);
});

function addSupports(supportType,position) {
    let newButton = document.createElement('button');

    if(supportType === 'SIMPLE') {
        newButton.textContent = `Simple Support ${supportCount}`;
    }
    else if(supportType === 'ROLLER') {
        newButton.textContent = `Roller ${supportCount}`;
    }
    else if(supportType === 'FIXED') {
        newButton.textContent = `Fixed End ${supportCount}`;
    }

    newButton.id = `support-${supportCount}`;
    newButton.className = 'triangle-button';
    
    //add event listener to button to allow deletion
    newButton.addEventListener('click', function() {
        deleteElementFromList(this,supportList);
        canvas.removeChild(this);
    });

    supportList.push(newButton);
    canvas.appendChild(newButton);   
    supportCount++;
}

function addLoads(loadType,position,load) {

    let newButton = document.createElement('button');
    
    if(loadType === 'POINT') {
        newButton.textContent = `Force ${forceCount}`;
    }
    
    newButton.id = `force-${forceCount}`;
    newButton.className = 'point-load-object';

    //add event listener to button to allow deletion
    newButton.addEventListener('click', function() {
        deleteElementFromList(this,forceList);
        canvas.removeChild(this);
    });

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