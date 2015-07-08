var Fixed = (function(){

    'use strict';

    var exports = function (element, options){

        this._element = element;
        this._options = options || {};
        this._initialize();

    };

    exports.prototype = {

        /**
         * Initialize module.
         *
         * @memberof FixedAfterScroll
         * @static
         * @private
         */

        _initialize:function(){

            this._onResizeBind = $.proxy(this._onResize, this);
            this._onScrollBind = $.proxy(this._onScroll, this);

            // insert placeholder
            this._placeholder = document.createElement('div');
            this._placeholder.className = 'fixed-placeholder';
            this._element.parentNode.insertBefore(this._placeholder, this._element);

            // get container
            var q = this._element.getAttribute('data-container');
            if(q) {
                this._container = document.querySelector(q);
            }

            // set starting point
            this._start = $(this._placeholder).offset().top;

            // initial measure
            this.measure();

            // initial state
            this.update();

            // listen
            this.listen();

        },

        listen: function(){
            $(window).bind('resize', this._onResizeBind);
            $(window).bind('scroll', this._onScrollBind);
            this._active = true;
        },

        ignore: function(){
            $(window).unbind('resize', this._onResizeBind);
            $(window).unbind('scroll', this._onScrollBind);
            this._active = false;
        },

        /**
         * Update measurements
         */

        update: function(){

            if(!this._active){
                return;
            }

            if(this._timer){
                clearTimeout(this._timer);
            }

            // toggle states
            var _this = this;
            this._timer = setTimeout(function(){
                _this._toggle();
            });

        },

        measure: function(){
            this._measure(this._element);
            this._measure(this._container);
        },

        /**
         * Measure element.
         * @param element
         * @private
         */

        _measure: function(element){

            if(!element){
                return;
            }

            // get offset
            $.data(element, 'offset', $(element).offset());

            // get dimensions
            var dimensions = {
                x: $(element).outerWidth(),
                y: $(element).outerHeight()
            };

            $.data(element, 'dimensions', dimensions);

            // get position
            $.data(element, 'position', $(element).position());

        },

        /**
         * Position fixed.
         * @private
         */

        _fixed: function(){

            // set placeholder height to prevent content from jumping up
            $(this._placeholder).css({
                'height': $.data(this._element, 'dimensions').y
            });

            // fixed
            $(this._element).addClass('is-fixed');

            // offset
            var offset = this._offsetY ? this._offsetY : 0;

            // check if element is bigger than bottom of container
            var scroll = $(window).scrollTop(),
                containerHeight = $.data(this._container, 'dimensions').y,
                containerEnd = $.data(this._container, 'offset').top,
                containerVisible = $.data(this._container, 'dimensions').y + (containerEnd - scroll),
                elementHeight = $.data(this._element, 'dimensions').y,
                elementOffset = offset,
                elementBottom = elementHeight + elementOffset,
                overflow = (elementHeight - containerVisible);

            if(offset){
                overflow = overflow + $.data(this._element, 'dimensions').y;
            }

            var _overflow;
            if(offset) {
                _overflow = elementBottom - containerVisible;

            }

            // calculate top
            var top = ((overflow >= 0 ? -overflow : 0) + offset);

            if(_overflow > 0) {
                top = top - _overflow;
            }

            // set height and width etc
            $(this._element).css({
                'width': $.data(this._element, 'dimensions').x
                ,'left': $.data(this._element, 'position').x
                ,'top': top + 'px'
            });

            this._state = 'fixed';

        },

        /**
         * Position static.
         * @private
         */

        _static: function(){

            // set placeholder height to prevent content from jumping up
            $(this._placeholder).css({
                'height': 0
            });

            // unfix
            $(this._element).removeClass('is-fixed');

            // remove height / width etc
            $(this._element).css({
                'width': '',
                'height': '',
                'left': ''
            });

            // remove placeholder height to prevent content from jumping up
            $(this._placeholder).css({
                'height': 0
            });

            this._state = 'static';

        },

        getElement: function(){
            return this._element;
        },

        setStartingPoint: function(pixels){
            this._start = pixels;
        },

        getStartingPoint: function(){
            return this._start;
        },

        setOffset: function(x, y){

            if(x) {
                this._offsetX = x;
            }

            if(y) {
                this._offsetY = y;
            }

        },

        /**
         * Switch between static & fixed.
         * @private
         */

        _toggle: function(){

            var scroll = $(window).scrollTop(),
                past = scroll > this._start;

            if(past){
                this._fixed();
            } else {
                this._static();
            }

        },

        /**
         * Throttle resizing.
         * @private
         */
        _onResize: function(){

            if(this._resizeTimer){
                clearTimeout(this._resizeTimer);
            }

            var _this = this;
            this._resizeTimer = setTimeout(function(){
                _this._static();
                setTimeout(function(){
                    _this.update();
                }, 500);
            }, 10);

        },

        /**
         * Throttle scroll.
         * @private
         */

        _onScroll: function(){

            if(this._scrollTimer){
                clearTimeout(this._scrollTimer);
            }

            var _this = this;
            this._scrollTimer = setTimeout(function(){
                _this._toggle();
            }, 10);

        },

        /**
         * Clean up when unloading this module.
         *
         * @memberof Toggle
         * @static
         * @public
         */

        unload:function(){

            // reset position
            this._static();

            // stop listening
            this.ignore();

        }

    };

    return exports;

})();