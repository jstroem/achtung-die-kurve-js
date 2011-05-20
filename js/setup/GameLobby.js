/**
 * @classDescription Lobby
 * @param
 * 		{
 * 			game: <canvas>,
 * 			playerlist: <ul>,
 * 			buttons:
 * 				{
 * 					addPlayer: <a>,
 * 					start: <a>
 * 				}
 * 		} domElements
 * @return
 */
function GameLobby( domElements ) {
	var self = this,
		localCurves = [],
		networkHandler = null;
	
	function init( ) {
		networkHandler = new NetworkHandler( );
		
		networkHandler.addObserver( "CURRENT PLAYERS", addPlayers );
		networkHandler.send( { type: "CURRENT PLAYERS" } );
		
		networkHandler.addObserver( "PLAYER JOINED", addPlayers );
		networkHandler.addObserver( "PLAYER LEFT", deletePlayer );
		networkHandler.addObserver( "START GAME", startGame );
		
		var host = $.cookie( "host" ),
			join = $.cookie( "join" ),
			game;
		
		if ( host ) {
			game = JSON.parse( host );
			networkHandler.send( { type: "HOST", game: game } );
		} else {
			game = JSON.parse( join );
			networkHandler.send( { type: "JOIN", game: game } );
		}

		var player = $.cookie( "player" );
		if ( player ) {
			self.addLocalPlayer( JSON.parse( player ) );
		}
	};
	
	function addPlayers( update ) {
		if ( update.type ) {
			if ( update.type == "CURRENT PLAYERS" ) {
				domElements.playerlist.innerHTML = "";
				
				for ( var i = 0; i < update.players.length; i++ ) {
					addPlayers( update.players[ i ] );
				}
			} else if ( update.type == "PLAYER JOINED" ) {
				addPlayers( update.player );
			}
		} else {
			var player = update;
			
			var liItem = document.createElement( "li" );
			liItem.value = player.id;
			liItem.className = (i % 2 == 0) ? "even" : "odd";
			
			var a = document.createElement( "a" );
			// a.href = "JavaScript: lobby.join( '" + game.id + "' );";
			a.innerHTML = player.name;
			
			liItem.appendChild( a );
			
			domElements.playerlist.appendChild( liItem );
		}
	}
	
	function deletePlayer( update ) {
		var items = domElements.playerlist.getElementsByTagName( "li" );
		for ( var i = 0; i < items.length; i++ ) {
			var item = items[ i ];
			if ( item.value == update.player.id ) {
				domElements.playerlist.removeChild( item );
				break;
			}
		}
	}
	
	this.addLocalPlayer = function( player ) {
		loadPlayer( player ,
			function( ) {
				// TODO: CREATE LOCAL CURVE
				
				addPlayers(
					{
						name: player.name,
						id: player.id
					}
				);
			}
		);
	};
	
	this.voteStart = function( ) {
		networkHandler.send( { type: "START" } );
	};
	
	function startGame( update ) {
		for ( var i = 0; i < localCurves.length; i++ ) {
			var randomPos = new Point( getRandom( 1, 500, true ), getRandom( 1, 500, true ) );
			var randomDir = new Vector( getRandom( -1, 1, false ), getRandom( -1, 1, false ) ).normalize();
			game.addCurve( new Curve( locals[i].color, randomPos, randomDir, locals[i].keys ) );
		}
		
		game.world.start( );
	}
	
	init( );
}

function loadPlayer( player, callback ) {
	if ( !player.name ) {
		self.nickname = prompt( "Choose a nickname." );
	}
	if ( !player.color ) {
		self.color = prompt( "Choose a color." );
	}
	
	if ( player.keys.left == -1 || player.keys.right == -1 ) {
		alert( "Press left-key." );
		document.onkeydown = function( e ) {
			if ( player.keys.left == -1 ) {
				player.keys.left = getKeyCode( e );
				alert( "Press right-key." );
			} else {
				player.keys.right = getKeyCode( e );
				document.onkeydown = null;
			}
		};
		
		var waitForKeys = window.setInterval( function( ) {
			if ( player.keys.left != -1 && player.keys.right != -1 ) {
				window.clearTimeout( waitForKeys );
				callback( player );
			}
		}, 100 );
	} else {
		callback( self );
	}
}