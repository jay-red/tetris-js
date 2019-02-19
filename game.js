function blockify( blockStr, letter ) {
	block = [];
	l = Math.sqrt( blockStr.length );
	for( var row = 0; row < l; row++ ) {
		block.push( [] );
		for( var col = 0; col < l; col++ ) {
			if( parseInt( blockStr.charAt( row * l + col ) ) ) {
				block[ row ].push( letter );
			} else {
				block[ row ].push( "0" );
			}
		}
	}
	return block;
}

function rotate( matrix ) {
	rotated = []
	for( var col = 0; col < matrix[ 0 ].length; col++ ) {
		rotated.push( [] );
		for( var row = matrix.length - 1; row >= 0; row-- ) {
			rotated[ col ].push( matrix[ row ][ col ] );
		}
	}
	return rotated;
}

function rotations( matrix ) {
	rots = [ matrix ];
	for( var i = 1; i < 4; i++ ) {
		rots.push( rotate( rots[ i - 1 ] ) );
	}
	return rots;
}

var BLOCK_I = rotations( blockify( "0000111100000000", "I" ) ),
	BLOCK_J = rotations( blockify( "100111000", "J" ) ),
	BLOCK_L = rotations( blockify( "001111000", "L" ) ),
	BLOCK_O = rotations( blockify( "1111", "O" ) ),
	BLOCK_S = rotations( blockify( "011110000", "S" ) ),
	BLOCK_T = rotations( blockify( "010111000", "T" ) ),
	BLOCK_Z = rotations( blockify( "110011000", "Z" ) ),
	WIDTH = 10,
	HEIGHT = 20,
	BLOCK = 32,
	COLORS = [ "#00FFFF", "#0000FF", "#FFA500", "#FFFF00", "#ADFF2F", "#FF00FF", "#FF0000" ],
	LETTERS = [ "I", "J", "L", "O", "S", "T", "Z" ];

function getBlock( letter ) {
	switch( letter ) {
		case "I":
			return [ BLOCK_I, COLORS[ 0 ], LETTERS[ 0 ] ];
		case "J":
			return [ BLOCK_J, COLORS[ 1 ], LETTERS[ 1 ] ];
		case "L":
			return [ BLOCK_L, COLORS[ 2 ], LETTERS[ 2 ] ];
		case "O":
			return [ BLOCK_O, COLORS[ 3 ], LETTERS[ 3 ] ];
		case "S":
			return [ BLOCK_S, COLORS[ 4 ], LETTERS[ 4 ] ];
		case "T":
			return [ BLOCK_T, COLORS[ 5 ], LETTERS[ 5 ] ];
		case "Z":
			return [ BLOCK_Z, COLORS[ 6 ], LETTERS[ 6 ] ];
		case 0:
			return [ BLOCK_I, COLORS[ 0 ], LETTERS[ 0 ] ];
		case 1:
			return [ BLOCK_J, COLORS[ 1 ], LETTERS[ 1 ] ];
		case 2:
			return [ BLOCK_L, COLORS[ 2 ], LETTERS[ 2 ] ];
		case 3:
			return [ BLOCK_O, COLORS[ 3 ], LETTERS[ 3 ] ];
		case 4:
			return [ BLOCK_S, COLORS[ 4 ], LETTERS[ 4 ] ];
		case 5:
			return [ BLOCK_T, COLORS[ 5 ], LETTERS[ 5 ] ];
		case 6:
			return [ BLOCK_Z, COLORS[ 6 ], LETTERS[ 6 ] ];
		default:
			break;
	}
}

var lockGrid = [],
	gameGrid = [],
	iteration = 0,
	dropX = 3,
	dropY = 0,
	hardX = 3,
	hardY = 0,
	dropLetter = "Z",
	dropRot = 0,
	rate = 60,
	tempRate = 10,
	dropping = false,
	temp = [],
	seven = [],
	left = [];

var gameCanvas = document.getElementById( "game" );
var gameCtx = gameCanvas.getContext( "2d" );

function copyArrTo( a1, a2 ) {
	for( var i = 0; i < a1.length; i++ ) {
		a2.push( a1[ i ] );
	}
}

