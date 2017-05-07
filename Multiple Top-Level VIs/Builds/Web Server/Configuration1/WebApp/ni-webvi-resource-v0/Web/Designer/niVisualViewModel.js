//****************************************
// Visual View Model
// National Instruments Copyright 2014
//****************************************
(function (parent) {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;

    // Constructor Function
    NationalInstruments.HtmlVI.ViewModels.VisualViewModel = function (element, model) {
        parent.call(this, element, model);

        // Public Instance Properties
        // None

        // Private Instance Properties
        // Default Resize Strategy.
        this.resizeStrategy = new NationalInstruments.HtmlVI.PaintResizeStrategy();
    };

    // Static Public Variables
    // None

    // Static Public Functions
    // None

    // Prototype creation
    var child = NationalInstruments.HtmlVI.ViewModels.VisualViewModel;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);

    // Static Private Variables
    // None

    // Static Private Functions
    var getModelBounds = function (model) {
        // Assuming bounds are saved as '(\d)+px'
        return {
            left: parseInt(model.left),
            top: parseInt(model.top),
            width: parseInt(model.width),
            height: parseInt(model.height)
        };
    };

    // Public Prototype Methods
    proto.bindTextFocusEventListener = function () {
        var that = this;
        var niElement = that.element;
        var focusEventType = 'Focus';
        var createHandlerHelper = function (value) {
            return function (event) {
                var target = event.target;
                while (target !== null) {
                    if (target.isTextEditFocusable !== undefined && target.isTextEditFocusable(event.target)) {
                        break;
                    }

                    target = target.parentElement;
                }

                if (target !== null) {
                    that.model.internalControlEventOccurred(focusEventType, value);
                }
            };
        };

        niElement.addEventListener('focus', createHandlerHelper(true), true);
        niElement.addEventListener('blur', createHandlerHelper(false), true);
    };

    proto.registerViewModelProperties(proto, function (targetPrototype, parentMethodName) {
        parent.prototype[parentMethodName].call(this, targetPrototype, parentMethodName);

        proto.addViewModelProperty(targetPrototype, { propertyName: 'readOnly' });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'labelId' });
    });

    proto.modelPropertyChanged = function (propertyName) {
        var renderBuffer = parent.prototype.modelPropertyChanged.call(this, propertyName);

        switch (propertyName) {
            case 'top':
            case 'left':
            case 'width':
            case 'height':
                this.resizeStrategy.onBoundsChanging(getModelBounds(this.model), renderBuffer);
                break;
            case 'visible':
                if (!this.model.visible) {
                    renderBuffer.cssClasses.toAdd.push('ni-hidden');
                } else {
                    renderBuffer.cssClasses.toRemove.push('ni-hidden');
                }

                break;
            case 'foreground':
                renderBuffer.cssStyles.color = this.model.foreground;
                break;
            case 'fontSize':
            case 'fontWeight':
            case 'fontStyle':
            case 'fontFamily':
            case 'textDecoration':
                // TODO mraj font should be handled by the view model, not the element
                this.element.setFont(this.model.fontSize, this.model.fontFamily, this.model.fontWeight, this.model.fontStyle, this.model.textDecoration);
                break;
        }

        return renderBuffer;
    };

    // Called by niEditorUpdateService.
    proto.userInteractionChanged = function (newState) {
        var renderBuffer = NationalInstruments.HtmlVI.RenderEngine.getOrAddRenderBuffer(this.element);
        var modelBounds = getModelBounds(this.model);

        if (newState === 'end') {
            this.resizeStrategy.onBoundsChangeEnd(modelBounds, renderBuffer);
        } else if (newState === 'start') {
            this.resizeStrategy.onBoundsChangeStarted(modelBounds, renderBuffer);
        }

        this.applyElementChanges();
    };

    // Called by niUpdateService and derived objects.
    // it gives the VisualViewModel some hints of the environment that it lives
    // on. So it can take decisions on how to render, and perhaps more hints later.
    proto.setRenderHints = function (renderHints) {
        if (typeof renderHints !== 'object') {
            throw new Error('Renderhints should be an object.');
        }

        if (renderHints.preferTransforms === true) {
            this.resizeStrategy = new NationalInstruments.HtmlVI.EditorResizeStrategy();
        }
    };

    proto.updateModelFromElement = function () {
        parent.prototype.updateModelFromElement.call(this);

        var model = this.model,
            element = this.element;

        var style = window.getComputedStyle(element);
        // CSS 'used' values https://developer.mozilla.org/en-US/docs/Web/CSS/used_value
        model.top = style.getPropertyValue('top');          // string as pixel value, ie '5px'
        model.left = style.getPropertyValue('left');        // string as pixel value
        model.width = style.getPropertyValue('width');      // string as pixel value
        model.height = style.getPropertyValue('height');    // string as pixel value

        // CSS 'resolved' values https://developer.mozilla.org/en-US/docs/Web/CSS/resolved_value
        model.fontSize = style.getPropertyValue('font-size');                  // string as pixel value
        model.fontFamily = style.getPropertyValue('font-family');              // comma separated string
        model.fontWeight = style.getPropertyValue('font-weight');              // string as weight number, ie '500', https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight
        model.fontStyle = style.getPropertyValue('font-style');                // string
        model.textDecoration = style.getPropertyValue('text-decoration');      // string
        model.visible = !element.classList.contains('ni-hidden');    // string

        // CSS 'resolved' but returns rgba() if alpha otherwise rgb() https://developer.mozilla.org/en-US/docs/Web/CSS/color
        model.foreground = style.getPropertyValue('color');

        model.setBindingInfo(element.bindingInfo);
    };

    proto.applyModelToElement = function () {
        parent.prototype.applyModelToElement.call(this);

        var model = this.model,
            element = this.element;

        element.style.top = model.top;
        element.style.left = model.left;
        element.style.width = model.width;
        element.style.height = model.height;
        element.style.color = model.foreground;
        element.style.fontSize = model.fontSize;
        element.style.fontFamily = model.fontFamily;
        element.style.fontWeight = model.fontWeight;
        element.style.fontStyle = model.fontStyle;
        element.style.textDecoration = model.textDecoration;
        if (!model.visible) {
            element.classList.add('ni-hidden');
        } else {
            element.classList.remove('ni-hidden');
        }

        element.bindingInfo = model.getBindingInfo();
    };

}(NationalInstruments.HtmlVI.ViewModels.VisualComponentViewModel));
