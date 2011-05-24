/**
 * @author Jesper & Christoffer
 * @classDescription Handles network trafic.
 * @constructor networkOptions
 */
function NetworkHandler( ) {
	var self = this,
		observers = [];
	
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
		if ( msg && msg.type && msg.type == "START" ) {
			notifyObservers( { type: "START GAME" } );
		}
	};
};