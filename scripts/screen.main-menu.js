jewel.screens["main-menu"] = (function() {
    var game = jewel.game,
        firstRun = true;

    function setup() {
        $("#main-menu ul.menu").on("click", function(e) { 
            if (e.target.nodeName.toLowerCase() === "button") {
                var action = $(e.target).attr("name");
                    game.showScreen(action); 
            }
        });
    }

    function run() {
        if (firstRun) {
            setup();
            firstRun = false;
        }
    }

    return {
        run : run
    };
})();
