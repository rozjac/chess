jewel.screens["demo"] = (function() {
    var storage = jewel.storage,
        board = jewel.board,
        display = jewel.display,
        audio = jewel.audio,
        firstRun = true,
        paused = false;

    function setup() {
       
        $("#demo button[name=back]").on("click", function() {  
            paused = true;
            board.setKing(3, 0,'white');
            board.setKing(3, 7,'black');
            jewel.game.showScreen("main-menu"); 
            $('#demo .game-board canvas').remove();
            
        });
    };
    function startDemo() {
        var startJewels,
            i,j,
            game,
            coord = [],
            moves = [{xFrom:1,yFrom:0,xTo:2,yTo:2},{xFrom:1,yFrom:7,xTo:2,yTo:5},{xFrom:5,yFrom:1,xTo:5,yTo:3},{xFrom:1,yFrom:6,xTo:1,yTo:5},{xFrom:6,yFrom:0,xTo:5,yTo:2},{xFrom:2,yFrom:7,xTo:1,yTo:6},{xFrom:4,yFrom:1,xTo:4,yTo:3},{xFrom:3,yFrom:7,xTo:1,yTo:7},{xFrom:5,yFrom:0,xTo:2,yTo:3},{xFrom:4,yFrom:6,xTo:4,yTo:4},{xFrom:4,yFrom:0,xTo:6,yTo:2},{xFrom:4,yFrom:4,xTo:5,yTo:3},{xFrom:6,yFrom:2,xTo:5,yTo:3},{xFrom:5,yFrom:6,xTo:5,yTo:5},{xFrom:3,yFrom:1,xTo:3,yTo:3},{xFrom:6,yFrom:7,xTo:4,yTo:6},{xFrom:7,yFrom:0,xTo:4,yTo:0},{xFrom:4,yFrom:6,xTo:6,yTo:5},{xFrom:5,yFrom:3,xTo:5,yTo:4},{xFrom:5,yFrom:7,xTo:1,yTo:3},{xFrom:2,yFrom:3,xTo:1,yTo:4},{xFrom:6,yFrom:5,xTo:7,yTo:3},{xFrom:5,yFrom:4,xTo:7,yTo:2},{xFrom:7,yFrom:3,xTo:5,yTo:2},{xFrom:6,yFrom:1,xTo:5,yTo:2},{xFrom:2,yFrom:5,xTo:3,yTo:3},{xFrom:1,yFrom:4,xTo:3,yTo:6},{xFrom:4,yFrom:7,xTo:6,yTo:5},{xFrom:2,yFrom:0,xTo:5,yTo:3},{xFrom:3,yFrom:3,xTo:5,yTo:2},{xFrom:3,yFrom:6,xTo:5,yTo:4},{xFrom:2,yFrom:7,xTo:3,yTo:7},{xFrom:3,yFrom:0,xTo:2,yTo:0},{xFrom:1,yFrom:3,xTo:3,yTo:5},{xFrom:5,yFrom:4,xTo:6,yTo:5},{xFrom:3,yFrom:5,xTo:5,yTo:3},{xFrom:2,yFrom:0,xTo:1,yTo:0},{xFrom:5,yFrom:2,xTo:3,yTo:1},{xFrom:1,yFrom:0,xTo:2,yTo:0},{xFrom:3,yFrom:1,xTo:4,yTo:3},{xFrom:2,yFrom:0,xTo:1,yTo:0},{xFrom:4,yFrom:3,xTo:3,yTo:1},{xFrom:1,yFrom:0,xTo:2,yTo:0},{xFrom:3,yFrom:1,xTo:5,yTo:2},{xFrom:2,yFrom:0,xTo:1,yTo:0},{xFrom:7,yFrom:6,xTo:6,yTo:5},{xFrom:7,yFrom:2,xTo:6,yTo:3},{xFrom:7,yFrom:7,xTo:7,yTo:3},{xFrom:6,yFrom:3,xTo:6,yTo:5},{xFrom:5,yFrom:2,xTo:4,yTo:0},{xFrom:0,yFrom:1,xTo:0,yTo:2},{xFrom:7,yFrom:3,xTo:7,yTo:1},{xFrom:1,yFrom:0,xTo:0,yTo:1},{xFrom:4,yFrom:0,xTo:2,yTo:1},{xFrom:0,yFrom:0,xTo:3,yTo:0},{xFrom:3,yFrom:7,xTo:3,yTo:0},{xFrom:6,yFrom:5,xTo:4,yTo:7},{xFrom:1,yFrom:6,xTo:2,yTo:7},{xFrom:2,yFrom:2,xTo:3,yTo:0},{xFrom:5,yFrom:3,xTo:4,yTo:4},{xFrom:3,yFrom:0,xTo:2,yTo:2},{xFrom:2,yFrom:1,xTo:3,yTo:3},{xFrom:4,yFrom:7,xTo:6,yTo:7},{xFrom:6,yFrom:6,xTo:6,yTo:4},{xFrom:0,yFrom:2,xTo:0,yTo:3},{xFrom:0,yFrom:6,xTo:0,yTo:4},{xFrom:2,yFrom:2,xTo:3,yTo:4},{xFrom:1,yFrom:7,xTo:1,yTo:6},{xFrom:0,yFrom:1,xTo:1,yTo:0},{xFrom:2,yFrom:7,xTo:5,yTo:4},{xFrom:1,yFrom:0,xTo:2,yTo:0},{xFrom:3,yFrom:3,xTo:1,yTo:2},{xFrom:2,yFrom:0,xTo:3,yTo:0},{xFrom:5,yFrom:4,xTo:6,yTo:3},{xFrom:3,yFrom:0,xTo:4,yTo:0},{xFrom:4,yFrom:4,xTo:6,yTo:2},{xFrom:4,yFrom:0,xTo:5,yTo:0},{xFrom:1,yFrom:2,xTo:3,yTo:1},{xFrom:5,yFrom:0,xTo:6,yTo:0},{xFrom:3,yFrom:1,xTo:5,yTo:2},{xFrom:6,yFrom:0,xTo:5,yTo:0},{xFrom:7,yFrom:1,xTo:5,yTo:1}];
            paused = false;
        board.initialize(startJewels, function() {
            display.initialize('demo',function() {
                display.redraw(board.getBoard(), function() { 
                    audio.initialize();
                 //   moves = storage.get("chessGame");
                    j = moves.length;
                    i = 0; 
                game = setInterval(function() {
                    if ((moves[i].yTo === 7 && board.getJewel(moves[i].xFrom, moves[i].yFrom) === 5) 
                        || (moves[i].yTo === 0 && board.getJewel(moves[i].xFrom, moves[i].yFrom) === 11)) {                       
                        board.setCPA(moves[i].piece);
                        board.setCreatePiece();
                    }
                    if ((moves[i].xTo !== moves[i].xFrom 
                        && (board.getJewel(moves[i].xFrom, moves[i].yFrom) === 5 || board.getJewel(moves[i].xFrom, moves[i].yFrom) === 11) 
                        && board.getJewel(moves[i].xTo, moves[i].yTo)) === 'undefined') {
                            board.setenPassant();                    
                    }
                    if (board.getJewel(moves[i].xFrom, moves[i].yFrom) === 0) {
                        board.setKing(moves[i].xTo, moves[i].yTo,'white');
                    }
                    if (board.getJewel(moves[i].xFrom, moves[i].yFrom) === 6) {
                        board.setKing(moves[i].xTo, moves[i].yTo,'black');
                    }
                    
                        board.swap(moves[i].xFrom, moves[i].yFrom, 
                            moves[i].xTo, moves[i].yTo, jewel.screens["game-screen"].playBoardEvents);
                            
                        if (i % 2 === 0) {
                            board.signAttackedFields('white');
                            coord = board.getKing('black'); 
                            console.log(coord[0]+' '+coord[1]);
                            if (board.isChecked(coord[0],coord[1],'black')) {                           
                                audio.play("match");
                            }
                        }
                        else {
                            board.signAttackedFields('black');
                            coord = board.getKing('white'); 
                            console.log(coord[0]+' '+coord[1]);
                            if (board.isChecked(coord[0],coord[1],'white')) {                           
                                audio.play("match");
                            }
                        }
                        if ((moves[i].xFrom - moves[i].xTo) === 2 && board.getJewel(moves[i].xTo, moves[i].yTo) === 0) {
                            board.swap(0, 0, 2, 0, jewel.screens["game-screen"].playBoardEvents);
                        }
                        if ((moves[i].xTo - moves[i].xFrom) === 2 && board.getJewel(moves[i].xTo, moves[i].yTo) === 0) {
                            board.swap(7, 0, 4, 0, jewel.screens["game-screen"].playBoardEvents);
                        }
                        if ((moves[i].xFrom - moves[i].xTo) === 2 && board.getJewel(moves[i].xTo, moves[i].yTo) === 6) {
                            board.swap(0, 7, 2, 7, jewel.screens["game-screen"].playBoardEvents);
                        }
                        if ((moves[i].xTo - moves[i].xFrom) === 2 && board.getJewel(moves[i].xTo, moves[i].yTo) === 6) {
                            board.swap(7, 7, 4, 7, jewel.screens["game-screen"].playBoardEvents);
                        }
                    i += 1;
                    if (i === j || paused) {
                        audio.play("gameover");
                        board.setKing(3, 0,'white');
                        board.setKing(3, 7,'black');
                        clearInterval(game);
                        display.gameOver(function() {
                                announce("Mat");           
                            }); 
                    }
                 }, 1200);
                });
            });
        });
    };
    function run() {
        if (firstRun) {
            setup();
            firstRun = false;
        }
        startDemo();
    };

   


    return {
        run : run
    };

})();
