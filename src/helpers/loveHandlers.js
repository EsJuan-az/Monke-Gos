const { CloudManager } = require("../models/taskManagers");


const emojiStatus = {
    e: '✖️',
    pn: '⌛',
    pl: '✍🏻',
    h: '💌',
    r: '♻️'
}
const emojiPriority = [
    '🥇',
    '🥈',
    '🥉',
    '🦥'
]

const hola = async( bot, messageRequest, options ) => {
    await bot.sendMessage(messageRequest.chat, 'hola')
}

//
const listHandler = function( manager, formatHandler, example ){
    return async( bot, messageRequest, options ) => {
        const { chat } = messageRequest.get();
        //Here we verify we have the respective params
        if( options.length > 0 ) return bot.sendMessage( chat, `No entiendo bien qué quieres que haga😕\nEjemplo: ${example}` );
        bot.sendMessage( chat, 'Consultando la lista que quieres ver...')
        
        
        let {ok, plans, memories, ...rest} = await manager.getAll();
        if( !ok  && !plans && !memories ) return bot.sendMessage( chat, 'Toy enfermita🤒. No pude obtener lo que querías' );
        let collection = plans || memories;

        let message = formatHandler(collection);
        bot.sendMessage( chat, message );
        
        

    }
}

//monke phone
//monke crea una actividad
//monke phone join
//monke phone start

//Escribe los que quieras que dibujen
//

const showHandler = function( manager, formatHandler, example){
    return async( bot, messageRequest, options ) => {
        const { chat } = messageRequest.get();
        if( options.length != 1 ) return bot.sendMessage( chat, `No entiendo bien qué quieres que haga😕\nEjemplo: ${example}` );
        //Here we get the id    
        const id = options[0].trim();

    
        bot.sendMessage( chat, 'Consultando el elemento que quieres ver...')
        let {ok, plan, memory} = await manager.getById( id );
        if( !ok && !plan && !memory ) return bot.sendMessage( chat, 'Toy enfermita🤒. No pude obtener lo que querías...' );
        let document = plan || memory;
        message = formatHandler(document);

        bot.sendMessage( chat, message );
    }
}

const createHandler = function( manager, listName , example ){
    return async(bot, messageRequest, options ) => {
        const { chat, author } = messageRequest.get();
        const { id: { _serialized: authorId } } = author;
        if( options.length == 0 ) return bot.sendMessage( chat, `No entiendo bien qué quieres que haga😕\nEjemplo: ${example}` );

        const title = options.reduce((acc, s) => acc + ' ' + s,'');

        const { ok } = await manager.create( title, authorId.replace(/:[\d]+/, '') )
        if( ok ){
            bot.sendMessage( chat, `Buenas noticias!😊, '${title}' fue añadido a la lista '${listName}'` );
        }else{
            bot.sendMessage( chat, `Ups... Algo ha salido mal😔` );
        }
    }
}

const updateHandler = function( manager, collection, example ){
    return async(bot, messageRequest, options ) => {
        const { chat } = messageRequest.get();
        console.log(options);
        if( options.length <= 2 ) return bot.sendMessage( chat, `No entiendo bien qué quieres que haga😕\nEjemplo: ${ example }\nPlan: descripción, prioridad, estado\nRecuerdo: estrellas, título` );

        const id = options[0];
        const propiedad = options[1];
        const propiedades = {
            'descripción': {
                title: 'description',
                type: 'string'
            },
            'prioridad': {
                title: 'priority',
                type: 'number'
            },
            'título': {
                title: 'title',
                type: 'string'
            },
            'estrellas':{
                title:  'stars',
                type: 'number'
            },
            'estado': {
                title: 'status',
                type: 'string'
            },
        }
        const { title, type } = propiedades[propiedad];

        if( !title || !type ) return bot.sendMessage( chat, `No entiendo bien qué quieres que haga😕\nEjemplo: ${ example }\nPlan: descripción, prioridad, estado\nRecuerdo: estrellas, título` );
        const body = {};

        switch( type ){
            case 'string':
                body[title] = options.slice(2).reduce((acc, s) => acc + ' ' + s,'');
                break;
            case 'number':
                let value = parseInt(options[2]);
                if( isNaN( value ) ) return bot.sendMessage( chat, `No entiendo bien qué quieres que haga😕\nEjemplo: ${ example }\nPlan: descripción, prioridad, estado\nRecuerdo: estrellas, título` );
                body[title] = value
                break;
        }

        const { ok } = await manager.update( id, body );

        if( ok ){
            bot.sendMessage( chat, `Tu ${collection} se ha actualizado satisfactoriamente`)
        }else{
            bot.sendMessage( chat, `Tu ${collection} no ha tenido oportunidad de actualizarse`)
        }
    }
}

const imgHandler = function( manager, collection, example){
    return async( bot, messageRequest, options ) => {
        const { chat, message } = messageRequest.get();
        if( options.length != 1 ) return bot.sendMessage( chat, `No entiendo bien qué quieres que haga😕\nEjemplo: ${ example }` );
        const id = options[0].trim();

        let media = [];
        if( message.hasQuotedMsg  ){
            const quoted = await message.getQuotedMessage();
            if( quoted.hasMedia ) media.push( quoted.downloadMedia() );
        }
        if( message.hasMedia ){
            media.push( message.downloadMedia() );
        }
        if( !message.hasMedia && !message.hasQuotedMsg ){
            return bot.sendMessage( chat, `No entiendo bien qué quieres que haga😕\nEjemplo: ${ example }\n\nNota: Debes adjuntar una imagen o responder a un mensaje con imagen` )
        }
        media = await Promise.all( media );

        const toUrl = media.map( ( m ) => CloudManager.messageMediaToURL( m ))
        const urls = await Promise.all( toUrl );

        //We make sure there´s no errors
        for( let data of urls ){
            if( !data.ok ){
                return bot.sendMessage( chat, `No logré subir las imagenes que me pediste 😔` );
            }
        }
        //Now we upload
        let responses = urls.map( ({ secure_url }) => manager.uploadImg( id, secure_url ) );
        responses = await Promise.all( responses );

        for( let data of responses ){
            if( !data.ok ){
                return bot.sendMessage( chat, `No logré subir las imagenes que me pediste 😿` );
            }
        }
        bot.sendMessage( chat, `${responses.length} imagenes se han subido al ${collection} ${id}` );
    }
}

const tagHandler = function( manager, collection, example){
    return async( bot, messageRequest, options ) => {
        const { chat, message } = messageRequest.get();
        if( options.length != 2 ) return bot.sendMessage( chat, `No entiendo bien qué quieres que haga😕\nEjemplo: ${ example }` );
        const id = options[0].trim();
        const tag = options[1].trim().toLowerCase();

        let { ok } = await manager.uploadTag( id, tag );
        if( ok ){
            bot.sendMessage( chat, `La etiqueta ${tag} se han subido al ${collection} ${id}` );
        }else{
            bot.sendMessage( chat, `No logré subir las etiquetas que me pediste 😿` );

        }
    }
}

const handlers = {
    listHandler,
    showHandler,
    createHandler,
    updateHandler,
    imgHandler,
    tagHandler
}

module.exports = handlers;