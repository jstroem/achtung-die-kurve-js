/**
 * @author Jesper & Christoffer
 * @classDescription Represents a Curve-game.
 * @constructor { HTMLCanvasElement } canvasDOM
 * @methods
 * 		void addCurve ( Curve curve )
 */
function Game ( canvasDOM, curves, networkHandler ) {
	var self = this;
	
	this.drawer = new Drawer( canvasDOM ),
	this.world = new World ( this, networkHandler ),
	this.curves = curves;
	
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
			this.curves[ i ].isDead = true;
			this.curves.splice( i, 1 );
		}
	};
};