//Node req
import axios from 'axios';
import { v2 as cloudinary } from 'cloudinary'

//Internal req
import {  cloudkey, cloudSecret, voicerss } from '../env/index.js';
const url = ""
class TaskManager{
    static taskManager;
    constructor(){
        cloudinary.config({
            cloud_name: "dvaqrycs1",
            api_key: cloudkey,
            api_secret: cloudSecret
          });
        if(!TaskManager.taskManager){
            TaskManager.taskManager = this;
        }
    }
    DecodeCommand(command){
        let ar = command.split(" ");
        if(ar.length == 2){
            return {
                command: ar[1]
            };
        }else if(ar.length > 2){
            return {
                command: ar[1],
                options: ar.slice(2)
            };
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
            return result.data
        }catch(err){
            console.log(err);
            throw new Error(err);
        }

    }
    async GetContact(id){
        try{
            var params= {
                "token": ultramsg_token,
                "chatId": id
            };
            
            var config = {
            method: 'get',
            url: `${url}contacts/contact`,
            headers: {  
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            params: params
            };
            
            const result  = await axios(config)
            return result.data
        }catch(err){
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
    async TextToSpeech(msg){
        const encodedParams = new URLSearchParams();
        encodedParams.set('src', msg);
        encodedParams.set('hl', 'es-es');
        encodedParams.set('r', '0');
        encodedParams.set('c', 'OGG');
        encodedParams.set('f', '16khz_16bit_mono');
        encodedParams.set('b64', true);

        const options = {
        method: 'POST',
        url: 'https://voicerss-text-to-speech.p.rapidapi.com/',
        params: {key: voicerss},
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'X-RapidAPI-Key': '39170849bemsh944113cea1eac89p17212djsnf6b14d2ca7a4',
            'X-RapidAPI-Host': 'voicerss-text-to-speech.p.rapidapi.com'
        },
        data: encodedParams,
        };

        try {
            const audio = (await axios.request(options)).data.replace(" ", "").replace(/(\r\n|\n|\r)/gm,"");
            const sent = await cloudinary.uploader.upload( audio,  {
                resource_type: "auto",
                overwrite: true,
                invalidate: true,
            });
            const {url, public_id} = sent
            return {url, public_id}

        } catch (error) {
            console.error(error);
            throw error
        }
    }
    async CloudDestroy(public_id, type){
        const response = await cloudinary.uploader.destroy(public_id, {
            resource_type: type
        })
        console.log(response);
        return response
    }
}

const sharedInstance = new TaskManager();

export {
    TaskManager
}