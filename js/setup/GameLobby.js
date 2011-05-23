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
		localPlayers = [],
		networkHandler;
	
	function init( ) {
		networkHandler = new NetworkHandler( );
		
		networkHandler.addObserver( "PLAYER JOINED", addPlayers );
		networkHandler.addObserver( "PLAYER LEFT", deletePlayer );
		networkHandler.addObserver( "START GAME", startGame );
		
		var host = $.cookie( "host" ),
			join = $.cookie( "join" ),
			player = JSON.parse( $.cookie( "player" ) ),
			game;
		
		self.addLocalPlayer( player,
			function( ) {
				if ( host ) {
					networkHandler.send( { type: "HOST", game: JSON.parse( host ), player: player } );
					$.cookie( "host", null );
				} else {
					networkHandler.send( { type: "JOIN", game: JSON.parse( join ), player: player } );
					$.cookie( "join", null );
		
					networkHandler.addObserver( "CURRENT PLAYERS", addPlayers );
					networkHandler.send( { type: "CURRENT PLAYERS" } );
				}
			}
		);
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
	
	this.addLocalPlayer = function( player, callback ) {
		loadPlayer( player ,
			function( ) {
				// TODO: CREATE LOCAL CURVE
				localPlayers.push( player );
				
				addPlayers( player );
				
				if ( typeof callback == "function" ) {
					callback( player );
				}
			}
		);
	};
	
	this.voteStart = function( ) {
		networkHandler.send( { type: "START" } );
	};
	
	function startGame( ) {
		var curves = [];
		for ( var i = 0; i < localPlayers.length; i++ ) {
			var randomPos = new Point( getRandom( 21, 480, true ), getRandom( 21, 480, true ) );
			var randomDir = new Vector( getRandom( -1, 1, false ), getRandom( -1, 1, false ) ).normalize();
			curves.push ( new Curve( localPlayers[ i ].color, randomPos, randomDir, localPlayers[ i ].keys ) );
		}
		
		new Game( domElements.game, curves, networkHandler ).world.start( );
	}
	
	init( );
}

function loadPlayer( player, callback ) {
	if ( !player.name ) {
		player.nickname = prompt( "Choose a nickname." );
	}
	if ( !player.color ) {
		player.color = prompt( "Choose a color." );
	}
	if ( !player.keys ) {
		player.keys =
			{
				left: -1,
				right: -1
			};
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