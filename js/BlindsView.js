define([
    "core/js/adapt",
    "core/js/views/componentView"
], function(Adapt, ComponentView) {

    var Blinds = ComponentView.extend({

        captionQueue: [],
        ENTER_DELAY: 150,
        ANIMATION_TIME: 400,
        CAPTION_DELAY: 600,

        events: {
            "mouseenter .blinds-item": "onMouseEnter",
            "mouseleave .blinds-items": "onMouseLeave",
            "click .blinds-item": "onClick"
        },

        preRender: function() {
            this.listenTo(Adapt, "device:resize", this.calculateWidths, this);
            if (!this.model.get("_expandBy")) {
                this.model.set("_expandBy", 2);
            }
        },

        postRender: function() {
            this.$(".blinds-inner").imageready(_.bind(function() {
                this.setupBlinds();
                this.setReadyStatus();
            }, this));
        },

        setupBlinds: function() {
            this.calculateWidths();
            this.setupEventListeners();
        },

        setupEventListeners: function() {
            this.completionEvent = this.model.get("_setCompletionOn") || "allItems";

            if (this.completionEvent === "inview") {
                this.$(".component-widget").on("inview", _.bind(this.inview, this));
            }
        },

        onMouseEnter: function(e) {
            if (Adapt.device.screenSize !== "large") {
                return;
            }

            this.queuedIndex = null;
            var index = $(e.currentTarget).index();

            this.hideCaptions();
            clearTimeout(this.enterTimeout);

            if (this.isAnimating) {
                this.queuedIndex = index;
            } else {
                this.enterTimeout = setTimeout(_.bind(function() {
                    this.expandBlind(index);
                }, this), this.ENTER_DELAY)
            }

            this.model.setItemVisited(index);
            this.model.checkCompletionStatus();
        },

        onMouseLeave: function() {
            if (Adapt.device.screenSize !== "large") {
                return;
            }

            clearTimeout(this.enterTimeout);
            clearTimeout(this.delayedEnterTimeout);
            this.queuedIndex = null;
            this.isAnimating = false;
            this.hideCaptions();
            this.$(".blinds-item").width(this.itemWidth);
        },

        onClick: function(e) {
            if (Adapt.device.screenSize === "large") {
                return;
            }

            var index = $(e.currentTarget).index();
            if (index === this.currentItemIndex) {
                this.hideCaptions();
            } else {
                this.currentItemIndex = index;
                this.displayCaptions(index, 0);
                this.model.setItemVisited(index);
                this.model.checkCompletionStatus();
            }
        },

        expandBlind: function(index) {
            this.isAnimating = true;
            var $blind = this.$getElement(index);
            var $siblings = $blind.siblings();
            $blind.width(this.itemExpandedWidth);
            $siblings.width(this.itemCollapsedWidth);
            this.displayCaptions(index, this.ANIMATION_TIME + this.ENTER_DELAY);

            this.delayedEnterTimeout = setTimeout(_.bind(function() {
                this.isAnimating = false;
                if (typeof this.queuedIndex === "number") {
                    this.expandBlind(this.queuedIndex);
                    this.queuedIndex = null;
                }
            }, this), this.ANIMATION_TIME + 200);
        },

        displayCaptions: function(index, delay) {
            var $blind = this.$getElement(index);
            var $captions = $blind.find(".blinds-caption").show();
            var item = this.model.getItem(index);
            var currTop = 10;

            _.each(this.captionQueue, clearTimeout);

            _.each($captions, function(el, i) {
                var t = delay + (i * this.CAPTION_DELAY);
                var caption = item._captions[i];
                var left = parseInt(caption.left) || 0;
                var top = caption.top;

                if (!top && i === 0) {
                    top = 0;
                }

                var width = caption.width || this.itemExpandedWidth + "px";

                this.captionQueue[i] = setTimeout(function() {
                    if (top === undefined || top === "") {
                        top = $captions.eq(i - 1).outerHeight() + currTop + 10;
                    }
                    currTop = parseInt(top);

                    $(el).css({
                        opacity: 1,
                        top: top,
                        left: left,
                        maxWidth: width
                    });
                }, t);
            }, this);
        },

        hideCaptions: function() {
            _.each(this.captionQueue, clearTimeout);
            this.$(".blinds-caption").hide().css("opacity", 0);
        },

        $getElement: function(index) {
            return this.$(".blinds-item").eq(index);
        },

        calculateWidths: function() {
            var $blinds = this.$(".blinds-item");

            if (this.model.get("height")) {
                $blinds.height(this.model.get("height"));
            }

            var wTotal = this.$(".blinds-container").width();
            this.itemWidth = wTotal / $blinds.length;
            this.itemExpandedWidth = this.itemWidth * this.model.get("_expandBy");
            this.itemCollapsedWidth = (wTotal - this.itemExpandedWidth) / ($blinds.length - 1);

            $blinds.width(this.itemWidth);
        },

        inview: function(event, visible, visiblePartX, visiblePartY) {
            if (visible) {
                if (visiblePartY === "top") {
                    this._isVisibleTop = true;
                } else if (visiblePartY === "bottom") {
                    this._isVisibleBottom = true;
                } else {
                    this._isVisibleTop = true;
                    this._isVisibleBottom = true;
                }

                if (this._isVisibleTop && this._isVisibleBottom) {
                    this.$(".component-inner").off("inview");
                    this.setCompletionStatus();
                }
            }
        },

        onCompletion: function() {
            this.setCompletionStatus();
            if (this.completionEvent && this.completionEvent != "inview") {
                this.off("inview", this);
            }
        }
    });

    return Blinds;

});
