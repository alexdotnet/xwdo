var Label = {};

System.defineFactory("Label", function () {

    DisplayObject.registerDisplayObjectDelegate( "label", Label );

    Label.getValue = function( selector ) {
        return DisplayObject.get(selector)
            .textContent;
    };

    Label.setValue = function( selector, value ) {
        DisplayObject.get(selector)
            .textContent = value;
    };

    return Label;
});
