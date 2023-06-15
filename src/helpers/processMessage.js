
const processMessage = async(data, botpool) => {
    const embed = {
        message: data
    }
    //In case there's no author, to, from or if the message contins [] (bot messages)
    const isBot = data?.author == "" || !data?.author || !data?.to || !data?.from || /\[.+\]/.test(data?.body);
    if( isBot ){
        //And then we prevent the default behaviour
        return;
    }
    //We'll find out the groupId, if there's no groupId we'll omit
    if ( data.to.includes("@g.us") ){
        embed.groupId = data.to;
    }else if( data.from.includes("@g.us") ){
        embed.groupId = data.from;
    }else{
        return;
    }

    //Now we'll embed some data into the default data
    embed.who = data.author.replace(/:\d+/,""); //We delete the :d prefix onthe messages for refering to the author
    
    //Everybot will eval the message and do the respectives processes
    botpool.broadcast( embed );
}
export {
    processMessage
};

