/**
 * @author Jesper & Christoffer
 * @classDescription Represents a Curve-game.
 * @constructor { HTMLCanvasElement } canvasDOM
 * @methods
 * 		void addCurve ( Curve curve )
 */
function Game ( canvasDOM, networkHandler ) {
	var self = this,
		options =
			{
				background: "#000000",
				fps: 60
			},
		interval,
		curves = [];
	
	this.drawer = new Drawer( canvasDOM ),
	this.world = new World ( this, networkHandler ),
	this.events = new Events( ),
	this.curves;
	
	this.addCurve = function( curve ) {
		curves.push( curve );
	};
	
	/**
	 * @method Kills the curve, i.e. stops it
	 * @param curve, the curve to kill
	 * @return void
	 */
	this.killCurve = function( curve, i ) {
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
	
	// Note: self must be used instead of this in the function, since it is used as an event listener
	this.start = function( ) {
		self.events.notifyListeners( "START" );
		
		interval = window.setInterval( self.world.run, 1000 / options.fps );
	};
	
	// Note: self must be used instead of this in the function, since it is used as an event listener
	this.pause = function( ) {
		self.events.notifyListeners( "PAUSE" );
		
		window.clearInterval( interval );
	};
	
	// Note: self must be used instead of this in the function, since it is used as an event listener
	this.restart = function( ) {
		self.events.notifyListeners( "RESTART" );
		
		self.drawer.setBackground( options.background );
		
		// Load curves
		self.curves = [];
		for ( var i = 0; i < curves.length; i++ ) {
			self.curves.push( curves[ i ] );
		}
		
		// Load tiles
		self.world.refresh( );
		
		// Start calling run
		interval = window.setInterval( self.world.run, 1000 / options.fps );
	};
	
	this.end = function( ) {
		self.events.notifyListeners( "END" );
		
		window.clearInterval( interval );
		alert( "GAME ENDED" );
	};
};