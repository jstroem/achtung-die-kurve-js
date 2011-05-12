/**
 * @author Jesper & Christoffer
 * @classDescription Represents a Curve.
 * @constructor { String } color, { Vector } dir
 * @methods
 * 		-
 */
function Curve ( color, pos ) {
	var self   = this, // To be used in private-methods.
		options = {
			turningRadians: 0.1
		};
	
	this.color = color,
	this.pos = pos,
	this.dir = new Vector( 0, 1 );
	
	/**
	 * @private
	 * @method Initializes the curve, including event handlers. Called on construction.
	 * @return void
	 */
	function init ( ) {
		document.onkeypress = keyPressHandler;
	};
	
	/**
	 * @private
	 * @method Handles user interaction with curve.
	 * @param e
	 * @return void
	 */
	function keyPressHandler ( e ) {
		var keyCode = getKeyCode( e );
		if ( keyCode == 97 ) { // 97 = A
			self.dir.turnRadians( -options.turningRadians );
		} else if ( keyCode == 100 ) { // 100 = D
			self.dir.turnRadians( options.turningRadians );
		}
	};
	
	/**
	 * @private
	 * @method Is run on every redraw.
	 * @return void
	 */
	this.move = function ( ) {
		this.pos.x += this.dir.x;
		this.pos.y -= this.dir.y; // - because canvas upper left corner is (0, 0)
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