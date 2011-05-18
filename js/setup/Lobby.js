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
 * 			multiplayerOptions:
 * 				{
 * 					gameName: <input type="text">,
 * 					maxNoOfPlayers: <input type="text">
 * 				}
 * 		} domElements
 * @return
 */
function Lobby( domElements ) {
	var self = this,
		networkHandler = null;
	
	function init( ) {
		networkHandler = new NetworkHandler( );
		networkHandler.addObserver( "CURRENT GAMES", updateGames );
		
		this.refresh( );
	}
	
	function updateGames( games ) {
		var i = 0;
		var game = games[ i ];
		while ( game ) {
			if ( game.name && game.id ) {
				var liItem = document.createElement( "li" );
				liItem.innerHTML = game.name;
				liItem.value = game.id;
				
				gamelist.appendChild( liItem );
			}
			
			game = games [ ++i ];
		}
	}
	
	this.refresh = function( ) {
		networkHandler.send( { type: "CURRENT GAMES" } );
	};
	
	init ( );
}