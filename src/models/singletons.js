const Bot = require('./bot');
const Pool = require('./pool');

const monkeSettings = require('../helpers/monkeSettings');
const gosSettings = require('../helpers/gosSettings');
const planSettings = require('../helpers/planSettings');
const recuerdoSettings = require('../helpers/recuerdoSettings');


//Here we get
const monke = new Bot('[🐵]', 'monke', monkeSettings);
const gos = new Bot('[👻]', 'gos', gosSettings);
const plan = new Bot('[🫀]', 'plan', planSettings);
const recuerdo = new Bot('[🫀]', 'recuerdo', recuerdoSettings);


const jv = new Pool( plan, recuerdo, monke );
const common = new Pool( monke, gos );


module.exports = {
    common, jv
}