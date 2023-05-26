import dotenv from 'dotenv';
dotenv.config();


const instance_id  = (process.env.INSTANCE_ID);
const ultramsg_token = (process.env.TOKEN) ;
const url  = (process.env.CHAT_API);
const rmc = (process.env.RMC_ID);
const code = (process.env.CODE_ID);
const port = (process.env.PORT);
const mongo_cnn = (process.env.MONGO_CNN);
const exp = {
    chat: 1,
    sticker: 0.5,
    image: 0.7,
    video: 0.9
}
export {
    instance_id,
    ultramsg_token,
    url,
    rmc,
    code,
    port,
    mongo_cnn,
    exp
};