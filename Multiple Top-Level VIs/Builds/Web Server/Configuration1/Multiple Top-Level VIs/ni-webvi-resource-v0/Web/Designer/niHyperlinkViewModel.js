//****************************************
// Hyperlink View Model
// National Instruments Copyright 2015
//****************************************
(function (parent) {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;

    // Constructor Function
    NationalInstruments.HtmlVI.ViewModels.HyperlinkViewModel = function (element, model) {
        parent.call(this, element, model);

        // Public Instance Properties
        // None

        // Private Instance Properties
        // None
    };

    // Static Public Variables
    // None

    // Static Public Functions
    // None

    // Prototype creation
    var child = NationalInstruments.HtmlVI.ViewModels.HyperlinkViewModel;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);

    // Static Private Variables
    // None

    // Static Private Functions
    // None

    // Public Prototype Methods
    proto.registerViewModelProperties(proto, function (targetPrototype, parentMethodName) {
        parent.prototype[parentMethodName].call(this, targetPrototype, parentMethodName);

        proto.addViewModelProperty(targetPrototype, { propertyName: 'content' });
    });

    proto.modelPropertyChanged = function (propertyName) {
        var renderBuffer = parent.prototype.modelPropertyChanged.call(this, propertyName);

        switch (propertyName) {
            case 'href':
                renderBuffer.properties.hrefNonSignaling = this.model.href;
                break;
        }

        return renderBuffer;
    };

    proto.updateModelFromElement = function () {
        parent.prototype.updateModelFromElement.call(this);

        var model = this.model,
            element = this.element;

        model.defaultValue = element.href;
        model.href = element.href;
    };

    proto.applyModelToElement = function () {
        parent.prototype.applyModelToElement.call(this);

        this.element.hrefNonSignaling = this.model.href;
    };

    proto.bindToView = function () {
        var that = this;
        var updateService = that.model.getRoot().getOwningWebApplication().updateService;
        if (updateService.isInIdeMode()) {
            // Override default hyperlink behavior when inside the editor, C# will handle it
            that.element.addEventListener('click', function (evt) {
                evt.preventDefault();

                // Note: We use the anchor tag's href value and not ni-hyperlink's href value because the a.href URL will be a full resolved URL,
                // which is what we want on the C# side. This also ensures the URL used when within the IDE is the same as for a deployed page.
                that.model.internalControlEventOccurred('HyperlinkClicked', { href: that.element.firstElementChild.href });
            });
        }
    };

    NationalInstruments.HtmlVI.NIModelProvider.registerViewModel(child, NationalInstruments.HtmlVI.Elements.Hyperlink, NationalInstruments.HtmlVI.Models.HyperlinkModel);
}(NationalInstruments.HtmlVI.ViewModels.VisualViewModel));
