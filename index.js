
// const WServer = require('./src/models/server');
// const { port } = require('./src/env/env')

// const sv = new WServer(port);
// sv.listen();


const { Client, RemoteAuth } = require('whatsapp-web.js');

// Require database
const { MongoStore } = require('wwebjs-mongo');
const mongoose = require('mongoose');
const { mongo_cnn } = require('./src/env/env')
const colors = require('@colors/colors');
const qrcode = require('qrcode-terminal')
// Load the session data
mongoose.connect(mongo_cnn).then(() => {
    const store = new MongoStore({ mongoose: mongoose });
    const client = new Client({
        authStrategy: new RemoteAuth({
            store: store,
            backupSyncIntervalMs: 300000
        })
    });

    client.on('qr', qr => {
        qrcode.generate(qr, {small: true});
    });
    
    client.on('ready', () => {
        console.log('CLIENT: ' + colors.green('up'));

    });

    client.on('message_create', async(message) => {

    });

    client.on('authenticated', () => {    
        console.log('SESSION: ' + colors.yellow('gotten'));
    });

    client.on('remote_session_saved', () => {
        console.log('SESSION: ' + colors.green('saved'));
    });
     
      
    client.initialize();
});
 