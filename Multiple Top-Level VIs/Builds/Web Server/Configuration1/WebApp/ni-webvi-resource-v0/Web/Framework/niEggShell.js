//***************************************
// Vireo EggShell Singleton
// National Instruments Copyright 2014
//***************************************
(function () {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    var EGGSHELL_PEEKER = NationalInstruments.HtmlVI.EggShellPeeker;
    var EGGSHELL_POKER = NationalInstruments.HtmlVI.EggShellPoker;

    // Constructor Function
    NationalInstruments.HtmlVI.EggShell = function () {
        // Public Instance Properties
        // None

        // Private Instance Properties
        var Vireo = NationalInstruments.Vireo.Vireo;
        this._vireo = new Vireo();
    };

    // Static Public Variables
    // None

    // Static Public Functions
    NationalInstruments.HtmlVI.EggShell.encodeVireoIdentifier = function (str) {
        var nonId = [' ', '!', '"', '#', '%', '&', '\'', '(', ')', ',', '.', '/', ':', ';', '<', '=', '>', '?', '@', '[', '\\', ']', '^', '`', '{', '|', '}', '~'];
        var encoded = '';

        if (typeof str !== 'string') {
            return undefined;
        }

        for (var i = 0; i < str.length; i++) {
            var codePoint = str.charCodeAt(i);
            var ch = str.charAt(i);

            // TODO mraj so ignore all non-ascii characters? Doesn't seem right as the CompiledName hits this code path which has comments
            // saying it can have non-ascii characters: http://ngsourcebrowser:4110/#NationalInstruments.Compiler/CompileHelper.cs,30
            if (codePoint <= 0x7F) {
                if ((i === 0  && !((codePoint >= 0x41 && codePoint <= 0x5A) || (codePoint >= 0x61 && codePoint <= 0x7A)))  || codePoint <= 0x1F || nonId.indexOf(ch) > -1) {
                    encoded += '%' + codePoint.toString(16).toUpperCase();
                } else {
                    encoded += ch;
                }
            }
        }

        return encoded;
    };

    // Prototype creation
    var child = NationalInstruments.HtmlVI.EggShell;
    var proto = child.prototype;

    // Static Private Variables
    // None

    // Static Private Functions
    // None

    // Public Prototype Methods
    proto.runSlices = function () {
        var executionState = { finished: false, error: false, errorMessage: ''}, retVal;

        try {
            retVal = this._vireo.eggShell.executeSlices(1000);
        } catch (e) {
            executionState.errorMessage = e;
            NI_SUPPORT.log('Vireo exception: ' + e);
            executionState.error = true;
            retVal = 0;
        }

        executionState.finished = (retVal > 0 ? false : true);
        return executionState;
    };

    proto.loadVia = function (viaText) {
        if (typeof viaText !== 'string') {
            throw new Error('The following is not a string that can be loaded as via text:', viaText);
        }

        // TODO mraj If we want internal state to be available when re-starting then need to remove
        // Maybe cache viaText and restart only if viaText changes?
        this._vireo.eggShell.reboot();
        this._vireo.eggShell.loadVia(viaText);
    };

    proto.reboot = function () {
        this._vireo.eggShell.reboot();
    };

    // setPrintCallback ( print : function(text : string) : void )
    proto.setPrintCallback = function (callback) {
        this._vireo.eggShell.setPrintFunction(callback);
        this._vireo.eggShell.setPrintErrorFunction(callback);
    };

    // setFrontPanelSynchronousCallback ( callback : function (fpID : string) : void)
    proto.setFrontPanelSynchronousUpdateCallback = function (callback) {
        this._vireo.coreHelpers.setFPSyncFunction(callback);
    };

    proto.peek = function (viName, path, type) {
        var peeker = EGGSHELL_PEEKER.GetPeeker(type);
        return peeker(this._vireo.eggShell, viName, path, type);
    };

    proto.poke = function (viName, path, type, data) {
        var poker = EGGSHELL_POKER.GetPoker(type);
        return poker(this._vireo.eggShell, viName, path, type, data);
    };
}());
