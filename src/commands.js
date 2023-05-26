import { exp } from "./global.js";
import { User } from "./userModel.js";

const todos = async(data) => {
    console.log("OnTodos()");
    const {bot, groupId, who} = data;
    const group = await bot.GetGroup(groupId)
    const {participants} = group.groupMetadata
    let author = null
    participants.forEach(participant => {
        if(who == participant.id){
            author = participant
        }
    });
    if (author.isAdmin){
        const participantId = participants.map(({id}) => id)
        bot.MentionPeople(groupId, participantId)
    }else{
        bot.SendMessage("Debes ser admin para usar esta funcionalidad🚫", groupId)
    }
}

const sticker = async(data) => {
    console.log("OnSticker()");
    const {bot, groupId, media, quotedMsg} = data;
    if(media){
        await bot.SendMessage("Creando Sticker con imagen...", groupId)
        bot.SendSticker(media, groupId);
    }else if(quotedMsg.media){
        await bot.SendMessage("Creando Sticker con el mensaje referenciado...", groupId)
        bot.SendSticker(quotedMsg.media, groupId);
    }else{
        await bot.SendMessage("¿Sticker de dónde?", groupId)
    }
}
const increaseExp = async(data) => {
    console.log("OnIncreaseExp()");
    //Buscarlo
    console.log("Haciendo algo");
    const {who, groupId, type, bot} = data;
    let user = await User.findOne({userId: who, chatId: groupId})
    if(!user){
        if(who == "" || groupId == ""){
            return
        }
        user = User();
        user.userId = `${who}`;
        user.chatId = `${groupId}`;
        user.exp = 0;
        user.level = 1;
        await user.save();
    }
    let newExp = parseFloat(user.exp) + exp[type];
    let newLevel = parseInt(user.level);
    if(newExp >= user.level * 10){
        newLevel++;
        newExp = 0;
        bot.MentionPeople(groupId, [who], {pre: "Felicidades, ", after: `\nHas subido a nivel ${newLevel}`})
    }
    let updateUser = await User.findOneAndUpdate(user._id, {exp: newExp, level: newLevel}, {new: true});
    //Guardar usuario y grupo con 0, 0 si no existe
}
const rank = async(data) => {
    console.log("OnRank()");
    const {who, groupId, bot} = data;
    let users = await User.find({chatId: groupId}).sort({level:-1, exp: -1});
    let rank = 1;
    let user = null;
    console.log(users);
    for(let u of users){
        if(u.userId.includes(who)){
            user = u
            break
        }
        rank ++;
    }
    
    bot.MentionPeople(groupId, [who], {pre: "Estadísticas: ", after: `\nExp: ${user.exp}/${user.level * 10}\nNivel: ${user.level}\nRank#${rank}`})
}

const top = async(data) => {

}
const monke = {
    todos,
    sticker
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