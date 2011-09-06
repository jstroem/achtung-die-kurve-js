function Drawer( canvasDOM ) {
	var context = canvasDOM.getContext( "2d" );
	
	this.setCanvasSize = function ( width, height ) {
		canvasDOM.width = width;
		canvasDOM.height = height;
	};
	
	this.drawCircle = function( pos, radius, color ) {
		context.beginPath( );
		context.fillStyle = color;
		context.arc( pos.col, pos.row, radius, 0, Math.PI * 2, true );
		context.fill( );
		context.closePath( );
	};

	this.drawRectangle = function( pos, width, height, color ) {
		context.fillStyle = color;
		context.fillRect( pos.col - width / 2, pos.row - height / 2, width, height );
	};
	
	this.setBackground = function ( background ) {
		context.fillStyle = background;
		context.fillRect( 0, 0, canvasDOM.width, canvasDOM.height );
	}
	
	this.clearCanvas = function ( ) {
		context.clearRect( 0, 0, canvasDOM.width, canvasDOM.height );
	}
}