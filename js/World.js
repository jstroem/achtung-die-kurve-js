/**
 * @author Jesper & Christoffer
 * @classDescription Represents the World of the Game (handles the tiles). 
 * @constructor { HTMLCanvasElement } canvasDOM
 * @methods
 * 		boolean isTileBlocked ( int row, int col )
 * 		void blockTile ( int row, int col, Curve curve )	
 */

function World ( game, canvasDOM ) {
	var self    = this, // To be used in private-methods.
		context = canvasDOM.getContext( "2d" ),
		options = {
			height: 500,
			width: 500,
			curveRadius: 1,
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
		context.fillStyle = options.background;
		context.fillRect( 0, 0, options.height, options.width );
		
		window.setInterval( run, 1000 / options.fps );
		window.setInterval( // TEST DATA-STRUCTURE
			function() {
				testDataStructure( options, blockedTiles );
			}
			, 2000
		);
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
			
			var pos = curve.move( options.curveRadius );
			if ( !isTileBlocked( pos ) ) {
				blockTile( pos );
			} else {
				// Draw a rectangle
				var rectSize = options.curveRadius + 4;
				
				context.beginPath( );
				context.fillStyle = "#ffffff";
				context.fillRect( pos.col - rectSize / 2, pos.row - rectSize / 2, rectSize, rectSize );  
				context.closePath( );
				context.fill( );
				
				// Kill
				curvesToKill.push( curve );
				
				continue;
			}
			
			// Draw a circle
			context.beginPath( );
			context.fillStyle = curve.color;
			context.arc( pos.col, pos.row, options.curveRadius, 0, Math.PI * 2, true ); 
			context.closePath( );
			context.fill( );
		}
		
		for (var i = curvesToKill.length - 1; i >= 0; i--) {
			// Note: Important to decrement i
			game.killCurve( null, i );
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
	 */
	function isTileBlocked ( pos ) {
		if ( isWithinBounds ( pos ) ) {
			try {
				return blockedTiles[ Math.round(pos.row) - 1 ][ Math.round(pos.col) - 1];
			} catch (err) {
				// blockedTiles not initialized at this place - i.e. the pos is NOT blocked
				return false;
			}
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
	function blockTile ( pos ) {
		blockedTiles[ Math.round(pos.row) - 1 ][ Math.round(pos.col) - 1] = true;
	}
	
	init( );
};

function testDataStructure(options, ds) {
	var canvasDOM2 = document.getElementById( "gameTest" );
	var context2 = canvasDOM2.getContext( "2d" );
	
	// Initialize DOM
	canvasDOM2.width = options.width;
	canvasDOM2.height = options.height;
	
	// Draw background
	context2.fillStyle = options.background;
	context2.fillRect( 0, 0, options.height, options.width );
	
	for ( var r = 0; r < options.height; r++ ) {
		for ( var c = 0; c < options.width; c++ ) {
			if ( ds[ r ] && ds[ r ][ c ] && ds[ r ][ c ] == true ) {
				context2.beginPath( );
				context2.fillStyle = "#ffffff";
				context2.arc( c, r, options.curveRadius, 0, Math.PI * 2, true ); 
				context2.closePath( );
				context2.fill( );
			}
		}
	}
}