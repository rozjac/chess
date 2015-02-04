window.requestAnimationFrame = (function() {
    return  window.webkitRequestAnimationFrame
        || window.mozRequestAnimationFrame
        || window.oRequestAnimationFrame
        || window.msRequestAnimationFrame
        || function(callback, element) {
            return window.setTimeout(
                function() {
                    callback(Date.now());
                }, 1000 / 60
            );
        };
})();

window.cancelRequestAnimationFrame = (function() {
    return window.webkitCancelRequestAnimationFrame
        || window.mozCancelRequestAnimationFrame
        || window.oCancelRequestAnimationFrame
        || window.msCancelRequestAnimationFrame
        || window.clearTimeout;
})();
