/**
 * The game object should look like:
 *  {
 *      noOfPlayers: int, (opt. will be added)
 *      maxNoOfPlayers: int,
 *      gameid: int, (opt. will be added)
 *      players: Array<Players> (opt. will be added),
 *      vote: boolean,
 *      name: sting,
 *      public: boolean,
 *  }
 * 
 * player object should looks like:
 * {
 *      playerid: int (playerid)
 *      socket: Socket,
 *      name: String,
 *      gameid: int (null if not in a game), (opt. )
 *      color: Color,
 * }
 * */

var GameServer = {
    games: {},
    
    addGame: function( game, player ){
        if ( GameServer.checkGame( game ) ) {
            game.gameid = GameServer.getUniqueId();
            game.noOfPlayers = 0;
            game.players = {};
            GameServer.addPlayer( game, player );
            GameServer.games[ game.gameid ] = game;
            return game.gameid;
        } else {
            return null;
        }
    },
    
    removeGame: function(game){
        if (typeof game == 'object') game = GameServer.games[ game.gameid ];
        var playerid;
        for( playerid in game.players ) {
            GameServer.removePlayer( game, playerid );
        }
        delete GameServer.games[ game.gameid ];
    },
    
    getGame: function(gameid){
        return GameServer.games[ gameid ];
    },
    
    getAvailableGames: function() {
        var avaiableGames = [], gameid;
        for ( gameid in GameServer.games ){
            if ( GameServer.games[ gameid ].public ) {
                avaiableGames.push( GameServer.games[ gameid ] );
            }
        }
        return avaiableGames;
    },
    
    checkGame: function(game){
        return  typeof game['maxNoOfPlayers'] == 'number' &&
                typeof game['vote'] == 'boolean' &&
                typeof game['name'] == 'string' &&
                typeof game['public'] == 'boolean';
    },
    
    newPlayer: function(socket, name, color) {        
        return {
            socket: socket,
            name: name,
            color: color,
            gameid: null,
            playerid: GameServer.getUniqueId()
        };
    },
    
    addPlayer: function ( game, player ){
        if (game.noOfPlayers < game.maxNoOfPlayers && player.gameid === null){
            game.noOfPlayers++;
            game.players[ player.playerid ] = player;
            player.gameid = game.gameid;
            return true;
        } else {
            return false;
        }
    },
    
    removePlayer: function ( game, player ) {
        if (typeof player == 'object') player = player.playerid;
        if (game.players[ player ] !== undefined) {
            game.noOfPlayers--;
            game.players[ player ].gameid = null;
            delete game.players[ player ];
            if ( game.noOfPlayers == 0) GameServer.removeGame(game);
            return true;
        } else {
            return false;
        }
    },
    
    restartServer: function( ) {
        GameServer.games = {};
    },
    
    getPlayer: function( game, playerid ) {
        return game.players[ playerid ];
    },
        
    
    getUniqueId: function() {
        return ((new Date()).getTime() + "" + Math.floor(Math.random() * 1000000)).substr(0, 18);
    }
};

exports.restartServer = GameServer.restartServer;
exports.addGame = GameServer.addGame;
exports.removeGame = GameServer.removeGame;
exports.getGame = GameServer.getGame;
exports.getAvailableGames = GameServer.getAvailableGames;
exports.checkGame = GameServer.checkGame;
exports.addPlayer = GameServer.addPlayer;
exports.newPlayer = GameServer.newPlayer;
exports.removePlayer = GameServer.removePlayer;
exports.getPlayer = GameServer.getPlayer;
exports.getUniqueId = GameServer.getUniqueId;