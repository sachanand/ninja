/* <copyright>
This file contains proprietary software owned by Motorola Mobility, Inc.<br/>
No rights, expressed or implied, whatsoever to this software are provided by Motorola Mobility, Inc. hereunder.<br/>
(c) Copyright 2011 Motorola Mobility, Inc.  All Rights Reserved.
</copyright> */

/* /////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
NOTES:

	The init function starts up the file system API, and a size must be
	set, no unlimited available as of now.
	
////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////// */
//
var Montage = require("montage/core/core").Montage;
////////////////////////////////////////////////////////////////////////
//
exports.ChromeApi = Montage.create(Object.prototype, {
	////////////////////////////////////////////////////////////////////
    //Needs size in MBs for fileSystem init
    init: {
    	enumerable: true,
    	value: function(size) {
    		//
    		if (window.webkitRequestFileSystem) {
    			//Current way to init Chrome's fileSystem API
    			window.webkitRequestFileSystem(window.PERSISTENT, size*1024*1024, function (fs) {
    				//Storing reference to instance
    				this.fileSystem = fs;
    				//Dispatching action ready event
    				var readyEvent = document.createEvent("CustomEvent");
            		readyEvent.initEvent('ready', true, true);
            		this.dispatchEvent(readyEvent);
    				//Building data of local Ninja Library
    				this._listNinjaChromeLibrary();
    			}.bind(this), function (e) {return false}); //Returns false on error (not able to init)
    			//
    			return true;
    		} else {
    			//No fileSystem API
    			return false;
    		}
    	}
    },
    ////////////////////////////////////////////////////////////////////
    //
    _fileSystem: {
        enumerable: false,
        value: null
    },
    ////////////////////////////////////////////////////////////////////
    //
    fileSystem: {
    	enumerable: false,
    	get: function() {
            return this._fileSystem;
        },
        set: function(value) {
        	this._fileSystem = value;
        }
    },
    ////////////////////////////////////////////////////////////////////
    //
    fileNew: {
    	enumerable: true,
    	value: function(filePath, content, callback) {
    		//
    		this.fileSystem.root.getFile(filePath, {create: true}, function(f) {
				//
				f.createWriter(function(writer) {
					//
					var mime, blob = new window.WebKitBlobBuilder, type = filePath.split('.');
					type = type[type.length-1];
					switch (type) {
						case 'bmp':
							mime = 'image/bmp';
							break;
						case 'gif':
							mime = 'image/gif';
							break;
						case 'jpeg':
							mime = 'image/jpeg';
							break;
						case 'jpg':
							mime = 'image/jpeg';
							break;
						case 'png':
							mime = 'image/png';
							break;
						case 'rtf':
							mime = 'application/rtf';
							break;
						case 'tif':
							mime = 'image/tiff';
							break;
						case 'tiff':
							mime = 'image/tiff';
							break;
						case 'pdf':
							mime = 'application/pdf';
							break;
						case 'zip':
							mime = 'application/zip';
							break;
						case 'svg':
							mime = 'image/svg+xml';
							break;
						default:
							mime = 'text/'+type;
							break;
					}
					//
               		blob.append(content);
               		writer.write(blob.getBlob(mime));
               		//
               		if (callback) callback(true);
				}, function (e) {if (callback) callback(false)});
			}, function (e) {if (callback) callback(false)});
    	}
    },
    ////////////////////////////////////////////////////////////////////
    //
    fileDelete: {
    	enumerable: true,
    	value: function(filePath, callback) {
    		this.fileSystem.root.getFile(filePath, {create: false}, function(file) {
    			file.remove(function() {
    				if (callback) callback(true);
    			});
    		}, function (e) {if (callback) callback(false)});
    	}
    },
    ////////////////////////////////////////////////////////////////////
    //
    fileContent: {
    	enumerable: true,
    	value: function(filePath, callback) {
    		//
    		this.fileSystem.root.getFile(filePath, {}, function(f) {
    			f.file(function(file) {
    				var reader = new FileReader();
    				reader.onloadend = function(e) {
         				if (callback) {
         					callback({content: this.result, data: file, file: f, url: f.toURL()});
         				}
       				};
       				reader.readAsText(file);
    			}, function (e) {if (callback) callback(false)});
    		}, function (e) {if (callback) callback(false)});
    	}
    },
    ////////////////////////////////////////////////////////////////////
    //
    fileCopy: {
    	enumerable: true,
    	value: function() {
    	}
    },
    ////////////////////////////////////////////////////////////////////
    //
    fileRename: {
    	enumerable: true,
    	value: function() {
    	}
    },
    ////////////////////////////////////////////////////////////////////
    //
    fileMove: {
    	enumerable: true,
    	value: function() {
    	}
    },
    ////////////////////////////////////////////////////////////////////
    //Creating directory from path, callback optional
    directoryNew: {
    	enumerable: true,
    	value: function(directoryPath, callback) {
    		//Checking for directory not to already exist
    		this.fileSystem.root.getDirectory(directoryPath, {}, function(dir) {
    			if (callback) callback(false);
    			return; //Directory already exists
    		});
    		//Creating new directory
    		this.fileSystem.root.getDirectory(directoryPath, {create: true}, function(dir) {
				if (callback) callback(true);
			}, function (e) {if (callback) callback(false)});
    	}
    },
    ////////////////////////////////////////////////////////////////////
    //
    directoryDelete: {
    	enumerable: true,
    	value: function(directoryPath, callback) {
    		//
    		this.fileSystem.root.getDirectory(directoryPath, {}, function(dir) {
    			//
    			dir.removeRecursively(function() {
      				if (callback) callback(true);
    			});
    		}, function (e) {if (callback) callback(false)});
    	}
    },
    ////////////////////////////////////////////////////////////////////
    //Returns the directory contents to a callback function
    directoryContents: {
    	enumerable: true,
    	value: function(directory, callback) {
    		//Creating instance of directory reader
    		this.fileSystem.directoryReader = directory.createReader();
    		//Getting directory contents and sending results to callback
    		this.fileSystem.directoryReader.readEntries(function(results) {
    			//Calling callback with results (null if invalid directory)
    			callback(results);
    		}, function (e) {callback(null)});
    	}
    },
    ////////////////////////////////////////////////////////////////////
    //
    directoryCopy: {
    	enumerable: true,
    	value: function() {
    	}
    },
    ////////////////////////////////////////////////////////////////////
    //
    directoryRename: {
    	enumerable: true,
    	value: function() {
    	}
    },
    ////////////////////////////////////////////////////////////////////
    //
    directoryMove: {
    	enumerable: true,
    	value: function() {
    	}
    },
    ////////////////////////////////////////////////////////////////////
    //
    _listNinjaChromeLibrary: {
    	enumerable: false,
        value: function () {
        	function parseLibrary (contents) {
        		//
        		var lib = [];
        		//
        		for(var i=0; contents[i]; i++) {
        			//
        			if (contents[i].isDirectory) {
        				lib.push(contents[i].name);
        			}
        		}
        		//Dispatching action ready event
    			var libraryEvent = document.createEvent("CustomEvent");
            	libraryEvent.initEvent('library', true, true);
            	libraryEvent.ninjaChromeLibrary = lib;
            	this.dispatchEvent(libraryEvent);
        	};
        	//
        	this.directoryContents(this.fileSystem.root, parseLibrary.bind(this));
        }
    }
    ////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////   
});
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////