function initGrid() {
	for( var row = 0; row < HEIGHT; row++ ) {
		gameGrid.push( [] );
		for( var col = 0; col < WIDTH; col++ ) {
			gameGrid[ row ].push( "0" );
		}
	}
}

function renderGrid() {
	var blockType;
	gameCtx.clearRect( 0, 0, gameCanvas.width, gameCanvas.height );
	for( var row = 0; row < HEIGHT; row++ ) {
		for( var col = 0; col < WIDTH; col++ ) {
			blockType = gameGrid[ row ][ col ];
			if( blockType != "0" ) {
				gameCtx.beginPath();
				gameCtx.rect( col * BLOCK, row * BLOCK, BLOCK, BLOCK );
				gameCtx.fillStyle = getBlock( blockType )[ 1 ];
				gameCtx.fill();
				gameCtx.strokeStyle = "black";
				gameCtx.strokeWidth = 3;
				gameCtx.stroke();
				gameCtx.closePath();
			}
		}
	}
}

function randomLetter() {
	if( left.length == 0 ) {
		copyArrTo( LETTERS, left );
	}
	return left.pop( Math.floor( Math.random() * left.length ) );
}

function getSeven() {
	while( seven.length < 7 ) {
		seven.push( randomLetter() );
		console.log( seven );
	}
}

function drawHard( x, y, letter, rotation ) {
	valid = true;
	while( valid ) {
		y++;
		valid = checkMove( x, y, letter, rotation );
	}
	hardX = x;
	hardY = y - 1;
	var block = getBlock( letter ),
		blockType;
	gameCtx.beginPath();
	for( var row = 0; row < block[ 0 ][ rotation ].length; row++ ) {
		for( var col = 0; col < block[ 0 ][ rotation ][ row ].length; col++ ) {
			blockType = block[ 0 ][ rotation ][ row ][ col ];
			if( blockType != "0" ) {
				gameCtx.rect( ( col * BLOCK ) + ( hardX * BLOCK ), ( row * BLOCK ) + ( hardY * BLOCK ), BLOCK, BLOCK );
				gameCtx.strokeStyle = block[ 1 ];
				gameCtx.strokeWidth = 3;
				gameCtx.stroke();
			}
		}
	}
	gameCtx.closePath();
}

function drawBlock( x, y, letter, rotation ) {
	var block = getBlock( letter ),
		blockType;
	gameCtx.beginPath();
	for( var row = 0; row < block[ 0 ][ rotation ].length; row++ ) {
		for( var col = 0; col < block[ 0 ][ rotation ][ row ].length; col++ ) {
			blockType = block[ 0 ][ rotation ][ row ][ col ];
			if( blockType != "0" ) {
				gameCtx.rect( ( col * BLOCK ) + ( x * BLOCK ), ( row * BLOCK ) + ( y * BLOCK ), BLOCK, BLOCK );
				gameCtx.fillStyle = block[ 1 ];
				gameCtx.fill();
				gameCtx.strokeStyle = "black";
				gameCtx.strokeWidth = 3;
				gameCtx.stroke();
			}
		}
	}
	gameCtx.closePath();
}

function checkMove( x, y, letter, rotation ) {
	var block = getBlock( letter ),
		valid = true,
		blockType;
	for( var row = 0; row < block[ 0 ][ rotation ].length; row++ ) {
		for( var col = 0; col < block[ 0 ][ rotation ][ row ].length; col++ ) {
			blockType = block[ 0 ][ rotation ][ row ][ col ];
			if( blockType != "0" ) {
				valid = valid && ( ( x + col ) >= 0 );
				valid = valid && ( ( x + col ) < WIDTH );
				valid = valid && ( ( y + row ) >= 0 );
				valid = valid && ( ( y + row ) < HEIGHT );
				valid = valid && ( gameGrid[ y + row ][ x + col ] == "0" );
			}
		}
	}
	return valid;
}

function removeRow( target ) {
	for( var col = 0; col < gameGrid[ target ].length; col++ ) {
		gameGrid[ target ][ col ] = "0";
	}
	for( var row = target - 1; row >= 0; row-- ) {
		for( var col = 0; col < gameGrid[ row ].length; col++ ) {
			gameGrid[ row + 1 ][ col ] = gameGrid[ row ][ col ];
		}
	}
}

