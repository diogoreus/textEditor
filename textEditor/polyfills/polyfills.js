require([
	'jquery',
	'medium-editor',
	'rangy-core',

	'rangy-selectionsaverestore',
	'rangy-classapplier'
], function($, MediumEditor, rangy) {
	var pollyfills = {
		savedSel: undefined,

		saveSelection: function() {
			console.log('saveSelection', this);
			this.destroySelection();
			this.savedSel = rangy.saveSelection();
		},

		restoreSelection: function() {
			console.log('restoreSelection: ', this.savedSel);
			if (this.savedSel) {
				rangy.restoreSelection(this.savedSel, true);
				this.saveSelection();            
			}
		},

		destroySelection: function(){
			if (this.savedSel) {
				rangy.removeMarkers(this.savedSel);
				this.savedSel = undefined;
			}
		},

		applyFakeSelection: function(){
			this.saveSelection();
			console.log('applyFakeSelection: ', this.savedSel);			
			if (this.savedSel) { 
				try {
					this.fakeSelection.applyToSelection();
					this.saveSelection();
				}
				catch (e) {				
					console.log('applyFakeSelection: ', e);
				}        		
			}
		},

		removeFakeSelection: function(){			
			console.log('removeFakeSelection', this.savedSel);
			var currentSelection = rangy.saveSelection();        	
			if (this.savedSel) {        		
				this.restoreSelection();
				this.fakeSelection.undoToSelection();        		
				rangy.removeMarkers(this.savedSel);
    			// return false;
        	}

        	rangy.restoreSelection(currentSelection, true);
        	this.saveSelection();
        },

        checkFakeSelection: function(){
        	var check = fakeSelection.isAppliedToSelection();
        	
        	return check;        	
        },

        checkIsApplied: function(classApplier){
        	console.log('checkIsApplied', classApplier);
        	if(classApplier) {
        		return classApplier.isAppliedToSelection();
        	}else{
        		return false;
        	}
        },

        undoToSelection: function(classApplier){
        	console.log('undoToSelection', classApplier);
        	if(classApplier) {
        		var elementAttributes = $.extend({}, classApplier.elementAttributes);
        		classApplier.elementAttributes = {};

        		classApplier.undoToSelection();
        		classApplier.elementAttributes = elementAttributes;
        		// this.saveSelection();
        	}else{
        		return false;
        	}
        },

        fakeSelection: rangy.createClassApplier("fakeSelection", {
        	elementTagName: "span",
        	elementAttributes: {                
        		style: "background-color:#338FFF; color:#fff"				
        	}
        })
    }

    MediumEditor.prototype.customMethods = pollyfills;    
});
