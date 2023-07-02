const bodyParser = require('body-parser');
const express = require('express');
const colors = require('@colors/colors');

const { ww, common:commonChats, jv:jvChats, backend } = require('../env/env');
const { common, jv } = require('./singletons');
const { default: axios } = require('axios');

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
        this.app.get('/', async function(req, res){
            res.json({
                ok: true,
            });
        } )
    }

    startInterval(){
        this.interval = setInterval( async() => {
            try{
                await axios.get(`${backend}/`);
            }catch(err){
                console.log(err)
            }
        }, 60 * 1000);
    }

    listen(){
        this.app.listen( this.port, async() => {
            console.log("APP" + colors.green(`:${this.port}`));

        //We register the main pool
        ww.register( common );
        ww.register( jv )

        ww.setOnReady(  async() => {
            //Prueba

            await common.awake();
            await common.addChats(...commonChats);
            await jv.addChats(...jvChats);
            console.log('SET: ' + colors.cyan('done'));
        });

        ww.init();

        
        console.log('PRESET: ' + colors.cyan('done'));
        this.startInterval();
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