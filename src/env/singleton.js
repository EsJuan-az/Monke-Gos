//Model and Requirements import
import Bot from '../models/bot.js';


//SharedInstances
const cum = new Bot("[🧁]", "cum");     //Birthday bot singleton
const gos = new Bot("[👻]", "gos");
const monke = new Bot("[🐵]", "monke");
const admin = new Bot("[👑]", "admin")



//Exports
export {
    //Bots
    cum,
    monke, 
    gos,
    admin
};