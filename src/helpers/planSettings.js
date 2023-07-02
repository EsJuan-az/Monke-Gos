const BotSettings = require("../models/botSettings");
const { PlanManager } = require("../models/taskManagers");

const { listHandler, showHandler, createHandler, updateHandler, imgHandler, tagHandler } = require('./loveHandlers');
//Prefixed variables
const emojiStatus = {
    e: '✖️',
    pn: '⌛',
    pl: '✍🏻',
    h: '💌',
    r: '♻️'
};
const emojiPriority = [
    '🥇',
    '🥈',
    '🥉',
    '🦥'
];


const list = async( bot, messageRequest, options ) => {
    const handler = listHandler( PlanManager, ( collection ) => {
        return collection.length > 0

        ? collection.reduce( (acc, current) => {
            return acc + `${current.id.slice(0, 5)} - ${current.title} ${emojiStatus[current.status]}\n`;
        }, `💌Aquí una lista de tus planes: \n`) 

        : '💌Aún no hay planes en tu lista';
    
    } , 'plan list' );
    handler( bot, messageRequest, options );
}

const show = async( bot, messageRequest, options ) => {
    const handler = showHandler( PlanManager, ( document ) => {
        const { title, description, status, priority, tags,images } = document;
        return `⭐${title}: ${description}\nEstado actual🗽: ${emojiStatus[status]}\nPrioridad👑: ${emojiPriority[priority-1]}\nEtiquetas🏷️: ${tags.reduce((acc, tag) => acc + '\n\t-' + tag ,'')}\nImagenes📷: ${'🌃'.repeat( images.length )}`
    }, 'plan show <id>');


    handler( bot, messageRequest, options );

}

const create = async(bot, messageRequest, options ) => {
    const handler = createHandler( PlanManager, 'planes', 'plan create ir de paseo' );
    handler( bot, messageRequest, options );
}

const update = async(bot, messageRequest, options ) => {
    const handler = updateHandler( PlanManager, 'plan', 'plan update <id> descripción <valor>' );
    handler( bot, messageRequest, options );
}

const img = async( bot, messageRequest, options ) => {
    const handler = imgHandler( PlanManager, 'plan', 'plan img <id>' )
    handler( bot, messageRequest, options );
}

const tag = async( bot, messageRequest, options ) => {
    const handler = tagHandler( PlanManager, 'plan', 'plan tag <id> <tag>' )
    handler( bot, messageRequest, options );
}

const help = async( bot, messageRequest, options ) => {
    const helpLog = 
`
Aquí hay algunos comandos que te pueden servir🤗:
1. Crear planes
    plan create <título_del_plan>
    Ejemplo: plan create Subir a la cruz✝️

2. Listar planes
    plan list

3. Mostrar un plan en particular
    plan show <id>
    Ejemplo: plan show abcd3

4. Actualizar un plan en particular:
    plan update <id> <campo> <valor>
    Ejemplo: plan update abcd3 título Hacer cupcakes🧁
Campos:
    título:
        El nombre en general que tiene el plan.
    descripción:
        Una o dos frases que especifiquen detalles.
    prioridad:
        Cuán importante o cuán deseado es el plan. (1 a 4)
    estado: 
        Cómo se encuentra el plan actualmente.
        valores posibles:
        - pn: Pendiente
        - pl: Planeando
        - r: Repetible
        - h: Hecho

5. Añadir imagen:
    Nota: debes enviar una imagen en el mensaje o responder a un mensaje que tenga una imagen.
    plan img <id>
    Ejemplo: plan img abcd3

6. Añadir etiqueta:
    plan tag <etiqueta>
    Ejemplo: plan tag cocina
`
    const { chat } = messageRequest.get();
    bot.sendMessage( chat, helpLog )
}

const settings = {
    cmds: {
        list,
        show,
        create,
        update,
        img,
        tag,
        help
    },
    middlewares: {
    }
}
const planSettings = new BotSettings().set(settings);
module.exports = planSettings;