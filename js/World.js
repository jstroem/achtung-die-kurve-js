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
			pxPerTile: 2,
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
	};
	
	/** 
	 * @private
	 * @method Is run on every redraw.
	 * @return void
	 */
	function run ( ) {
		
		// Draw background
		for ( i in game.curves ) {
			var curve = game.curves[i];
			
			var pos = curve.move();
			if (!isTileBlocked(pos)) {
				blockTile(pos);
			} else {
				alert("BLOCKED"); // TO DO: Errors with the blocked, because integers are too grain
			}
			
			// Draw a circle
			context.beginPath();
			context.fillStyle = curve.color;
			context.arc( pos.col, pos.row, 2, 0, Math.PI * 2, true ); 
			context.closePath();
			context.fill();
		}
	};
	
	/**
	 * @public
	 * @method isTileBlocked should check if a tile is occupied by another object.
	 * @return boolean
	 * @param { Point } pos, the position (row, col) to check
	 */
	function isTileBlocked ( pos ) {
		return blockedTiles[ pos.row - 1 ][ pos.col - 1];
	}
	
	/**
	 * @private
	 * @method blockTile should block a tile if it is possible.
	 * @return void
	 * @param { Point } pos, the position (row, col) to block
	 */
	function blockTile ( pos ) {
		blockedTiles[ pos.row - 1 ][ pos.col - 1] = true;
	}
	
	init( );
};