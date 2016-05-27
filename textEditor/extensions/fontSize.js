define([
   'jquery',
	'medium-editor',
    'underscore'
], function($, MediumEditor, _) {
    "use strict";    
    var fontSizeExt = MediumEditor.extensions.cssApplier.extend({
        defaults: {
            fontSizes: [12, 18, 22, 28, 32, 44, 55],    
        },        

    	init: function(){
    		// MediumEditor.extensions.cssApplier.prototype.init.apply(this, arguments);
    		// this.form = this.createForm();
            console.log('[extension]fontSize [method]init [var]this: ', this);
            var me = this,            
                button = me.document.createElement('button'),
                $button = $(button),
                content = me.getTemplate(),
                fontSizes = me.getFontSizes();

            $button.append(content);
            me.buildOptions($button, fontSizes);
            $button.addClass('medium-editor-action textSizeBt');
            me.button = button;
            me.$button = $button;

            me.hideForm = me.hideForm.bind(me);           

    		me.getElements();
    		me.initEvents();	
    	},

        getFontSizes: function(){
            var me = this,
                defaultFontSizes = me.defaults.fontSizes,
                optionsFontSizes = me.fontSizes,
                fontSizes = [].concat(defaultFontSizes, optionsFontSizes);

            fontSizes = _.uniq(fontSizes);
            fontSizes.sort(function(a,b){
                return a - b;
            });

            return fontSizes.slice(0,7);
        },

        buildOptions: function($button, fontSizes){
            console.log('[extension]fontSize [method]init [var]$button, fontSizes: ', $button, fontSizes);
            var me = this,
                $list = $button.find('.dropdown-menu');

            for (var i = 0; i < fontSizes.length; i++) {
                var fontSize = fontSizes[i];

                $list.append($('<li data-value="' + fontSize + 'px"><a>' + fontSize + 'px </a><li>'));
            }
            

            // /'<li data-value="6px"><a href="#">6px</a></li>',

        },

        getTemplate: function(){
            var template = [
                '<div class="textSize input-group">',
                    '<input type="text" class="form-control" aria-label="...">',                    
                    '<div class="input-group-btn dropup">', 
                        '<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">', 
                            '<span class="caret"></span>', 
                        '</button>', 
                        '<ul class="dropdown-menu dropdown-menu-right">',
                            
                        '</ul>', 
                    '</div>', 
                '</div>'
            ];
            
            console.log('[extension]fontSizeExt [method]getTemplate [var]template: ', template.join(''));
            return template.join('');
        },     

    	handleClick: function(){
            console.log('[extension]fontSize [method]handleClick [var]this: ', this);
    		var me = this,
                $input = me.$input,                
                cssApplier = me.cssApplier,
                cleanOnClick = me.cleanOnClick,
                customMethods = me.base.customMethods;
            
            if(cleanOnClick) customMethods.undoToSelection(cssApplier);
            customMethods.applyFakeSelection();
            me.base.saveSelection();
            me.subscribe('hideToolbar', me.hideForm);

            $input.select();
    	},

        isAlreadyApplied: function(){
            console.log('[extension]fontSize [method]isAlreadyApplied [var]this: ', this);
            var me = this,
                initialValue = me.getInitialValue();

            me.setInputValue(initialValue);
        },

    	getElements: function(){
    		console.log('[extension]fontSize [method]getElements [var]this: ', this);
    		var me = this,
    			$button = this.$button,
    			$dropdown = $button.find('.dropup'),
    			$dropBt = $button.find('.dropdown-toggle'),
    			$elements = $dropdown.find('li'),
    			$input = $button.find('input');    		
            
    		console.log('[extension]fontSize [method]getElements [var]$dropBt: ', $dropBt);
    		me.$input = $input;
    		me.$dropdown = $dropdown;
    		me.$elements = $elements;
    		me.$dropBt = $dropBt;
    	},

    	initEvents: function(){
    		var me = this,    			
    			$input = me.$input,
    			$elements = me.$elements,
    			$dropdown = me.$dropdown,
    			$dropBt = me.$dropBt;
    		
    		$input.on({
    			mousedown: function(e){
    				console.log('[extension]fontSize [method]initEvents/focusin [var]$dropdown: ', $dropdown);					
                    me.handleClick();

                    $dropdown.addClass('open');                                      
    			},

                mouseup: function(e){
                    e.preventDefault();
                    return;
                },

                keyup: function(e){
                    if (e.keyCode === MediumEditor.util.keyCode.ENTER) {
                        e.preventDefault();
                        me.doFormSave();
                        return;
                    }
                }
    		}); 

			$dropBt.on({
				click: function(){
					console.log('[extension]fontSize [method]$dropBt/click [var]$dropdown: ', $dropdown);                    
                    me.handleClick();
					$dropdown.toggleClass('open');                                     
				}
			});

			$elements.on({
				click: function(e){
					var $el = $(e.currentTarget),
						value = $el.data('value');

					console.log('[extension]fontSizeExt [method]$elements/click [var]value: ', value);
					me.setInputValue(value);
					me.doFormSave();		
				}
			})
    	},

        hideDropdown: function(){
            console.log('[extension]fontSive [method]hideDropdown [var]this: ', this);
            var me = this,
                $dropdown = me.$dropdown;

             $dropdown.removeClass('open');
        },

    	getInitialValue: function(){
    		var me = this,
                editor = me.base,
                $parentElement = $(editor.getSelectedParentElement()),
                $el = $parentElement.hasClass('fakeSelection') ? $parentElement.children() : $parentElement,
                fontSize = $el.css('font-size');

            console.log('[extension]fontSizeExt [method]getInitialValue [var]$el, $parentElement: ', $el, $parentElement);            
            return fontSize;
    	},

    	setInputValue: function(value){    		
    		console.log('[extension]fontSizeExt [method]setInputValue [var]value: ', value);
    		var me = this,
    			$input = me.$input;
    		
    		$input.val(value);
    	},

    	doFormSave: function () {
    		console.log('[extension]fontSizeExt [method]doFormSave [var]this: ', this);
        	var me = this,
        		$input = me.$input,
                customMethods = me.base.customMethods,
        		value = parseInt($input.val(), 10) + 'px',
        		opts = {
        			title: value
        		}
            
        	me.hideDropdown();
            me.completeFormSave(opts);
            me.setInputValue(value);
        },

        getInput: function (form) {
        	var me = this,
                $input = me.$input;

        	return $();
        },

        hideForm: function () {            
            console.log('[extension]fontSive [method]hideForm [var]this: ', this);
            var me = this,
                customMethods = me.base.customMethods;      
            
            me.unsubscribe('hideToolbar', me.hideForm);
            me.hideDropdown();
            customMethods.removeFakeSelection();
        },  
    });

    return fontSizeExt;
});