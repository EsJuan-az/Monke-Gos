import Bot from './bot.js';
import { code, rmc } from './global.js';
import { monke as cmdMonke, utils, gos as cmdGos } from './commands.js';

const Gos = new Bot("[👻]", "gos");
const Monke = new Bot("[🐵]", "monke");

const Bots = [Monke, Gos];
Monke.AddAllowed(rmc);
Monke.AddAllowed(code);
Gos.AddAllowed(rmc);
Gos.AddAllowed(code);

for(let cmd of Object.keys(cmdGos)){
    Gos.AddCommand(cmd, cmdGos[cmd])
}

for( let cmd of Object.keys(cmdMonke) ){
    Monke.AddCommand(cmd, cmdMonke[cmd])
}
const processMessage = async(message) => {
    const {data} = message
    if( data?.author == "" || !data?.author || !data?.to || !data?.from || /\[.+\]/.test(data?.body)){
        console.log(data);
        console.log("Omitting request");
        return
    }
    data.who = data.author.replace(/:\d+/,"")
    data.groupId = data.to.includes("@g.us") ? data.to : data.from
    if( Gos.IdIsAllowed(data.groupId) ){
        utils.increaseExp({...data, bot: Gos});
        console.log(data);
    } 
    
    for(let bot of Bots){
        let data2 = {...data}
        evalBot(bot, data2)
    }
}
export {
    processMessage
};
// :9
// [🚫]
const evalBot = async(bot, data) => {
    let msg = data.body;
    let match = bot.GetCmdMatches(msg);
    let chat = bot.IdIsAllowed(data.id);
    if(chat){
        if(match){
            let cmd = bot.DecodeCommand(match);
            if(!cmd.command){
                bot.SendMessage("No existe ese comando💀" , chat);
                return;
            }
            cmd.command({options: cmd.options, ...data, bot})
        }
    }

}
//.monke sticker --algo --algo