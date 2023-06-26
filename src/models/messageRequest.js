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
}
module.exports = MessageRequest;