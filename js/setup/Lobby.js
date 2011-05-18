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
		var player =
			{
				type: "NEW PLAYER",
				player:
					{
						name: domElements.nickname.value,
						id: "P" + (new Date).getTime( )
					}
			};
		
		$.cookie( "player", JSON.stringify( player ) );
		
		if ( !domElements.singleplayer.checked ) {
			networkHandler.send( player );
		}
	}
	
	this.host = function( update ) {
		console.log( update );
		if ( !update ) {
			registerPlayer( );
			
			if ( domElements.singleplayer.checked ) {
				document.location = "game-singleplayer.html";
			} else {
				var game =
					{
						type: "HOST",
						game:
							{
								name: domElements.multiplayerOptions.gameName.value,
								id: "G" + (new Date).getTime( ),
								options:
									{
										wallsOn: domElements.options.wallsOn.checked,
										maxNoOfPlayers: domElements.multiplayerOptions.maxNoOfPlayers.value
									}
							}
					};
				
				$.cookie( "game", JSON.stringify( game ) );
				
				console.log( game );
				networkHandler.send( game );
			}
		} else {
			document.location = "game-multiplayer.html";
		}
	};
	
	this.join = function( ) {
	};
	
	init ( );
}