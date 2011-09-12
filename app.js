
/**
 * Module dependencies.
 */

var express = require('express');
var app = module.exports = express.createServer();
var io = require('socket.io');
var port = 8991;

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({secret: 'secret', key: 'express.sid'}));
  app.use(express.static(__dirname + '/public'));
  app.use(app.router);
}); 

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

app.use(function(req, res, next){
  res.render('404', { layout: false, status: 404, url: req.url });
});
app.use(function(err, req, res, next){
    res.render('404', { layout: false, status: 404, url: req.url });
});

app.get('/', function(req, res){
  res.render('index', {
        javascripts: ['javascripts/setup/Lobby.js']
  });
});

app.get('/game', function(req, res) {
    res.render('game', {
        javascripts: [  'javascripts/util/Events.js',
                        'javascripts/communication/NetworkHandlerSingleplayer.js',
                        'javascripts/game/geometry/Point.js',
                        'javascripts/game/geometry/Vector.js',
                        'javascripts/game/Curve.js',
                        'javascripts/game/Drawer.js',
                        'javascripts/game/World.js',
                        'javascripts/game/Game.js',
                        'javascripts/setup/GameLobby.js']
    });
});

app.get('/404', function(req, res, next){
  next();
});

app.listen( port );
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);


sio = io.listen( app );
sio.set( 'log level', 1 );

//Read in the achtung socket class
require.paths.unshift( __dirname );
var achtungSocket = require( 'AchtungSocket' );
var Lobby = require( 'Lobby' );
var GameServer = require( 'GameServer' );

Lobby.setGameServer( GameServer );

sio.of('/lobby').on('connection', Lobby.onConnection );

sio.sockets.on( 'connection', achtungSocket.onConnect );