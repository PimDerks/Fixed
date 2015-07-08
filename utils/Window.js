/**
 * Generic methods for getting the height/width of the window.
 */
var WindowUtils = (function(){

    'use strict';

    return {

        getWidth: function() {

            // get size
            if(window.innerWidth){
                return window.innerWidth;
            }
            else {
                if(document.documentElement.clientWidth !== 0){
                    return document.documentElement.clientWidth; //strict mode
                }
                else {
                    return document.body.clientWidth; //quirks mode
                }
            }

            return 0;

        },

        getHeight: function () {

            // get size
            if (window.innerHeight) {
                return window.innerHeight;
            }
            else {
                if (document.documentElement.clientHeight !== 0) {
                    return document.documentElement.clientHeight; //strict mode
                }
                else {
                    return document.body.clientHeight; //quirks mode
                }
            }

            return 0;

        },

        getSize: function () {

            return {
                x: this.getWidth(),
                y: this.getHeight()
            };
        },

        getScroll: function() {

            var scroll = {
                x: window.pageXOffset || document.documentElement.scrollLeft  || document.body.scrollLeft,
                y: window.pageYOffset || document.documentElement.scrollTop   || document.body.scrollTop
            };

            return scroll;

        },

        setScroll:function(x,y){
            window.scrollTo(x || 0, y || 0);
        }

    };

})();