import dotenv from 'dotenv';
dotenv.config()

import express from "express";
import bodyParser from "body-parser";
import { processMessage } from "./processMessage.js";
import mongoose from 'mongoose';
import { mongo_cnn } from './global.js';
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