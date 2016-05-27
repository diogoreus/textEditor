define([
    'jquery',
    'medium-editor',
    'spectrum'
], function($, MediumEditor, spectrum) {
    var ColorPickerExtension = MediumEditor.extensions.button.extend({		
		contentDefault: '<b>TESTE</b>',
		contentFA: '<i class="fa fa-link"></i>',
		name: "colorPicker",
		action: "applyForeColor",
		aria: "color picker",
		contentDefault: "<span class='editor-color-picker'>Text Color<span>",
		defaultColorMethod: "toRgbString",
		isPickerOpen: false,

		init: function() {			
			var button = this.document.createElement('button'),
				colorPicker = this.document.createElement('input'),
				$colorPicker = $(colorPicker),
				$button = $(button);

			button.classList.add('medium-editor-action');
			button.style = "padding: 0 !important;"
			colorPicker.type = "text";
			this.button = button;
			this.$button = $button;
			this.$colorPicker = $colorPicker;

			$button.append($colorPicker);

			//init spectrum color picker for this button
			this.initPicker($(this.button));

			//use our own handleClick instead of the default one
			// this.on(this.button, 'mousedown', this.handleClick.bind(this));
			this.on(this.button, 'click', this.handleClick.bind(this));

			window.colorPicker = this;
		},

		handleClick: function(e){			
			console.log('[extension]colorPicker [method]handleClick [var]this: ', this);
			var medium = this,
				editor = this.base,
				cssApplier = this.cssApplier,
				customMethods = medium.base.customMethods,				
				$colorPicker = this.$colorPicker,
				toolbar = this.base.getExtensionByName('toolbar');
			
			cssApplier.undoToSelection();
            customMethods.applyFakeSelection();            
            // debugger;

            $colorPicker.spectrum("show");
            this.positionSpectrum();            
            
            if(toolbar) toolbar.hideToolbar(false);
            
            document.getSelection().removeAllRanges();
            // MediumEditor.extensions.form.prototype.hideToolbarDefaultActions.apply(this);			

          	this.isPickerOpen = true;
			return false;
		},

		positionSpectrum: function(){
			console.log('[extension]colorPicker [method]positionSpectrum [var]this: ', this);
			var medium = this,
				editor = this.base,
				$origElements = $(medium.getButton()).parent().parent().parent().parent(),
				$spectrum = this.$spectrum,
				pos = $origElements.position(),
				specWidth = $spectrum.outerWidth(),
				specHeight = $spectrum.outerHeight(),
				editorWidth = $origElements.outerWidth(),
				editorHeight = $origElements.outerHeight();			
			
			console.log('[extension]colorPicker [method]positionSpectrum [var]$origElements: ', $origElements, specWidth, editorWidth);
    		$spectrum.css({
    			top: (pos.top - (specHeight - editorHeight)) + "px",            	
        		left: (pos.left + ((editorWidth - specWidth)/2) ) + "px",        		
            })
		},

		isAlreadyApplied: function(){
			console.log('[extension]colorPicker [method]isAlreadyApplied [var]this: ', this);
			var currentColor = this.getCurrentColor(),
				isPickerOpen = this.isPickerOpen;

			console.log('[extension]colorPicker [method]isAlreadyApplied [var]currentColor, isPickerOpen: ', currentColor, isPickerOpen);
			if(!isPickerOpen) this.setInitialColor(currentColor);
			return false;
		},

		getCurrentColor: function(){
			var medium = this,
				editor = this.base,
				colorMethod = this.defaultColorMethod,
				$parentElement = $(editor.getSelectedParentElement()),
				parentElementColor = $parentElement.css('color'),
				currentColor = tinycolor(parentElementColor);
			
			return currentColor ? currentColor[colorMethod]() : false;
		},

		setInitialColor: function(currentColor){
			console.log('[extension]colorPicker [method]setInitialColor [var]currentColor: ', currentColor);
			var $colorPicker = this.$colorPicker;

			$colorPicker.spectrum("set", currentColor);
		},

		initPicker: function($el){			
			console.log('[extension]colorPicker [method]initPicker [var]this, $el: ', this, $el);
			var $colorPicker = this.$colorPicker;

			this.$spectrum = $colorPicker.spectrum({				
				color: "",
				showInput: true,
				showAlpha: true,
				showPalette: true,
				showInitial: true,
				chooseText: "Ok",
				clickoutFiresChange: true,
    			cancelText: "Cancelar",				
				preferredFormat: "hex3",				
				hide: this.setColor.bind(this),
				show: this.handleClick.bind(this),				
				palette: [
					["#000", "#444", "#666", "#999", "#ccc", "#eee", "#f3f3f3", "#fff"],
					["#f00", "#f90", "#ff0", "#0f0", "#0ff", "#00f", "#90f", "#f0f"],
					["#f4cccc", "#fce5cd", "#fff2cc", "#d9ead3", "#d0e0e3", "#cfe2f3", "#d9d2e9", "#ead1dc"],
					["#ea9999", "#f9cb9c", "#ffe599", "#b6d7a8", "#a2c4c9", "#9fc5e8", "#b4a7d6", "#d5a6bd"],
					["#e06666", "#f6b26b", "#ffd966", "#93c47d", "#76a5af", "#6fa8dc", "#8e7cc3", "#c27ba0"],
					["#c00", "#e69138", "#f1c232", "#6aa84f", "#45818e", "#3d85c6", "#674ea7", "#a64d79"],
					["#900", "#b45f06", "#bf9000", "#38761d", "#134f5c", "#0b5394", "#351c75", "#741b47"],
					["#600", "#783f04", "#7f6000", "#274e13", "#0c343d", "#073763", "#20124d", "#4c1130"]
				]
			}).spectrum("container");
		},

		setColor: function(color){
			console.log('[extension]colorPicker [method]setColor [var]this, color: ', this, color);
			this.base.customMethods.restoreSelection();		
			var medium = this,
				cssApplier = this.cssApplier,
        		customMethods = this.base.customMethods,
        		currentColor = this.getCurrentColor(),
        		colorMethod = this.defaultColorMethod,
				finalColor = color ? color[colorMethod]() : false;
			
			console.log('[extension]colorPicker [method]setColor [var]currentColor, finalColor: ', currentColor, finalColor);
			if (finalColor && currentColor && currentColor !== finalColor) {				
				cssApplier.elementAttributes['style'] = 'color:' + finalColor + ';';			
				
        		cssApplier.applyToSelection();
			}

			customMethods.removeFakeSelection();			
			this.base.checkSelection();

			this.isPickerOpen = false;

			return false;
		},      

        destroy: function () {        	
        	console.log('[extension]colorPicker [method]destroy: ');
        	var medium = this,
        		customMethods = medium.base.customMethods;

        	customMethods.removeFakeSelection();        	
        },

    });

    return ColorPickerExtension;
});