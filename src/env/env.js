//Dotenv
import dotenv from 'dotenv';
dotenv.config();
const ultramsg_token = (process.env.TOKEN) ;        //Ultramsg token
const url  = (process.env.CHAT_API);                //Ultramsg url
const rmc = (process.env.RMC_ID);                   //Custom group environment variable
const code = (process.env.CODE_ID);                 //Custom group environment variable
const port = (process.env.PORT);                    //Server port
const mongo_cnn = (process.env.MONGO_CNN);          //DB connection CNN
const voicerss = (process.env.VOICERSS_KEY);        //TEXT TO SPEECH API key
const cloudkey = (process.env.CLOUDINARY_KEY)       //Cloudinary key
const cloudSecret = (process.env.CLOUDINARY_SECRET);//Cloudinary secret
const cloud = (process.env.CLOUDINARY_URL);         //Cloudinary url

//Prefixed constantes
const exp = {
    chat: 1,
    sticker: 0.5,
    image: 0.7,
    video: 0.9,
    ptt: 0.2,
};

const findChatByUserAndGroup = (user, groupId) => user?.levels.find( ({chatId}) => chatId == groupId );


export  {
    //Ultramsg
    ultramsg_token,
    url,
    port,
    //Chat codes
    rmc,
    code,
    //DB
    mongo_cnn,
    //Voice api
    voicerss,
    //Cloudinary
    cloudkey,
    cloud,
    cloudSecret,
    //Prefix
    findChatByUserAndGroup,
    exp,
}