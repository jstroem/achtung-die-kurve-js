/**
 * @author Jesper
 */
var Game = {
	world: null,
	canvas: null,
	
	start: function ( c ) {
		this.canvas = c;
		var world = new World( );
		world.init ( window, c );
		this.world = world;
	}
};
