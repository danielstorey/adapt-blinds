# adapt-blinds

<img align="right" src="https://raw.githubusercontent.com/danielstorey/adapt-resources/master/blinds-demo.jpg" alt="blinds in action">
**Blinds** is a *presentation component* Created by Dan storey.

When a learner hovers on one of the images, it widens and the other images narrow accordingly. If set, then an array of captions will appear. Positions and timings of these can be customised.


##Installation



## Settings Overview

The attributes listed below are used in *components.json* to configure **Blinds**, and are properly formatted as JSON in [*example.json*](https://github.com/danielstorey/adapt-blinds/example.json).

### Attributes

[**core model attributes**](https://github.com/adaptlearning/adapt_framework/wiki/Core-model-attributes): These are inherited by every Adapt component. [Read more](https://github.com/adaptlearning/adapt_framework/wiki/Core-model-attributes).

**_component** (string): This value must be: `blinds`. (One word.)

**_classes** (string): CSS class name to be applied to **Blinds** containing `div`. The class must be predefined in one of the Less files. Separate multiple classes with a space.

**_layout** (string): This defines the horizontal position of the component in the block. Acceptable values are `full`, `left` or `right`.

**instruction** (string): This optional text appears above the component. It is frequently used to
guide the learner’s interaction with the component.

**_setCompletionOn** (string): This value determines when the component registers as complete. Acceptable values are `"allItems"` and `"inview"`. `"allItems"` requires each blind to be visited. `"inview"` requires the **Blinds** component to enter the view port completely.

**title** (string): This is the title text for the **Blinds** component.

**body** (string): This is the main text for the **Blinds** component.

**height** (number): Height in pixels. Defaults to 500 if this property is not defined.

**expandBy** (number): The amount to expand the blind by when hovering over it. Defaults is 2 (width of the blind doubles).

**_items** (string): Each item represents one image for this component and contains values for **_graphic** and **captions**.

>**_graphic** (string): The image to be used for the blind item. Since the image is used as a background image for a `div` no src, alt or title attributes are required

>>**src** (string): File name (not including path) of the image. Images should be placed in the *src/course/en/images* folder.

>>**alt** (string): This text becomes the image’s `alt` attribute.

>>**title** (string): This text becomes the image’s `title` attribute.

>**captions** (array): An optional array of captions for the image.

>>**_text** (string): Each caption must have a **_text** property. This is the text to be displayed inside the caption.

>>**top** (mixed): Each caption can contain optional **top**, **left** and **width** values to position them on the image. Values can be given as a number or string. A number will be interpreted as pixels but a string value may be used to specify a percentage (eg. "20%"). Default is 0. Multiple captions appear 10px below the previous one unless this value is specified.

>>**left** (mixed): Specify the position of the caption from the left. Value can be given as a number or a string. Default is 0;

>>**width** (mixed): Specify the max width of the caption. Value can be given as a string or a number. Default behaviour is to fit the width of the text

### Accessibility



## Limitations

Viewport sizing

----------------------------
**Version number:**  1.0
**Framework versions:**  2.0
**Author / maintainer:** Dan Storey
