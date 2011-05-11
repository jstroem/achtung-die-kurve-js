/**
 * @author Jesper
 * @classDescription
 * 		Methods:
 *	 		run
 * 			init ( { window } w, { canvasDOM } c )
 * 			isTileBlocked ( int row, int col )
 * 			blockTile ( int row, int col, Curve c )	
 */

var World = {
	/**
	 * @method init the method to be called when the world is initialized.
	 * @return void
	 * @param { window } w
	 * @param { canvasDOM } c
	 */
	init: function( w, c ) {
		console.log("TESTING");
	},
	
	/** 
	 * @method run the function which is called on every repainting.
	 * @return void
	 */
	run: function ( ) { },
	
	/**
	 * @method isTileBlocked should check if a tile is occupied by another object.
	 * @return boolean
	 * @param row the row to check
	 * @param col the col to check
	 */
	isTileBlocked: function ( row, col ) {
		return null;
	},
	
	/**
	 * @method blockTile should block a tile if it is possible.
	 * @return void
	 * @param row the row to block
	 * @param col the col to block
	 * @param { curve } c the curve to block the tile with.
	 */
	blockTile: function( row, col, c ) {
		
	}
};