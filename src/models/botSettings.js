const Command = require("./command");

class BotSettings{
    constructor(  ){
        this.commands = [];
        this.middlewares = []
    }
    addCommand( command ){
        this.commands.push( command )
    }
    addMiddleware( command ){
        this.middlewares.push( command )
    }
    set( settings ){
        for( let cmd in settings.cmds ){
            this.addCommand( new Command(cmd, settings.cmds[cmd]) )
        }
        for( let mdw in settings.middlewares ){
            this.addMiddleware( new Command(mdw, settings.middlewares[mdw]) )
        }
        return this;
    }
}
module.exports = BotSettings;