/**
 * @author Jesper & Christoffer
 * @classDescription Represents the World of the Game (handles the tiles). 
 * @constructor { HTMLCanvasElement } canvasDOM
 * @methods
 * 		boolean isTileBlocked ( int row, int col )
 * 		void blockTile ( int row, int col, Curve curve )	
 */

function World ( game, networkHandler ) {
	var self = this, // To be used in private-methods.
		options = {
			height: 500,
			width: 500,
			curveRadius: 2
		},
		blockedTiles,
		pendingUpdates = [],
		interval;
	
	this.events;
	
	/**
	 * @private
	 * @method Initializes the method. Is called when the world is initialized.
	 * @return void
	 * @param {  HTMLCanvasElement } c 
	 */
	function init ( ) {
		
		// Initialize objects
		self.events = new Events( );
		
		// Listen to updates
		if ( networkHandler ) {
			networkHandler.addObserver( "GAME UPDATE", handlePendingUpdates );
		}
		
		// Initialize Canvas DOM
		game.drawer.setCanvasSize( options.width, options.height );
		game.drawer.setBackground( options.background );
	};
	
	this.refresh = function( ) {
		blockedTiles = [];
		for ( var i = 0; i < options.height; i++ ) {
			blockedTiles.push( [] ); // for each pixel in height: add array for a row
		}
		
		for ( var i = 0; i < game.curves.length; i++ ) {
			var randomPos = new Point( getRandom( 21, 480, true ), getRandom( 21, 480, true ) );
			var randomDir = new Vector( getRandom( -1, 1, false ), getRandom( -1, 1, false ) ).normalize();
			game.curves[ i ].refresh( randomPos, randomDir );
		}
	};
	
	/** 
	 * @private
	 * @method Is run on every redraw.
	 * @return void
	 */
	this.run = function( ) {
		if ( game.curves.length == 0 ) {
			game.end( );
			return;
		}
		
		for ( var i = 0; i < game.curves.length; i++ ) {
			var curve = game.curves[ i ];
			curve.move( );
			
			if ( !isTileBlocked( curve.pos, curve.dir ) ) {
				if ( !curve.isInvisible ) {
					blockTile( curve.pos );
				}
			} else if ( !curve.pos.equals( curve.lastpos, false ) ) {
				// Kill
				game.killCurve( null, i );
				i--;
			}
			
			// Draw
			updateCanvas( curve );
			
			// Update
			addPendingUpdate( curve );
		}
		
		propagateUpdates( );
	};
	
	function updateCanvas( curve, pos, lastpos, color, isDead ) {
		if ( curve && curve != null ) {
			if ( curve.isInvisible ) {
				return;
			}
			
			pos = curve.pos;
			lastpos = curve.lastpos;
			color = curve.color;
			isDead = curve.isDead;
		}
		
		if ( isDead ) {
			game.drawer.drawRectangle( pos, options.curveRadius + 4, options.curveRadius + 4, "white" );
		} else {
			game.drawer.drawCircle( lastpos, options.curveRadius, color );
			game.drawer.drawCircle( pos, options.curveRadius, "yellow" );
		}
	}
	
	function addPendingUpdate( curve ) {
		pendingUpdates.push(
			{
				tombstone: curve.isDead,
				pos: {
					row: curve.pos.row,
					col: curve.pos.col
				},
				lastpos: {
					row: curve.lastpos.row,
					col: curve.lastpos.col
				},
				color: curve.color
			}
		);
	}
	
	function propagateUpdates( ) {
		networkHandler.send(
			{
				type: "GAME UPDATE",
				updates: pendingUpdates
			}
		);
		pendingUpdates = [];
		
	}
	
	function handlePendingUpdates( update ) {
		if ( !update.updates ) {
			return;
		}
		
		for ( var i = 0; i < update.updates.length; i++ ) {
			var curveInfo = update.updates[ i ];
			var pos = new Point( curveInfo.pos.row, curveInfo.pos.col );
			var lastpos = new Point( curveInfo.lastpos.row, curveInfo.lastpos.col );
			
			blockTile( pos );
			updateCanvas( null, pos, lastpos, curveInfo.color, curveInfo.tombstone );
		}
	}
	
	/**
	 * @private
	 * @method checks whether a given position (row, col) is within the bounds of the game
	 * @return boolean
	 * @param { Point } pos, the position (row, col) to check
	 */
	function isWithinBounds ( pos ) {
		return pos.row > 0 && pos.row < options.width && pos.col > 0 && pos.col < options.height;
	}
	
	/**
	 * @private
	 * @method isTileBlocked should check if a tile is occupied by another object.
	 * @return boolean
	 * @param { Point } pos, the position (row, col) to check
	 * @param { Vector } dir, the curve's direction-vector
	 */
	function isTileBlocked ( pos, dir ) {
		if ( isWithinBounds ( pos ) ) {
			var perimeter = 2 * Math.PI * options.curveRadius,
				diameter = 2 * options.curveRadius,
				theta = -Math.PI / 2, 
				testDir, testPos, i;
			
			for ( i = 0; i < perimeter; i++)  {
				theta += Math.PI / perimeter;
				testDir = new Vector( dir.x, dir.y ).multiply( diameter ).turnRadians( theta );
				testPos = new Point( Math.round( pos.row - testDir.y ), Math.round( pos.col + testDir.x ) );
				try {
					if ( blockedTiles[ testPos.row - 1 ][ testPos.col - 1 ] == true ) {
						return true;
					} 
				} catch (err) {
				}
			}
			return false;
		} else {
			return true;
		}
	}
	
	/**
	 * @private
	 * @method blockTile should block a tile if it is possible.
	 * @return void
	 * @param { Point } pos, the position (row, col) to block
	 */
	function blockTile( pos ) {
		blockedTiles[ Math.round( pos.row ) - 1 ][ Math.round( pos.col ) - 1 ] = true;
	}
	
	init( );
};