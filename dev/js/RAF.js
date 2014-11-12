﻿define("RAF", {
    statics: {
        ctor: function () {
            window.requestAnimFrame = (function () {
                return window.requestAnimationFrame ||
                        window.webkitRequestAnimationFrame ||
                        window.mozRequestAnimationFrame ||
                        window.oRequestAnimationFrame ||
                        window.msRequestAnimationFrame ||
                        function (/* function */ callback, /* DOMElement */ element) {
                            window.setTimeout(callback, 1000 / 60);
                        };
            })();
            window.requestInterval = function (fn, delay) {
                if (!window.requestAnimationFrame &&
                    !window.webkitRequestAnimationFrame &&
                    // Firefox 5 ships without cancel support
                    !(window.mozRequestAnimationFrame && window.mozCancelRequestAnimationFrame) && 
                    !window.oRequestAnimationFrame &&
                    !window.msRequestAnimationFrame)
                    return window.setInterval(fn, delay);

                var start = new Date().getTime(),
                    handle = new Object();

                function loop() {
                    var current = new Date().getTime(),
                        delta = current - start;

                    if (delta >= delay) {
                        fn.call();
                        start = new Date().getTime();
                    }

                    handle.value = requestAnimFrame(loop);
                };

                handle.value = requestAnimFrame(loop);
                return handle;
            }

            /**
             * Behaves the same as clearInterval except uses cancelRequestAnimationFrame() where possible for better performance
             * @param {int|object} fn The callback function
             */
            window.clearRequestInterval = function (handle) {
                window.cancelAnimationFrame ? window.cancelAnimationFrame(handle.value) :
                window.webkitCancelAnimationFrame ? window.webkitCancelAnimationFrame(handle.value) :
                window.webkitCancelRequestAnimationFrame ? window.webkitCancelRequestAnimationFrame(handle.value) : /* Support for legacy API */
                window.mozCancelRequestAnimationFrame ? window.mozCancelRequestAnimationFrame(handle.value) :
                window.oCancelRequestAnimationFrame ? window.oCancelRequestAnimationFrame(handle.value) :
                window.msCancelRequestAnimationFrame ? window.msCancelRequestAnimationFrame(handle.value) :
                clearInterval(handle);
            };

            this.requestInterval = requestInterval;
            this.clearRequestInterval = clearRequestInterval;
        }

    }


})