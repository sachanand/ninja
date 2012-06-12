/* <copyright>
 This file contains proprietary software owned by Motorola Mobility, Inc.<br/>
 No rights, expressed or implied, whatsoever to this software are provided by Motorola Mobility, Inc. hereunder.<br/>
 (c) Copyright 2011 Motorola Mobility, Inc.  All Rights Reserved.
 </copyright> */

var Montage = 		require("montage/core/core").Montage,
    Component =		require("montage/ui/component").Component,
    UndoManager = 	require("montage/core/undo-manager").UndoManager,
    AppData = 		require("js/data/appdata").AppData,
    Popup = 		require("js/components/popup.reel").Popup;

var matrix = require("js/lib/math/matrix");
var NjUtils = require("js/lib/NJUtils").NJUtils;

exports.Ninja = Montage.create(Component, {

    // SERIALIZABLE Properties
    //////////////////////////////
    rulerTop: {
        value: null,
        serializable: true
    },

    rulerLeft: {
        value: null,
        serializable: true
    },

    appModel: {
        value: null,
        serializable: true
    },

    toolsData: {
        value: null,
        serializable: true
    },

    toolsList: {
        value: null,
        serializable: true
    },

    toolsProperties: {
        value: null,
        serializable: true
    },

    stage: {
        value: null,
        serializable: true
    },

    elementMediator: {
        value: null,
        serializable: true
    },

    dragDropMediator: {
        value: null,
        serializable: true
    },

    undocontroller: {
        value: null,
        serializable: true
    },

    selectionController: {
        value: null,
        serializable: true
    },

    documentController: {
        value: null,
        serializable: true
    },

    popupManager: {
        value: null,
        serializable: true
    },

    colorController: {
        value: null,
        serializable: true
    },

    stylesController: {
        value: null,
        serializable: true
    },

    presetsController: {
        value: null,
        serializable: true
    },

    filePickerController: {
        value: null,
        serializable: true
    },

    newFileController: {
        value: null,
        serializable: true
    },

    coreIoApi: {
        value: null,
        serializable: true
    },

    documentBar: {
        value: null,
        serializable: true
    },

    editorViewOptions: {
        value: null,
        serializable: true
    },

    ioMediator: {
        value: null,
        serializable: true
    },

    timeline: {
        value: null,
        serializable: true
    },

    mainMenuController: {
        value: null,
        serializable: true
    },

    codeEditorController: {
        value: null,
        serializable: true
    },

    rightPanelContainer: {
        value: null,
        serializable: true
    },

    panelSplitter: {
        value: null,
        serializable: true
    },

    timelineSplitter: {
        value: null,
        serializable: true
    },

    toolsSplitter: {
        value: null,
        serializable: true
    },

    optionsSplitter: {
        value: null,
        serializable: true
    },

    documentList: {
        value: null,
        serializable: true
    },
    //////////////////////////////

    ninjaVersion: {
        value: null
    },

    appData: {
        value: AppData
    },

    currentDocument: {
        get: function() {
            if(this.documentList.selectedObjects) {
                return this.documentList.selectedObjects[0];
            } else {
                return null;
            }
        }
    },

    _resizedHeight : {
        value: 0
    },
    _height: {
        value: null
    },

    height: {
        get: function() {
            if(this._height === null) {
                var storedData = this.application.localStorage.getItem("timelinePanel");
                if(storedData && storedData.value) {
                    this._height = storedData.value;
                }
            }
            return this._height;
        },
        set: function(val) {
            if(this._height != val) {
                this._height = val;
                this.application.localStorage.setItem("timelinePanel", {"version": this.version, "value": val});
                this.needsDraw = true;
            }

        }
    },

    _resizedWidth: {
        value: 0
    },

    _width: {
        value: null
    },

    width: {
        get: function() {
            if(this._width === null) {
                var storedData = this.application.localStorage.getItem("rightPanelsContainer");
                if(storedData && storedData.value) {
                    this._width = storedData.value;
                }
            }
            return this._width;
        },
        set: function(val) {
            if(this._width != val) {
                this._width = val;
                this.application.localStorage.setItem("rightPanelsContainer", {"version": this.version, "value": val});
                this.needsDraw = true;
            }

        }
    },

    handleResizeStart: {
        value:function(e) {
            this.isResizing = true;
            this.height = parseInt(this.timeline.element.offsetHeight);
            this.width = parseInt(this.rightPanelContainer.offsetWidth);
            this.rightPanelContainer.classList.add("disableTransition");
            this.timeline.element.classList.add("disableTransition");
            this.needsDraw = true;
        }
    },

    handleResizeMove: {
        value:function(e) {
            this._resizedHeight = e._event.dY;
            this._resizedWidth = e._event.dX;
            this.stage.resizeCanvases = true;
            this.needsDraw = true;
        }
    },

    handleResizeEnd: {
        value: function(e) {
            this.stage.resizeCanvases = true;
            this._resizedHeight = 0;
            this._resizedWidth = 0;
            this.isResizing = false;
            this.needsDraw = true;
            this.rightPanelContainer.classList.remove("disableTransition");
            this.timeline.element.classList.remove("disableTransition");
            this.height = this.timeline.element.offsetHeight;
            this.width = this.rightPanelContainer.offsetWidth;
        }
    },

    handleResizeReset: {
        value: function(e) {
            this.width = 253;
            this.height = 140;
            this._resizedHeight = 0;
            this._resizedWidth = 0;
            this.timelineSplitter.collapsed = false;
            this.panelSplitter.collapsed = false;
            this.stage.resizeCanvases = true;
            this.needsDraw = true;
        }
    },

    selectedElements: {
        value: []
    },

    templateDidLoad: {
        value: function() {
            this.ninjaVersion = window.ninjaVersion.ninja.version;
            this.undoManager = document.application.undoManager = UndoManager.create();
            document.application.njUtils = NjUtils;
        }
    },

    prepareForDraw: {
        value: function() {
            console.log("Loading Ninja --> ", this.ninjaVersion);

            this.application.ninja = this;

            this.toolsData.selectedTool = this.toolsData.defaultToolsData[this.application.ninja.toolsData.selectionToolIndex];
            this.toolsData.defaultSubToolsData = this.toolsData.defaultToolsData[this.application.ninja.toolsData.shapeToolIndex].subtools;
            this.toolsData.selectedSubTool = this.toolsData.defaultToolsData[this.application.ninja.toolsData.shapeToolIndex].subtools[1];
            this.toolsData.selectedToolInstance = this.toolsList[this.toolsData.selectedTool.action];

            this.setupGlobalHelpers();

            window.addEventListener("resize", this, false);

            this.eventManager.addEventListener("selectTool", this, false);
            this.eventManager.addEventListener("selectSubTool", this, false);

            this.addPropertyChangeListener("appModel.livePreview", this.executeLivePreview, false);
            this.addPropertyChangeListener("appModel.chromePreview", this.executeChromePreview, false);
            this.addPropertyChangeListener("appModel.debug", this.toggleDebug, false);
        }
    },
    
    
    ////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////
	//TODO: Expand method to allow other browsers for preview
    executeChromePreview: {
    	value: function () {
    		//TODO: Make into proper component
    		this.saveOperationScreen = {};
    		this._saveOperationPopup = {};
    		//Show
    		this.saveOperationScreen.show = function (ctxt) {
    			//
    			ctxt._saveOperationPopup.blackout = document.createElement('div');
    			ctxt._saveOperationPopup.blackout.style.width = '100%';
    			ctxt._saveOperationPopup.blackout.style.height = '100%';
    			ctxt._saveOperationPopup.blackout.style.background = 'rgba(0,0,0,0.8)'; //'-webkit-radial-gradient(center, ellipse cover, rgba(0,0,0,.65) 0%, rgba(0,0,0,0.8) 80%)';
    			ctxt.application.ninja.popupManager.addPopup(ctxt._saveOperationPopup.blackout);
    		};
    		//Hide
    		this.saveOperationScreen.hide = function (ctxt) {
	    		ctxt.application.ninja.popupManager.removePopup(ctxt._saveOperationPopup.blackout);
    		};
    		//
    		this.currentDocument.model.browserPreview('chrome', this.saveOperationScreen, this);
    	}
    },
	////////////////////////////////////////////////////////////////////
	
	//TODO: Make into proper component
	_saveOperationPopup: {
		value: null
	},
	//TODO: Make into proper component
	saveOperationScreen: {
		value: null
	},
	
	////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////
	
	
    handleResize: {
        value: function() {
            this.stage.resizeCanvases = true;
        }
    },

    draw: {
        value: function() {
            if(this.isResizing) {
                this.timelineSplitter.collapsed = this.height - this._resizedHeight < 46;
                this.panelSplitter.collapsed = this.width - this._resizedWidth < 30;
            }

            this.rightPanelContainer.style.width = (this.width - this._resizedWidth) + "px";
            this.timeline.element.style.height = (this.height - this._resizedHeight) + "px";
        }
    },

    _didDraw: {
        value: false
    },
    
    didDraw: {
        value: function() {

            if(!this._didDraw) {
            	if (!this.application.ninja.coreIoApi.ioServiceDetected) {
            		var check = this.application.ninja.coreIoApi.cloudAvailable();
            	}
                NJevent("appLoaded");
                this._didDraw = true;
            }
        }
    },

    handleSelectTool: {
        value: function(event) {

            this.toolsData.defaultToolsData[this.toolsData.defaultToolsData.indexOf(this.toolsData.selectedTool)].selected = false;

            if(this.toolsData.selectedTool.container) {
                this.toolsList[this.toolsData.selectedSubTool.action]._configure(false);
            } else {
                this.toolsList[this.toolsData.selectedTool.action]._configure(false);
            }

            this.toolsData.selectedTool = event.detail;

            this.toolsData.defaultToolsData[this.toolsData.defaultToolsData.indexOf(this.toolsData.selectedTool)].selected = true;

            if(this.toolsData.selectedTool.container) {
                this.toolsData.selectedToolInstance = this.toolsList[this.toolsData.selectedSubTool.action];
            } else {
                this.toolsData.selectedToolInstance = this.toolsList[this.toolsData.selectedTool.action];
            }

            this.stage.SelectTool(this.toolsData.selectedTool.cursor);
            this.toolsData.selectedToolInstance._configure(true);

        }
    },

    handleSelectSubTool: {
        value: function(event) {

            this.toolsData.defaultSubToolsData[this.toolsData.defaultSubToolsData.indexOf(this.toolsData.selectedSubTool)].selected = false;

            this.toolsList[this.toolsData.selectedSubTool.action]._configure(false);

            this.toolsData.selectedSubTool = event.detail;

            this.toolsData.defaultSubToolsData[this.toolsData.defaultSubToolsData.indexOf(this.toolsData.selectedSubTool)].selected = true;
            this.toolsData.selectedToolInstance = this.toolsList[this.toolsData.selectedSubTool.action];

            this.toolsList[this.toolsData.selectedSubTool.action]._configure(true);

        }
    },

    openDocument: {
        value: function(doc) {
            this.documentList.content.push(doc);
            // TODO: Check why this is still needed
            this.documentList.selectedObjects = [doc];

        }
    },

    closeFile: {
        value: function(document) {
            var doc = this.documentList.content[this.documentList.content.indexOf(document)], activeDocument;

            if(this.documentList.selectedObjects[0] !== doc) {
                activeDocument = this.documentList.selectedObjects[0];
            } else {
                activeDocument = null;
            }

            this.documentList.removeObjects(doc);

            if(activeDocument) {
                this.documentList.selectedObjects = [activeDocument];
            } else {
                if(this.documentList.content.length) {
                    this.documentList.selectedObjects = this.documentList.content[0];
                }
            }
        }
    },

    executeLivePreview: {
        value: function() {
            var background, overflow, transitionStopRule;
            this.stage.hideCanvas(this.appModel.livePreview);

            // TODO: Remove marker for old template: NINJA-STAGE-REWORK
            if(this.appModel.livePreview) {
//                background =  "#000000";
//                overflow = "hidden";
                transitionStopRule = "nj-css-garbage-selector";
            } else {
//                background =  "#808080";
//                overflow = "visible";
                transitionStopRule = "*"
            }

            // TODO: Remove marker for old template: NINJA-STAGE-REWORK
//            this.currentDocument.model.documentRoot.elementModel.controller.setProperty(this.currentDocument.model.documentRoot, "body-background", background);
//            this.currentDocument.model.documentRoot.elementModel.controller.setProperty(this.currentDocument.model.documentRoot, "overflow", overflow);
//            this.currentDocument.model.documentRoot.elementModel.controller.changeSelector(this.currentDocument.model.documentRoot, "transitionStopRule", transitionStopRule);

            this.application.ninja.stylesController._stageStylesheet.rules[0].selectorText = transitionStopRule;

            this._toggleWebGlAnimation(this.appModel.livePreview);
        }
    },

    // Turn on WebGL animation during preview
    _toggleWebGlAnimation: {
        value: function(inLivePreview) {
            var glCanvases = this.currentDocument.model.views.design.iframe.contentWindow.document.querySelectorAll('[data-RDGE-id]'),
                glShapeModel;
            if(glCanvases) {
                for(var i = 0, len = glCanvases.length; i<len; i++) {
                    glShapeModel = glCanvases[i].elementModel.shapeModel;
                    if(inLivePreview) {
                        glShapeModel.GLWorld._previewAnimation = true;
                        glShapeModel.GLWorld.restartRenderLoop();
                    } else if (!glShapeModel.animate ) {
                        glShapeModel.GLWorld._previewAnimation = false;
                        glShapeModel.GLWorld._canvas.task.stop();
                    }
                }
            }
        }
    },

    // Property to hold the js console.log function when restoring it
    consoleLog: { value: null },
    toggleDebug: {
        value: function() {
            if(!this.consoleLog) this.consoleLog = console.log;

            this.appModel.debug ? console.log = this.consoleLog : console.log = function() {};
        }
    },

    setupGlobalHelpers: {
        value: function() {

            var self = this;

            NJevent = function( id, data ){

                var newEvent = document.createEvent( "CustomEvent" );
                newEvent.initCustomEvent( id, false, true, data );
                self.eventManager.dispatchEvent( newEvent );

            };
        }
    }

});
