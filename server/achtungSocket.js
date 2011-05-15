var achtungSocket = {
    clients: {},
    
    onMessage: function ( msg ) {
        var client = this;
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
    },
    
    multicastMessage: function ( client, msg ) {
        var group = achtungSocket.clients[ client.groupid ],
            i;
        console.log("Multicast: "+client.groupid+", group size: "+group.length+", msg:"+msg);
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