define([
    "core/js/adapt",
    "core/js/models/itemsModel",
    "./BlindsView"
], function(Adapt, ItemsModel, BlindsView) {

    return Adapt.register("blinds", {
        view: BlindsView,
        model: ItemsModel
    });

});