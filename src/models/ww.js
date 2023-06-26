const { Client, RemoteAuth  } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const colors = require('@colors/colors');

class WW{
    constructor(){
        this.pools = [];
        this.up = false;
        this.onReady = () => {};
    }
    async init( store ){
        await this.getClient( store );
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
    async getClient( store ){
        // Use the saved values
        this.store = store;
        
        this.client = new Client({
            puppeteer: {
                headless: true,

            },
            authStrategy: new RemoteAuth ({
                clientId: "juanes-az",
                store,
                backupSyncIntervalMs: 300000,
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
            for( let pool of this.pools ){
                pool.processMsg( message );
            }
        });

        this.client.on('authenticated', () => {    
            console.log('SESSION: ' + colors.yellow('gotten'));
        });

        this.client.on('remote_session_saved', () => {
            console.log('SESSION: ' + colors.green('saved'));
        });
         
         
    }
}
module.exports = WW;