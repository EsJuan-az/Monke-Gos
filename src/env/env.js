//Dotenv
const dotenv = require('dotenv');
dotenv.config();
const WW = require('../models/ww');

dotenv.config();

const common = (process.env.COMMON).split(',').map(id => id.trim());
const jv = (process.env.JV).split(',').map(id => id.trim());       //Custom group environment variable
const port = (process.env.PORT);                    //Server port
const voicerss = (process.env.VOICERSS_KEY);        //TEXT TO SPEECH API key
const cloudkey = (process.env.CLOUDINARY_KEY)       //Cloudinary key
const cloudSecret = (process.env.CLOUDINARY_SECRET);//Cloudinary secret
const cloud = (process.env.CLOUDINARY_URL);         //Cloudinary url
const ww = new WW();    //Global client
const backend = (process.env.RENDER_BACKEND);          //DB connection CNN

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
    backend,
    //Chat codes
    //DB
    //Voice api
    voicerss,
    //Cloudinary
    cloudkey,
    cloud,
    cloudSecret,
    //Prefix
    exp,
    port,
    common,
    jv
}