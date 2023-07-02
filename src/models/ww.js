const { Client, LocalAuth  } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const colors = require('@colors/colors');

class WW{
    constructor(){
        this.pools = [];
        this.up = false;
        this.onReady = () => {};
    }
    async init(){
        await this.getClient();
        this.setClient();
        this.client.initialize();
        console.log('CLIENT: ' + colors.blue('on'));
        this.up = true;
    }
    setOnReady(handler){
        this.onReady = handler;
    }
    register( pool ){
        this.pools.push( pool );
    }
    async getClient(  ){
        // Use the saved values
        this.client = new Client({
            puppeteer: {
                headless: true,

            },
            authStrategy: new LocalAuth ({

            })

        });
    }
    setClient(){
        if( !this.client ) throw new Error("client hasn't been created");
        this.client.on('qr', qr => {
            qrcode.generate(qr, {small: true});
        });
        
        this.client.on('ready', () => {
            console.log('CLIENT: ' + colors.green('up'));
            this.onReady();
        });

        this.client.on('message_create', async(message) => {
            try{
                for( let pool of this.pools ){
                    pool.processMsg( message );
                }
            }catch(err){
                console.log(err)
            }
        });

        this.client.on('authenticated', () => {    
            console.log('SESSION: ' + colors.yellow('gotten'));
        });

         
    }
}
module.exports = WW;