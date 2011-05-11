/**
 * @author Jesper
 * @classDescription
 * 		Constructor {  HTMLCanvasElement } cC
 */
function Game ( c ) {
	var world, canvas;
	
	function start ( c ) {
		canvas = c;
		world = new World( c );
	}
	
	start ( c );
};
