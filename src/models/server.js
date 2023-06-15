//Node requirements
import express from "express";
import bodyParser from "body-parser";
import qrcode from 'qrcode-terminal';
import wwjs from 'whatsapp-web.js';
import wwjsmongo from 'wwebjs-mongo'
import mongoose from 'mongoose';

const RemoteAuth = wwjs.RemoteAuth;
const Client = wwjs.Client;
const MongoStore = wwjsmongo.MongoStore;

//Internal requirements
import { processMessage } from "../helpers/processMessage.js";
import { admin, common, findChatByUserAndGroup, mongo_cnn } from '../env/index.js'
import { User } from '../models/user.js';
class Server{
    static client;
    static store;
    constructor(port){
        this.port = port;
        this.app = express();
        this.config();
        this.routes();
    }
    setClient(){
        Server.client.on('qr', qr => {
            qrcode.generate(qr, { small: true });
        });
        Server.client.on('ready', async() => {
            console.log('Client is ready!');
        });
        Server.client.on('message_create', message => {
            processMessage( message, common );
        });
        Server.client.on('remote_session_saved', () => {
            console.log('Remote session saved');
        })
    }
    async cnnConnect(){
        await mongoose.connect(mongo_cnn);
        console.log("Connected to BD");
        //After the connection, we create the cli
        Server.store = new MongoStore({ mongoose: mongoose });
        Server.client = new Client({
                puppeteer: {
                authStrategy: new RemoteAuth({
                    clientId: 'main',
                    store: Server.store,
                    backupSyncIntervalMs:300000,
                }),
                product: "chrome",
                executablePath: "/usr/bin/google-chrome",
                args: [
                '--no-sandbox',
                '--disable-setuid-sandbox'
                ],
            }
        });
    }
    config(){
        this.app.use(bodyParser.json());
    }
    routes(){
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
        this.app.listen(this.port, async () => {
            console.log(`Server online on port ${this.port}`);
            await this.cnnConnect();

            this.setClient();
            //Now that the CLI's ready, we initialize it
            Server.client.initialize();
        });
    }
}
export {
    Server
};