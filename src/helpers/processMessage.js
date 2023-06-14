import { gos, monke } from '../env/singleton.js';
import { code, rmc } from '../env/env.js';
import { monke as cmdMonke, gos as cmdGos } from './commands.js';
import { monke as midMonke, gos as midGos } from './middlewares.js';

const botSettings = [
    {
        bot: monke,
        cmds: cmdMonke,
        middlewares: midMonke,
        chats: [code, rmc],
    },
    {
        bot: gos,
        middlewares: midGos,
        cmds: cmdGos,
        chats: [code, rmc],
    },
];

botSettings.forEach( ({ bot, ...data }) => bot.Set(data) );

const Bots = [monke, gos];

const processMessage = async(message) => {
    const {data} = message;
    //In case there's no author, to, from or if the message contins [] (bot messages)
    const isBot = data?.author == "" || !data?.author || !data?.to || !data?.from || /\[.+\]/.test(data?.body);
    if( isBot ){
        //And then we prevent the default behaviour
        return;
    }
    //We'll find out the groupId, if there's no groupId we'll omit
    if ( data.to.includes("@g.us") ){
        data.groupId = data.to;
    }else if( data.from.includes("@g.us") ){
        data.groupId = data.from;
    }else{
        return;
    }

    //Now we'll embed some data into the default data
    data.who = data.author.replace(/:\d+/,""); //We delete the :d prefix onthe messages for refering to the author
    
    console.log("OnJoin()")
    //Everybot will eval the message and do the respectives processes
    for(let bot of Bots){
        bot.EvalBot( data );
    }
}
export {
    processMessage
};

