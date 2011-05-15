/**
 * @author Jesper & Christoffer
 * @classDescription Handles network trafic.
 * @constructor networkOptions
 */
function NetworkHandler( game, port ) {
	var self = this, // To be used in private-methods.
		socket;
	
	/**
	 * @private
	 * @method Initializes the handler incl. connection.
	 * @return void
	 */
	function init( ) {
		socket = new io.Socket( null, { port: port, rememberTransport: false } );
		socket.connect( );
		socket.on(
			'message',
			function ( obj ) {
				if ( 'buffer' in obj ) {
					for ( var i in obj.buffer ) {
						self.update( obj.buffer[i] );
					}
				} else {
					self.update( obj );
				}
			}
		);
		
		socket.on( 'connect', function( ) {
			self.send( { groupid: 'mygroup' } );
			game.world.start( );
		} );
		
		socket.on( 'disconnect', function( ) {
		} );
		
		socket.on( 'reconnect', function ( ) {
		} );
		
		socket.on( 'reconnecting', function ( nextRetry ) {
		} );
		
		socket.on( 'reconnect_failed', function ( ) {
		} );
	}
	
	this.sendGameUpdate = function( curve ) {
		send( {
			tombstone: curve.isDead,
			pos: {
				row: curve.pos.row,
				col: curve.pos.col
			},
			lastpos: {
				row: curve.lastpos.row,
				col: curve.lastpos.col
			},
			color: curve.color
		} );
	};
	
	var i = 0;
	function send( msg ) {
		if (i < 10) {
			console.log( "SENDING: " + msg );
			socket.send( msg );
			i++;
		}
	};
	
	this.updateGame = function( update ) {
//		if ( update.tombstone ) {
//			drawRectangle( new Point( update.pos.row, update.pos.col ), options.curveRadius + 4, "white", context );
//		} else {
//			drawCircle( new Point( update.lastpos.row, update.lastpos.col ), options.curveRadius, curve.color, context );
//			drawCircle( new Point( update.pos.row, update.pos.col ), options.curveRadius, update.color, context );
//		}
	};
	
	init( );
};