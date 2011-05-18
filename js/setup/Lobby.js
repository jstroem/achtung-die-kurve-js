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
		
		self.refresh( );
	}
	
	function updateGames( update ) {
		domElements.gamelist.innerHTML = "";
		
		var games = update.games;
		for ( var i = 0; i < games.length; i++ ) {
			var game = games[ i ];
			if ( game.name && game.id ) {
				var liItem = document.createElement( "li" );
				liItem.value = game.id;
				liItem.className = (i % 2 == 0) ? "even" : "odd";
				
				var a = document.createElement( "a" );
				a.innerHTML = game.name;
				
				liItem.appendChild( a );
				
				domElements.gamelist.appendChild( liItem );
			}
		}
	}
	
	this.refresh = function( ) {
		networkHandler.send( { type: "CURRENT GAMES" } );
	};
	
	init ( );
}