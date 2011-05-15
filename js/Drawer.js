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
		context.closePath( );
		context.fill( );
	};

	this.drawRectangle = function( pos, width, height, color ) {
		context.beginPath( );
		context.fillStyle = color;
		context.fillRect( pos.col - width / 2, pos.row - height / 2, width, height );  
		context.closePath( );
		context.fill( );
	};
}