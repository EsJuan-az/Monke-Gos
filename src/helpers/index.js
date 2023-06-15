import { code, rmc } from "../env/env.js";
import { monke as cmdMonke, gos as cmdGos } from "./commands.js";
import { monke as midMonke, gos as midGos } from "./middlewares.js";
import { processMessage } from "./processMessage.js";

const setMonke = {
    cmds: cmdMonke,
    chats: [ rmc, code ],
    middlewares: midMonke
};
const setGos = {
    cmds: cmdGos,
    chats: [ rmc, code ],
    middlewares: midGos
};


export {
    setMonke, 
    setGos, 
    processMessage
};