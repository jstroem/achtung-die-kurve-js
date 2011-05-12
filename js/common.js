function addEvent ( element, eventName, func, useCapture ) {
	if ( element.addEventListener ) { 
		element.addEventListener( eventName, func, useCapture ); 
		return true; 
	} else if ( element.attachEvent ) { 
		var r = element.attachEvent( 'on' + eventName, func ); 
		return r;
	} else {
		element[ 'on' + eventName ] = func;
	}
}