define(function(require) {

	var ComponentView = require('coreViews/componentView');
	var Adapt = require('coreJS/adapt');

	var Blinds = ComponentView.extend({

		preRender: function() {

			this.listenTo(Adapt, 'device:resize', this.calculateWidths, this);
			this.setDeviceSize();

			// Checks to see if the text should be reset on revisit
			this.checkIfResetOnRevisit();
		},

		postRender: function() {
			this.setReadyStatus();
			this.$('.blinds-inner').imageready(_.bind(function() {
				this.setupBlinds();
				this.setReadyStatus();
			}, this));

		},

		setupBlinds: function() {
			if(!this.model.has('_items') || !this.model.get('_items').length) return;
			this.model.set('_itemCount', this.model.get('_items').length);
			this.model.set('_active', true);
			this.calculateWidths();
			this.setupEventListeners();
		},

		setupEventListeners: function() {
			var that = this;
			var $items = this.$(".blinds-item");
			var _items = this.model.get("_items");
			var wItem = this.itemWidth;
			var animationTime = 400;
			var captionDelay = this.model.has("captionDelay") ? this.model.get("captionDelay") : 800;
			var expandBy = this.model.get("expandBy") || 2;
			var count = 0;
			var currentItem;
			var queue = [];

			$items.on({
				mouseenter: function() {
					currentItem = this;

					var $this = $(this);
					var itemIndex = $this.index();
					var _item = _items[itemIndex];
					var $siblings = $this.siblings();
					var $p = $this.find("p");
					var wItemNew = wItem * expandBy;
					var wSiblingsNew = wItem - ((wItemNew - wItem) / $siblings.length);
					var currTop = 10;

					$this.outerWidth(wItemNew);

					that.setStage(itemIndex);

					$p.each(function(i, el) {
						(function(i, el) {
							var t = animationTime + (i * captionDelay);
							var caption = _item.captions[i];
							var left = caption.left || _item.left || 0;
							var top = caption.top;
							if (!top && i === 0) top = 0;
							var width = caption.width || wItem * expandBy + "px";
							queue[i] = setTimeout(function() {
								if (top === undefined) {
									top = $p.eq(i - 1).outerHeight() + currTop + 10;
								}
								currTop = parseInt(top);
								$(el).css({
									opacity: 1,
									top: top,
									left: left,
									maxWidth: width
								});
							}, t);
						})(i, el);
					});
					$siblings.outerWidth(wSiblingsNew);
				},
				mouseleave: function() {
					for (var i = 0; i < queue.length; i++) {
						clearTimeout(queue[i]);
					}
					currentItem = null;
					count = 0;
					var $this = $(this);
					$this.outerWidth(wItem);
					$this.find("p").css("opacity", 0);
					$this.siblings().outerWidth(wItem);
				}
			});

			this.completionEvent = this.model.get('_setCompletionOn') || 'allItems';

			if (this.completionEvent !== 'inview' && this.model.get('_items').length > 1) {
				this.on(this.completionEvent, _.bind(this.onCompletion, this));
			} else {
				this.$('.component-widget').on('inview', _.bind(this.inview, this));
			}
		},

		calculateWidths: function() {
			if (this.model.get("height")) this.$(".blinds-item").height(this.model.get("height"));
			var wTotal = this.$(".blinds-container").width();
			var $items = this.$(".blinds-item");
			var margin = parseInt($items.css("marginRight"));
			var wItem = (wTotal / $items.length) - (margin * 2);
			this.itemWidth = wItem;
			$items.outerWidth(wItem);
		},

		// Used to check if the text should reset on revisit
		checkIfResetOnRevisit: function() {
			var isResetOnRevisit = this.model.get('_isResetOnRevisit');

			// If reset is enabled set defaults
			if (isResetOnRevisit) {
				this.model.reset(isResetOnRevisit);
			}
		},

		setStage: function(stage) {
			this.model.set('_stage', stage);
			if (this.model.get('_isDesktop')) {
				// Set the visited attribute for large screen devices
				var currentItem = this.getCurrentItem(stage);
				currentItem._isVisited = true;
			}

			this.evaluateCompletion();
		},

		getCurrentItem: function(index) {
			return this.model.get('_items')[index];
		},

		getVisitedItems: function() {
			return _.filter(this.model.get('_items'), function(item) {
				return item._isVisited;
			});
		},

		evaluateCompletion: function() {
			if (this.getVisitedItems().length === this.model.get('_items').length) {
				this.trigger('allItems');
			}
		},

		inview: function(event, visible, visiblePartX, visiblePartY) {
			if (visible) {
				if (visiblePartY === 'top') {
					this._isVisibleTop = true;
				} else if (visiblePartY === 'bottom') {
					this._isVisibleBottom = true;
				} else {
					this._isVisibleTop = true;
					this._isVisibleBottom = true;
				}

				if (this._isVisibleTop && this._isVisibleBottom) {
					this.$('.component-inner').off('inview');
					this.setCompletionStatus();
				}
			}
		},

		onCompletion: function() {
			this.setCompletionStatus();
			if (this.completionEvent && this.completionEvent != 'inview') {
				this.off(this.completionEvent, this);
			}
		},

		setDeviceSize: function() {
			if (Adapt.device.screenSize === 'large') {
				this.$el.addClass('desktop').removeClass('mobile');
				this.model.set('_isDesktop', true);
			} else {
				this.$el.addClass('mobile').removeClass('desktop');
				this.model.set('_isDesktop', false)
			}
		}

	});

	Adapt.register('blinds', Blinds);

	return Blinds;

});
