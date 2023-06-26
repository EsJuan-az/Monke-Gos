const bodyParser = require('body-parser');
const express = require('express');
const { default: mongoose } = require('mongoose');
const colors = require('@colors/colors');

const { mongo_cnn, ww, chats } = require('../env/env');
const { common } = require('./singletons');

class WServer{
    constructor( port ){
        this.app = express();
        this.port = port;
        this.config();
        this.routes();
    }
    config(){
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
    }
    routes(){
        this.app.get('/', function(req, res){
            res.json({ok: true, ww});
        } )
    }
    async cnnConnect(){
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true
          };
        await mongoose.connect( mongo_cnn,  options)
        console.log('DB: ' + colors.green('up'));
    }

    listen(){
        this.app.listen( this.port, async() => {
            console.log("APP" + colors.green(`:${this.port}`));

            //We register the main pool
            ww.register( common );

            ww.setOnReady(  async() => {
                //Prueba

                await Promise.all([
                    common.addChats(...chats)
                ]);


                console.log('SET: ' + colors.cyan('done'));
            });

            await Promise.all([
                this.cnnConnect(),
                ww.init()
            ]);
            
            console.log('PRESET: ' + colors.cyan('done'));
        });
    }
}



module.exports = WServer;








// //settings once onready is executed
// ww.setOnReady(async () => {


//     
// });
// //preset promises



// //set promises