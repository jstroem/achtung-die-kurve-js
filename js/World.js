/**
 * @author Jesper & Christoffer
 * @classDescription Represents the World of the Game (handles the tiles). 
 * @constructor { HTMLCanvasElement } canvasDOM
 * @methods
 * 		boolean isTileBlocked ( int row, int col )
 * 		void blockTile ( int row, int col, Curve curve )	
 */

function World ( game, canvasDOM ) {
	var self = this, // To be used in private-methods.
		context = canvasDOM.getContext( "2d" ),
		options = {
			height: 500,
			width: 500,
			curveRadio: 2,
			background: "#000000",
			fps: 60
		},
		pixelArray = [];
	
	/**
	 * @private
	 * @method Initializes the method. Is called when the world is initialized.
	 * @return void
	 * @param {  HTMLCanvasElement } c 
	 */
	function init ( ) {
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
		var curve = null;
		//call each curve to make them move.
		for ( i in game.curves ) {
			curve = game.curves[i];
			
			curve.move();
			
			// Draw a circle
			context.beginPath();
			context.fillStyle = curve.color;
			context.arc( curve.pos.x, curve.pos.y, options.curveRadio, 0, Math.PI * options.curveRadio, true ); 
			context.closePath();
			context.fill();
		}
	};
	
	/**
	 * @public
	 * @method isTileBlocked should check if a tile is occupied by another object.
	 * @return boolean
	 * @param row the row to check
	 * @param col the col to check
	 */
	this.isTileBlocked = function ( row, col ) {
		return false;
	};
	
	/**
	 * @public
	 * @method blockTile should block a tile if it is possible.
	 * @return void
	 * @param row the row to block
	 * @param col the col to block
	 * @param { curve } curve the curve to block the tile with.
	 */
	this.blockTile = function ( row, col, curve ) {
		
	};
	
	init( );
};