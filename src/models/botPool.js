class BotPool{
    constructor(...bots){
        this.pool = bots;
    }
    add( bot ){
        this.pool.push( bot );
    }
    broadcast( msg ){
        this.pool.forEach( bot => {
            bot.EvalBot( msg )
        } )
    }
}
export { 
    BotPool
};