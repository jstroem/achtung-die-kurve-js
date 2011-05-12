/**
 * @author Jesper & Christoffer
 * @classDescription Represents a Vector in R2.
 * @constructor { int } x, { int } y
 * @methods
 * 		void turnDegrees ( int theta )
 */
function Vector ( x, y ) {
	var self = this; // To be used in private-methods.
	
	this.x = x,
	this.y = y;
	
	/**
	 * @public
	 * @method Turns the curve theta radians using the rotation matrix of R2.
	 * @return void
	 * @param { int } theta
	 */
	this.turnRadians = function ( theta ) {
		var newX = this.x * Math.cos( theta ) + this.y * Math.sin ( theta );
		this.y = this.y * Math.cos( theta ) - this.x * Math.sin ( theta );
		this.x = newX;
	};
};