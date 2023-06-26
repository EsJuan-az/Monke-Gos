const BotSettings = require("../models/botSettings");
const { ww } = require('../env/env');
const prueba = async( bot, messageRequest, options ) => {

}
const settings = {
    cmds: {
        prueba
    },
    middlewares: {
        prueba
    }
}
const gosSettings = new BotSettings().set(settings);
module.exports = gosSettings;