jewel.game = (function() {

    /* ukrywa aktywny ekran i wyœwietla ekran 
     * o podanym identyfikatorze. */
    function showScreen(screenId) {
        var activeScreen = $("#game .screen.active"),
            screen = $("#" + screenId);
        if (activeScreen) {
            activeScreen.removeClass("active");
        }
        
        // Wyodrêbnia parametry ekranu z argumentów.
        var args = Array.prototype.slice.call(arguments, 1);
        // Uruchamia modu³ ekranu.
        jewel.screens[screenId].run.apply(
            jewel.screens[screenId], args
        );

        // Wyœwietla poszukiwany ekran.
        screen.addClass("active");
    }
    
    // Umieszcza deseñ w tle.
    function createBackground() {
        if (!Modernizr.canvas) return;

        var canvas = document.createElement("canvas"),
            ctx = canvas.getContext("2d"),
            background = $("#game .background"),
        //    rect = background.getBoundingClientRect(),
            gradient,
            i;

        canvas.width = 512;
        canvas.height = 512;

        ctx.scale(512, 512);

        gradient = ctx.createRadialGradient(
            0.25, 0.15, 0.5,
            0.25, 0.15, 1
        );
        gradient.addColorStop(0, "rgb(55,65,50)");
        gradient.addColorStop(1, "rgb(0,0,0)");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 1, 1);

        ctx.strokeStyle = "rgba(255,255,255,0.02)";
        ctx.strokeStyle = "rgba(0,0,0,0.2)";
        ctx.lineWidth = 0.008;
        ctx.beginPath();
        for (i=0;i<2;i+=0.020) {
            ctx.moveTo(i, 0);
            ctx.lineTo(i - 1, 1);
        }
        ctx.stroke();
        background.append(canvas);
    }


    function setup() {
        // Wy³¹cza wbudowane zdarzenie przewijania dotykiem. 
        // Zapobiega przewijaniu strony. 
        $(document).on('touchmove', function(event) {
            event.preventDefault();
        });
        // Chowa pasek adresów w Androidzie.
        if (/Android/.test(navigator.userAgent)) {
            $("html").css('height','200%');           
            $.scrollTo(0, 'slow');         
        }
        
        createBackground();
    }
    
    // Wy³ania metody publiczne.
    return {
        setup : setup,
        showScreen : showScreen
    };
})();
