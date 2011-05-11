/**
 * @author Jesper
 * @classDescription
 * 		Constructor ( { window } w, { canvasDOM } c )
 * 		Methods:
 * 			isTileBlocked ( int row, int col )
 * 			blockTile ( int row, int col, Curve c )	
 */

function World ( w, c ) {
	/**
	 * @method init the method to be called when the world is initialized.
	 * @private
	 * @return void
	 * @param { window } w
	 * @param { canvasDOM } c
	 */
	function init ( w, c ) {
		
	};
	
	/** 
	 * @method run the function which is called on every repainting.
	 * @private;
	 * @return void
	 */
	function run ( ) { };
	
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
	
	init( w, c );
};