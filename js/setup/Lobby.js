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
		console.log( update );
		
		var games = update.games;
		for ( var i = 0; i < games.length; i++ ) {
			domElements.gamelist.innerHTML = "";
			
			var game = games[ i ];
			if ( game.name && game.id ) {
				var liItem = document.createElement( "li" );
				liItem.innerHTML = game.name;
				liItem.value = game.id;
				liItem.className = (i % 2 == 0) ? "even" : "odd";
				
				domElements.gamelist.appendChild( liItem );
			}
		}
	}
	
	this.refresh = function( ) {
		networkHandler.send( { type: "CURRENT GAMES" } );
	};
	
	init ( );
}