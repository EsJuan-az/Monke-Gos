import { User } from "../models/index.js";
import { exp } from "../env/index.js";

const increaseExp = async( { message, who, bot } ) => {
    console.log("OnIncreaseExp()");
    //Buscarlo
    const { type } = message;
    const chat = await message.getChat();
    const contact = await message.getContact();
    //Just in case that neither who nor groupId exist, we'll abort
    if(who == ""){
        return
    }

    let user = await User.findOne({userId: who});
    //If user doesn't exist we'll create it
    if(!user){
        user = User();
        user.userId = `${who}`;
        user.name = `${message.notifyName}`
        user.levels = [{
            chatId: `${chat.id}`,
            exp: 0,
            level: 1,
        }]
        await user.save();
        //now that we did that, we just finish
        return;
    }
    //we try to get the chat data, if group doesn't exist we'll add it
    const level = user.levels.find( ({chatId}) => chatId == chat.id )
    if( !level ){
        user.levels.push({
            chatId: `${chat.id}`,
            exp: 0,
            level: 1,
        })
    }
    //now that we granted user and group, we'll increase the data
    else{
        //We get the new exp and the level (if it's required we level it up)
        let adexp = exp[type] || 0.1
        level.exp = parseFloat(level.exp) + adexp;
        level.level = parseInt(level.level);
        if(level.exp >= level.level * 10){
            level.level++;
            level.exp = 0;
            //level ups will be notified
            bot.MentionPeople(chat, [contact], `Felicidades $m,\nHas subido a nivel ${level.level}`);
            user.levels = user.levels.filter( ({chatId}) => chatId != chat.id );
            user.levels.push(level)
        }
    }

    //we update the score
    await User.findOneAndUpdate(user._id, {levels: user.levels}, {new: true});
};

const gos = [
    increaseExp
];
const monke = [

];
export {
    gos,
    monke,
}