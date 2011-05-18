/**
 * @author Jesper & Christoffer
 * @classDescription Represents a Curve-game.
 * @constructor { HTMLCanvasElement } canvasDOM
 * @methods
 * 		void addCurve ( Curve curve )
 */
function Game ( canvasDOM, singleplayer ) {
	var self = this;
	
	this.drawer = new Drawer( canvasDOM );
	this.world = new World ( this ),
	this.curves = [],
	this.networkHandler;
	
	/**
	 * @private
	 * @method Initializes the Game.
	 * @return void
	 */
	function init( ) {
		if ( !singleplayer ) {
			self.networkHandler = new NetworkHandler( self );
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
			this.curves[ i ].isDead = true;
			this.curves.splice( i, 1 );
		}
	};
	
	init( );
};