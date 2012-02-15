/* <copyright>
This file contains proprietary software owned by Motorola Mobility, Inc.<br/>
No rights, expressed or implied, whatsoever to this software are provided by Motorola Mobility, Inc. hereunder.<br/>
(c) Copyright 2011 Motorola Mobility, Inc.  All Rights Reserved.
</copyright> */

////////////////////////////////////////////////////////////////////////
//
var Montage = 		require("montage/core/core").Montage,
	BaseDocument =	require("js/document/models/base-document").BaseDocument;
////////////////////////////////////////////////////////////////////////
//
exports.TextDocument = Montage.create(BaseDocument, {
    // PRIVATE MEMBERS
    _codeEditor: {
        value: {
            "editor": { value: null, enumerable: false },

        }
    },

    _editor: { value: null, enumerable: false },
    _hline: { value: null, enumerable: false },

    _textArea: {value: null, enumerable: false },
	
	_userDocument: {value: null, enumerable: false },
	
    _source: { value: null, enumerable: false},

    source: {
        get: function() { return this._source;},
        set: function(value) { this._source = value;}
    },

    // PUBLIC MEMBERS

    _savedLeftScroll: {value:null},
    _savedTopScroll: {value:null},

    //****************************************//
    //PUBLIC API


    // GETTERS / SETTERS

    savedLeftScroll:{
        get: function() { return this._savedLeftScroll; },
        set: function(value) { this._savedLeftScroll = value}
    },

    savedTopScroll:{
        get: function() { return this._savedTopScroll; },
        set: function(value) { this._savedTopScroll = value}
    },

    textArea: {
        get: function() { return this._textArea; },
        set: function(value) { this._textArea = value; }
    },
    editor: {
        get: function() { return this._editor; },
        set: function(value) { this._editor = value}
    },

    hline: {
        get: function() { return this._hline; },
        set: function(value) {this._hline = value; }
    },

    
    ////////////////////////////////////////////////////////////////////
	//
    initialize: {
    	value: function(file, uuid, textArea, container, callback) {
        	//
			this._userDocument = file;
			//
			this.init(file.name, file.uri, file.extension, container, uuid, callback);
	        //
    	    this.currentView = "code";
        	this.textArea = textArea;
        }
    },
    ////////////////////////////////////////////////////////////////////
    //
	save: {
		enumerable: false,
    	value: function () {
    		//TODO: Improve sequence
    		this.editor.save();
    		return {mode: this._userDocument.extension, document: this._userDocument, content: this.textArea.value};
    	}
	}
	////////////////////////////////////////////////////////////////////











    /*
// PRIVATE METHODS
    _loadContent: {
        value: function() {
            // Start and AJAX call to load the HTML Document as a String
            var xhr = new XMLHttpRequest();
            var ref = this;

            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4) {
                    ref.source = xhr.responseText;
                    ref.textArea.innerHTML = xhr.responseText;
                    //ref.callback(xhr.responseText);
                    ref.callback(ref);
                }
            };

            if(this.documentType === "js") {
                xhr.open('GET', 'user-document-templates/montage-application-cloud/appdelegate.js');
            } else if(this.documentType === "css") {
                xhr.open('GET', 'user-document-templates/montage-application-cloud/default_html.css');
            } else {
                xhr.open('GET', 'user-document-templates/montage-application-cloud/index.html');
            }
            
            xhr.send('');
        }
    },
*/
    ////////////////////////////////////////////////////////////////////
	

    /**
     * public method
     */
    /*
save:{
        value:function(){
            try{
                this.editor.save();
                //persist textArea.value to filesystem
                this.dirtyFlag=false;
            }catch(e){
                console.log("Error while saving "+this.uri);
                console.log(e.stack);
            }
        }
    }
*/
});