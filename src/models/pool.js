const { ww } = require('../env/env');
const MessageRequest = require('./messageRequest');

class Pool{
    constructor(...bots){
        this.bots = bots;
        this.chats = [];
        this.onAwake = () => {};
    }
    setOnAwake( handler ){
        this.onAwake = handler;
    }
    async broadcast(messageRequest){
        this.bots.forEach( bot  => {
            bot.eval( messageRequest );
        })
    }
    async broadcastAction( handler ){
        this.chats.forEach( chat => {
            this.bots.forEach( bot => handler( chat, bot) )
        });
    }
    async awake(){
        this.onAwake();
    }
    async addChats( ...chatIds ){
        const newChats = await Promise.all( chatIds.map( id => ww.client.getChatById( id ) ) );
        this.chats = this.chats.concat( newChats );
    }
    async processMsg( message ){
        if(message.body.match(/\[.+\]/)) return;
        //We confirm the message contains any of the chat ids
        const chat = this.chats.find( chat => message.id._serialized.includes( chat.id._serialized ) );
        if( !chat ) return
        //Now if the chat exists, we'll get the author and eval the bots
        const author = await message.getContact();
        const req = new MessageRequest( message, chat, author );
        this.broadcast( req );
    }
}
module.exports = Pool;