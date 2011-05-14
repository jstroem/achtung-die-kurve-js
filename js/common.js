// CANVAS

function drawCircle( pos, radius, color, context ) {
	context.beginPath( );
	context.fillStyle = color;
	context.arc( pos.col, pos.row, radius, 0, Math.PI * 2, true );
	context.closePath( );
	context.fill( );
}

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