import dotenv from 'dotenv';
dotenv.config()

import express from "express";
import bodyParser from "body-parser";
import { processMessage } from "./processMessage.js";
import mongoose from 'mongoose';
import { admin, mongo_cnn } from './global.js';
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
                const {chatId} = req.params;
                const research = await User.find({chatId});
                const PhotoRequests = await Promise.all([...research].map(user => admin.GetProfilePic(user.userId)))
                const UserRequests = await Promise.all([...research].map(user => user))
                const merged = research.map((user, index) => ({...user, ...photoRequest}))
                const groupPic = await admin.GetProfilePic(chatId);
                return res.status(200).json({
                    photoRequest
                    // merged,
                    // groupPic,
                })
            }catch(err){
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