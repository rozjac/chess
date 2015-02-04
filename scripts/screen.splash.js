jewel.screens["splash-screen"] = (function() {
    var game = jewel.game,
        firstRun = true;
        
    function setup(getLoadProgress) {
        var scr = $("#splash-screen");
        function checkProgress() {
            var p = getLoadProgress() * 100;
            $(".indicator",scr).css('width', p + '%');
            if (p === 100) {
                $(".continue",scr).css('display', "block");
                scr.click(function() {
                    game.showScreen("main-menu");
                });
            } else {
                setTimeout(checkProgress, 30);
            }
        }

        checkProgress();
    }
    
    function run(getLoadProgress) {
        if (firstRun) {
            setup(getLoadProgress);
            firstRun = false;
        }
    }

    return {
        run : run
    };
})();
