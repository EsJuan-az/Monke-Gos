
import qs from 'qs';
import axios from 'axios';
import Ultramsg from 'ultramsg-whatsapp-api';
import { instance_id, ultramsg_token, url } from './global.js';

class Bot{
    constructor(logPrefix, reqPrefix){
        this.logPrefix = logPrefix;
        this.commandRegex = new RegExp(`${reqPrefix} \\w{3,}( --\w+)*`);
        this.commands = {};
        this.allowed = [];
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
    DecodeCommand(command){
        let ar = command.split(" ");
        if(ar.length == 2){
            return {
                command: this.GetCommand(ar[1])
            };
        }else if(ar.length >= 3){
            return {
                command: this.GetCommand(ar[1]),
                options: ar.slice(2).map(op => op.replace("--",""))
            };
        }
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
    
    async GetMessages(target, limit = 10){
        try{
            var params= {
                "token": ultramsg_token,
                "page": 1,
                "limit": limit,
                "status": "all",
                "sort": "desc",
                "chadId": target,
            };
            
            var config = {
              method: 'get',
              url: `${url}/chats/messages`,
              headers: {  
                'Content-Type': 'application/x-www-form-urlencoded'
              },
              params: params
            };
            
            let response = await axios(config);
            console.log(response.data);
            return response.data;
        }catch(err){
            console.log(err);
            throw new Error(err);
        }
    }
    
    async GetGroup(groupId){
        try{
            let params= {
                "token": ultramsg_token,
                "groupId": groupId,
                "priority": ""
            };
            
            let config = {
              method: 'get',
              url: `${url}groups/group`,
              headers: {  
                'Content-Type': 'application/x-www-form-urlencoded'
              },
              params: params
            };
            
            let response = await axios(config);
            return response.data
        }catch(err){
            console.log(err);
            throw new Error(err);
        }
    }
    async GetProfilePic(id){
        try{
            let params = {
                "token": ultramsg_token,
                "chatId": id
            }
            let config = {
                method: 'get',
                url: `${url}contacts/image`,
                headers:{
                    'Content-Type': "application/x-www-form-urlencoded"
                },
                params:params
            }
            const result = await axios(config);
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
    async GetMessageById(id){
        try{
            var params= {
                "token": ultramsg_token,
                "page": 1,
                "limit": 10,
                "status": "all",
                "sort": "desc",
                "id": id
            };
            
            var config = {
              method: 'get',
              url: `${url}messages`,
              headers: {  
                'Content-Type': 'application/x-www-form-urlencoded'
              },
              params: params
            };
            
            let response = await axios(config)
            return response.data.messages[1]
        }catch(err){
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
}

export default Bot;