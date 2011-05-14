/**
 * @author Jesper & Christoffer
 * @classDescription Represents a Curve.
 * @constructor { String } color, { Point } pos, { left, right } keys
 * @methods
 * 		-
 */
function Curve ( color, pos, keys ) {
	var self = this, // To be used in private-methods.
		dirOptions = {
			currentDir: new Vector( 0, 1 ),
			turnLeft: false,
			turnRight: false,
			turningRadians: 0.1
		};
	
	this.color = color,
	this.pos   = pos;
	
	/**
	 * @private
	 * @method Initializes the curve, including event handlers. Called on construction.
	 * @return void
	 */
	function init ( ) {
		addEvent( document, 'keydown', function( e ) {
			keyPressHandler( true, getKeyCode( e ) );
		}, false );
		addEvent( document, 'keyup', function( e ) {
			keyPressHandler( false, getKeyCode( e ) );
		}, false );
	};
	
	/**
	 * @private
	 * @method Handles user interaction with curve.
	 * @param { boolean } down, { int } keyCode
	 * @return void
	 */
	function keyPressHandler ( down, keyCode ) {
		if ( keyCode == keys.left ) {
			dirOptions.turnLeft = down;
		} else if ( keyCode == keys.right ) {
			dirOptions.turnRight = down;
		}
	};
	
	/**
	 * @public
	 * @method Is run on every redraw.
	 * @return void
	 * @param { double } distance
	 */
	this.move = function ( ) {
		if ( dirOptions.turnLeft ) {
			dirOptions.currentDir.turnRadians( -dirOptions.turningRadians );
		}
		if ( dirOptions.turnRight ) {
			dirOptions.currentDir.turnRadians( dirOptions.turningRadians );
		}
		
		this.pos.row -= dirOptions.currentDir.y; // - because canvas upper left corner is (0, 0)
		this.pos.col += dirOptions.currentDir.x;
		
		return this.pos;
	};
	
	init ( );
};

function getKeyCode ( e ) {
	if ( window.event ) {
		return window.event.keyCode;
	} else if ( e ) {
		return e.which;
	}
	return null;
}