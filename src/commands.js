import { exp, findChatByUserAndGroup } from "./global.js";
import { User } from "./userModel.js";

const todos = async(data) => {
    console.log("OnTodos()");
    const {bot, groupId, who} = data;
    const group = await bot.manager.GetGroup(groupId)
    const {participants} = group.groupMetadata
    const author = participants.find(participant => participant.id == who && participant.isAdmin);
    if (author?.isAdmin){
        const participantId = participants.map(({id}) => id)
        bot.MentionPeople(groupId, participantId, {pre : "", after:""})
    }else{
        // bot.SendMessage("Debes ser admin para usar esta funcionalidad🚫", groupId)
    }
}

const sticker = async(data) => {
    console.log("OnSticker()");
    const {bot, groupId, media, quotedMsg} = data;
    if(media){
        await bot.SendMessage("Creando Sticker con imagen...", groupId)
        bot.SendSticker(media, groupId);
    }else if(quotedMsg.media){
        await bot.SendMessage("Creando Sticker con el mensaje referenciado...", groupId);
        bot.SendSticker(quotedMsg.media, groupId);
    }else{
        // await bot.SendMessage("¿Sticker de dónde?", groupId)
    }
}
const increaseExp = async(data) => {
    console.log("OnIncreaseExp()");
    //Buscarlo
    const {who, groupId, type, bot} = data;
    let user = await User.findOne({userId: who});
    //If user doesn't exist we'll create it
    if(!user){
        //Just in case that neither who nor groupId exist, we'll abort
        if(who == "" || groupId == ""){
            return
        }
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
    if(!chat){
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
    let updateUser = await User.findOneAndUpdate(user._id, {levels: user.levels}, {new: true});
    
    //Guardar usuario y grupo con 0, 0 si no existe
}
const admins = async(data) => {
    console.log("OnAdmins()");
    const {bot, groupId} = data;
    const group = await bot.manager.GetGroup(groupId)
    const {participants} = group.groupMetadata
    const admins =  participants.filter(({isAdmin}) => !!isAdmin).map( admin => admin.id );

    bot.MentionPeople(groupId, admins, {pre : "", after:""});

}



const rank = async(data) => {
    console.log("OnRank()");
    const {who, groupId, bot} = data;
    let users = ( await User.find({}) ).filter(user => !!findChatByUserAndGroup(user, groupId));
    users = users.sort( (u2, u1) => findChatByUserAndGroup(u1, groupId).exp - findChatByUserAndGroup(u2, groupId).exp ).sort( (u2, u1) => findChatByUserAndGroup(u1, groupId).level - findChatByUserAndGroup(u2, groupId).level )
    users.forEach( user => console.log(`${user.name}: ${findChatByUserAndGroup(user, groupId)}`));
    const user = users.find(user => user.userId.includes(who));
    const chat = findChatByUserAndGroup(user, groupId);
    if(!chat) return
    const rank = users.indexOf(user) + 1
    if(rank == 0){
        console.log("Algo mal");
    }
    bot.MentionPeople(groupId, [who], {pre: "Estadísticas: ", after: `\nExp🌟: ${chat.exp}/${chat.level * 10}\nNivel🎓: ${chat.level}\nRank#${rank}${rank == 1 ? "👑" : "💀"}`})
}

const say = async({options, groupId, bot}) => {
    console.log("OnSay()");
    console.log(options);
    if(!options){
        return
    }
    let msg = ''
    options.forEach(word => msg += " " + word)
    msg = msg.replaceAll("#","hashtag").replaceAll("13", "entre más me la mama más me crece")
    console.log(msg);

    const resp = await bot.SendAudio(msg, groupId);
    console.log(resp);
}


const top = async(data) => {

}
const monke = {
    todos,
    admins,
    sticker,
    say
}
const gos = {
    rank, 
    top
}
const utils = {
    increaseExp
}
export  {
    monke,
    gos,
    utils
}

//Max de exp por nivel 10 20 30