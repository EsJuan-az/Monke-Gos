import  wwjs  from 'whatsapp-web.js';
import { TaskManager } from '../models/index.js'

const MessageMedia = wwjs.MessageMedia;

class Bot{
    constructor(logPrefix, reqPrefix, set){
        this.manager = TaskManager.taskManager;
        this.logPrefix = logPrefix;
        this.commandRegex = new RegExp(`^${reqPrefix} \\w{3,}( \\S+)*`);
        this.commands = set?.cmds || {};
        this.middlewares = set?.middlewares || [];
        this.allowed = set?.chats || [];
        console.log( logPrefix, this.commands);
    }
    //Decode a string and execute the respective command
    DecodeCommand(command){
        const cmd = this.manager.DecodeCommand(command);
        //if there's no command we'll return false, otherwise we'll return the command
        cmd.command = !!cmd.command ? this.GetCommand(cmd.command) : false
        return cmd
    }

    AddMiddleware(middleware){
        this.middlewares.push(middleware);
    }
    AddCommand(name, newCommand){
        this.commands[name] = newCommand;
    }
    GetCommand(name){
        return this.commands[name];
    }
    AddAllowed(chat){
        this.allowed.push(chat);
    }
    //Verify an id is valid for executing the command
    IdIsAllowed(id){
        for(let chatId of this.allowed){
            if( id.includes(chatId) ){
                return chatId;
            }
        }
        return null;
    }
    GetCmdMatches(cmd){
        let matches = cmd.match(this.commandRegex);
        return !!matches ? matches[0] : null;
    }

    async EvalBot( data ) {
        //We get some data from the msg object without affecting it
        const msg = data.message.body;
        const match = this.GetCmdMatches(msg);
        const chat = this.IdIsAllowed( data.message.id._serialized   );
        if( chat ) this.middlewares.forEach( middleware => middleware( {...data, bot: this} ));
        if( chat && match){
                const cmd = this.DecodeCommand(match);
                //If there's no command object we'll ommit
                if(!cmd.command){
                    return;
                }
                //Now we exec the command sending the bod and the options
                cmd.command({options: cmd.options, ...data, bot: this});
        }
    
    }

    async SendMessage(chat, message){
        try{
            //Add the prefix to the message
            let msg = `${this.logPrefix} ${message}`;

            //now, based on the chat, we send the message
            let response = await chat.sendMessage( msg )
            return response;
        }catch(err){
            console.log(err);
        }
    }
    
    //Mention people with a message before and after those mentions
    async MentionPeople(chat, mentions, ftext){
        try{
            let mentionText = "";
            //We create a mention text and embed it in the original message
            mentions.forEach( contact => mentionText += ` @${contact.id.user} ` );
            ftext = ftext.replace( "$m", mentionText);
            let msg = `${this.logPrefix} ${ftext}`;

            //We send it and get it
            let response = await chat.sendMessage( msg, {
                mentions: mentions
            });
            return response;
        }
        catch(err){
            console.log(err);
        }
    }
    
    async SendSticker(chat, media){
        try{
            let response = await chat.sendMessage( media, {
                sendMediaAsSticker: true,
                stickerAuthor: 'JuanEs-az',
                stickerName: 'Monke-Gos',
                media: media
            });
            return response;
        }catch(err){
            console.log(err);
            this.SendMessage(chat, "No es posible hacer un sticker con eso😒")
        }

    }
    async SendAudio(chat, msg){
        try{
            //Now, we turn the text into speech through the task manager
            const {url: msg_url, public_id} = await this.manager.TextToSpeech(msg);
            console.log(msg_url);
            //Now that we got it, we use this to prepare the request and use the public id to delete the audio later

            //We send the audio
            const media = MessageMedia.fromUrl( msg_url );
            const response = await chat.sendMessage(media, {
                sendAudioAsVoice: true,
                media: media
            })
            console.log(response);
            //We delete it in the cloud
            const del = await this.manager.CloudDestroy(public_id, "video")
            return {...response, ...del}
        }catch(err){
            console.log(err);
        }
    }
}

export {
    Bot
};