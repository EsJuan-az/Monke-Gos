const BotSettings = require("../models/botSettings");
const { ww } = require('../env/env');

const prueba = async( bot, messageRequest, options ) => {
    await bot.sendMessage(messageRequest.chat, 'pong')

}

const sticker = async( bot, messageRequest, options ) => {
    console.log("OnSticker()");
    const { chat, message } = messageRequest.get();
    // We confirm if there's media or some quoted msg with media
    if(message.hasQuotedMsg){
        //Here we decide
        await bot.sendMessage(chat, "Creando Sticker con el mensaje referenciado...");
        const quoted = await message.getQuotedMessage();
        const media = await quoted.downloadMedia();
        await bot.sendSticker(chat, media);
    }else if(message.hasMedia){
        await bot.sendMessage(chat, "Creando Sticker con imagen...");
        const media = await message.downloadMedia();
        await bot.sendSticker(chat, media);
    }else{
        await bot.sendMessage(chat, "¿Sticker de dónde?")
    }
}

const todos = async(bot, messageRequest, options ) => {
    console.log("OnTodos()");
    //We get group's participants from metadata
    const { chat, author } = await messageRequest.get();
    const { participants } = chat.groupMetadata;
    //We confirm the author is admin
    const admin = participants.some(participant => participant.id._serialized == author.id._serialized && participant.isAdmin);

    //We mention everyone just in case the author's admin
    if (admin){
        const promiseContacts = participants.map(( { id } ) => ww.client.getContactById( id._serialized ));
        const contacts = await Promise.all( promiseContacts );
        bot.mention( chat, contacts, "🔥Llamado al grupo🔥\n$m" )
    }else{
        bot.sendMessage(chat, "No eres admin🤬🫵")
    }
}

const admins = async(bot, messageRequest, options) => {
    console.log("OnAdmins()");
    //We get group's participants from metadata
    const { chat } = await messageRequest.get();
    const { participants } = chat.groupMetadata;

    //We mention everyone just in case the author's admin
    const promiseContacts = participants.map(( { id, isAdmin } ) => isAdmin ? ww.client.getContactById( id._serialized ) : undefined).filter(contact => !!contact);
    const contacts = await Promise.all( promiseContacts );
    bot.mention( chat, contacts, "👑Llamado oficial a los admins👑\n$m" )

}
const settings = {
    cmds: {
        prueba,
        sticker,
        todos,
        admins
    },
    middlewares: {
    }
}
const monkeSettings = new BotSettings().set(settings);
module.exports = monkeSettings;