import { port } from './src/global.js'
import { Server } from './src/server.js';

// SendMessage("Zootopia 2", process.env.RMC_ID)
try{
    const sv = new Server(port);
    sv.listen()
}catch{
    
}