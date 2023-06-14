
import qs from 'qs';
import axios from 'axios';
import {  ultramsg_token, url } from '../env/env.js';
import { TaskManager } from '../models/taskManager.js'

class Bot{
    constructor(logPrefix, reqPrefix){
        this.manager = TaskManager.taskManager;
        this.logPrefix = logPrefix;
        this.commandRegex = new RegExp(`^${reqPrefix} \\w{3,}( \\S+)*`);
        this.commands = {};
        this.middlewares = [];
        this.allowed = [];
    }
    //We send the bot it's respective chats and processes
    Set({cmds, chats, middlewares }){
        chats.forEach( chat => this.AddAllowed( chat ) );
        middlewares.forEach( middleware => this.AddMiddleware(middleware) );
        for( let cmd in cmds){
            this.AddCommand(cmd, cmds[cmd]);
        }
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
        this.middlewares.forEach( middleware => middleware( data ));
        //We get some data from the msg object without affecting it
        const msg = data.body;
        const match = this.GetCmdMatches(msg);
        const chat = this.IdIsAllowed(data.id);
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

    async SendMessage(message, destination){
        try{
            //Add the prefix to the message
            let msg = `${this.logPrefix} ${message}`;

            //Configure the data
            let data = qs.stringify({
                "token": ultramsg_token,
                "to": destination,
                "body": msg,
            });

            //Set the request
            var config = {
                method: 'post',
                url: `${url}/messages/chat`,
                headers: {  
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                data : data,
            };
            //Do and get the request's response
            let response = await axios(config);
            return response.data;
        }catch(err){
            console.log(err);
            throw new Error(err);
        }
    }
    
    //Mention people with a message before and after those mentions
    async MentionPeople(chatId, ids, {pre="", after=""}){
        try{
            let numbers = []
            let msg = ""
            //We'll add every number to the middle message and every id to the mentioned id's
            ids.forEach(id => {
                let number = id.replace("@c.us", "")
                msg += `@${number} `
                numbers.push(parseInt(number))
            });

            //We turn the mentioned id's into a string without the []
            let mentions = JSON.stringify(numbers).replace("[", "").replace("]", "").replace(" ", "");
            //Configure the request
            let data = qs.stringify({
                "token": ultramsg_token,
                "to": chatId,
                "body": `${this.logPrefix}\n${pre}${msg}${after}`,
                "mentions": mentions ,
            });
            //Prepare the request
            let config = {
                method: 'post',
                url: `${url}messages/chat`,
                headers: {  
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data : data
            };
            //Send it and get it
            let response = await axios(config);
            return response.data
        }
        catch(err){
            console.log(err);
            throw new Error(err);
        }
    }
    
    async SendSticker(link, chat){
        try{
            //Using the link we'll simply do and get the request
            var data = qs.stringify({
                "token": ultramsg_token,
                "to": chat,
                "sticker": link
            });
            
            var config = {
              method: 'post',
              url: `${url}messages/sticker`,
              headers: {  
                'Content-Type': 'application/x-www-form-urlencoded'
              },
              data : data
            };
            
            let response = await axios(config);
            return response.data
        }catch(err){
            console.log(err);
            throw new Error(err);
        }

    }
    async SendAudio(msg, groupId){
        try{
            //Now, we turn the text into speech through the task manager
            const {url: msg_url, public_id} = await this.manager.TextToSpeech(msg);
            //Now that we got it, we use this to prepare the request and use the public id to delete the audio later
            const data = qs.stringify({
                "token": ultramsg_token,
                "to": groupId,
                "audio": msg_url
            });
            
            const config = {
              method: 'post',
              url: `${url}messages/audio`,
              headers: {  
                'Content-Type': 'application/x-www-form-urlencoded'
              },
              data : data
            };
            //We send the audio
            const {data: sent} = await axios(config)
            //We delete it in the cloud
            const del = await this.manager.CloudDestroy(public_id, "video")
            return {...sent, ...del}
        }catch(err){
            console.log(err);
            throw new Error(err);
        }
    }
}

export default Bot;