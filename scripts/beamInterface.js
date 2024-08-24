import BeamAnalysis from '../beamSolver/beamAnalysis.js';
import Support from '../beamSolver/support.js';
import Force from '../beamSolver/force.js';

const beam = new BeamAnalysis();

let length;
let E;
let I;
let supports;
let forces;


window.addEventListener('toggleBeam',function(e) {

    E = e.detail.E;
    I = e.detail.I;
    length = e.detail.length;
    supports = processSupportList(e.detail.supports);
    forces = processForcesList(e.detail.forces);

    analyseBeam();

});


function processSupportList(supportListHTML) {

    supports = [];

    supportListHTML.array.forEach(element => {
        let id = element.id; //id of form support-#-type-TYPE-position-POSITION
        let info = id.split("-");
        let supportType = info[3];
        let position = info[5];

        if(supportType == 'simple') supportType = 'PIN';
        if(supportType == 'roller') supportType = 'ROLLER';
        if(supportType == 'fixed') supportType = 'FIXED';

        supports.push(new Support(position,supportType));
    });

}

function processForcesList(forceListHTML) {

    forces = [];

    forceListHTML.array.forEach(element => {
        let id = element.id; //id of form force-#-type-TYPE-position-POSITION-load-LOAD
        let info = id.split("-");
        let loadType = info[3];
        let position = info[5];
        let load = info[7];

        if(loadType == 'point') supportType = 'POINT';
        console.log("H")
        forces.push(new Force(position,load));
    });
}

function analyseBeam(supports,forces,length) {

    beam.resetAnalysis();
    beam.initialise(supports,forces,length);
    beam.analyse();

    let deflectionEq = beam.deflectionEquation;

}