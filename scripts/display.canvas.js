jewel.display = (function() {
    var canvas, ctx,
        cols, rows,
        jewelSize,
        jewels,
     //   firstRun = true,
        cursor,
        previousCycle,
        animations = [];
    
    function createBackground() {
        var background = ($('<canvas class="background"></canvas>'))[0] ,
            bgctx = background.getContext("2d");

        background.width = cols * jewelSize;
        background.height = rows * jewelSize;

        
        for (var x=0;x<cols;x++) {
            for (var y=0;y<cols;y++) {
                if ((x+y) % 2) {
                    bgctx.fillStyle = "rgba(195,225,250,1)";
                    bgctx.fillRect(
                        x * jewelSize, y * jewelSize,
                        jewelSize, jewelSize
                    );
                }
                else {
                    bgctx.fillStyle = "rgba(255,235,255,1)";                    
                    bgctx.fillRect(
                        x * jewelSize, y * jewelSize,
                        jewelSize, jewelSize
                    );
                }
            }
        }
        return background;
    }
 
    function setup(from) {
        if (from ==='game') {
            var boardElement = $("#game-screen .game-board");
        }
        else {
            var boardElement = $("#demo .game-board");
        }
        cols = jewel.settings.cols;
        rows = jewel.settings.rows;
        jewelSize = jewel.settings.jewelSize;

        canvas = ($('<canvas class="board"></canvas>'))[0],  
        ctx = canvas.getContext("2d");
        canvas.width = cols * jewelSize;
        canvas.height = rows * jewelSize;
        ctx.scale(jewelSize, jewelSize);
        
        boardElement.append(canvas);
        boardElement.append(createBackground());
        previousCycle = Date.now();
        requestAnimationFrame(cycle);
    }

    function addAnimation(runTime, fncs) {
        var anim = {
            runTime : runTime,
            startTime : Date.now(),
            pos : 0,
            fncs : fncs
        };
        animations.push(anim);
    }

    function renderAnimations(time, lastTime) {
        var anims = animations.slice(0), // Kopiuje listę.
            n = anims.length,
            animTime,
            anim,
            i;

        // Wywołuje funkcję before(). 
        for (i=0;i<n;i++) {
            anim = anims[i];
            if (anim.fncs.before) {
                anim.fncs.before(anim.pos);
            }
            anim.lastPos = anim.pos;
            animTime = (lastTime - anim.startTime);
            anim.pos = animTime / anim.runTime;
            anim.pos = Math.max(0, Math.min(1, anim.pos));
        }

        animations = []; // Resetuje listę animacji.

        for (i=0;i<n;i++) {
            anim = anims[i];
            anim.fncs.render(anim.pos, anim.pos - anim.lastPos);
            if (anim.pos === 1) {
                if (anim.fncs.done) {
                    anim.fncs.done();
                }
            } 
            else {
                animations.push(anim);
            }
        }
    };
    
    function drawJewel(type, x, y, scale, rot) {
        var image = jewel.images["images/jewels" +
                        jewelSize + ".png"];
        ctx.save();
        if (typeof scale !== "undefined" && scale > 0) {
            ctx.beginPath();
            ctx.rect(x,y,1,1);
            ctx.clip();
            ctx.translate(x + 0.5, y + 0.5);
            ctx.scale(scale, scale);
            if (rot) {
                ctx.rotate(rot);
            }
            ctx.translate(-x - 0.5, -y - 0.5);
        }
        if (type < 6) {
            ctx.drawImage(image,
                type * jewelSize + 5, 0, jewelSize, jewelSize,
                x, y, 1, 1
            );
        }
        else {
            ctx.drawImage(image,
                (type-6) * jewelSize + 5, 64, jewelSize, jewelSize,
                x, y, 1, 1
            );
        };
        ctx.restore();
    };

    function redraw(newJewels, callback) {
        var x, y;
        jewels = newJewels;
        ctx.clearRect(0,0,canvas.width,canvas.height);
        for (x = 0; x < rows; x++) {
            for (y = 0; y < cols; y++) {
                drawJewel(jewels[x][y], x, y);
            }
        }
        callback();
        renderCursor();
    }

    function clearJewel(x, y) {
        ctx.clearRect(x, y, 1, 1);
    }

    
    function clearCursor() {
        if (cursor) {
            var x = cursor.x,
                y = cursor.y;
            clearJewel(x, y);
            drawJewel(jewels[x][y], x, y);
        }
    };

    function setCursor(x, y, selected) {
        clearCursor();
        if (arguments.length > 0) {
            cursor = {
                x : x,
                y : y,
                selected : selected
            };
        } else {
            cursor = null;
        }
        renderCursor();
    }
    
    function moveJewels(movedJewels, callback) {
        var n = movedJewels.length;
            cursor = null;
        movedJewels.forEach(function(e) {
            var x = e.fromX, y = e.fromY,
                dx = e.toX - e.fromX,
                dy = e.toY - e.fromY,
                dist = Math.abs(dx) + Math.abs(dy);
            addAnimation(100 * dist, {
                before : function(pos) {
                    ctx.save();
                    ctx.globalCompositeOperation = "xor";
             //     ctx.globalAlpha = 1;
                    pos = Math.sin(pos * Math.PI / 2);
                    drawJewel(
                      e.type,
                    x + dx  * pos , y + dy  * pos
                    );
                    ctx.restore();
               //     clearJewel(x + dx  * pos , y + dy  * pos );
                },
                render : function(pos) {              
                    ctx.save();
                    ctx.globalCompositeOperation = "destination-over";
             //     ctx.globalAlpha = 0.6;
                    pos = Math.sin(pos * Math.PI / 2);                    
                    drawJewel(
                      e.type,
                    x + dx  * pos , y + dy  * pos
                    );
                    ctx.restore();
                },
                done : function() {
                    if (--n === 0) {
                        callback();
                    }
                }
            });
        });
    };

    function explodePieces(pieces, pos, delta) {
        var piece, i;
        for (i=0;i<pieces.length;i++) {
            piece = pieces[i];

            piece.vel.y += 50 * delta;
            piece.pos.y += piece.vel.y * delta;
            piece.pos.x += piece.vel.x * delta;

            if (piece.pos.x < 0 || piece.pos.x > cols) {
                piece.pos.x = Math.max(0, piece.pos.x);
                piece.pos.x = Math.min(cols, piece.pos.x);
                piece.vel.x *= -1;
            }

            ctx.save();
            ctx.globalCompositeOperation = "lighter";
            ctx.translate(piece.pos.x, piece.pos.y);
            ctx.rotate(piece.rot * pos * Math.PI * 4);
            ctx.translate(-piece.pos.x, -piece.pos.y);
            drawJewel(piece.type,
                piece.pos.x - 0.5,
                piece.pos.y - 0.5
            );
            ctx.restore();
        }
    }

    function explode(callback) {
        var pieces = [],
            piece,
            x, y;
        for (x=0;x<cols;x++) {
            for (y=0;y<rows;y++) {
                piece = {
                    type : jewels[x][y],
                    pos : {
                        x : x + 0.5,
                        y : y + 0.5
                    },
                    vel : {
                        x : (Math.random() - 0.5) * 20,
                        y : -Math.random() * 10
                    },
                    rot : (Math.random() - 0.5) * 3
                };
                pieces.push(piece);
            }
        }

        addAnimation(2000, {
            before : function(pos) {
                ctx.clearRect(0,0,cols,rows);
            },
            render : function(pos, delta) {
                explodePieces(pieces, pos, delta);
            },
            done : callback
        });
    }

    
    function gameOver(callback) {
        addAnimation(1000, {
            render : function(pos) {
                $('.board').css('left',
                    0.2 * pos * (Math.random() - 0.5) + "em");
                 $('.board').css('top',
                    0.2 * pos * (Math.random() - 0.5) + "em");
            },
            done : function() {
                 $('.board').css('left', 0);
                 $('.board').css('top',  0);
                explode(callback);
            }
        });
    }
    
    function renderCursor(time) {
        if (!cursor) {
            return;
        }
        var x = cursor.x,
            y = cursor.y,
            t1 = (Math.sin(time / 200) + 1) / 2,
            t2 = (Math.sin(time / 400) + 1) / 2;

        clearCursor();

        if (cursor.selected) {
            ctx.save();
            ctx.globalCompositeOperation = "lighter";
            ctx.globalAlpha = 0.8 * t1;
            drawJewel(jewels[x][y], x, y);
            ctx.restore();
        }
        ctx.save();
        ctx.lineWidth = 0.09;
        ctx.strokeStyle =
            "rgba(50,250,50," + (0.5 + 0.5 * t2) + ")";
        ctx.strokeRect(x+0.05,y+0.05,0.9,0.9);
        ctx.restore();
    }

    function cycle(time) {
        renderCursor(time);
        renderAnimations(time, previousCycle);
        previousCycle = time;
        requestAnimationFrame(cycle);
    }

    function initialize(from,callback) {
        setup(from);
        callback();
    }

    return {
        initialize : initialize,
        redraw : redraw,
        setCursor : setCursor,
        moveJewels : moveJewels,
        gameOver : gameOver
    };
})();
