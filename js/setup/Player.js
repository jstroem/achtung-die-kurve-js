function Player( nickname, color, leftKey, rightKey ) {
	var self = this;
	
	this.nickname = nickname,
	this.color = color,
	this.keys = {
		left: leftKey || -1,
		right: rightKey || -1
	};
	
	this.load = function( callback ) {
		if ( !self.nickname ) {
			self.nickname = prompt( "Choose a nickname." );
		}
		if ( !self.color ) {
			self.color = prompt( "Choose a color." );
		}
		
		if ( self.keys.left == -1 || self.keys.right == -1 ) {
			alert( "Press left-key." );
			document.onkeydown = function( e ) {
				if ( self.keys.left == -1 ) {
					self.keys.left = getKeyCode( e );
					alert( "Press right-key." );
				} else {
					self.keys.right = getKeyCode( e );
					document.onkeydown = null;
				}
			};
			
			var waitForKeys = window.setInterval( function( ) {
				if ( self.keys.left != -1 && self.keys.right != -1 ) {
					window.clearTimeout( waitForKeys );
					callback( self );
				}
			}, 100 );
		} else {
			callback( self );
		}
	};
}