function checkDrop() {
	var blockType,
		rows = 0,
		valid;
	for( var row = 0; row < HEIGHT; row++ ) {
		valid = true;
		for( var col = 0; col < gameGrid[ row ].length; col++ ) {
			blockType = gameGrid[ row ][ col ];
			valid = valid && !( blockType == "0" );
		}
		if( valid ) {
			removeRow( row );
			rows++;
		}
	}
}

function lockBlock( x, y, letter, rotation ) {
	var block = getBlock( letter ),
		blockType;
	for( var row = 0; row < block[ 0 ][ rotation ].length; row++ ) {
		for( var col = 0; col < block[ 0 ][ rotation ][ row ].length; col++ ) {
			blockType = block[ 0 ][ rotation ][ row ][ col ];
			if( blockType != "0" ) {
				gameGrid[ y + row ][ x + col ] = block[ 2 ];
			}
		}
	}
	checkDrop();
	dropLetter = seven.shift();
	dropX = 3;
	dropY = 0;
	dropRot = 0;
	getSeven();
}

function keydown( e ) {
	switch( e.keyCode ) {
		case 32:
			lockBlock( hardX, hardY, dropLetter, dropRot );
			break;
		case 37:
			if( checkMove( dropX - 1, dropY, dropLetter, dropRot ) ) {
				dropX--;
			}
			break;
		case 38:
			var newRot = dropRot - 1;
			if( newRot == -1 ) {
				newRot = 3;
			}
			if( checkMove( dropX, dropY, dropLetter, newRot ) ) {
				dropRot = newRot;
			} else {
				if( dropX <= 0 ) {
					if( checkMove( dropX + 1, dropY, dropLetter, newRot ) ) {
						dropX++;
						dropRot = newRot;
					}
				} else {
					if( dropX >= WIDTH - 3 ) {
						if( checkMove( dropX + 1, dropY, dropLetter, newRot ) ) {
							dropX--;
							dropRot = newRot;
						}
					}
				}
			}
			break;
		case 39:
			if( checkMove( dropX + 1, dropY, dropLetter, dropRot ) ) {
				dropX++;	
			}
			break;
		case 40:
			if( !dropping ) {
				tempRate = rate;
			}
			rate = 5;
			dropping = true;
			break;
		case 90:
			if( checkMove( dropX, dropY, dropLetter, ( dropRot + 1 ) % 4 ) ) {
				dropRot = ( dropRot + 1 ) % 4;
			} else {
				if( dropX <= 0 ) {
					if( checkMove( dropX + 1, dropY, dropLetter, ( dropRot + 1 ) % 4 ) ) {
						dropX++;
						dropRot = ( dropRot + 1 ) % 4;
					}
				} else {
					if( dropX >= WIDTH - 3 ) {
						if( checkMove( dropX + 1, dropY, dropLetter, ( dropRot + 1 ) % 4 ) ) {
							dropX--;
							dropRot = ( dropRot + 1 ) % 4;
						}
					}
				}
			}
			break;
		default:
			break;
	}
	e.preventDefault();
}

function keyup( e ) {
	switch( e.keyCode ) {
		case 40:
			rate = tempRate;
			dropping = false;
			break;
		default:
			break;
	}
	e.preventDefault();
}

window.addEventListener( "keydown", keydown, false );
window.addEventListener( "keyup", keyup, false );

function gameLoop() {
	iteration++;
	if( iteration % rate == 0 ) {
		var valid = checkMove( dropX, dropY + 1, dropLetter, dropRot ),
			nextPiece;
		//console.log( valid );
		if( valid ) {
			dropY++;
		} else {
			lockBlock( dropX, dropY, dropLetter, dropRot );
		}
		//console.log( dropY );
	}
	renderGrid();
	drawBlock( dropX, dropY, dropLetter, dropRot );
	drawHard( dropX, dropY, dropLetter, dropRot );
}

initGrid();
getSeven();
dropLetter = seven.shift();
setInterval( gameLoop, 1000 / 60 );