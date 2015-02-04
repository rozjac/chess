jewel.screens["game-screen"] = (function() {
    var settings = jewel.settings,
        storage = jewel.storage,
        board = jewel.board,
        display = jewel.display,
        input = jewel.input,
        audio = jewel.audio,
        cursor,
        gameState,
        gameState1,
        delta = settings.baseLevelTimer, 
        delta1 = settings.baseLevelTimer,
        firstRun = true,
        paused = false,
        white = true,
        moves = [], 
        pauseTime,
        wsUri = "ws://192.168.1.2:9000/server.php", 	
	websocket = new WebSocket(wsUri); 
        
    function startGame() {
        gameState = {
            level : 0,
            tmp : 0,
            timer : 0, // Odniesienie dla funkcji setTimeout(). 
            startTime : 0, // Czas usdtawiany po osiagniêciu poziomu.
            endTime : 0 // Czas pozosta³y do koñca gry. 
        };
        gameState1 = {
            level : 0,
            tmp : 0,
            timer : 0, // Odniesienie dla funkcji setTimeout(). 
            startTime : 0, // Czas usdtawiany po osiagniêciu poziomu.
            endTime : 0 // Czas pozosta³y do koñca gry. 
        };
        cursor = {
            x : 0,
            y : 0,
            selected : false
        };
        
        var activeGame = storage.get("activeGameData"),
            useActiveGame,
            startJewels;

        if (activeGame) {
            useActiveGame = window.confirm(
                "Czy chcesz kontynuowaÄ‡ wczeÅ›niej rozpoczÄ™tÄ… rozgrywkÄ™?"
            );
            if (useActiveGame) {
                gameState.level = activeGame.level;
                startJewels = activeGame.jewels;
            }
            else {
                white = true; 
            }
        }
       
        board.initialize(startJewels, function() {
            display.initialize('game',function() {
                display.redraw(board.getBoard(), function() {
                    audio.initialize();
                    if (useActiveGame) {
                        setLevelTimer(true, activeGame.time);
                    } else {
                        advanceLevel();
                    }
                });
            });
        });
    }

    function announce(str) {
        var element = $("#game-screen .announcement");
        element.text(str);       
        if (Modernizr.cssanimations) {
            element.removeClass("zoomfade");
            setTimeout(function() {
                element.addClass("zoomfade");
            }, 1);
        } else {
            element.addClass("active");
            setTimeout(function() {
                element.removeClass("active");
            }, 1000);
        }
    };
    
    function advanceLevel() {
        gameState.level++;
        announce("Start Gry");
        audio.play("levelup");
                
        gameState.startTime = Date.now();
        gameState1.startTime = Date.now();
        gameState.endTime = settings.baseLevelTimer;
         gameState1.endTime = settings.baseLevelTimer ;
        setLevelTimer(true);
    }

    function setLevelTimer(reset) {
        var percent, percent1,
            progress = $("#game-screen .time .indicator"),
            progress1 = $("#game-screen .time .indicator1"); 
        if (gameState.timer) {
            clearTimeout(gameState.timer);
            gameState.timer = 0;
        }
        if (gameState1.timer) {
            clearTimeout(gameState1.timer);
            gameState1.timer = 0;
        }
        if (reset) {
            gameState.startTime = Date.now();
            gameState.tmp = 0;
            gameState1.startTime = Date.now();
            gameState1.tmp = 0;
            gameState.endTime = settings.baseLevelTimer;
            gameState1.endTime = settings.baseLevelTimer;                       
        }
        if (white) {  
         delta = gameState.startTime +
                    gameState.endTime - Date.now() +
                         gameState1.tmp ; 
          percent = (delta / gameState.endTime) * 100;  
           gameState.tmp = Date.now() - gameState.startTime -  gameState1.tmp;   
        }
        else {            
            delta1 = gameState1.startTime +
                         gameState1.endTime - Date.now() +
                            gameState.tmp ;     
            percent1 = (delta1 / gameState1.endTime) * 100;   
            gameState1.tmp =  Date.now() - gameState1.startTime -  gameState.tmp ; 
        }                
            
        if (delta < 0 || delta1 < 0) {
            gameOver();
        } else {
            progress.css('width', percent + "%");
            progress1.css('width', percent1 + "%");
            gameState.timer = setTimeout(function() {
                setLevelTimer(false);
            }, 30);
           
        }
    }

    function gameOver() {
        audio.play("gameover");
        stopGame();
        storage.set("activeGameData", null);
        display.gameOver(function() {
            announce("Koniec gry!");           
        });
    };
    
    function run() {
        if (firstRun) {
            websocket.onopen = function(ev) { // connection is open 
		alert ('connected');
            };
            websocket.onmessage = function(ev) {
		var msg = JSON.parse(ev.data), //PHP sends Json data
		    type = msg.type, //message type
		    xFrom = msg.xFrom, 
		    yFrom = msg.yFrom, 
		    xTo = msg.xTo,
                    yTo = msg.yTo;
                if (msg.piece) {
                    var piece = msg.piece;
                }
		if(type === 'usermsg') 
		{
                    
                    
                    if ((xTo !== xFrom 
                        && (board.getJewel(xFrom, yFrom) === 5 || board.getJewel(xFrom, yFrom) === 11) 
                        && board.getJewel(xTo, yTo)) === 'undefined') {
                            board.setenPassant();                    
                    }
                    if (board.getJewel(xFrom, yFrom) === 0) {
                        board.setKing(xTo, yTo,'white');
                    }
                    if (board.getJewel(xFrom, yFrom) === 6) {
                        board.setKing(xTo, yTo,'black');
                    }
                    if ((yTo === 7 && board.getJewel(xFrom, yFrom) === 5 && (board.getJewel(xTo, yTo) > 5 || board.getJewel(xTo, yTo) === 'undefined')) 
                        || (yTo === 0 && board.getJewel(xFrom, yFrom) === 11 && (board.getJewel(xTo, yTo) < 5 || board.getJewel(xTo, yTo) === 'undefined'))) {  
                       console.log(piece);
                        board.setCPA(piece);
                        board.setCreatePiece();
                        board.swap(xFrom, yFrom, 
                            xTo, yTo, playBoardEvents);
                    }
                    
                    else if (yTo === 7 && board.getJewel(xFrom, yFrom) === 'undefined') {
                        white = true;
                    }
                    else if (yTo === 0 && board.getJewel(xFrom, yFrom) === 'undefined') {
                        white = false;
                    }
                    else {
                  //      alert(xFrom+' '+yFrom+' '+xTo+' '+yTo+' '+board.getJewel(xFrom, yFrom));
                        board.swap(xFrom, yFrom, 
                        xTo, yTo, playBoardEvents);
                    }
                        if ((xFrom - xTo) === 2 && board.getJewel(xTo, yTo) === 0 && board.getJewel(0, 0) === 4) {
                            board.swap(0, 0, 2, 0, jewel.screens["game-screen"].playBoardEvents);
                        }
                        if ((xTo - xFrom) === 2 && board.getJewel(xTo, yTo) === 0 && board.getJewel(7, 0) === 4) {
                            board.swap(7, 0, 4, 0, jewel.screens["game-screen"].playBoardEvents);
                        }
                        if ((xFrom - xTo) === 2 && board.getJewel(xTo, yTo) === 6 && board.getJewel(0, 7) === 10) {
                            board.swap(0, 7, 2, 7, jewel.screens["game-screen"].playBoardEvents);
                        }
                        if ((xTo - xFrom) === 2 && board.getJewel(xTo, yTo) === 6 && board.getJewel(7, 7) === 10) {
                            board.swap(7, 7, 4, 7, jewel.screens["game-screen"].playBoardEvents);
                        }
                    setCursorAfter(xTo, yTo, false); 
                    board.setLastMoveTo(xTo,yTo);
                    doThingsAfterMove();
		}
            };
	
	websocket.onerror	= function(ev){alert("Error Occurred - "+ev.data); };
	websocket.onclose 	= function(ev){alert('Connection Closed');};
            setup();
            firstRun = false;
        }
        startGame();
    }

    function setCursor(x, y, select) {
        if (white) {
            if (board.isWhite(x,y) && board.validMove(x,y,true)) {
                cursor.x = x;
                cursor.y = y;
                cursor.selected = select;
                display.setCursor(x, y, select);
            }
            else {
                audio.play("badswap"); 
            }
        }
        else {
            if (board.isBlack(x,y) && board.validMove(x,y,true)) {
                cursor.x = x;
                cursor.y = y;
                cursor.selected = select;
                display.setCursor(x, y, select);
            }
            else {
                audio.play("badswap"); 
            }
        }
        
    };
    function setCursorAfter(x, y, select) {
        cursor.x = x;
        cursor.y = y;
        cursor.selected = select;
        display.setCursor(x, y, select);
    };
   

    function selectJewel(x, y) {
        var move = {
                xFrom :0,
                yFrom :0,
                xTo : 0,
                yTo : 0        
            },
            msg = {
		xFrom:0,
		yFrom: 0,
		xTo : 0,
                yTo : 0
            };
   //         websocket.send(JSON.stringify(msg));
        if (arguments.length === 0) {
            selectJewel(cursor.x, cursor.y);
            return;
        }
        if (cursor.selected) {
            var dx = Math.abs(x - cursor.x),
                dy = Math.abs(y - cursor.y),
                dist = dx + dy;

            if (dist === 0) {
                // Odznacza wybrany klejnot. 
             //   setCursor(x, y, false);
             return;
            } 
            else {
                if (!board.validMove(x,y,false)) {
                     audio.play("badswap"); 
                     return;
                }
                else { 
                    
              //      alert(msg.xFrom+' '+msg.yFrom+' '+msg.xTo+' '+msg.yTo);
                   
                    
                    
                    if (board.checkPawn(x,y)) {
                           if (white) {
                                choosePiece('white'); 
                            }
                            else {
                                 choosePiece('black');  
                            }
                            board.setLastMoveTo(x,y);
                        while (board.getCPA() === 0) {                            
                            return ;
                        }
                    };
                    move.xFrom = cursor.x;
                    move.yFrom = cursor.y;
                    move.xTo = x;
                    move.yTo = y;
                    moves.push(move);             
                    msg = {
                        xFrom: cursor.x,
                        yFrom: cursor.y,
                        xTo : x,
                        yTo : y
                    };
                    websocket.send(JSON.stringify(msg));
                 /*   
                    board.swap(cursor.x, cursor.y, 
                    x, y, playBoardEvents);
                  */  
                   
                    
                    /*
                    setCursorAfter(x, y, false); 
                    board.setLastMoveTo(x,y);
                    doThingsAfterMove();  
                    */
                }
            }
        } 
        else {
            board.setLastMoveFrom(x,y);
            setCursor(x, y, true);
        }
    };
    
    function choosePiece(color) {
        if (color === 'white') {
            $("#game-screen .pause-overlay, #game-screen .newpieces").addClass("active"); 
        }
        else {
            $("#game-screen .pause-overlay, #game-screen .newpiecesb").addClass("active"); 
        }    
    };

    function playBoardEvents(events) {
        if (events.length > 0) {
            var boardEvent = events.shift(),                
                next = function() {
                    playBoardEvents(events);
                };
            switch (boardEvent.type) {
                case "move" :
                    display.moveJewels(boardEvent.data,next);
                    break;                
                case "capture" :
                     audio.play("capture"); 
                     next();
                    break;
                default :
                    next();
                    break;
            }
        } else {
            display.redraw(board.getBoard(), function() {
                // Ponowne wype³nianie planszy.
            });
        }
    }
    
    function moveCursor(x, y) {
        if (cursor.selected) {
            x += cursor.x;
            y += cursor.y;
            if (x >= 0 && x < settings.cols 
                && y >= 0 && y < settings.rows) {
                selectJewel(x, y);
            }
        } else {
            x = (cursor.x + x + settings.cols) % settings.cols;
            y = (cursor.y + y + settings.rows) % settings.rows;
            setCursor(x, y, false);
        }
    }

    function moveUp() {
        moveCursor(0, -1);
    }

    function moveDown() {
        moveCursor(0, 1);
    }

    function moveLeft() {
        moveCursor(-1, 0);
    }

    function moveRight() {
        moveCursor(1, 0);
    }
    
    function stopGame() {
        clearTimeout(gameState.timer);
    }
    
     function saveGameData() {
        storage.set("activeGameData", {
            level : gameState.level,
            time : Date.now() - gameState.startTime,
            jewels : board.getBoard()
        });
    }

    function togglePause(enable) {
        if (enable === paused) return; // Brak zmian.

        var overlay = $("#game-screen .pause-overlay");
        paused = enable;
        overlay.css('display', paused ? "block" : "none");

        if (paused) {
            clearTimeout(gameState.timer);
            gameState.timer = 0;
            pauseTime = Date.now();
        } else {
            gameState.startTime += Date.now() - pauseTime;
            setLevelTimer(false);
        }
    };
    
    function doThingsAfterMove() {
        var coord = [],
                i,j,k,
                str = '';
                    if (white) {
                        for (i = 0; i < moves.length; i++) {
                             str += '{xFrom:'+moves[i].xFrom+',yFrom:'+moves[i].yFrom+',xTo:'+moves[i].xTo+',yTo:'+moves[i].yTo+'},';
                         }
                            console.log(str);
                        white = false;
                        board.signAttackedFields('white');
                        coord = board.getKing('black');
                        k = 0;
                        for (i = 0; i < 8; i++) {
                            for (j = 0; j < 8; j++) {
                                 board.setLastMoveFrom(i,j);
                                 if (board.isBlack(i,j) && board.validMove(i,j,true)) {
                                    k += 1; 
                                 }
                            }    
                        }
                        if (k === 0 && board.isChecked(coord[0],coord[1],'black')) {
                            audio.play("gameover");
                            stopGame();
                            storage.set("activeGameData", null);
                            storage.set("chessGame", moves);
                            display.gameOver(function() {
                                announce("Mat");           
                            }); 
                         
                        }
                        else if (k === 0 && !board.isChecked(coord[0],coord[1],'black')) {
                            announce("Pat");
                            audio.play("gameover");
                            stopGame();
                            storage.set("activeGameData", null);
                            storage.set("chessGame", moves);
                        }
                        else if (board.isChecked(coord[0],coord[1],'black')) {                           
                             audio.play("match");
                        }
                        
                    } 
                    else {
                        white = true;
                        board.signAttackedFields('black');
                        coord = board.getKing('white');
                        k = 0;
                        for (i = 0; i < 8; i++) {
                            for (j = 0; j < 8; j++) {
                                 board.setLastMoveFrom(i,j);
                                 if (board.isWhite(i,j) && board.validMove(i,j,true)) {
                                    k += 1; 
                                 }
                            }    
                        }
                        if (k === 0 && board.isChecked(coord[0],coord[1],'white')) {
                            audio.play("gameover");
                            stopGame();
                            storage.set("activeGameData", null);
                            storage.set("chessGame", moves);
                            display.gameOver(function() {
                                announce("Mat");           
                            }); 
                        }
                        else if (k === 0 && !board.isChecked(coord[0],coord[1],'white')) {
                            announce("Pat");
                            audio.play("gameover");
                            stopGame();
                            storage.set("activeGameData", null);
                            storage.set("chessGame", moves);
                        }
                        else if (board.isChecked(coord[0],coord[1],'white')) {                           
                             audio.play("match");
                        }                       
                    }
    };

    function setup() {
        input.initialize();
        input.bind("selectJewel", selectJewel);
        input.bind("moveUp", moveUp);
        input.bind("moveDown", moveDown);
        input.bind("moveLeft", moveLeft);
        input.bind("moveRight", moveRight);
        
        $("#game-screen .newpieces, #game-screen .newpiecesb").on("click", function(e) {
            var move = {
                    xFrom :0,
                    yFrom :0,
                    xTo : 0,
                    yTo : 0,
                    piece : 0
                },
                msg = {},
                coord = [],
                action = $(e.target).attr("id"); 
                switch (action) {
                case "queen" :
                    board.setCPA(1);
                    break;
                case "bishop" :
                     board.setCPA(2);
                    break;
                case "knight" :
                     board.setCPA(3);
                    break;
                case "rook" :
                     board.setCPA(4);
                    break; 
                case "queenb" :
                    board.setCPA(7);
                    break;
                case "bishopb" :
                     board.setCPA(8);
                    break;
                case "knightb" :
                     board.setCPA(9);
                    break;
                case "rookb" :
                     board.setCPA(10);
                    break; 
                default :
                  //  board.setCPA(1);
                    break;
            }
            $("#game-screen .pause-overlay, #game-screen .newpieces, #game-screen .newpiecesb").removeClass('active');
                coord = board.getLastMoveTo();            
                board.swap(cursor.x, cursor.y, 
                coord[0],coord[1], playBoardEvents); 
                    move.xFrom = cursor.x;
                    move.yFrom = cursor.y;
                    move.xTo = coord[0];
                    move.yTo = coord[1];
                    move.piece = board.getJewel( move.xTo,move.yTo);
                    moves.push(move);
                    console.log( move.piece);
                    msg = {
                        xFrom : cursor.x,
                        yFrom : cursor.y,
                        xTo : coord[0],
                        yTo : coord[1],
                        piece : move.piece
                    };
                    websocket.send(JSON.stringify(msg));
                    setCursorAfter(coord[0], coord[1], false); 
                    doThingsAfterMove();
        });
      
        $("#game-screen button[name=exit]").on("click", function() {
                togglePause(true);
                var exitGame = window.confirm(
                    "Czy chcesz powrÃ³ciÄ‡ do gÅ‚Ã³wnego menu?"
                );
                togglePause(false);
                if (exitGame) {
                    saveGameData();
                    stopGame();
                    moves = [];                   
                    jewel.game.showScreen("main-menu");
                        $("#game-screen .game-board canvas").remove();
                    
                }            
         });
        
    }
    
    return {
        run : run,
        playBoardEvents : playBoardEvents
    };
})();
