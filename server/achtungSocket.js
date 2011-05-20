var achtungSocket = {
    clients: [],
    games: {},
    gamePlayers: {},
    
    onMessage: function ( msg ) {
        var client = this;
        
        if ( msg.type !== undefined && msg.type !== null ) {
                switch ( msg.type ) {
                    case "NEW PLAYER" :
                        achtungSocket.newPlayer( client, msg );
                    break;
                    
                    case "GAME UPDATE" :
                        if ( achtungSocket.isClientInGame( client ) ) {
                            achtungSocket.multicastMessage( achtungSocket.gamePlayers[ client.gameid ], msg ); 
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
    
    newPlayer: function ( client, msg ) {
        if ( msg.player !== undefined && msg.player !== null ) {
            //check if user is in use.
            if (msg.player.id !== undefined && msg.player.id !== null ) {
                client.playerid = msg.playerid;
                client.send( { type: "NEW PLAYER" } );
            } else {
                achtungSocket.sendErrorMessage( client, 1, "Player object was missing id" );   
            }
        } else {
            achtungSocket.sendErrorMessage( client, 1, "Player object was missing" );
        };
    },
    
    newGameHosted: function ( client, msg ) {
        if ( msg.game !== undefined && msg.game !== null ) {
            var game = msg.game;
            game.noOfPlayers = 1;
            achtungSocket.games[ game.id ] = game;
            client.send( { type: "HOST" } );
        } else {
            achtungSocket.sendErrorMessage( client, 1, "Game was missing" );
        }
        achtungSocket.multicastMessage( achtungSocket.clients, 
            { type: "ADD GAME", game: game },
            function ( client ) {
                return !achtungSocket.isClientInGame( client );
            } 
        );
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
        var availGames = [], gameid;
        for ( gameid in achtungSocket.games ) {
            console.log( "game:", achtungSocket.games[ gameid ] );
            if ( achtungSocket.games[ gameid ].public === 1 ) {
                availGames.push( achtungSocket.games[ gameid ] );
            }
        }
        client.send ( { type: "CURRENT GAMES", games: availGames } );
    },
    
    multicastMessage: function ( clients, msg, cond ) {
        if (cond === null || cond === undefined ) { 
            cond = function () { true } 
        }
        for(var i = 0; i < clients.length; i++ ) {
            if ( clients[ i ] !== this && cond( clients[ i ] ) ) {
                clients[ i ].send( msg );
            }
        }
    },
    
    onConnect: function ( client ) {
        client.groupid = false;
        
        achtungSocket.clients.push( client );
        
        //Setup callback functions
        client.on( "message", achtungSocket.onMessage );
        client.on( "disconnect", achtungSocket.onDisconnect );
    },
    
    isClientInGame: function ( client ) {
        if ( !client.gameid ) {
            return false;
        } else {
            return ( achtungSocket.gamePlayers[ client.gameid ] !== null );
        }
    },
    
    removeElementFromArray: function ( array, el ) {
        for (var i = 0; i < array.length; i++ ) {
            if ( array[ i ] === el ) {
                array.splice( i, 1 );
                return true;
            }
        }
        return false;
    },
    
    onDisconnect: function ( ) {
        var client = this;
        if ( achtungSocket.isClientInGame( client ) ) {
            achtungSocket.removeElementFromArray( achtungSocket.gamePlayeres[ client.gameid ], client );
            if ( achtungSocket.gamePlayers[ client.gameid ].length == 0 ) {
                delete achtungSocket.gamePlayers[ client.gameid ];
                delete achtungSocket.games[ client.gameid ];
                achtungSocket.multicastMessage( achtungSocket.clients, 
                    { type: "DELETE GAME", game: game },
                    function ( client ) {
                        return !achtungSocket.isClientInGame( client );
                    }   
                );
            }
        }
        achtungSocket.removeElementFromArray( achtungSocket.clients, client );
    }
        
}

//Defines the external API:
exports.onDisconnect = achtungSocket.onDisconnect;
exports.onConnect = achtungSocket.onConnect;
exports.onMessage = achtungSocket.onMessage;