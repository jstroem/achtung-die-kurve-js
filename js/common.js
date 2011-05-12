function addEvent ( element, eventName, func, useCapture ) {
	if ( element.addEventListener ) { 
		element.addEventListener( eventName, func, useCapture ); 
		return true; 
	} else if ( element.attachEvent ) { 
		return element.attachEvent( 'on' + eventName, func );
	} else {
		element[ 'on' + eventName ] = func;
	}
}