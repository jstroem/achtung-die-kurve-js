/**
 * @classDescription Lobby
 * @param
 * 		{
 * 			gamelist: <ul>,
 * 			nickname: <input type="text">,
 * 			singleplayer: <input type="checkbox">,
 * 			options:
 * 				{
 * 					wallsOn: <input type="checkbox">
 * 				}
 * 			multiplayer:
 * 				{
 * 					gameName: <input type="text">,
 * 					maxNoOfPlayers: <input type="text">
 * 				}
 * 		} domElements
 * @return
 */
function Lobby( domElements ) {
	var self = this,
		locals = [],
		externals = [],
		localStart = false,
		externalStart = [],
		observers = [];
	
	function init( ) {
		observers[ "NEW_LOCAL_PLAYER" ] = [];
	};
	
	this.addObserver = function( type, func ) {
		observers[ type ].push( func );
	};
	
	function notifyObservers( type, arg ) {
		for ( var i = 0; i < observers[ type ].length; i++ ) {
			observers[ type ][ i ]( arg );
		}
	};
	
	this.addLocalPlayer = function( player, callback ) {
		player.load( function( ) {
			locals.push( player );
			checkStart( );
			
			notifyObservers( "NEW_LOCAL_PLAYER", player );
			if ( typeof callback == "function" ) {
				callback( );
			}
		} );
	};
	
	this.voteStart = function( ) {
		localStart = true;
		checkStart( );
	};
	
	function checkStart( ) {
		if ( !localStart ) {
			return false;
		}
		if ( !singleplayer ) {
			for ( var i = 0; i < externalStart.length; i++ ){
				if ( !externalStart[i] ) {
					return false;
				}
			}
		}
		
		for ( var i = 0; i < locals.length; i++ ) {
			var randomPos = new Point( getRandom( 1, 500, true ), getRandom( 1, 500, true ) );
			var randomDir = new Vector( getRandom( -1, 1, false ), getRandom( -1, 1, false ) ).normalize();
			game.addCurve( new Curve( locals[i].color, randomPos, randomDir, locals[i].keys ) );
		}
		
		game.world.start( );
	}
	
	init( );
}