const BotSettings = require("../models/botSettings");
const { RecuerdoManager } = require("../models/taskManagers");

const { listHandler, showHandler, tagHandler, imgHandler, updateHandler, createHandler } = require('./loveHandlers');



const list = async( bot, messageRequest, options ) => {
    const handler = listHandler( RecuerdoManager, ( collection ) => {
        return collection.length > 0 

        ? collection.reduce( (acc, current) => {
            return acc + `🔥${current.id.slice(0,5)} - ${current.title}\n${'⭐'.repeat(current.stars)}\n`
        }, '🔥Una lista con tus recuerdos: \n')

        : '✨Aún no hay recuerdos en tu lista';

    }, 'recuerdo list');

    handler( bot, messageRequest, options );
}

const show = async( bot, messageRequest, options ) => {
    const handler = showHandler( RecuerdoManager, ( document ) => {
        let { title, description, stars, date, tags, images } = document;
        date = new Date( date );
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', };
        const formattedDate = date.toLocaleDateString('es-ES', options);

        return `❣️${title}: ${description}\nFecha📅: ${formattedDate}\nEstrellas✨: ${'⭐'.repeat(stars)}\nEtiquetas🏷️: ${tags.reduce((acc, tag) => acc + '\n\t-' + tag ,'')}\nImagenes📷: ${'🌃'.repeat( images.length )}`
    }, 'recuerdo show <id>');

    handler( bot, messageRequest, options );
}

const create = async(bot, messageRequest, options ) => {
    const handler = createHandler( RecuerdoManager, 'recuerdos', 'recuerdo create ir de paseo' );
    handler( bot, messageRequest, options );
}

const update = async(bot, messageRequest, options ) => {    
    const handler = updateHandler( RecuerdoManager, 'recuerdo', 'recuerdo update <id> descripción <valor>' )
    handler( bot, messageRequest, options );

}

const img = async( bot, messageRequest, options ) => {
    const handler = imgHandler( RecuerdoManager, 'recuerdo', 'recuerdo img <id>' )
    handler( bot, messageRequest, options );
}

const tag = async( bot, messageRequest, options ) => {
    const handler = tagHandler( RecuerdoManager, 'recuerdo', 'recuerdo tag <id> <tag>' )
    handler( bot, messageRequest, options );
}

const help = async( bot, messageRequest, options ) => {
    const helpLog = 
`
Aquí hay algunos comandos que te pueden servir🤗:
1. Crear recuerdos
    recuerdo create <título_del_recuerdo>
    Ejemplo: recuerdo create Subir a la cruz✝️

2. Listar recuerdos
    recuerdo list

3. Mostrar un recuerdo en particular
    recuerdo show <id>
    Ejemplo: recuerdo show abcd3

4. Actualizar un recuerdo en particular:
    recuerdo update <id> <campo> <valor>
    Ejemplo: recuerdo update abcd3 título Hacer cupcakes🧁
Campos:
    título:
        El nombre en general que tiene el recuerdo.
    descripción:
        Una o dos frases que especifiquen detalles.
    estrellas:
        Cuán gustado fue el recuerdo. (1 a 5)

5. Añadir imagen:
    Nota: debes enviar una imagen en el mensaje o responder a un mensaje que tenga una imagen.
    recuerdo img <id>
    Ejemplo: recuerdo img abcd3

6. Añadir etiqueta:
    recuerdo tag <etiqueta>
    Ejemplo: recuerdo tag cocina
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
const recuerdoSettings = new BotSettings().set(settings);
module.exports = recuerdoSettings;