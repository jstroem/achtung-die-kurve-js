/**
 * @author Jesper & Christoffer
 * @classDescription Represents a Curve-game.
 * @constructor { HTMLCanvasElement } canvasDOM
 * @methods
 * 		void addCurve ( Curve curve )
 */
function Game ( canvasDOM, port ) {
	var self = this; // To be used in private-methods.;
	
	this.world = new World ( this, canvasDOM ),
	this.curves = [], // No need for a specific data-structure so far.
	this.networkHandler;
	
	/**
	 * @private
	 * @method Initializes the Game.
	 * @return void
	 */
	function init( ) {
		if (port) {
			self.networkHandler = new NetworkHandler( self, port );
		} else {
			self.world.start( );
		}
	}
	
	/**
	 * @public
	 * @method Adds a curve to the world.
	 * @return void
	 * @param { Curve } curve
	 */
	this.addCurve = function ( curve ) {
		this.curves.push ( curve );
	};
	
	/**
	 * @method Kills the curve, i.e. stops it
	 * @param curve, the curve to kill
	 * @return void
	 */
	this.killCurve = function ( curve, i ) {
		if ( curve != null ) {
			for ( c in this.curves ) {
				if ( curve == this.curves[ c ] ) {
					i = c;
					break;
				}
			}
		}
		if ( i != null ) {
			this.curves[ i ].isKilled = true;
			this.curves.splice( i, 1 );
		}
	};
	
	init( );
};