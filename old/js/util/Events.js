function Events( ) {
	var self = this,
		listeners = [];
	
	this.addListener = function ( type, listener ) {
		var list = listeners[ type ];
		if ( !list ) {
			list = [ listener ];
			listeners[ type ] = list;
		} else {
			list.push( listener );
		}
	};
	
	this.notifyListeners = function( type ) {
		var list = listeners[ type ];
		if ( list ) {
			for ( var i = 0; i < list.length; i++ ) {
				list[ i ]( type );
			}
		}
	};
};