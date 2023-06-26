class Bot{
    constructor(prefix, inputPrefix, settings){
        this.prefix = prefix;
        this.regexp = new RegExp(`^${inputPrefix} \\w{3,}( \\S+)*`);
        this.settings = settings;
    }
    async eval( messageRequest ){
        //We run the middlewares

        this.settings.middlewares.forEach( mdw => {
            mdw.execute( this, messageRequest, []);
        });
        //We get the matches and the commands
        const matches = messageRequest.message.body.match( this.regexp );
        if( !matches ) return;
        const {command, options} = this.decode( matches[0] );

        //If there's no command, we quit
        if( !command ) return;
        command.execute( this, messageRequest, options )
    }

    decode( match ){
        let arr = match.split(' ');
        const details = {};
        details.command = this.settings.commands.find( cmd =>  cmd.name == arr[1]) || null;
        details.options = arr.length > 2 ? arr.slice(2) : [];
        return details;
    }
    async sendMessage( chat, text ){
        try{
            await chat.sendMessage( `${this.prefix} ${text}` );
            return { ok: true }
        }catch(err){
            return { ok: false, err }
        }
    }
    async replyMessage( message, text ){
        try{
            await message.reply( `${this.prefix} ${text}` );
            return { ok: true }
        }catch(err){
            return { ok: false, err }
        }
    }
    async sendSticker( chat, media ){
        try{
            await chat.sendMessage( media, {
                sendMediaAsSticker: true,
                stickerAuthor: 'Monke-Gos',
                stickerName: this.prefix,
                stickerCategories: this.prefix,
                media
            });
            return { ok: true }
        }catch(err){
            return { ok: false, err }
        }
    }
    async mention( chat, contacts, format ){
        let mentions = contacts.reduce( ( value, contact ) => value + ` @${contact.id.user}`, '' );
        try{
            await chat.sendMessage( `${this.prefix} ${format}`.replace( '$m', mentions ), {
                mentions: contacts
            });
            return { ok: true }
        }catch(err){
            return { ok: false, err }
        }
    }
}
module.exports = Bot;

//monke a ab abc
//monkea