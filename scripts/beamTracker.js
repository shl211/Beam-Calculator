const addSimpleSupportButton = document.getElementById('add-simple-support');
const addRollerSupportButton = document.getElementById('add-roller-support');
const addFixedSupportButton = document.getElementById('add-fixed-support');
const addPointForceButton = document.getElementById('add-point-force');

const canvas = document.getElementById('visualisation-block');

var supportList = [];
var supportCount = 0;
var forceCount = 0;

//add a support onto canvas if support add button clicked
addSimpleSupportButton.addEventListener('click', function() {
    addSimpleSupport();
});

addRollerSupportButton.addEventListener('click', function() {
    addRollerSupport();
});

addFixedSupportButton.addEventListener('click', function() {
    addFixedSupport();
});

//add a force onto canvas if force add button clicked
addPointForceButton.addEventListener('click', function() {
    addPointLoad();
});

const addSimpleSupport = function() {
    
    let newButton = document.createElement('button');
    newButton.textContent = `Simple Support ${supportCount}`;
    newButton.id = `support-${supportCount}`;
    newButton.className = 'triangle-button';
    
    //add event listener to button to allow deletion
    newButton.addEventListener('click', function() {
        canvas.removeChild(this);
    });


    canvas.appendChild(newButton);   
    supportCount++;
}

const addRollerSupport = function() {
    
    let newButton = document.createElement('button');
    newButton.textContent = `Roller ${supportCount}`;
    newButton.id = `support-${supportCount}`;
    newButton.className = 'triangle-button';
    
    //add event listener to button to allow deletion
    newButton.addEventListener('click', function() {
        canvas.removeChild(this);
    });

    canvas.appendChild(newButton);   
    supportCount++;
}

const addFixedSupport = function() {
    
    let newButton = document.createElement('button');
    newButton.textContent = `Fixed End ${supportCount}`;
    newButton.id = `support-${supportCount}`;
    newButton.className = 'triangle-button';

    //add event listener to button to allow deletion
    newButton.addEventListener('click', function() {
        canvas.removeChild(this);
    });

    canvas.appendChild(newButton);   
    supportCount++;
}

const addPointLoad = function() {
    
    let newButton = document.createElement('button');
    newButton.textContent = `Force ${forceCount}`;
    newButton.id = `force-${forceCount}`;
    newButton.className = 'point-load-object';

    //add event listener to button to allow deletion
    newButton.addEventListener('click', function() {
        canvas.removeChild(this);
    });

    canvas.appendChild(newButton);   
    forceCount++;
}