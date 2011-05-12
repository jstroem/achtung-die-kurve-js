/**
 * @author Jesper & Christoffer
 * @classDescription An event handler that makes it possible to assign multiple events to for instance window.onload.
 * @constructor { String } color, { Vector } dir, { left, right } keys
 * @methods
 * 		-
 */
function EventHandler () {
	var self   = this,
		events = new Array( );
	
	/*
	 * @private
	 * @method Initializes the event-handler with some predefined event-categories.
	 */
	function init ( ) {
		self.addEventCategory( "window.onload" );
		self.addEventCategory( "document.onkeydown" );
		self.addEventCategory( "document.onkeyup" );
		
		window.onload = function ( ) {
			self.executeEvent( "window.onload" );
		};
		document.onkeydown = function ( ) {
			self.executeEvent( "document.onkeydown" );
		};
		document.onkeyup = function ( ) {
			self.executeEvent( "document.onkeyup" );
		};
	}
	
	/*
	 * @public
	 * @method Adds an event-category.
	 * @param { String } eventName
	 */
	this.addEventCategory = function ( eventName ) {
		events[ eventName ] = new Array( );
	};
	
	/*
	 * @public
	 * @method Adds an event to a predefined event-name.
	 * @param { String } eventName
	 * @param { function } func
	 */
	this.addEvent = function ( eventName, func ) {
		events[eventName].push( func );
	};
	
	/*
	 * @public
	 * @method Executes the functions associated to a event-name.
	 * @param { String } eventName
	 */
	this.executeEvent = function ( eventName ) {
		var theEvents = events[ eventName ];
		for ( i in theEvents ) {
			theEvents[ i ]();
		}
	};
	
	init ( );
}

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