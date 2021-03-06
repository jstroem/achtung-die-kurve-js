/**
 * @author Jesper & Christoffer
 * @classDescription Represents a Curve.
 * @constructor { String } color, { Point } pos, { left, right } keys
 * @methods
 * 		-
 */
function Curve( color, keys ) {
	var self = this, // To be used in private-methods.
		dirOptions = {
			turnLeft: false,
			turnRight: false,
			turningRadians: 0.05
		};
	
	this.color = color;
	this.pos, this.lastpos, this.dir, this.isDead, this.isInvisible;
	
	/**
	 * @private
	 * @method Initializes the curve, including event handlers. Called on construction.
	 * @return void
	 */
	function init( ) {
		addEvent( document, 'keydown', function( e ) {
			keyPressHandler( true, getKeyCode( e ) );
		}, false );
		addEvent( document, 'keyup', function( e ) {
			keyPressHandler( false, getKeyCode( e ) );
		}, false );
	};
	
	this.refresh = function( pos, dir ) {
		this.pos = pos;
		this.lastpos = new Point( pos.row, pos.col );
		this.dir = dir;

		this.isDead = false;
		this.isInvisible = true;
		
		toggleInvisibility();
	};
	
	function toggleInvisibility( ) {
		if ( !self.isDead ) {
			self.isInvisible = !self.isInvisible;
			
			var delay = ( self.isInvisible ) ? getRandom( 125, 250, true ) : getRandom( 3000, 7000, true ) ;
			window.setTimeout( toggleInvisibility, delay );
		}
	}
	
	/**
	 * @private
	 * @method Handles user interaction with curve.
	 * @param { boolean } down, { int } keyCode
	 * @return void
	 */
	function keyPressHandler( down, keyCode ) {
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
	this.move = function( ) {
		this.lastpos.row = this.pos.row;
		this.lastpos.col = this.pos.col;
		
		if ( dirOptions.turnLeft ) {
			this.dir.turnRadians( -dirOptions.turningRadians );
		}
		if ( dirOptions.turnRight ) {
			this.dir.turnRadians( dirOptions.turningRadians );
		}
		
		this.pos.row -= this.dir.y; // - because canvas upper left corner is (0, 0)
		this.pos.col += this.dir.x;
	};
	
	init ( );
};