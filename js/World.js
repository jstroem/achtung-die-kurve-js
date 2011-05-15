/**
 * @author Jesper & Christoffer
 * @classDescription Represents the World of the Game (handles the tiles). 
 * @constructor { HTMLCanvasElement } canvasDOM
 * @methods
 * 		boolean isTileBlocked ( int row, int col )
 * 		void blockTile ( int row, int col, Curve curve )	
 */

function World ( game ) {
	var self = this, // To be used in private-methods.
		options = {
			height: 500,
			width: 500,
			curveRadius: 4,
			background: "#000000",
			fps: 60
		},
		blockedTiles = new Array( );
	
	/**
	 * @private
	 * @method Initializes the method. Is called when the world is initialized.
	 * @return void
	 * @param {  HTMLCanvasElement } c 
	 */
	function init ( ) {
		
		// Initialize data structures
		for ( var i = 0; i < options.height; i++ ) {
			blockedTiles.push( new Array( ) ); // for each pixel in height: add array for a row
		}
		
		// Initialize DOM
		canvasDOM.height = options.height;
		canvasDOM.width = options.width;
		
		// Draw background
		game.drawer.drawRectangle( new Point( options.height / 2, options.width / 2 ), options.width, options.height, options.background );
	};
	
	this.start = function( ) {
		window.setInterval( run, 1000 / options.fps );
	};
	
	/** 
	 * @private
	 * @method Is run on every redraw.
	 * @return void
	 */
	function run ( ) {
		var curvesToKill = new Array();
		
		// Draw background
		for ( i in game.curves ) {
			var curve = game.curves[ i ];
			curve.move( );
			
			if ( !isTileBlocked( curve.pos, curve.dir ) ) {
				blockTile( curve.pos );
			} else if ( !curve.pos.equals( curve.lastpos, false ) ) {
				// Draw a rectangle
				game.drawer.drawRectangle( curve.pos, options.curveRadius + 4, options.curveRadius + 4, "white" );
				
				// Kill
				curvesToKill.push( i );
			}
			
			// Draw a circle
			if ( !curve.isDead ) {
				game.drawer.drawCircle( curve.lastpos, options.curveRadius, curve.color );
				game.drawer.drawCircle( curve.pos, options.curveRadius, "yellow" );
			}
			
			// Propagate updates
			if ( game.networkHandler ) {
				game.networkHandler.sendGameUpdate( curve );
			}
		}
		
		for (var i = curvesToKill.length - 1; i >= 0; i--) {
			// Note: Important to decrement i
			game.killCurve( null, curvesToKill[ i ] );
		}
	};
	
	/**
	 * @private
	 * @method checks whether a given position (row, col) is within the bounds of the game
	 * @return boolean
	 * @param { Point } pos, the position (row, col) to check
	 */
	function isWithinBounds ( pos ) {
		return pos.row > 0 && pos.row < options.width && pos.col > 0 && pos.col < options.height;
	}
	
	/**
	 * @private
	 * @method isTileBlocked should check if a tile is occupied by another object.
	 * @return boolean
	 * @param { Point } pos, the position (row, col) to check
	 * @param { Vector } dir, the curve's direction-vector
	 */
	function isTileBlocked ( pos, dir ) {
		if ( isWithinBounds ( pos ) ) {
			var perimeter = 2 * Math.PI * options.curveRadius,
				diameter = 2 * options.curveRadius,
				theta = -Math.PI / 2, 
				testDir, testPos, i;
			
			for ( i = 0; i < perimeter; i++)  {
				theta += Math.PI / perimeter;
				testDir = new Vector( dir.x, dir.y ).multiply( diameter ).turnRadians( theta );
				testPos = new Point( Math.round( pos.row - testDir.y ), Math.round( pos.col + testDir.x ) );
				try {
					if (blockedTiles[ testPos.row - 1 ][ testPos.col - 1] == true) {
						return true;
					} 
				} catch (err) {
				}
			}
			return false;
		} else {
			return true;
		}
	}
	
	/**
	 * @private
	 * @method blockTile should block a tile if it is possible.
	 * @return void
	 * @param { Point } pos, the position (row, col) to block
	 */
	function blockTile( pos ) {
		blockedTiles[ Math.round( pos.row ) - 1 ][ Math.round( pos.col ) - 1] = true;
	}
	
	init( );
};