const Bot = require('./bot');
const BotSettings = require('./botSettings');
const Pool = require('./pool');
const monkeSettings = require('../helpers/monkeSettings')
const gosSettings = require('../helpers/gosSettings')
//Here we get
const monke = new Bot('[🐵]', 'monke', monkeSettings);
const gos = new Bot('[👻]', 'gos', gosSettings);
const common = new Pool( monke, gos );


module.exports = {
    monke, gos, common
}