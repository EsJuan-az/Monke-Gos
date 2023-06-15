
// import { setMonke, setGos,  } from './index.js';
// import { code, rmc } from '../env/index.js';
// import { gos, monke } from '../env/singleton.js'


// console.log(monke);
// const botSettings = {
//     monke: {
//         ...setMonke,
//         chats: [code, rmc],
//     },
//     gos: {
//         ...setGos,
//         chats: [code, rmc],
//     },
// };

// monke.Set( botSettings.monke );
// const Bots = [monke, gos];

import { port } from './src/env/index.js'
import { Server } from './src/models/index.js';


const sv = new Server(port);
sv.listen();



