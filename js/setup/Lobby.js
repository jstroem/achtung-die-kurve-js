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
		networkHandler = null;
	
	function init( ) {
		networkHandler = new NetworkHandler( );
		
		networkHandler.addObserver( "CURRENT GAMES", initGames );
		networkHandler.send( { type: "CURRENT GAMES" } );

		networkHandler.addObserver( "ADD GAME", editGames );
		networkHandler.addObserver( "REMOVE GAME", editGames );
		networkHandler.addObserver( "JOIN", function( ) {
			document.location = "game-multiplayer.html";
		} );
	}
	
	function initGames( update ) {
		domElements.gamelist.innerHTML = "";
		
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
				type: "NEW PLAYER",
				player:
					{
						name: domElements.player.name.value,
						id: "P" + (new Date).getTime( )
					}
			};
		
		$.cookie( "player", JSON.stringify( player.player ) );
		
		if ( !domElements.game.singleplayer.checked ) {
			networkHandler.send( player );
		}
	}
	
	this.host = function( ) {
		registerPlayer( );
		
		if ( domElements.game.singleplayer.checked ) {
			document.location = "game-singleplayer.html";
		} else {
			var game =
				{
					type: "HOST",
					game:
						{
							name: domElements.game.name.value,
							id: "G" + (new Date).getTime( ),
							
							// Options:
							public: 1,
							wallsOn: domElements.game.wallsOn.checked,
							maxNoOfPlayers: domElements.game.maxNoOfPlayers.value
						}
				};
			
			$.cookie( "host", JSON.stringify( game.game ) );
			
			document.location = "game-multiplayer.html";
		}
	};
	
	this.join = function( gameId ) {
		registerPlayer( );
		
		$.cookie( "join", JSON.stringify( { id: gameId } ) );
		
		document.location = "game-multiplayer.html";
	};
	
	init ( );
}