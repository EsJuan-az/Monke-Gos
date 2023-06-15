//Model and Requirements import

import { setGos, setMonke } from '../helpers/index.js';
import { Bot, BotPool } from '../models/index.js';






//SharedInstances
const cum = new Bot("[🧁]", "cum");     //Birthday bot singleton
const gos = new Bot("[👻]", "gos", setGos)
const monke = new Bot("[🐵]", "monke", setMonke)
const admin = new Bot("[👑]", "admin")
const common = new BotPool( monke, gos );



//Exports
export {
    //Bots
    cum,
    monke, 
    gos,
    admin,
    common,
};