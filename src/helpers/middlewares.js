import { User } from "../models/user.js";
import { exp } from "../env/env.js";

const increaseExp = async(data) => {
    console.log("OnIncreaseExp()");
    //Buscarlo
    const {who, groupId, type, bot} = data;

    //Just in case that neither who nor groupId exist, we'll abort
    if(who == "" || groupId == ""){
        return
    }

    let user = await User.findOne({userId: who});
    //If user doesn't exist we'll create it
    if(!user){
        user = User();
        user.userId = `${who}`;
        user.name = `${data.pushname}`
        user.levels = [{
            chatId: `${groupId}`,
            exp: 0,
            level: 1,
        }]
        await user.save();
        //now that we did that, we just finish
        return
    }
    //we try to get the chat data, if group doesn't exist we'll add it
    const chat = user.levels.find( ({chatId}) => chatId == groupId )
    if( !chat ){
        user.levels.push({
            chatId: `${groupId}`,
            exp: 0,
            level: 1,
        })
    }
    //now that we granted user and group, we'll increase the data
    else{
        //We get the new exp and the level (if it's required we level it up)
        chat.exp = parseFloat(chat.exp) + exp[type];
        chat.level = parseInt(chat.level);
        if(chat.exp >= chat.level * 10){
            chat.level++;
            chat.exp = 0;
            //level ups will be notified
            bot.MentionPeople(groupId, [who], {pre: "Felicidades, ", after: `\nHas subido a nivel ${chat.level}`});
            user.levels = user.levels.filter( ({chatId}) => chatId != groupId );
            user.levels.push(chat)
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