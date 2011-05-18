var selectedGameItem = null;

addEvent( window, 'load', function() {
	var gameItems = document.getElementById( "gamelist" ).getElementsByTagName( "li" );
	
	var i;
	for ( i = 0; i < gameItems.length; i++ ) {
		gameItems[i].onclick = function() {
			if ( selectedGameItem ) {
				selectedGameItem.style.background = "";
			}
			this.style.background = "white";
			selectedGameItem = this;
		};
	}
}, false );

// JOIN

function JoinGame( ) {
	if ( selectedGameItem ) {
		alert( "Joining game." );
	} else {
		alert( "No game selected." );
	}
}

// HOST

var pg = null;

function ToggleSingleplayer( singleplayer ) {
	document.getElementById( "multiplayer_options" ).style.display = ( singleplayer ) ? "none" : "block";
}

function HostGame( ) {
	var singleplayer = document.getElementById( "field_options_singleplayer" ).checked;
	pg = new PreGame( singleplayer );
	
	var nickname = document.getElementById( "field_name_nick" ).value;
	pg.addLocalPlayer( new Player( nickname ) );
	
	pg.addObserver( "NEW_LOCAL_PLAYER", NewPlayer );
}

function NewPlayer( player ) {
	var playerlist = document.getElementById( "playerlist" );
	
	var newItem = document.createElement( "li" );
	newItem.className = ( playerlist.getElementsByTagName("li").length % 2 == 0 ) ? "even" : "odd";
	newItem.innerHTML = '<a href="#">' + player.nickname + '</a>';
	
	playerlist.appendChild( newItem );
}
