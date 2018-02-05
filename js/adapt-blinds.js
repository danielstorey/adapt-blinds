define([
    "core/js/adapt",
    "core/js/models/itemModel",
    "./BlindsView"
], function(Adapt, ItemModel, BlindsView) {

    return Adapt.register("blinds", {
        view: BlindsView,
        model: ItemModel
    });

});
