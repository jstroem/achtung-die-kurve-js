var http = require('http'),  
    io = require('socket.io'),
    fs = require('fs'),
    sys = require(process.binding('natives').util ? 'util' : 'sys'),
    server, socket;
    
server = http.createServer(function(req, res){
    
});
server.listen(8998, "jstroem.com");
socket = io.listen( server );

//Read in the achtung socket class
require.paths.unshift(__dirname);
var achtungSocket = require('achtungSocket');

socket.on( 'connection', achtungSocket.onConnect );