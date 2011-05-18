var port = 8998;

/**
 * @author Jesper & Christoffer
 * @classDescription Handles network trafic.
 * @constructor networkOptions
 */
function NetworkHandler( ) {
	var self = this,
		observers = [],
		socket = null;
	
	/**
	 * @private
	 * @method Initializes the handler incl. connection.
	 * @return void
	 */
	function init( ) {
		// Initialize observers
		observers["CURRENT GAMES"] = [];
		
		// Initialize socket
		socket = new io.Socket( null,
			{
				port: port,
				rememberTransport: false
			}
		);
		socket.connect( );
		socket.on(
			'message',
			function ( obj ) {
				if ( 'buffer' in obj ) {
					for ( var i in obj.buffer ) {
						receive( obj.buffer[i] );
					}
				} else {
					receive( obj );
				}
			}
		);
		
//		socket.on( 'connect', function( ) {
//			self.send( { groupid: 'mygroup' } );
//			game.world.start( );
//		} );
//		
//		socket.on( 'disconnect', function( ) {
//		} );
//		
//		socket.on( 'reconnect', function ( ) {
//		} );
//		
//		socket.on( 'reconnecting', function ( nextRetry ) {
//		} );
//		
//		socket.on( 'reconnect_failed', function ( ) {
//		} );
	}
	
	this.addObserver = function ( type, func ) {
		var list = observers[ type ];
		if ( list ) {
			list.push( func );
		}
	};
	
	function notifyObservers( update ) {
		var list = observers[ update.type ];
		if ( list ) {
			for ( var i = 0; i < list.length; i++ ) {
				list[ i ]( update );
			}
		}
	};
	
//	this.sendGameUpdate = function( curve ) {
//		this.send( {
//			tombstone: curve.isDead,
//			pos: {
//				row: curve.pos.row,
//				col: curve.pos.col
//			},
//			lastpos: {
//				row: curve.lastpos.row,
//				col: curve.lastpos.col
//			},
//			color: curve.color
//		} );
//	};
	
	this.send = function( msg ) {
		console.log( "SEND:" );
		console.log( msg );
		socket.send( msg );
	};
	
	function receive( update ) {
		console.log( "RECEIVE:" );
		console.log( update );
		
		if ( !update.type ) {
			return;
		}
		
		notifyObservers( update );
	};
	
	init( );
};