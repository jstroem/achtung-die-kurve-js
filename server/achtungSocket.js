var achtungSocket = {
    clients: [],
    games: {},
    gamePlayers: {},
    
    onMessage: function ( msg ) {
        var client = this;
        if ( msg.type !== undefined && msg.type !== null ) {
                console.log( "Message recived: "+ msg.type );
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
                    
                    case "CURRENT PLAYERS" :
                        achtungSocket.sendCurrentPlayers( client );
                    break;
                    
                    case "HOST" :
                        achtungSocket.createNewGame( client, msg );
                    break;
                    
                    case "START" :
                        achtungSocket.voteStart( client );
                    break;
                    
                    case "JOIN" :
                        if ( msg.game !== null && msg.game !== undefined && msg.game.id !== null && msg.game.id !== undefined ) {
                            achtungSocket.joinGame( client, msg );
                        } else {
                            achtungSocket.sendErrorMessage( client, 1, "game.id was missing" );
                        }
                    break;
                    
                    default:
                        achtungSocket.sendErrorMessage( client, 1, "type was unknown" );
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
                client.player = msg.player;
                
            } else {
                achtungSocket.sendErrorMessage( client, 1, "Player object was missing id" );   
            }
        } else {
            achtungSocket.sendErrorMessage( client, 1, "Player object was missing" );
        }
    },
    
    voteStart: function ( client ) {
        if ( client.gameid !== null && client.gameid !== undefined ) {
            client.vote = true;
            //Check if all has made a vote
            
            var gamePlayers = achtungSocket.gamePlayers[ client.gameid ],
                votes = gamePlayers.length;
                
            console.log(gamePlayers);
            if ( gamePlayers !== null && gamePlayers !== undefined ) {
                for ( var i = 0; i < gamePlayers.length; i++ ) {
                    if ( gamePlayers[ i ].vote ) {
                        votes--;
                    }
                }
                if ( votes === 0 ) {
                    achtungSocket.multicastMessage( gamePlayers, { type: "START" } );
                }
            }
        }
    },
    
    joinGame: function ( client, msg ) {
        var game = achtungSocket.games[ msg.game.id ];
        if ( game !== null && game !== undefined ) {
            if ( game.noOfPlayers < game.maxNoOfPlayers ) {
                game.noOfPlayers++;
                client.gameid = msg.game.id;
                client.vote = false;
                client.player = msg.player;
                achtungSocket.gamePlayers[ msg.game.id ].push( client );
                
            } else {
                achtungSocket.sendErrorMessage( client, 2, "Game is full" );
            }
                
        }
    },
    
    createNewGame: function ( client, msg ) {
        if ( msg.game !== undefined && msg.game !== null ) {
            var game = msg.game;
            game.noOfPlayers = 1;
            client.gameid = game.id;
            client.player = msg.player;
            client.vote = false;
            achtungSocket.games[ game.id ] = game;
            console.log("new game", game);
            achtungSocket.gamePlayers[ game.id ] = [ client ];
            achtungSocket.multicastMessage( achtungSocket.clients, 
                { type: "ADD GAME", game: game },
                function ( client ) {
                    return !achtungSocket.isClientInGame( client );
                } 
            );
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
        var availGames = [], gameid;
        for ( gameid in achtungSocket.games ) {
            console.log("Game", achtungSocket.games[ gameid ]);
           // if ( achtungSocket.games[ gameid ].public === 1 ) {
                availGames.push( achtungSocket.games[ gameid ] );
            //}
        }
        client.send ( { type: "CURRENT GAMES", games: availGames } );
    },
    
    sendCurrentPlayers: function ( client ) {
        var result = [],
            gamePlayers = achtungSocket.gamePlayers[ client.gameid ];
        
        for ( var i = 0;i < gamePlayers.length; i++ ) {
            result.push( gamePlayers[ i ].player );
        }
        client.send( {  type: "CURRENT PLAYERS", players: result } );
    },
    
    multicastMessage: function ( clients, msg, cond ) {
        if (cond === null || cond === undefined ) { 
            cond = function () { return true; };
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
        client.on( "disconnect", function ( ) { 
            achtungSocket.onDisconnect( client ); 
        } );
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
    
    onDisconnect: function ( client ) {
        if ( achtungSocket.isClientInGame( client ) ) {
            achtungSocket.removeElementFromArray( achtungSocket.gamePlayeres[ client.gameid ], client );
            if ( achtungSocket.gamePlayers[ client.gameid ].length === 0 ) {
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
        
};

//Defines the external API:
exports.onDisconnect = achtungSocket.onDisconnect;
exports.onConnect = achtungSocket.onConnect;
exports.onMessage = achtungSocket.onMessage;