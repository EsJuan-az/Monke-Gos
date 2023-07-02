const axios = require("axios");
const {backend, cloudSecret, cloudkey,  } = require('../env/env')
const cloudinary = require('cloudinary').v2
cloudinary.config({ 
    cloud_name: 'dvaqrycs1', 
    api_key: cloudkey, 
    api_secret: cloudSecret,
    secure: true
  });

class CloudManager{
    static async messageMediaToURL( media ){
        try{
            let { data, mimetype } = media;
            data = `data:${mimetype};base64,${data}`;
            const sent = await cloudinary.uploader.upload_large( data, {
                resource_type: "auto",
                overwrite: true,
                invalidate: true,
            });
            return {ok: true, ...sent}
        }catch(err){
            return { ok: false, err }
        }
    }
}

class PlanManager{

    static async getAll(){
        try{
            const response = await axios.get(`${backend}/plan/`);
            return response.data;
        }catch(err){
            console.log(err);
            return { ok: false, err}
        }
    }
    static async getById( id ){
        try{
            const response = await axios.get(`${backend}/plan/${id}`);
            return response.data;
        }catch(err){
            console.log(err);
            return { ok: false, err}
        }
    }
    static async create( title, authorId ){
        try{
            const response = await axios.post(`${backend}/plan/`, { title , authorId});
            return response.data;
        }catch(err){
            console.log(err);
            return { ok: false, err}
        }
    }
    static async update( id, body ){
        try{
            const response = await axios.put(`${backend}/plan/${id}`, body);
            return response.data;
        }catch(err){
            console.log(err);
            return { ok: false, err}
        }
    }
    static async uploadImg( id, url ){
        try{
            const response = await axios.put(`${backend}/plan/image/${id}`, { link: url });
            return response.data
        }catch(err){
            console.log( err );
            return { ok: false, err: err.data }
        }
    }
    static async uploadTag( id, tag ){
        try{
            const response = await axios.put(`${backend}/plan/tag/${id}`, { tag: tag });
            return response.data
        }catch(err){
            console.log( err );
            return { ok: false, err: err.data }
        }
    }
}
class RecuerdoManager{
    static async getAll(){
        try{
            const response = await axios.get(`${backend}/memory/`);
            return response.data;
        }catch(err){
            console.log(err);
            return { ok: false, err}
        }
    }
    static async getById( id ){
        try{
            const response = await axios.get(`${backend}/memory/${id}`);
            return response.data;
        }catch(err){
            console.log(err);
            return { ok: false, err}
        }
    }
    static async create( title, authorId ){
        try{
            const response = await axios.post(`${backend}/memory/`, { title, authorId });
            return response.data;
        }catch(err){
            console.log(err);
            return { ok: false, err}
        }
    }
    static async createFromPlan( id ){
        try{
            const response = await axios.post(`${backend}/memory/plan/${id}`);
            return response.data;
        }catch(err){
            console.log(err);
            return { ok: false, err}
        }
    }
    static async update( id, body ){
        try{
            const response = await axios.put(`${backend}/memory/${id}`, body);
            return response.data;
        }catch(err){
            console.log(err);
            return { ok: false, err}
        }
    }
    static async uploadImg( id, url ){
        try{
            const response = await axios.put(`${backend}/memory/image/${id}`, { link: url });
            return response.data;
        }catch(err){
            console.log( err );
            return { ok: false, err };
        }
     }  
    static async uploadTag( id, tag ){
        try{
            const response = await axios.put(`${backend}/memory/tag/${id}`, { tag: tag });
            return response.data
        }catch(err){
            console.log( err );
            return { ok: false, err: err.data }
        }
    }
}

class UserManager{
    static async getAll(){    
        try{
            const response = await axios.get(`${backend}/user/`);
            return response.data;
        }catch(err){
            console.log(err);
            return { ok: false, err}
        }
    }
    static async getUsersByGroup( groupId ){
        try{
            const response = await axios.get(`${backend}/user/group/${groupId}`);
            return response.data;
        }catch(err){
            console.log(err);
            return { ok: false, err}
        }
    }
    static async getUserById( id ){
        try{
            const response = await axios.get(`${backend}/user/${id}`);
            return response.data;
        }catch(err){
            console.log(err);
            return { ok: false, err}
        }
    }
    static async createUser( userId, name ){
        try{
            const response = await axios.post(`${backend}/user/`, { userId, name });
            return response.data;
        }catch(err){
            console.log(err);
            return { ok: false, err}
        }
    }
    static async incrementExp( id, groupId, increase, name, pictureUrl ){
        try{
            const response = await axios.put(`${backend}/user/group/${id}`, {
                "groupId": groupId,
                "increase": increase,
                "name": name,
                "profilePic": pictureUrl
            });
            return response.data;
        }catch(err){
            console.log(err);
            return { ok: false, err}
        }
    }
}

module.exports = {
    PlanManager, 
    RecuerdoManager,
    CloudManager,
    UserManager
};