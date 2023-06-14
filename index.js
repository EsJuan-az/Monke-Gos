console.log("Index");

import { port } from './src/env/env.js'
import { Server } from './src/models/server.js';
import { test } from './src/test.js';

console.log("Holaa");
try{
    const sv = new Server(port);
    test();
    sv.listen();
}catch{
    
}