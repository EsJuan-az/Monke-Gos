//Dotenv
const dotenv = require('dotenv');
const WW = require('../models/ww')

dotenv.config();

const chats = (process.env.CHATS).split(',').map(id => id.trim());       //Custom group environment variable
const port = (process.env.PORT);                    //Server port
const mongo_cnn = (process.env.MONGO_CNN);          //DB connection CNN
const voicerss = (process.env.VOICERSS_KEY);        //TEXT TO SPEECH API key
const cloudkey = (process.env.CLOUDINARY_KEY)       //Cloudinary key
const cloudSecret = (process.env.CLOUDINARY_SECRET);//Cloudinary secret
const cloud = (process.env.CLOUDINARY_URL);         //Cloudinary url
const ww = new WW();    //Global client
//Prefixed constantes
const exp = {
    chat: 1,
    sticker: 0.5,
    image: 0.7,
    video: 0.9,
    ptt: 0.2,
};



module.exports =   {
    //Client
    ww,
    //Chat codes
    chats, 
    //DB
    mongo_cnn,
    //Voice api
    voicerss,
    //Cloudinary
    cloudkey,
    cloud,
    cloudSecret,
    //Prefix
    exp,
    port,
}