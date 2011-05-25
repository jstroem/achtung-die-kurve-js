/**
 * @classDescription Lobby
 * @param
 * 		{
 * 			gamelist: <ul>,
 * 			player:
 * 				{
 * 					name: <input type="text">
 * 				},
 * 			game:
 * 				{
 * 					name: <input type="text">,
 * 					singleplayer: <input type="checkbox">,
 * 					wallsOn: <input type="checkbox">,
 * 					maxNoOfPlayers: <input type="text">
 * 				}
 * 		} domElements
 * @return
 */
function Lobby( domElements ) {
	var self = this,
		networkHandler;
	
	function init( ) {
		// Initialize objects
		networkHandler = new NetworkHandler( );
		
		// Add observers
		networkHandler.addObserver( "CURRENT GAMES", initGames );
		networkHandler.addObserver( "ADD GAME", editGames );
		networkHandler.addObserver( "REMOVE GAME", editGames );
		networkHandler.addObserver( "JOIN", function( ) {
			document.location = "game-multiplayer.html";
		} );
		
		// Get open games
		networkHandler.send( { type: "CURRENT GAMES" } );
	}
	
	function initGames( update ) {
		// Clear the <UL>-list
		domElements.gamelist.innerHTML = "";
		
		// Iterate through the received games (from the server), and add them to the <UL>-list
		var games = update.games;
		for ( var i = 0; i < games.length; i++ ) {
			editGames(
				{
					type: "ADD GAME",
					game: games[ i ]
				}
			);
		}
	}
	
	function editGames( update ) {
		if ( update.type ) {
			if ( update.type == "ADD GAME" ) {
				var game = update.game;
				
				var liItem = document.createElement( "li" );
				liItem.value = game.id;
				liItem.className = (i % 2 == 0) ? "even" : "odd";
				
				var a = document.createElement( "a" );
				a.href = "JavaScript: lobby.join( '" + game.id + "' );";
				a.innerHTML = game.name + " (" + game.noOfPlayers + " / " + game.maxNoOfPlayers + ")";
				
				liItem.appendChild( a );
				
				domElements.gamelist.appendChild( liItem );
			} else if ( update.type == "REMOVE GAME" ) {
				var game = update.game;
				
				var liItems = domElements.gamelist.getElementsByTagName( "li" );
				for ( var i = 0; i < li.length; i++ ){
					var liItem = liItems[ i ];
					
					if ( liItem.value == game.id ) {
						domElements.gamelist.removeChild( liItem );
						break;
					}
				}
			}
		}
	}
	
	function registerPlayer( ) {
		var player =
			{
				name: domElements.player.name.value,
				id: "P" + (new Date).getTime( )
			};
		
		$.cookie( "player", JSON.stringify( player ) );
	}
	
	this.host = function( ) {
		registerPlayer( );
		
		var game =
			{
				name: domElements.game.name.value,
				id: "G" + (new Date).getTime( ),
				
				singleplayer: domElements.game.singleplayer.checked,
				
				// Options:
				public: 1, // TODO: Add this parameter to the GUI
				wallsOn: domElements.game.wallsOn.checked, // TODO: Add this parameter to the game
				maxNoOfPlayers: domElements.game.maxNoOfPlayers.value
			};
		
		$.cookie( "host", JSON.stringify( game ) );
		document.location = "game.html";
	};
	
	this.join = function( gameId ) {
		registerPlayer( );
		
		$.cookie( "join", JSON.stringify( { id: gameId } ) );
		document.location = "game.html";
	};
	
	init ( );
}