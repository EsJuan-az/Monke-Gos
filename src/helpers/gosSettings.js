const BotSettings = require("../models/botSettings");
const User = require("../models/user")
const { exp, ww } = require('../env/env');
const { UserManager } = require('../models/taskManagers')
const updateExp = async( bot, messageRequest, options ) => {
    //We get data
    const { author, chat, message } = messageRequest.get();

    const authorId = author.id._serialized.replace(/:[\d]+/, '');
    const publicAuthor = await messageRequest.getPublicContact( authorId );
    const { pushname:authorName } = publicAuthor;

    const chatId = chat.id._serialized;
    const pictureUrl = await publicAuthor.getProfilePicUrl();
    //Now we try to get the group
    const { ok, user:newUser, levelUp } = await UserManager.incrementExp( authorId, chatId, exp[message.type], authorName, pictureUrl )
    if ( !ok || !newUser ) return;
    const newGroup = newUser.groups.find( g => g.chatId == chatId );
    //Now we get the newGroup
    if( levelUp ) return await bot.mention( chat, [ publicAuthor ], `\nFelicidades, $m, has subido a nivel ${ newGroup.level }🌃🧁✨🤗` )//Mensaje de levelup

}

const rank = async( bot, messageRequest, options ) => {
    const { author:a, chat, message } = messageRequest.get();
    bot.sendMessage( chat, 'Esto puede tardar unos segundos...' );
    let author
    if( message.mentionedIds.length > 0 ){
        author = await message.getMentions()
        author = author[0];
    }else{
        author = a
    }


    const authorId = author.id._serialized.replace(/:[\d]+/, '');;
    author = await messageRequest.getPublicContact( authorId );

    const chatId = chat.id._serialized
    const { ok, users } = await UserManager.getUsersByGroup( chatId )
    if( !ok ) return bot.sendMessage( chat, 'Algo ha salido mal en el proceso de rankearte😔' );

    const index = users.findIndex( u => u.userId == authorId );
    if( index == -1 ) return bot.sendMessage( chat, 'Algo ha salido mal en el proceso de rankearte😿' );

    const [ rank, groupData ] = [ index+1, users[index].groups ];

    const rankText = `${rank} ${ rank == 1 ? '🔥👑🔥' : '💩' }`;
    bot.mention(chat, [ author ], `Estadísticas de $m🗿:\nExp: ${groupData.exp}/${groupData.level * 10}🐍\nLevel: ${groupData.level}/∞🌟\nMensajes totales✉️:${groupData.totalMsg}\nRank:${rankText}`)

}

const settings = {
    cmds: {
        rank
    },
    middlewares: {
        updateExp
    }
}
const gosSettings = new BotSettings().set(settings);
module.exports = gosSettings;