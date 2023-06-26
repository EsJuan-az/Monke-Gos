class Command{
    constructor( name, handler ){
        this.name = name;
        this.handler = handler;
    }
    execute( bot, messageRequest, options ){
        try{
            this.handler( bot, messageRequest, options );
        }catch(err){
            console.log(err);
        }
    }
}
module.exports = Command