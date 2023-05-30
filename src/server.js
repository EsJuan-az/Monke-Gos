import dotenv from 'dotenv';
dotenv.config()

import express from "express";
import bodyParser from "body-parser";
import { processMessage } from "./processMessage.js";
import mongoose from 'mongoose';
import { Cum, admin, findChatByUserAndGroup, mongo_cnn } from './global.js';
import { User } from './userModel.js';
class Server{
    constructor(port){
        this.port = port;
        this.app = express();
        this.config();
        this.routes();

    }
    async cnnConnect(){
        await mongoose.connect(mongo_cnn);
        console.log("Connected to BD")
    }
    config(){
        this.app.use(bodyParser.json());
    }
    routes(){
        this.app.post('/ultramsgwebhook', async(req, res) => {
            try{
                processMessage(req.body);
                res.status(200).end();
            }catch{
                res.status(500).end();
            }
        })
        this.app.get('/images/:chatId', async(req, res) => {
            try{
                
                const {chatId:groupId} = req.params;
                const research = (await User.find())
                    .filter(user => !!findChatByUserAndGroup(user, groupId))
                    .sort( (u2, u1) => findChatByUserAndGroup(u1, groupId).exp - findChatByUserAndGroup(u2, groupId).exp )
                    .sort( (u2, u1) => findChatByUserAndGroup(u1, groupId).level - findChatByUserAndGroup(u2, groupId).level );
                const photoRequests = await Promise.all(research.map(user => admin.manager.GetProfilePic(user.userId)))
                const users = research.map((user, index) => {
                    let {levels, ...restUser} = user._doc
                    return { ...restUser, group: findChatByUserAndGroup(user, groupId), photo: (photoRequests[index]).success}
                })
                const groupPic = (await admin.manager.GetProfilePic(groupId)).success;
                return res.status(200).json({
                    groupPic,
                    users
                })
            }catch(err){
                console.log(err);
                res.status(500).json({
                    err: 'Falló alguna de las peticiones'
                })
            }
            
        })
        this.app.get('/bday', async(req, res) => {
            try{
                console.log("OnBday()");
                let today = new Date()
                today = {
                    day: today.getDate(),
                    month: today.getMonth()
                }
                let cums = (await User.find({}))
                // cums = cums.filter( user => new Date(user.birthday).getDate() == today.day && new Date(user.birthday).getMonth() == today.month )
                cums = cums.filter(({birthday}) => {
                    const birthdate = new Date(birthday)
                    return birthdate.getDate() == today.day && birthdate.getMonth() == today.month 
                })
                if(cums.length == 0){
                    return
                }
                const mentions = {}
                cums.forEach(cum => {
                    cum.levels.forEach(group => {
                        if(!mentions[group.chatId]){
                            mentions[group.chatId] = [];
                        }
                        mentions[group.chatId].push(cum.userId)
                    })
                })
                Object.keys(mentions).forEach(groupId => {
                    const people = mentions[groupId]
                    Cum.MentionPeople(groupId, people, {pre: "Buenos días y un muy felíz cum para: ", after:""})
                })
                
                res.status(200).json("Todo ok")  
            }catch(err){
                console.log(err);
                res.status(500).json({
                    err: 'Falló alguna de las peticiones'
                })
            }
            
        })
    }
    listen(){
        this.app.listen(this.port, () => {
            console.log(`Webhook online on port ${this.port}`);
            this.cnnConnect();
        });
    }
}
export {
    Server
};