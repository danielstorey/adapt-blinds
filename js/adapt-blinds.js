define([
    "core/js/adapt",
    "core/js/models/itemsComponentModel",
    "./BlindsView"
], function(Adapt, ItemsComponentModel, BlindsView) {

    return Adapt.register("blinds", {
        view: BlindsView,
        model: ItemsComponentModel
    });

});
