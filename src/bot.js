
import qs from 'qs';
import axios from 'axios';
import Ultramsg from 'ultramsg-whatsapp-api';
import { instance_id, ultramsg_token, url, taskManager } from './global.js';

class Bot{
    constructor(logPrefix, reqPrefix){
        this.manager = taskManager;
        this.logPrefix = logPrefix;
        this.commandRegex = new RegExp(`^${reqPrefix} \\w{3,}( \\S+)*`);
        this.commands = {};
        this.allowed = [];
    }
    DecodeCommand(command){
        const cmd = this.manager.DecodeCommand(command);
        cmd.command = !!cmd.command ? this.GetCommand(cmd.command) : false
        return cmd
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
    async SendMessage(message, destination){
        try{
            let msg = `${this.logPrefix} ${message}`;

            let data = qs.stringify({
                "token": ultramsg_token,
                "to": destination,
                "body": msg
            });

            var config = {
            method: 'post',
            url: `${url}/messages/chat`,
            headers: {  
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data : data
            };

            let response = await axios(config)
            console.log(response);
            return response.data;
        }catch(err){
            console.log(err);
            throw new Error(err);
        }
    }
    
    
    async MentionPeople(chatId, ids, {pre="", after=""}){
        try{
            let numbers = []
            let msg = ""
            ids.forEach(id => {
                let number = id.replace("@c.us", "")
                msg += `@${number} `
                numbers.push(parseInt(number))
            });
            let mentions = JSON.stringify(numbers).replace("[", "").replace("]", "").replace(" ", "")
            let data = qs.stringify({
                "token": ultramsg_token,
                "to": chatId,
                "body": `${this.logPrefix}\n${pre}${msg}${after}`,
                "mentions": mentions ,
            });
            
            let config = {
                method: 'post',
                url: `${url}messages/chat`,
                headers: {  
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data : data
            };
            
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
            const {url: msg_url, public_id} = await this.manager.TextToSpeech(msg)
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
            
            const {data: sent} = await axios(config)
            const del = await this.manager.CloudDestroy(public_id, "video")
            return {...sent, ...del}
        }catch(err){
            console.log(err);
            throw new Error(err);
        }
    }
}

export default Bot;