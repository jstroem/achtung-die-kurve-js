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
		networkHandler.addObserver( "HOST", self.host );
		
		self.refresh( );
	}
	
	this.refresh = function( ) {
		networkHandler.send( { type: "CURRENT GAMES" } );
	};
	
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
	
	function registerPlayer( ) {
		networkHandler.send(
			{
				type: "NEW PLAYER",
				player:
					{
						name: domElements.nickname,
						id: "P" + Date.getMilliseconds()
					}
			}
		);
	}
	
	this.host = function( update ) {
		if ( domElements.singleplayer.checked ) {
			document.location = "game-singleplayer.html";
		}
		
		if ( !update ) {
			registerPlayer( );
			
			networkHandler.send(
				{
					type: "HOST",
					game:
						{
							name: domElements.multiplayerOptions.gameName.value,
							id: "G" + Date.getMilliseconds(),
							options:
								{
									wallsOn: domElements.options.wallsOn.checked,
									maxNoOfPlayers: domElements.multiplayerOptions.maxNoOfPlayers.value
								}
						}
				}
			);
		} else {
			$.cookie( "game", JSON.stringify( update ) );
			document.location = "game-multiplayer.html";
		}
	};
	
	this.join = function( ) {
	};
	
	init ( );
}