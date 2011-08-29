// EVENT

function addEvent( element, eventName, func, useCapture ) {
	if ( element.addEventListener ) { 
		element.addEventListener( eventName, func, useCapture ); 
		return true; 
	} else if ( element.attachEvent ) { 
		return element.attachEvent( 'on' + eventName, func );
	} else {
		element[ 'on' + eventName ] = func;
	}
}

// USER INTERACTION

function getKeyCode ( e ) {
	if ( window.event ) {
		return window.event.keyCode;
	} else if ( e ) {
		return e.which;
	}
	return null;
}

// OTHER

function getRandom( from, to, integer ) {
	var rnd = Math.random() * ( to - from ) + from;
	if ( integer ) {
		return Math.floor( rnd );
	}
	return rnd;
}