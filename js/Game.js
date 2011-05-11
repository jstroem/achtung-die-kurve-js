/**
 * @author Jesper
 * @classDescription
 * 		Constructor {  HTMLCanvasElement } c
 */
function Game ( c ) {
	var world, canvas;
	
	function start ( c ) {
		canvas = c;
		world = new World( c );
	}
	
	start ( c );
};
