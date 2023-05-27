import { port } from './src/global.js'
import { Server } from './src/server.js';
import { test } from './src/test.js';

// SendMessage("Zootopia 2", process.env.RMC_ID)
try{
    const sv = new Server(port);
    test();
    sv.listen()
}catch{
    
}