var Lobby = {
    GameServer: {},
    
    setGameServer: function (gameServer) {
        Lobby.GameServer = gameServer;
    },
    
    onConnection: function(socket){
        socket.on( 'getCurrentGames', function(){
            socket.emit( 'currentGames', Lobby.GameServer.getAvailableGames() );
        });
        
        socket.on( 'addGame', function ( game ){
            if (Lobby.GameServer.addGame(game)) {
                if ( game.public ) {
                    socket.broadcast.emit( 'addGame', game );
                }
            } else {
                socket.emit('error', {errorid: 2, msg: "game object not valid"});
            }
        });
        
        socket.on( 'removeGame', function ( game ) {
            Lobby.GameServer.removeGame( game );
            socket.broadcast.emit( 'removeGame', game );            
        });
        
        socket.on( 'joinGame', function ( game, player ) {
            if ( Lobby.addPlayer( game, player ) ) {
                socket.emit('joinSuccess', game);
                socket.broadcast.emit( 'updateGame', game );
            } else {
                socket.emit('error', {errorid: 1, msg: "Game was full"});
            }
        });
        
        socket.on( 'leaveGame', function ( game, player ) {
            if ( Lobby.leaveGame( game, player ) ) {
            } else {
                socket.emit('error', {errorid: 1, msg: "You wasn't in a game"});
            }
        });
    }
};

exports.onConnection = Lobby.onConnection;
exports.setGameServer = Lobby.setGameServer;