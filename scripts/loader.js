var jewel = {
    screens : {},
    settings : {
        rows : 8,
        cols : 8,
        numJewelTypes : 12,
        baseLevelTimer : 1000000,
        jewelSize : 64,
        controls : {
            KEY_UP : "moveUp",
            KEY_LEFT : "moveLeft",
            KEY_DOWN : "moveDown",
            KEY_RIGHT : "moveRight",
            KEY_ENTER : "selectJewel",
            KEY_SPACE : "selectJewel",
            CLICK : "selectJewel",
            TOUCH : "selectJewel"
        }
    },
    images : {}
};

$(document).ready(function(){

// Wczytywanie wstÄ™pne. 
yepnope.addPrefix("preload", function(resource) {
    resource.noexec = true;
    return resource;
});

var numPreload = 0,
    numLoaded = 0;

yepnope.addPrefix("loader", function(resource) {
    // console.log("Å?adowanie: " + resource.url)
    
    var isImage = /.+\.(jpg|png|gif)$/i.test(resource.url);
    resource.noexec = isImage;

    numPreload++;
    resource.autoCallback = function(e) {
        // console.log("PostÄ™p Å‚adowania: " + resource.url)
        numLoaded++;
        if (isImage) {
            var image = new Image();
            image.src = resource.url;
            jewel.images[resource.url] = image;
        }
    };
    return resource;
});

function getLoadProgress() {
    if (numPreload > 0) {
        return numLoaded / numPreload;
    } else {
        return 0;
    }
}

// Å?adowanie â€” etap 1.
Modernizr.load([
{ 
    test : Modernizr.localstorage,
    yep : "scripts/storage.js",
    nope : "scripts/storage-cookie.js"
},{   
    load : [
        "scripts/requestAnimationFrame.js",
        "scripts/game.js",
        "scripts/screen.splash.js"
    ]
},{  
    complete : function() {       
        jewel.game.setup();        
        jewel.game.showScreen("splash-screen",
                getLoadProgress);
        
    }
}
]);

// Å?adowanie â€” etap 2.

    Modernizr.load([
    {
        test : Modernizr.canvas,
        yep : "loader!scripts/display.canvas.js",
        nope : "loader!scripts/display.dom.js"
    },{
        load : [
            "loader!scripts/board.js",
            "loader!scripts/audio.js",
            "loader!scripts/input.js",
            "loader!scripts/screen.main-menu.js",
            "loader!scripts/screen.game.js",
            "loader!scripts/screen.demo.js",
            "loader!images/jewels"
                + jewel.settings.jewelSize + ".png"
        ]
    }
    ]);
});
