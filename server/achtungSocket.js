var achtungSocket = {
    clients: {},
    games: {},
    
    onMessage: function ( msg ) {
        var client = this;
        
        if ( msg.type !== undefined && msg.type !== null ) {
                switch ( msg.type ) {
                    case "NEW PLAYER" : 
                    
                        if ( msg.playerid !== undefined && msg.playerid !== null ) {
                            //check if user is in use.
                            client.playerid = msg.playerid;
                        } else {
                            achtungSocket.sendErrorMessage( client, 1, "Playerid was missing" );
                        }; 
                    break;
                    
                    case "GAME UPDATE" :
                        if ( achtungSocket.isClientGroupified( client ) ) {
                            achtungSocket.multicastMessage( client, msg ); 
                        } else {
                            //Listen for groupid and if getting setup
                            if ( msg.groupid ) {
                                client.groupid = msg.groupid;
                                if ( !achtungSocket.clients[ client.groupid ] ) {
                                    achtungSocket.clients[ client.groupid ] = [ ];
                                }
                                achtungSocket.clients[ client.groupid ].push( client );
                            }
                        }
                    break;
                    
                    case "CURRENT GAMES" :
                        achtungSocket.sendCurrentGames( client );
                    break;
                    
                    case "HOST" :
                        achtungSocket.newGameHosted( client, msg );
                    break;
                    
                    case "VOTE START" :
                    break;
                    
                    case "JOIN GAME" :
                    break;
                    
                    default:
                        achtungSocket.sendErrorMessage( client, 1, "type was unkown" );
                    break;
                    
                }
        } else {
           achtungSocket.sendErrorMessage( client, 1, "Type was missing" );
        }
    },
    
    
    newGameHosted: function ( client, msg ) {
        if ( msg.game !== undefined && msg.game !== null ) {
            var game = msg.game;
            achtungSocket.games[ game.id ] = game;
            client.send( msg );
        } else {
            achtungSocket.sendErrorMessage( client, 1, "Game was missing" );
        }
    },
    
    sendErrorMessage: function ( client, errorid, msg ) {
        var error = {
            type: "ERROR",
            errorid: errorid,
            message: msg
        };
        client.send( error );
    },
    
    sendCurrentGames: function ( client ) {
        var availGames = [], game;
        for ( game in achtungSocket.games ) {
            if ( game.public == 1 ) {
                availGames.push( game );
            }
        }
        client.send ( { type: "CURRENT GAMES", games: availGames } );
    },
    
    multicastMessage: function ( client, msg ) {
        var group = achtungSocket.clients[ client.groupid ],
            i;
            
        for( i = 0; i < group.length; i++ ) {
            if ( group[ i ] !== client ) {
                client.send( msg );
            }
        }
    },
    
    onConnect: function ( client ) {
        client.groupid = false;
        
        //Setup callback functions
        client.on( "message", achtungSocket.onMessage );
        client.on( "disconnect", achtungSocket.onDisconnect );
    },
    
    isClientGroupified: function ( client ) {
        if ( !client.groupid ) {
            return false;
        } else {
            return ( achtungSocket.clients[ client.groupid ] !== null );
        }
    },
    
    removeClient: function ( client ) {
        var group = achtungSocket.clients[ client.groupid ],
            i;
        for ( i = 0; i < group.length; i++ ) {
            if ( group[ i ] === client ) {
                group.splice( i, 1 );
                return true;
            }
        }
        return false;
    },
    
    onDisconnect: function ( ) {
        var client = this;
        if ( achtungSocket.isClientGroupified( client ) ) {
            achtungSocket.removeClient( client );
            if ( achtungSocket.clients[ client.groupid ].length == 0 ) {
                delete achtungSocket.clients[ client.groupid ];
            }
        }
    }
        
}

//Defines the external API:
exports.onDisconnect = achtungSocket.onDisconnect;
exports.onConnect = achtungSocket.onConnect;
exports.onMessage = achtungSocket.onMessage;