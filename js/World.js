/**
 * @author Jesper
 * @classDescription
 * 		Constructor ( { HTMLCanvasElement } c )
 * 		Methods:
 * 			isTileBlocked ( int row, int col )
 * 			blockTile ( int row, int col, Curve c )	
 */

function World ( c ) {
	var options = {
		height: 500,
		width: 500,
		rows: 250,
		cols: 250,
		background: "#000000"
	}, context, canvas;
	/**
	 * @method init the method to be called when the world is initialized.
	 * @private
	 * @return void
	 * @param {  HTMLCanvasElement } c 
	 */
	this.init = function ( c ) {
		canvas = c;
		context = c.getContext( "2d" );
		
		canvas.height = options.height;
		canvas.width = options.width;
		var self = this;
		console.log(self);
		window.setInterval( self.run, 1000 / 60 );
	};
	
	/** 
	 * @method run the function which is called on every repainting.
	 * @private;
	 * @return void
	 */
	this.run = function()  {
		
		//Draw background
		 context.fillStyle = options.background;
		 context.fillRect( 0, 0, options.height, options.width );
	};
	
	/**
	 * @method isTileBlocked should check if a tile is occupied by another object.
	 * @return boolean
	 * @param row the row to check
	 * @param col the col to check
	 */
	this.isTileBlocked = function ( row, col ) {
		return false;
	};
	
	/**
	 * @method blockTile should block a tile if it is possible.
	 * @return void
	 * @param row the row to block
	 * @param col the col to block
	 * @param { curve } c the curve to block the tile with.
	 */
	this.blockTile = function ( row, col, c ) {
		
	};
	
	this.init( c );
};