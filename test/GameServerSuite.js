require.paths.unshift( __dirname );
var GameServer = require('../GameServer');

var game1, game2, game3;
var player1, player2, player3;
var p1Obj = {};

function runBefore() {
    GameServer.restartServer();
    game1 = { vote: false, maxNoOfPlayers: 6, public: true, name: "game1" };
    game2 = {vote: false, maxNoOfPlayers: 7, public: false, name: "game2" }; 
    game3 = {vote: false, maxNoOfPlayers: 7, public: true, name: "game3" };
    player1 = GameServer.newPlayer(p1Obj,"test1","red");
    player2 = GameServer.newPlayer(p1Obj,"test2","blue");
    player3 = GameServer.newPlayer(p1Obj,"test3","yellow");
}

exports['check game'] = function(test){
    runBefore();
    test.ok( !GameServer.checkGame( { name: "game1", vote: false, public: true } ), "Object without maxNoOfPlayers should fail" );
    test.ok( !GameServer.checkGame( { name: "game1", maxNoOfPlayers: 6, public: true } ), "Object without vote should fail" );
    test.ok( !GameServer.checkGame( { name: "game1", vote: false, maxNoOfPlayers: 6 } ), "Object without public should fail" );
    test.ok( !GameServer.checkGame( { vote: false, public: true, maxNoOfPlayers: 6 } ), "Object without name should fail" );
    test.ok( GameServer.checkGame( game1 ), "Object without maxNoOfPlayers, players, vote and public should be OK" );
    test.done();
};

exports['restart Server'] = function(test){
    runBefore();
    var gameid = GameServer.addGame( game1, player1 );
    GameServer.restartServer();
    test.equal( GameServer.getGame( gameid ), null, "Should not contain any games");
    test.done();
};

exports['new player'] = function(test){
    runBefore();
    test.equal(typeof player1.playerid, "string", "should have a playerid");
    test.equal( player1.name, "test1", "should have the correct name");
    test.equal( player1.socket, p1Obj, "should have the correct socket");
    test.equal( player1.color, "red", "should have the correct color");
    test.equal( player1.gameid, null, "Should not have a game attached");
    test.done();
}

exports['new game'] = function(test){
    runBefore();
    test.equal( GameServer.addGame( { vote: false, public: true }, player1 ), null, "If game is not valid ignore" );
    var gameid = GameServer.addGame( game1, player1 );
    test.equal(typeof gameid, "string", "Should return a gameid when game is added" );
    test.strictEqual( GameServer.getGame( gameid ), game1, "Should be able to get the game from the GameServer" );
    test.equal( game1.noOfPlayers, 1, "Should add the user creating the game as player");
    test.done();
};

exports['add player'] = function(test){
    runBefore();
    GameServer.addGame( game1, player1 );
    test.ok( GameServer.addPlayer( game1, player2 ), "Should return true when joining a game");
    test.equal(typeof player2.gameid, "string", "Should update the gameid");
    test.equal( GameServer.getGame( player2.gameid ), game1, "Should be able to get the game");
    test.equal( game1.noOfPlayers, 2, "Should be able to get the game");
    test.strictEqual( GameServer.getPlayer( game1, player2.playerid ), player2, "Should give the player2 back");
    test.done();
};

exports['remove player'] = function(test){
    runBefore();
    GameServer.addGame( game1, player1 );
    GameServer.addPlayer( game1, player2 );
    test.ok( GameServer.removePlayer( game1, player2 ), "Should remove player");
    test.equal( player2.gameid, null, "Should remove the gameid from the player");
    test.equal( game1.noOfPlayers, 1, "Should count the players in the game down");
    test.done();
};

exports['get available games'] = function(test) {
    runBefore();
    var gameid1 = GameServer.addGame( game1, player1 );
    var gameid2 = GameServer.addGame( game2, player2 );
    var gameid3 = GameServer.addGame( game3, player3 );
    var availableGames = GameServer.getAvailableGames();
    test.ok( availableGames instanceof Array, "Should return something of type array");
    test.equal( availableGames.length, 2, "Should contain only 2 games (game2 is not public)");
    test.equal( availableGames[0], game1, "Should contain game1 as first");
    test.equal( availableGames[1], game3, "Should contain game3 as second");
    test.done();
};

exports['should not be able to join 2 games'] = function(test){
    runBefore();
    GameServer.addGame( game1, player1 );
    GameServer.addGame( game3, player3 );
    test.ok( !GameServer.addPlayer( game1, player3 ), "Should not be able to join a different game");
    test.done();
};

exports['remove game'] = function (test) {
    runBefore();
    GameServer.addGame( game1, player1 );
    GameServer.addPlayer( game1, player2 );
    GameServer.removeGame( game1 );
    test.equal( GameServer.getGame( game1.gameid ), null , "Should be removed");
    test.equal( player1.gameid, null , "Should have updated the gameid on player 1");
    test.equal( player2.gameid, null , "Should have updated the gameid on player 2");
    test.done();
};

exports['should remove game when no players'] = function (test) {
    runBefore();
    GameServer.addGame( game1, player1 );
    GameServer.removePlayer( game1, player1 );
    test.equal( GameServer.getGame( game1.gameid ), null , "Should be removed");
    test.equal( player1.gameid, null , "Should have updated the gameid on player 1");
    test.done();
};