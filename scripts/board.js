jewel.board = (function() {
    var settings,
        jewels,
        cols,
        rows,
        baseScore,
        numJewelTypes,
        whiteKingMoved = false,
        whiteRook1Moved = false,
        whiteRook2Moved = false,
        blackKingMoved = false,
        blackRook1Moved = false,
        blackRook2Moved = false,
        enPassant = false,
        createPiece = false,
        chooseType = 0,
        lastMoveFrom = {
            x : 0,
            y : 0
        },
        lastMoveTo = {
            x : 0,
            y : 0
        },
        whiteKing = {
            x : 3,
            y : 0
        },
        blackKing = {
            x : 3,
            y : 7
        },        
        attackedFieldsW;

    function getJewel(x, y) {
        if (x < 0 || x > cols-1 || y < 0 || y > rows-1) {
            return -1;
        } else {
            return jewels[x][y];
        }
    };
    function isOnBoard(x,y) {
        if (x < 0 || x > cols-1 || y < 0 || y > rows-1) {
            return false;
        } else {
            return true;
        }
    };
    function isWhite(x,y) {
        var type;
        type = getJewel(x, y);
        if (type >=-1 && type < 6) {
            return true;
        }
        else {
            return false;
        }
    };
    function isBlack(x,y) {
        var type;
        type = getJewel(x, y);
        if ((type >=6 && type < 12) || (type === -1)) {
            return true;
        }
        else {
            return false;
        }
    };
    function setCPA(type) {
        chooseType  = type;
    };
    function getCPA() {
        return  chooseType;
    };
    function setCreatePiece() {
        createPiece  = true;
    };
    function setenPassant() {
        enPassant  = true;
    };
    
    function setLastMoveFrom(x, y) {
        lastMoveFrom.x = x;
        lastMoveFrom.y = y;
    };
    function setLastMoveTo(x, y) {
        lastMoveTo.x = x;
        lastMoveTo.y = y;
    };
    function getLastMoveTo() {
        var coord = [];       
            coord[0] = lastMoveTo.x;
            coord[1] = lastMoveTo.y;
            return coord;
    };
    
    function isCaptured(x1, y1, x2, y2) {
          if ((isWhite(x1, y1) && isBlack(x2, y2)) || (isBlack(x1, y1) && isWhite(x2, y2))) {
              return true;
          }
          else {
              return false;
          }
    };
    function bishopAttacks(x,y) {
        var i,  
            leftDown = true,
            leftUp = true,
            rightDown = true,
            rightUp = true;
            i = 1;
                while ( (leftDown === true) || (leftUp === true) || (rightDown === true) || (rightUp === true)) {
                    if (leftDown === true) {                  
                        if (isWhite(x-i,y-i) || isBlack(x-i,y-i)) {
                            if ((isBlack(x,y)  && getJewel(x-i,y-i) === 0) || (isWhite(x,y)  && getJewel(x-i,y-i) === 6)) {
                                if (isOnBoard(x-i-1,y-i-1)) {
                                    attackedFieldsW[x-i-1][y-i-1] = 2;
                                }
                            }
                            if (isOnBoard(x-i,y-i)) {
                                attackedFieldsW[x-i][y-i] = 2;
                            }
                            leftDown = false;
                        }                        
                        else {
                            attackedFieldsW[x-i][y-i] = 2;
                        }
                    };
                    if (leftUp === true) {                  
                        if (isWhite(x-i,y+i) || isBlack(x-i,y+i)) {
                            if ((isBlack(x,y)  && getJewel(x-i,y+i) === 0) || (isWhite(x,y)  && getJewel(x-i,y+i) === 6)) {
                                if (isOnBoard(x-i-1,y+i+1)) {
                                    attackedFieldsW[x-i-1][y+i+1] = 2;
                                }
                            }
                            if (isOnBoard(x-i,y+i)) {
                                attackedFieldsW[x-i][y+i] = 2;
                            }
                            leftUp = false;
                        }                        
                        else {
                            attackedFieldsW[x-i][y+i] = 2;
                        }
                    };
                    if (rightDown === true) {                  
                        if (isWhite(x+i,y-i) || isBlack(x+i,y-i)) {
                            if ((isBlack(x,y)  && getJewel(x+i,y-i) === 0) || (isWhite(x,y)  && getJewel(x+i,y-i) === 6)) {
                                if (isOnBoard(x+i+1,y-i-1)) {
                                    attackedFieldsW[x+i+1][y-i-1] = 2;
                                }
                            }
                            if (isOnBoard(x+i,y-i)) {
                                attackedFieldsW[x+i][y-i] = 2;
                            }
                            rightDown = false;
                        }                        
                        else {
                            attackedFieldsW[x+i][y-i] = 2;
                        }
                    };
                    if (rightUp === true) {                  
                        if (isWhite(x+i,y+i) || isBlack(x+i,y+i)) {
                            if ((isBlack(x,y)  && getJewel(x+i,y+i) === 0) || (isWhite(x,y)  && getJewel(x+i,y+i) === 6)) {
                                if (isOnBoard(x+i+1,y+i+1)) {
                                    attackedFieldsW[x+i+1][y+i+1] = 2;
                                }
                            }
                            if (isOnBoard(x+i,y+i)) {
                                attackedFieldsW[x+i][y+i] = 2;
                            }
                            rightUp = false;
                        }                        
                        else {
                            attackedFieldsW[x+i][y+i] = 2;
                        }
                    };
                    i += 1;
                };
    };
    function rookAttacks(x,y) {
        var i,  
            down = true,
            up = true,
            left = true,
            right = true;
            i = 1;
                while ( (down === true) || (left === true) || (right === true) || (up === true)) {
                    if (down === true) {                  
                        if (isWhite(x,y-i) || isBlack(x,y-i)) {
                            if ((isBlack(x,y)  && getJewel(x,y-i) === 0) || (isWhite(x,y)  && getJewel(x,y-i) === 6)) {
                                if (isOnBoard(x,y-i-1)) {
                                    attackedFieldsW[x][y-i-1] = 4;
                                }
                            }
                            if (isOnBoard(x,y-i)) {
                                attackedFieldsW[x][y-i] = 4;
                            }
                            down = false;
                        }                        
                        else {
                            attackedFieldsW[x][y-i] = 4;
                        }
                    };
                    if (left === true) {                  
                        if (isWhite(x-i,y) || isBlack(x-i,y)) {
                            if ((isBlack(x,y)  && getJewel(x-i,y) === 0) || (isWhite(x,y)  && getJewel(x-i,y) === 6)) {
                                if (isOnBoard(x-i-1,y)) {
                                    attackedFieldsW[x-i-1][y] = 4;
                                }
                            }
                            if (isOnBoard(x-i,y)) {
                                attackedFieldsW[x-i][y] = 4;
                            }
                            left = false;
                        }                        
                        else {
                            attackedFieldsW[x-i][y] = 4;
                        }
                    };
                    if (right === true) {                  
                        if (isWhite(x+i,y) || isBlack(x+i,y)) {
                            if ((isBlack(x,y)  && getJewel(x+i,y) === 0) || (isWhite(x,y)  && getJewel(x+i,y) === 6)) {
                                if (isOnBoard(x+i+1,y)) {
                                    attackedFieldsW[x+i+1][y] = 4;
                                }
                            }
                            if (isOnBoard(x+i,y)) {
                                attackedFieldsW[x+i][y] = 4;
                            }
                            right = false;
                        }                        
                        else {
                            attackedFieldsW[x+i][y] = 4;
                        }
                    };
                    if (up === true) {                  
                        if (isWhite(x,y+i) || isBlack(x,y+i)) {
                            if ((isBlack(x,y)  && getJewel(x,y+i) === 0) || (isWhite(x,y)  && getJewel(x,y+i) === 6)) {
                                if (isOnBoard(x,y+i+1)) {
                                    attackedFieldsW[x][y+i+1] = 4;
                                }
                            }
                            if (isOnBoard(x,y+i)) {
                                attackedFieldsW[x][y+i] = 4;
                            }
                            up = false;
                        }                        
                        else {
                            attackedFieldsW[x][y+i] = 4;
                        }
                    };
                    i += 1;
                };
    };
    function bishopMove(x, y, color, moveable) {
        var x1,y1,i,k,l,  
            leftDown,leftUp ,
            rightDown,rightUp,
            tmpBoard = [];
            if (moveable) {
                x1 = x;
                y1 = y;
            }
            else {
                x1 = lastMoveFrom.x;
                y1 = lastMoveFrom.y;  
            }
            if (x1 === 0) {
               leftDown = false;
               leftUp = false; 
               rightDown = true;
               rightUp = true; 
            }
            else if (x1 === 7) {
                leftDown = true;
                leftUp = true; 
                rightDown = false;
                rightUp = false;                
            }
            else if (y1 === 0) {
                rightDown = false;
                leftDown = false;
                leftUp = true; 
                rightUp = true;  
            }
            else if (y1 === 7) {
                leftUp = false; 
                rightUp = false;
                leftDown = true;
                rightDown = true;
            }
            else {
                leftDown = true;
                leftUp = true;            
                rightDown = true;
                rightUp = true;  
            }
            for (i = 0; i < rows; i++) {
                tmpBoard[i] = [];
            };
            i = 1;
            while ( (leftDown === true) || (leftUp === true) || (rightDown === true) || (rightUp === true)) {
                if (color === 'white') {
                    if (leftDown === true) {
                  
                        if (isWhite(x1-i,y1-i)) {
                            leftDown = false;
                        }
                        else if (isBlack(x1-i,y1-i)) {
                            leftDown = false;
                            tmpBoard[x1-i][y1-i] = 1;
                        }
                        else {
                            tmpBoard[x1-i][y1-i] = 1;
                        }
                    };
                    if (leftUp === true) {
                        
                        if (isWhite(x1-i,y1+i)) {
                            leftUp = false;
                        }
                        else if (isBlack(x1-i,y1+i)) {
                            leftUp = false;
                            tmpBoard[x1-i][y1+i] = 1;
                        }
                        else {
                            tmpBoard[x1-i][y1+i] = 1;
                        }
                    };
                    if (rightDown === true) {
                        if (isWhite(x1+i,y1-i)) {
                            rightDown = false;
                        }
                        else if (isBlack(x1+i,y1-i)) {
                            rightDown = false;
                            tmpBoard[x1+i][y1-i] = 1;
                        }
                        else {
                            tmpBoard[x1+i][y1-i] = 1;
                        }
                    };
                    if (rightUp === true) {
                       
                        if (isWhite(x1+i,y1+i)) {
                            rightUp = false;
                        }
                        else if (isBlack(x1+i,y1+i)) {
                            rightUp = false;
                            tmpBoard[x1+i][y1+i] = 1;
                    
                        }
                        else {
                            tmpBoard[x1+i][y1+i] = 1;
                        }
                    };
                }
                else {
                    if (leftDown === true) {
                  
                        if (isBlack(x1-i,y1-i)) {
                            leftDown = false;
                        }
                        else if (isWhite(x1-i,y1-i)) {
                            leftDown = false;
                            tmpBoard[x1-i][y1-i] = 1;
                        }
                        else {
                            tmpBoard[x1-i][y1-i] = 1;
                        }
                    };
                    if (leftUp === true) {
                        
                        if (isBlack(x1-i,y1+i)) {
                            leftUp = false;
                        }
                        else if (isWhite(x1-i,y1+i)) {
                            leftUp = false;
                            tmpBoard[x1-i][y1+i] = 1;
                        }
                        else {
                            tmpBoard[x1-i][y1+i] = 1;
                        }
                    };
                    if (rightDown === true) {
                        if (isBlack(x1+i,y1-i)) {
                            rightDown = false;
                        }
                        else if (isWhite(x1+i,y1-i)) {
                            rightDown = false;
                            tmpBoard[x1+i][y1-i] = 1;
                        }
                        else {
                            tmpBoard[x1+i][y1-i] = 1;
                        }
                    };
                    if (rightUp === true) {
                       
                        if (isBlack(x1+i,y1+i)) {
                            rightUp = false;
                        }
                        else if (isWhite(x1+i,y1+i)) {
                            rightUp = false;
                            tmpBoard[x1+i][y1+i] = 1;
                    
                        }
                        else {
                            tmpBoard[x1+i][y1+i] = 1;
                        }
                    };
                }
                i += 1;
            }
            i = 0;
            if (moveable) {
                if (color === 'white') {
                    for (k = 0; k < rows; k++) {
                        for (l = 0; l < cols; l++) {
                            if (tmpBoard[k][l] === 1 && isnotCheckedAfterMove(k,l,'white')) {                           
                                i += 1;                                                     
                            }    
                        };
                    };
                    if (i > 0) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                else {
                    for (k = 0; k < rows; k++) {
                        for (l = 0; l < cols; l++) {
                            if (tmpBoard[k][l] === 1 && isnotCheckedAfterMove(k,l,'black')) {
                                i += 1;                                                     
                            }    
                        };
                    };
                    if (i > 0) {
                        return true;
                    }
                    else {
                        return false;
                    } 
                }
            }
            else {
                if (tmpBoard[x][y] === 1) {
                    if (color === 'white') {
                        if (isnotCheckedAfterMove(x,y,'white')) {
                            return true;
                        }    
                    }
                    else {
                        if (isnotCheckedAfterMove(x,y,'black')) {
                            return true;
                        }
                    }
                }
                else {
                    return false;
                }
            }
    };
    
    function rookMove(x, y, color, moveable) {
        var x1,y1,i,k,l,  
            down = true,
            left = true,
            right = true,
            up = true,
            tmpBoard = [];
            if (moveable) {
                x1 = x;
                y1 = y;
            }
            else {
                x1 = lastMoveFrom.x;
                y1 = lastMoveFrom.y;             
            }
            for (i = 0; i < rows; i++) {
                tmpBoard[i] = [];
            };
            i = 1;
            while ( (down === true) || (left === true) || (right === true) || (up === true)) {
                if (color === 'white') {
                    if (left === true) {
                  
                        if (isWhite(x1-i,y1)) {
                            left = false;
                        }
                        else if (isBlack(x1-i,y1)) {
                            left = false;
                            tmpBoard[x1-i][y1] = 1;
                        }
                        else {
                            tmpBoard[x1-i][y1] = 1;
                        }
                    };
                    if (up === true) {
                        
                        if (isWhite(x1,y1+i)) {
                            up = false;
                        }
                        else if (isBlack(x1,y1+i)) {
                            up = false;
                            tmpBoard[x1][y1+i] = 1;
                        }
                        else {
                            tmpBoard[x1][y1+i] = 1;
                        }
                    };
                    if (down === true) {
                        
                        if (isWhite(x1,y1-i)) {
                            down = false;
                        }
                        else if (isBlack(x1,y1-i)) {
                            down = false;
                            tmpBoard[x1][y1-i] = 1;
                        }
                        else {
                            tmpBoard[x1][y1-i] = 1;
                        }
                    };
                    if (right === true) {
                      
                        if (isWhite(x1+i,y1)) {
                            right = false;
                        }
                        else if (isBlack(x1+i,y1)) {
                            right = false;
                            tmpBoard[x1+i][y1] = 1;
                    
                        }
                        else {
                            tmpBoard[x1+i][y1] = 1;
                        }
                    };
                }
                else {
                    if (left === true) {
                  
                        if (isBlack(x1-i,y1)) {
                            left = false;
                        }
                        else if (isWhite(x1-i,y1)) {
                            left = false;
                            tmpBoard[x1-i][y1] = 1;
                        }
                        else {
                            tmpBoard[x1-i][y1] = 1;
                        }
                    };
                    if (up === true) {
                        
                        if (isBlack(x1,y1+i)) {
                            up = false;
                        }
                        else if (isWhite(x1,y1+i)) {
                            up = false;
                            tmpBoard[x1][y1+i] = 1;
                        }
                        else {
                            tmpBoard[x1][y1+i] = 1;
                        }
                    };
                    if (down === true) {
                        if (isBlack(x1,y1-i)) {
                            down = false;
                        }
                        else if (isWhite(x1,y1-i)) {
                            down = false;
                            tmpBoard[x1][y1-i] = 1;
                        }
                        else {
                            tmpBoard[x1][y1-i] = 1;
                        }
                    };
                    if (right === true) {
                       
                        if (isBlack(x1+i,y1)) {
                            right = false;
                        }
                        else if (isWhite(x1+i,y1)) {
                            right = false;
                            tmpBoard[x1+i][y1] = 1;                    
                        }
                        else {
                            tmpBoard[x1+i][y1] = 1;
                        }
                    };
                }
                i += 1;
            }
            i = 0;
            if (moveable) {
                if (color === 'white') {
                    for (k = 0; k < rows; k++) {
                        for (l = 0; l < cols; l++) {
                            if (tmpBoard[k][l] === 1 && isnotCheckedAfterMove(k,l,'white')) {
                                i += 1;                                                     
                            }    
                        };
                    };
                    if (i > 0) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                else {
                    for (k = 0; k < rows; k++) {
                        for (l = 0; l < cols; l++) {
                            if (tmpBoard[k][l] === 1 && isnotCheckedAfterMove(k,l,'black')) {
                                i += 1;                                                     
                            }    
                        };
                    };
                    if (i > 0) {
                        return true;
                    }
                    else {
                        return false;
                    } 
                }
            }
            else {
            if (tmpBoard[x][y] === 1) {
                if (color === 'white') {
                    if (isnotCheckedAfterMove(x,y,'white')) {
                        return true;
                    }    
                }
                else {
                    if (isnotCheckedAfterMove(x,y,'black')) {
                        return true;
                    }
                }
            }
            else {
                return false;
            }
            }
    };
    
    function isChecked(x,y,color) {
        if (color === 'white') {
            if  (attackedFieldsW[x][y] !== 'undefined') {
                return true;
            }
            else {
                return false;
            };
        }
        else {
            if  (attackedFieldsW[x][y] !== 'undefined') {
                return true;
            }
            else {
                return false;
            };
        }
    };
    function getKing(color) {
        var coord = [];
        if (color === 'white') {
            coord[0] = whiteKing.x;
            coord[1] = whiteKing.y;
            return coord;
        }
        else {
            coord[0] = blackKing.x;
            coord[1] = blackKing.y;
            return coord;
        };
    };
    function setKing(x,y,color) {
        if (color === 'white') {
            whiteKing.x = x;
            whiteKing.y = y;
        }
        else {
            blackKing.x = x;;
            blackKing.y = y;
        };
    };
    
    function signAttackedFields(color) {
        var x, y , i, j, type; 
            for (x = 0; x < rows; x++) {
                for (y = 0; y < cols; y++) {
                    attackedFieldsW[x][y] = 'undefined';
                };
            };
        if (color === 'white') {
            for (x = 0; x < rows; x++) {
                for (y = 0; y < cols; y++) {
                    if (isWhite(x,y)) {
                        type = getJewel(x, y);
                        switch (type) {
                            case 5 :
                                if (isOnBoard(x-1,y+1)) {
                                    attackedFieldsW[x-1][y+1] = 5;
                                };
                                 if (isOnBoard(x+1,y+1)) {
                                    attackedFieldsW[x+1][y+1] = 5; 
                                };
                                break;                            
                            case 0 :
                                for (i = 0; i < 3; i++) {
                                    for (j = 0; j < 3; j++) {
                                        if (isOnBoard(x+i-1,y+j-1)) {
                                            attackedFieldsW[x+i-1][y+j-1] = 0;                                         
                                        };
                                    };
                                };
                                break;
                            case 1 :
                                bishopAttacks(x,y);
                                rookAttacks(x,y);
                                break;                            
                            case 2 :
                                bishopAttacks(x,y);
                                break;                
                            case 4 :
                                rookAttacks(x,y);
                                break;                
                            case 3 :
                                if (isOnBoard(x-2,y-1)) {
                                    attackedFieldsW[x-2][y-1] = 3;                                   
                                };
                                if (isOnBoard(x-2,y+1)) {
                                    attackedFieldsW[x-2][y+1] = 3; 
                                };
                                if (isOnBoard(x-1,y-2)) {
                                    attackedFieldsW[x-1][y-2] = 3;
                                };
                                if (isOnBoard(x-1,y+2)) {
                                    attackedFieldsW[x-1][y+2] = 3; 
                                };
                                if (isOnBoard(x+1,y-2)) {
                                    attackedFieldsW[x+1][y-2] = 3;                                   
                                };
                                if (isOnBoard(x+1,y+2)) {
                                    attackedFieldsW[x+1][y+2] = 3; 
                                };
                                if (isOnBoard(x+2,y-1)) {
                                    attackedFieldsW[x+2][y-1] = 3;
                                };
                                if (isOnBoard(x+2,y+1)) {
                                    attackedFieldsW[x+2][y+1] = 3; 
                                };
                                break;               
                            default :
                                
                                break;
                        }
                    }
                }
            }    
        }
        else {
            for (x = 0; x < rows; x++) {
                for (y = 0; y < cols; y++) {
                    if (isBlack(x,y)) {
                        type = getJewel(x, y);
                        switch (type) {
                            case 11 :
                                if (isOnBoard(x-1,y-1)) {
                                    attackedFieldsW[x-1][y-1] = 11;
                                };
                                 if (isOnBoard(x+1,y-1)) {
                                    attackedFieldsW[x+1][y-1] = 11; 
                                };
                                break;                            
                            case 6 :
                                for (i = 0; i < 3; i++) {
                                    for (j = 0; j < 3; j++) {
                                        if (isOnBoard(x+i-1,y+j-1)) {
                                            attackedFieldsW[x+i-1][y+j-1] = 6;                                         
                                        };
                                    };
                                };
                                break;
                            case 7 :
                                bishopAttacks(x,y);
                                rookAttacks(x,y);
                                break;                            
                            case 8 :
                                bishopAttacks(x,y);
                                break;                
                            case 10 :
                                rookAttacks(x,y);
                                break;                
                            case 9 :
                                if (isOnBoard(x-2,y-1)) {
                                    attackedFieldsW[x-2][y-1] = 9;                                   
                                };
                                if (isOnBoard(x-2,y+1)) {
                                    attackedFieldsW[x-2][y+1] = 9; 
                                };
                                if (isOnBoard(x-1,y-2)) {
                                    attackedFieldsW[x-1][y-2] = 9;
                                };
                                if (isOnBoard(x-1,y+2)) {
                                    attackedFieldsW[x-1][y+2] = 9; 
                                };
                                if (isOnBoard(x+1,y-2)) {
                                    attackedFieldsW[x+1][y-2] = 9;                                   
                                };
                                if (isOnBoard(x+1,y+2)) {
                                    attackedFieldsW[x+1][y+2] = 9; 
                                };
                                if (isOnBoard(x+2,y-1)) {
                                    attackedFieldsW[x+2][y-1] = 9;
                                };
                                if (isOnBoard(x+2,y+1)) {
                                    attackedFieldsW[x+2][y+1] = 9; 
                                };
                                break;               
                            default :
                                
                                break;
                        }
                    }
                }
            }    
        }
        
    };
    
    function isnotCheckedAfterMove(x,y,color) {
        var x1 = lastMoveFrom.x,
            y1 = lastMoveFrom.y,
            tmp =  jewels[x][y];
            if (color === 'white') {               
                jewels[x][y] = jewels[x1][y1];
                jewels[x1][y1] = 'undefined';
                signAttackedFields('black');
                if (!isChecked(whiteKing.x,whiteKing.y,'white')) {
                    jewels[x1][y1] = jewels[x][y];
                    jewels[x][y] = tmp;
                    return true;
                }
                else {
                    jewels[x1][y1] = jewels[x][y];
                    jewels[x][y] = tmp;
                    return false;
                }        
                }
            else {
                jewels[x][y] = jewels[x1][y1];
                jewels[x1][y1] = 'undefined';
                signAttackedFields('white');
                if (!isChecked(blackKing.x,blackKing.y,'black')) {
                    jewels[x1][y1] = jewels[x][y];
                    jewels[x][y] = tmp;
                    return true;
                }
                else {
                    jewels[x1][y1] = jewels[x][y];
                    jewels[x][y] = tmp;
                    return false;
                } 
            }
    };
    function validMove(x, y, moveable) {
        var x1,y1,i,j,k,          
            type,
            lastType =  getJewel(lastMoveTo.x, lastMoveTo.y);
            if (moveable) {
                x1 = x;
                y1 = y;
            }
            else {
                x1 = lastMoveFrom.x;
                y1 = lastMoveFrom.y;
            }
            type = getJewel(x1, y1);
            switch (type) {              
                case 5 :
                    if (moveable) {
                        if ((!isBlack(x1,y1+1) && !isWhite(x1,y1+1) && isnotCheckedAfterMove(x1,y1+1,'white')) 
                            || (y1 === 1 && !isBlack(x1,y1+2) && !isWhite(x1,y1+2) && isnotCheckedAfterMove(x1,y1+2,'white'))
                            || (isBlack(x1-1,y1+1) && isOnBoard(x1-1,y1+1) && isnotCheckedAfterMove(x1-1,y1+1,'white'))
                            || (isBlack(x1+1,y1+1) && isOnBoard(x1+1,y1+1) && isnotCheckedAfterMove(x1+1,y1+1,'white'))
                            || (lastType === 11  && isOnBoard(x1-1,y1+1) && isnotCheckedAfterMove(x1-1,y1+1,'white') && y1 === 4  && lastMoveTo.y === 4 && lastMoveTo.x === x1-1 )
                            || (lastType === 11  && isOnBoard(x1+1,y1+1) && isnotCheckedAfterMove(x1+1,y1+1,'white') && y1 === 4  && lastMoveTo.y === 4 && lastMoveTo.x === x1+1 )) { 
                                return true;
                        } 
                        else {
                             return false;
                        }
                    }
                    else {
                    if (x !== x1) {
                        if ((x === x1-1 && y === y1+1 && isBlack(x,y)) || (x === x1+1 && y === y1+1 && isBlack(x,y))
                            || (lastType === 11 && y === 5 && y1 === 4  && lastMoveTo.y === 4 && lastMoveTo.x === x )) {
                            if (isnotCheckedAfterMove(x,y,'white')) {  
                                if (lastType === 11 && y === 5 && y1 === 4  && lastMoveTo.y === 4 && lastMoveTo.x === x ) {
                                    enPassant = true;
                                }
                                if (y === 7) {
                                    createPiece = true;
                                }
                                return true;                                
                            }
                        }
                        else {
                            return false;
                        }
                    }
                    else {
                        if ((!isBlack(x1,y1+1) && !isWhite(x1,y1+1) && y === y1+1) || (y1 === 1 && !isBlack(x1,y1+2) && !isWhite(x1,y1+2) && y === y1+2)) { 
                            if (isnotCheckedAfterMove(x,y,'white')) {
                                if (y === 7) {
                                    createPiece = true;
                                }
                                return true;
                            } 
                        }                        
                        else {
                            return false;
                        }
                    }
                    }
                    break;
                case 11 :
                    if (moveable) {
                        if ((!isBlack(x1,y1-1) && !isWhite(x1,y1-1) && isnotCheckedAfterMove(x1,y1-1,'black')) 
                            || (y1 === 6 && !isBlack(x1,y1-2) && !isWhite(x1,y1-2) && isnotCheckedAfterMove(x1,y1-2,'black'))
                            || (isWhite(x1-1,y1-1)  && isOnBoard(x1-1,y1-1) && isnotCheckedAfterMove(x1-1,y1-1,'black'))
                            || (isWhite(x1+1,y1-1)  && isOnBoard(x1+1,y1-1) && isnotCheckedAfterMove(x1+1,y1-1,'black'))
                            || (lastType === 5  && isOnBoard(x1-1,y1-1) && isnotCheckedAfterMove(x1-1,y1-1,'black') && y1 === 3  && lastMoveTo.y === 3 && lastMoveTo.x === x1-1 )
                            || (lastType === 5  && isOnBoard(x1+1,y1-1) && isnotCheckedAfterMove(x1+1,y1-1,'black') && y1 === 3  && lastMoveTo.y === 3 && lastMoveTo.x === x1+1 )) { 
                            return true;
                        } 
                        else {
                            return false;
                        }
                    }
                    else {
                    if (x !== x1) {
                        if ((x === x1-1 && y === y1-1 && isWhite(x,y)) || (x === x1+1 && y === y1-1 && isWhite(x,y))
                            || (lastType === 5 && y1 === 3  && lastMoveTo.y === 3 && lastMoveTo.x === x )) {
                            if (isnotCheckedAfterMove(x,y,'black')) {
                                if (lastType === 5 && y === 2 && y1 === 3  && lastMoveTo.y === 3 && lastMoveTo.x === x ) {
                                    enPassant = true;
                                 //   swap(x1, y1, x, y-1, jewel.screens["game-screen"].playBoardEvents);
                                  //  enPassant = false;
                                }
                                if (y === 0) {
                                    createPiece = true;
                                }
                                return true;
                            }
                        }
                        else {
                            return false;
                        }
                    }
                    else {
                        if ((!isBlack(x1,y1-1) && !isWhite(x1,y1-1) && y === y1-1) || (y1 ===6 && !isBlack(x1,y1-2) && !isWhite(x1,y1-2) && y === y1-2)) {                            
                            if (isnotCheckedAfterMove(x,y,'black')) {
                                if (y === 0) {
                                    createPiece = true;
                                }
                                return true;
                            }
                        }
                        else {
                            return false;
                        }
                    }
                    }
                    break;
                case 0 :
                    if (moveable) {
                        k = 0;
                        for (i = 0; i < 3; i++) {
                            for (j = 0; j < 3; j++) {                             
                                if (!isWhite(x1+i-1,y1+j-1) && isOnBoard(x1+i-1,y1+j-1) && !isChecked(x1+i-1,y1+j-1,'white')) {
                                    k += 1; 
                                };
                                
                            };
                        };
                        if (k > 0) {
                            return true;
                        }
                        else {
                            return false;
                        }
                    }
                    else {
                    if ((!isWhite(x,y) && Math.abs(x-x1) <= 1 && Math.abs(y-y1) <= 1 && !isChecked(x,y,'white')) 
                        || (x===1 && y===0 && whiteKing.x===3 && whiteKing.y===0 && getJewel(0,0)===4 && getJewel(1,0)==='undefined' && getJewel(2,0)==='undefined' && whiteKingMoved===false && whiteRook1Moved===false && !isChecked(3,0,'white') && !isChecked(2,0,'white') && !isChecked(1,0,'white'))
                        || (x===5 && y===0 && whiteKing.x===3 && whiteKing.y===0 && getJewel(7,0)===4 && getJewel(6,0)==='undefined' && getJewel(5,0)==='undefined'  && getJewel(4,0)==='undefined' && whiteKingMoved===false && whiteRook2Moved===false && !isChecked(3,0,'white') && !isChecked(4,0,'white') && !isChecked(5,0,'white') && !isChecked(6,0,'white'))) {                        
                        whiteKingMoved = true;
                        whiteKing.x = x;
                        whiteKing.y = y;
                        if ((x1 - x) === 2) {
                            swap(0, 0, 2, 0, jewel.screens["game-screen"].playBoardEvents);
                        }
                        if ((x - x1) === 2) {
                            swap(7, 0, 4, 0, jewel.screens["game-screen"].playBoardEvents);
                        }
                        return true;
                    }
                    else {
                        return false;
                    }
                    }
                    break
                case 1 :
                    if (bishopMove(x,y,'white',moveable) || rookMove(x,y,'white',moveable)) {
                        return true;
                    }
                    else {
                        return false;
                    }
                    break;
                case 6 :
                    if (moveable) {
                        k = 0;
                        for (i = 0; i < 3; i++) {
                            for (j = 0; j < 3; j++) {                             
                                if (!isBlack(x1+i-1,y1+j-1) && isOnBoard(x1+i-1,y1+j-1) && !isChecked(x1+i-1,y1+j-1,'white')) {
                                    k += 1; 
                                };
                                
                            };
                        };
                        if (k > 0) {
                            return true;
                        }
                        else {
                            return false;
                        }
                    }
                    else {
                    if ((!isBlack(x,y) && Math.abs(x-x1) <= 1 && Math.abs(y-y1) <= 1 && !isChecked(x,y,'black'))
                        || (x===1 && y===7 && blackKing.x===3 && blackKing.y===7 && getJewel(0,7)===10 && getJewel(1,7)==='undefined' && getJewel(2,7)==='undefined' && blackKingMoved===false && blackRook1Moved===false && !isChecked(3,7,'black') && !isChecked(2,7,'black') && !isChecked(1,7,'black'))
                        || (x===5 && y===7 && blackKing.x===3 && blackKing.y===7 && getJewel(7,7)===10 && getJewel(6,7)==='undefined' && getJewel(5,7)==='undefined'  && getJewel(4,7)==='undefined' && blackKingMoved===false && blackRook2Moved===false && !isChecked(3,7,'black') && !isChecked(4,7,'black') && !isChecked(5,7,'black') && !isChecked(6,7,'black'))) {                        
                        blackKingMoved = true;
                        blackKing.x = x;
                        blackKing.y = y; 
                        if ((x1 - x) === 2) {
                            swap(0, 7, 2, 7, jewel.screens["game-screen"].playBoardEvents);
                        }
                        if ((x - x1) === 2) {
                            swap(7, 7, 4, 7, jewel.screens["game-screen"].playBoardEvents);
                        }
                        return true;
                    }
                    
                    else {
                        return false;
                    }
                    }
                    break;
                case 7 :
                    if (bishopMove(x,y,'black',moveable) || rookMove(x,y,'black',moveable)) {
                        return true;
                    }
                    else {
                        return false;
                    }
                    break; 
                case 2 :
                    if (bishopMove(x,y,'white',moveable)) {
                        return true;
                    }
                    else {
                        return false;
                    }
                    break;
                case 8 :
                    if (bishopMove(x,y,'black',moveable)) {
                        return true;
                    }
                    else {
                        return false;
                    }
                    break;  
                case 4 :
                    if (rookMove(x, y, 'white',moveable)) {
                        if (!moveable) {
                            if (x1===0 && y1===0) {
                                whiteRook1Moved = true;
                            }
                            if (x1===7 && y1===0) {
                                whiteRook2Moved = true;
                            }
                        }
                        return true;                           
                    }
                    else {
                        return false;
                    }
                    break;
                case 10 :
                    if (rookMove(x, y, 'black',moveable)) {
                        if (!moveable) {
                            if (x1===0 && y1===7) {
                                blackRook1Moved = true;
                            }
                            if (x1===7 && y1===7) {
                                blackRook2Moved = true;
                            }
                        }   
                        return true;
                    }
                    else {
                        return false;
                    }
                    break; 
                case 3 :
                    if (moveable) {
                        if ((!isWhite(x1-1,y1-2) && isOnBoard(x1-1,y1-2) && isnotCheckedAfterMove(x1-1,y1-2,'white')) 
                            || (!isWhite(x1+1,y1-2) && isOnBoard(x1+1,y1-2) && isnotCheckedAfterMove(x1+1,y1-2,'white')) 
                            || (!isWhite(x1-2,y1-1) && isOnBoard(x1-2,y1-1) && isnotCheckedAfterMove(x1-2,y1-1,'white'))
                            || (!isWhite(x1+2,y1-1) && isOnBoard(x1+2,y1-1) && isnotCheckedAfterMove(x1+2,y1-1,'white'))
                            || (!isWhite(x1-1,y1+2) && isOnBoard(x1-1,y1+2) && isnotCheckedAfterMove(x1-1,y1+2,'white')) 
                            || (!isWhite(x1+1,y1+2) && isOnBoard(x1+1,y1+2) && isnotCheckedAfterMove(x1+1,y1+2,'white'))
                            || (!isWhite(x1-2,y1+1) && isOnBoard(x1-2,y1+1) && isnotCheckedAfterMove(x1-2,y1+1,'white'))
                            || (!isWhite(x1+2,y1+1) && isOnBoard(x1+2,y1+1) && isnotCheckedAfterMove(x1+2,y1+1,'white'))) {
                            return true;   
                        }
                        else {
                            return false;
                        }
                    }
                    else {
                    if (!isWhite(x,y) && ((x ===  x1 - 1 && y === y1 - 2 ) || (x ===  x1 + 1 && y === y1 - 2 )
                                      ||  (x ===  x1 - 2 && y === y1 - 1 ) || (x ===  x1 + 2 && y === y1 - 1 )
                                      ||  (x ===  x1 - 1 && y === y1 + 2 ) || (x ===  x1 + 1 && y === y1 + 2 )
                                      ||  (x ===  x1 - 2 && y === y1 + 1 ) || (x ===  x1 + 2 && y === y1 + 1 ))) {                        
                        if (isnotCheckedAfterMove(x,y,'white')) {
                            return true;
                        }
                    }
                    else {
                        return false;
                    }
                    }
                    break;
                case 9 :
                    if (moveable) {
                        if ((!isBlack(x1-1,y1-2) && isOnBoard(x1-1,y1-2) && isnotCheckedAfterMove(x1-1,y1-2,'black')) 
                            || (!isBlack(x1+1,y1-2) && isOnBoard(x1+1,y1-2) && isnotCheckedAfterMove(x1+1,y1-2,'black')) 
                            || (!isBlack(x1-2,y1-1) && isOnBoard(x1-2,y1-1) && isnotCheckedAfterMove(x1-2,y1-1,'black'))
                            || (!isBlack(x1+2,y1-1) && isOnBoard(x1+2,y1-1) && isnotCheckedAfterMove(x1+2,y1-1,'black'))
                            || (!isBlack(x1-1,y1+2) && isOnBoard(x1-1,y1+2) && isnotCheckedAfterMove(x1-1,y1+2,'black')) 
                            || (!isBlack(x1+1,y1+2) && isOnBoard(x1+1,y1+2) && isnotCheckedAfterMove(x1+1,y1+2,'black'))
                            || (!isBlack(x1-2,y1+1) && isOnBoard(x1-2,y1+1) && isnotCheckedAfterMove(x1-2,y1+1,'black'))
                            || (!isBlack(x1+2,y1+1) && isOnBoard(x1+2,y1+1) && isnotCheckedAfterMove(x1+2,y1+1,'black'))) {
                            return true;   
                        }
                        else {
                            return false;
                        }
                    }
                    else {
                    if (!isBlack(x,y) && ((x ===  x1 - 1 && y === y1 - 2 ) || (x ===  x1 + 1 && y === y1 - 2 )
                                      ||  (x ===  x1 - 2 && y === y1 - 1 ) || (x ===  x1 + 2 && y === y1 - 1 )
                                      ||  (x ===  x1 - 1 && y === y1 + 2 ) || (x ===  x1 + 1 && y === y1 + 2 )
                                      ||  (x ===  x1 - 2 && y === y1 + 1 ) || (x ===  x1 + 2 && y === y1 + 1 ))) {                        
                        if (isnotCheckedAfterMove(x,y,'black')) {
                            return true;
                        }
                    }
                    else {
                        return false;
                    }
                    }
                    break;
                default :
                    return true;
                    break;
            }
    };
    
    function fillBoard() {
        var x, y;
        jewels = [];
        attackedFieldsW = [];           
         for (x = 0; x < rows; x++) {
            jewels[x] = [];
            attackedFieldsW[x] = [];
        }
        jewels[0][0] = 4;
        jewels[1][0] = 3;
        jewels[2][0] = 2;
        jewels[3][0] = 0;
        jewels[4][0] = 1;
        jewels[5][0] = 2;
        jewels[6][0] = 3;
        jewels[7][0] = 4;
        
        for (x = 0; x < rows; x++) {
            jewels[x][1] = 5;   
        }
        for (y = 2; y < 6; y++) {
            for (x = 0; x < rows; x++) {
                jewels[x][y] = 'undefined';
            }
        }
        for (x = 0; x < rows; x++) {
            jewels[x][6] = 11;   
        }
        jewels[0][7] = 10;
        jewels[1][7] = 9;
        jewels[2][7] = 8;
        jewels[3][7] = 6;
        jewels[4][7] = 7;
        jewels[5][7] = 8;
        jewels[6][7] = 9;
        jewels[7][7] = 10;
                    
    };
    
    // Tworzy kopiê planszy z klejnotami.
    function getBoard() {
        var copy = [],
            x , y;
         for (x = 0; x < rows; x++) {
             copy[x] = [];
        }
        for (x = 0; x < rows; x++) {
            for (y = 0; y < cols; y++) {
                copy[x][y] = jewels[x][y];
            }    
        }
        return copy;
    };
    
    function checkPawn(x,y) {
        if ((y === 7 && getJewel(lastMoveFrom.x,lastMoveFrom.y) === 5) ||  (y === 0 && getJewel(lastMoveFrom.x,lastMoveFrom.y) === 11)){
            return true;
        }
        else {
            return false;
        }
    };

    // Jeœli istnieje taka mo¿liwoœæ zmienia miejscami klejnot w komórce (x1, y1)
    // z klejnotem w komórce (x2, y2).
    function swap(x1, y1, x2, y2, callback) {
        var tmp, swap1, swap2,
            events = [];
        swap1 = {
            type : "move",
            data : [{
                type : getJewel(x1, y1),
                fromX : x1, fromY : y1, toX : x2, toY : y2
            },{
                type : getJewel(x2, y2),
                fromX : x2, fromY : y2, toX : x1, toY : y1
            }]
        };
        swap2 = {
            type : "move",
            data : [{
                 type : getJewel(x1, y1),
                fromX : x1, fromY : y1, toX : x2, toY : y2
            }]
        };
       
                if (enPassant) { 
                    events.push(swap1,{type:"capture"});
                    jewels[x2][y2] = getJewel(x1, y1);
                    if (isWhite(x1,y1)) {
                        jewels[x2][y2-1] = 'undefined';
                    } 
                    else {
                        jewels[x2][y2+1] = 'undefined';
                    }
                    jewels[x1][y1] = 'undefined';
                    enPassant = false;
                } else                     
                if (createPiece) { 
                    jewels[x2][y2] = chooseType;
                    jewels[x1][y1] = 'undefined';
                    events.push(swap2,{type:"capture"});
                    createPiece = false;
                    chooseType = 0;
                }               
                else     
                if (isCaptured(x1, y1, x2, y2)) { 
                    events.push(swap2,{type:"capture"});
                    jewels[x2][y2] = getJewel(x1, y1);
                    jewels[x1][y1] = 'undefined'; 
                } 
                else {
                    events.push(swap1);
                    tmp = getJewel(x1, y1);
                    jewels[x1][y1] = getJewel(x2, y2);
                    jewels[x2][y2] = tmp;
                }
                
                callback(events);
            
    };
    
    
    function initialize(startJewels,callback) {
        settings = jewel.settings;
        numJewelTypes = settings.numJewelTypes;
        baseScore = settings.baseScore;
        cols = settings.cols;
        rows = settings.rows;
        
        if (startJewels) {
            jewels = startJewels;
        } else {
            fillBoard();
        }
        callback();
 //       print();
    }
   
    function print() {
        var str = "";
        for (var y = 0; y < rows; y++) {
            for (var x = 0; x < cols; x++) {
                str += jewels[x][y] + " ";
            }
            str += "\r\n";
        }
        console.log(str);
    }

    return {
        initialize : initialize,
        swap : swap,
        getJewel : getJewel,
        isWhite : isWhite,
        isBlack : isBlack,
        setLastMoveFrom : setLastMoveFrom,
        setLastMoveTo : setLastMoveTo,
        getLastMoveTo : getLastMoveTo,
        validMove : validMove,
        signAttackedFields : signAttackedFields,
        isChecked : isChecked,
        getKing : getKing,
        setKing : setKing,
        setCPA : setCPA,
        getCPA : getCPA,
        setCreatePiece : setCreatePiece,
        setenPassant : setenPassant,
        checkPawn : checkPawn,
        getBoard : getBoard
     //   print : print
    };

})();
