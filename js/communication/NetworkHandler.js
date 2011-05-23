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
	}
	
	this.addObserver = function ( type, func ) {
		var list = observers[ type ];
		if ( !list ) {
			list = [ func ];
			observers[ type ] = list;
		} else {
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