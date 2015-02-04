jewel.input = (function() {
    var settings = jewel.settings,
        inputHandlers,
        keys = {
        37 : "KEY_LEFT",
        38 : "KEY_UP",
        39 : "KEY_RIGHT",
        40 : "KEY_DOWN",
        13 : "KEY_ENTER",
        32 : "KEY_SPACE",
        65 : "KEY_A",
        66 : "KEY_B",
        67 : "KEY_C",
        // Kody klawiszy alfabetu 68 � 87
        88 : "KEY_X",
        89 : "KEY_Y",
        90 : "KEY_Z"
    };
        
    function handleClick(event, control, click) {
        // Sprawdza czy do otrzymanego sygna�u przypisano akcj�.
        var action = settings.controls[control],
            relX, relY,
            jewelX, jewelY;
        if (!action) {
            return;
        }
        
        // Sprawdza wsp�rz�dne klikni�cia wzgl�dem planszy. 
        relX = click.clientX ;
        relY = click.clientY ;
        // Wsp�rz�dne klejnotu.
        jewelX = Math.floor(relX / 512 * settings.cols);
        jewelY = Math.floor(relY / 512 * settings.rows);
        // Wyzwala funkcje przypisane danemu dzia�aniu. 
        trigger(action, jewelX, jewelY);
        // Zapobiega zaj�ciu domy�lnej odpowiedzi przegl�darki na klikni�cie.
        event.preventDefault();
    }

    function initialize() {
        inputHandlers = {};
        var board = $("#game-screen .game-board");

        board.on("mousedown", function(event) {
            handleClick(event, "CLICK", event);
        });
        
        board.on("touchstart", function(event) {
            handleClick(event, "TOUCH", event.targetTouches[0]);
        });
        
        $(document).on("keydown", function(event) {
            var keyName = keys[event.keyCode];
            if (keyName && settings.controls[keyName]) {
                event.preventDefault();
                trigger(settings.controls[keyName]);
            }
        });

    }


    function bind(action, handler) {
        if (!inputHandlers[action]) {
            inputHandlers[action] = [];
        }
        inputHandlers[action].push(handler);
    }

    function trigger(action) {
        var handlers = inputHandlers[action],
            args = Array.prototype.slice.call(arguments, 1);

        if (handlers) {
            for (var i=0;i<handlers.length;i++) {
                handlers[i].apply(null, args);
            }
        }
    }

    return {
        initialize : initialize,
        bind : bind
    };
})();
