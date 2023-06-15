import { findChatByUserAndGroup } from "../env/index.js";
import { User, Server } from "../models/index.js";

const todos = async({message, bot, who}) => {
    console.log("OnTodos()");
    //We get group's participants from metadata
    const chat = await message.getChat();
    const { participants } = chat.groupMetadata;
    //We confirm the author is admin
    const author = participants.find(participant => participant.id._serialized.includes(who) && participant.isAdmin);

    //We mention everyone just in case the author's admin
    if (!!author){
        const promiseContacts = participants.map(( { id } ) => Server.client.getContactById( id._serialized ));
        const contacts = await Promise.all( promiseContacts );
        bot.MentionPeople( chat, contacts, "🌟OS CONVOCO A TODOS🌟\n$m" )
    }else{
        bot.SendMessage(chat, "No eres admin🤬🫵")
    }
}


const admins = async({message, bot}) => {
    console.log("OnAdmins()");
    //We get group's participants from metadata
    const chat = await message.getChat();
    const { participants } = chat.groupMetadata;

    //We mention everyone just in case the author's admin
    const promiseContacts = participants.map(( { id, isAdmin } ) => isAdmin ? Server.client.getContactById( id._serialized ) : undefined).filter(contact => !!contact);
    const contacts = await Promise.all( promiseContacts );
    bot.MentionPeople( chat, contacts, "👑Llamado oficial a los admins👑\n$m" )

}

const sticker = async({message, bot}) => {
    //TODO: MP4
    console.log("OnSticker()");
    const chat = await message.getChat();
    //We confirm if there's media or some quoted msg with media
    if(message.hasQuotedMsg){
        await bot.SendMessage(chat, "Creando Sticker con el mensaje referenciado...");
        const quoted = await message.getQuotedMessage();
        const media = await quoted.downloadMedia();
        bot.SendSticker(chat, media);
    }else if(message.hasMedia){
        await bot.SendMessage(chat, "Creando Sticker con imagen...");
        const media = await message.downloadMedia();
        bot.SendSticker(chat, media);
    }else{
        await bot.SendMessage(chat, "¿Sticker de dónde?")
    }
}





const rank = async({message, bot, who}) => {
    console.log("OnRank()");
    //We get every user
    let [...users] = await User.find({});
    users = users.map( user => user._doc )
    let chat = await message.getChat();
    //Now we filter those who have the groupId between its groups 
    users = users.map( user => {
        const lv = findChatByUserAndGroup(user, chat.id._serialized);
        if(!lv) return; 
        const {level, exp, chatId} = lv;
        let { userId, name, birthday } = user
        return {
            userId, name, birthday, level, exp, chatId
        }
    }).filter( user => !!user );
    console.log(users);
    //We sort the users based on their level and experience
    users = users
        .sort( (u1, u2) => u2.exp - u1.exp )
        .sort( (u1, u2) => u2.level - u1.level );
    //Logs to confirm

    users.forEach( user => console.log(`${user.name}: ${user.level}/${user.exp}`));
    //We find the user that mentioned
    who = message.mentionedIds[0] || who;

    const user = users.find(user => user.userId.includes(who));
    const userIndex = users.indexOf(user);
    //If the user that mentioned doesn't exist, we finish
    if(userIndex === -1) return;
    //We establish the rank based on the userIndex
    const rank = userIndex + 1;
    const contact = await Server.client.getContactById( who );
    bot.MentionPeople(chat, [contact],`Estadísticas de $m🐲:\nExp🌟: ${user.exp}/${user.level * 10}\nNivel🎓: ${user.level}\nRank#${rank}${rank == 1 ? "👑" : "💀"}`)
}

const say = async({options, bot, message}) => {
    console.log("OnSay()");
    const chat = await message.getChat()
    if(!options){
        return
    }
    //We create a message based in the options
    let msg = ''
    options.forEach(word => msg += " " + word)
    msg = msg.replaceAll("#","hashtag").replaceAll("13", "entre más me la mama más me crece")

    //We send the audio
    await bot.SendAudio(chat, msg);
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
