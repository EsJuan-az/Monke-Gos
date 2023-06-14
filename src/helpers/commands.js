import { findChatByUserAndGroup } from "../env/env.js";
import { User } from "../models/user.js";

const todos = async({bot, groupId, who}) => {
    console.log("OnTodos()");

    //We get group's participants from metadata
    const group = await bot.manager.GetGroup(groupId);
    const {participants} = group.groupMetadata;
    //We confirm the author is admin
    const author = participants.find(participant => participant.id == who && participant.isAdmin);
    //We mention everyone just in case the author's admin
    if (author){
        const participantId = participants.map(({id}) => id)
        bot.MentionPeople(groupId, participantId, {pre : "", after:""})
    }
}

const sticker = async({bot, groupId, media, quotedMsg}) => {
    console.log("OnSticker()");

    //We confirm if there's media or some quoted msg with media
    if(media){
        await bot.SendMessage("Creando Sticker con imagen...", groupId);
        bot.SendSticker(media, groupId);
    }else if(quotedMsg.media){
        await bot.SendMessage("Creando Sticker con el mensaje referenciado...", groupId);
        bot.SendSticker(quotedMsg.media, groupId);
    }
}

const admins = async({bot, groupId}) => {
    console.log("OnAdmins()");

    //We get the participants
    const group = await bot.manager.GetGroup(groupId);
    const {participants} = group.groupMetadata;
    //Filter the admins from the users
    const admins =  participants.filter(({isAdmin}) => !!isAdmin).map( admin => admin.id );
    //Mention them
    bot.MentionPeople(groupId, admins, {pre : "", after:""});
}



const rank = async({who, groupId, bot}) => {
    console.log("OnRank()");

    //We get every user
    let [...users] = await User.find({});

    //Now we filter those who have the groupId between its groups 
    users = users.map( user => {
        const chat = findChatByUserAndGroup(user, groupId);
        if(!chat) return;
        return {
            user,
            chat
        }
    });
    //We sort the users based on their level and experience
    users = users
        .sort( (u1, u2) => u2.exp - u1.exp )
        .sort( (u1, u2) => u2.level - u1.level );
    //Logs to confirm
    users.forEach( user => console.log(`${user.name}: ${user.level} ${user.exp}`));

    //We find the user that mentioned
    const user = users.find(user => user.userId.includes(who));
    const userIndex = users.indexOf(user);
    //If the user that mentioned doesn't exist, we finish
    if(userIndex === -1) return;
    //We establish the rank based on the userIndex
    const rank = userIndex + 1;
    bot.MentionPeople(groupId, [who], {pre: "Estadísticas: ", after: `\nExp🌟: ${user.exp}/${user.level * 10}\nNivel🎓: ${user.level}\nRank#${rank}${rank == 1 ? "👑" : "💀"}`})
}

const say = async({options, groupId, bot}) => {
    console.log("OnSay()");


    if(!options){
        return
    }
    //We create a message based in the options
    let msg = ''
    options.forEach(word => msg += " " + word)
    msg = msg.replaceAll("#","hashtag").replaceAll("13", "entre más me la mama más me crece")

    //We send the audio
    await bot.SendAudio(msg, groupId);
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
export  {
    monke,
    gos,
}
