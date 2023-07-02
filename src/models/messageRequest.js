const { ww } = require("../env/env");

class MessageRequest{
    constructor( message, chat, author ){
        this.message = message;
        this.chat = chat;
        this.author = author;
    }
    get(){
        return {
            message: this.message,
            chat: this.chat,
            author: this.author
        }
    }
    async getPublicContact( id ){
        return await ww.client.getContactById( id );
    }
}
module.exports = MessageRequest;