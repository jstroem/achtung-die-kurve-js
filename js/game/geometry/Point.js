/**
 * @author Jesper & Christoffer
 * @classDescription Represents a Point.
 * @constructor { int } row, { int } col
 */
function Point ( row, col ) {
	this.row = row,
	this.col = col;
	
	/**
	 * @method Checks whether to points are equal.
	 * @param exact, if false the check is based on the closets integer.
	 * @return boolean
	 * @param { Point } point
	 * @param { boolean } exact
	 */
	this.equals = function ( point, exact ) {
		if ( exact ) {
			return this.row == point.row && this.col == point.col;
		} else {
			return Math.round( this.row ) == Math.round( point.row ) && Math.round( this.col ) == Math.round ( point.col );
		}
	};
}