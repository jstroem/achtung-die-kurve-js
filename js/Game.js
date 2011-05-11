/**
 * @author Jesper
 * @classDescription
 * 		Constructor { canvasDOM } c
 */
function Game ( c ) {
	var world, canvas;
	
	function start ( c ) {
		canvas = c;
		world = new World( window, c );
	}
	
	start ( c );
};
