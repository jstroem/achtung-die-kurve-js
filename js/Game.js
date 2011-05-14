/**
 * @author Jesper & Christoffer
 * @classDescription Represents a Curve-game.
 * @constructor { HTMLCanvasElement } canvasDOM
 * @methods
 * 		void addCurve ( Curve curve )
 */
function Game ( canvasDOM ) {
	var self   = this, // To be used in private-methods.
		world  = new World ( this, canvasDOM );
	
	this.curves = new Array ( ); // No need for a specific data-structure so far.
	
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
			this.curves.splice( i, 1 );
		}
	};
};