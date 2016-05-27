define([
	'jquery',
	'medium-editor',
], function($, MediumEditor) {

		var cssApplier = MediumEditor.extensions.form.extend({			
			placeholderText: 'Paste or type a link',	        
	        tagNames: ['a', 'span'],
	        contentDefault: '<b>TESTE</b>',
	        contentFA: '<i class="fa fa-link"></i>',
            cleanOnClick: true,
            noAction: undefined,

        init: function () {                 	
         	MediumEditor.extensions.form.prototype.init.apply(this, arguments);
            this.form = this.createForm();
        },

        // Called when the button the toolbar is clicked
        // Overrides ButtonExtension.handleClick
        handleClick: function (event) {
        	var me = this,
        		customMethods = me.base.customMethods,
        		cssApplier = me.cssApplier,
                cleanOnClick = me.cleanOnClick,
        		check = cssApplier.isAppliedToSelection(),
                initialValue = me.getInitialValue();
            
            console.log('[extension]cssApplier [method]handleClick [var]cssApplier: ', cssApplier);
            me.setInputValue(initialValue);
            me.initialValue = initialValue;
            me.noAction = true;

            me.hideForm = me.hideForm.bind(me);
            me.subscribe('hideToolbar', me.hideForm);
            
            if(cssApplier.elementTagName === 'a') me.execAction('unlink');
            if(cleanOnClick) customMethods.undoToSelection(cssApplier);
            customMethods.applyFakeSelection();
            me.base.saveSelection();

            if (!me.isDisplayed()) {
            	me.showForm();
            }
        },

     	isAlreadyApplied: function(){
     		console.log('isAlreadyApplied');
     		var me = this,
     			cssApplier = me.cssApplier,
        		customMethods = me.base.customMethods,
                $button = $(me.button),
                $icon = $button.find('i'),
        		isApplied = customMethods && cssApplier ? customMethods.checkIsApplied(cssApplier) : false;
        	            
        	return isApplied;
     	},

        // Called by medium-editor to append form to the toolbar
        getForm: function () {
        	if (!this.form) {
        		this.form = this.createForm();
        	}
        	return this.form;
        },

        getTemplate: function () {
        	var template = [
        		'<input type="text" class="medium-editor-toolbar-input" placeholder="', this.placeholderText, '">'
        	];

        	template.push(
        		'<a href="#" class="medium-editor-toolbar-save">',
        		this.getEditorOption('buttonLabels') === 'fontawesome' ? '<i class="fa fa-check"></i>' : this.formSaveLabel,
        		'</a>'
        		);

        	template.push('<a href="#" class="medium-editor-toolbar-close">',
        		this.getEditorOption('buttonLabels') === 'fontawesome' ? '<i class="fa fa-times"></i>' : this.formCloseLabel,
        		'</a>');    

            template.push('<a href="#" class="medium-editor-toolbar-remove">',
                this.getEditorOption('buttonLabels') === 'fontawesome' ? '<i class="fa fa-trash"></i>' : this.formCloseLabel,
                '</a>')  

        	return template.join('');
        },

        // Used by medium-editor when the default toolbar is to be displayed
        isDisplayed: function () {
        	return MediumEditor.extensions.form.prototype.isDisplayed.apply(this);
        },

        hideForm: function () {            
            console.log('[extension]cssApplier [method]hideForm [var]this: ', this);
            var me = this,
                noAction = me.noAction,
                customMethods = me.base.customMethods;            
            
            if(noAction) {
                me.doFormCancel()
            }              
            
            customMethods.removeFakeSelection();
            this.unsubscribe('hideToolbar', this.hideForm);
        	MediumEditor.extensions.form.prototype.hideForm.apply(this);            
        	this.getInput().value = '';
        },

        showForm: function (opts) {
            var medium = this,
                editor = this.base,                
                $parentElement = $(editor.getSelectedParentElement()),
                input = this.getInput(),
                $input = $(input);

            console.log('[extension]cssApplier [method]showForm [var]this: ',  $parentElement);
           
            this.hideToolbarDefaultActions();
            MediumEditor.extensions.form.prototype.showForm.apply(this);
            this.setToolbarPosition();
            
            input.focus();
            $input.select();
        },

        getInitialValue: function(){
             var medium = this,
                editor = this.base,
                $parentElement = $(editor.getSelectedParentElement()),
                attr = this.attr;
                value = $parentElement.attr(attr);

            console.log('[extension]cssApplier [method]getInitialValue [var]value: ',  value);
            return value;            
        },

        setInputValue: function(value){
            var me = this,
                input = this.getInput();

            if(value !== undefined) input.value = value;
        },

        // Called by core when tearing down medium-editor (destroy)
        destroy: function () {
        	console.log('destroy');
        	var medium = this,
        		customMethods = medium.base.customMethods;
            
        	this.unsubscribe('hideToolbar', this.hideForm);

        	if (!this.form) {
        		return false;
        	}

        	if (this.form.parentNode) {
        		this.form.parentNode.removeChild(this.form);
        	}

        	delete this.form;
        },

        // core methods

        getFormOpts: function () {
        	return opts = {
        		title: this.getInput().value.trim()
        	};
        },

        doFormSave: function () {
        	var opts = this.getFormOpts();
            console.log('[extension]cssApplier [method]doFormSave [var]opts: ', opts);

            this.noAction = false;
        	this.completeFormSave(opts);
        },

        completeFormSave: function (opts) {
            console.log('[extension]cssApplier [method]completeFormSave [var]opts, this: ', opts, this);
            if(!opts.title) return false;
        	var me = this,
     			cssApplier = this.cssApplier,        		
                format = this.format,
                cleanOnClick = me.cleanOnClick,
                customMethods = me.base.customMethods,
                value = format ? format(opts.title) : opts.title,                
        		attr = this.attr;

        	cssApplier.elementAttributes[attr] = value;
            customMethods.restoreSelection();
            if(!cleanOnClick) customMethods.undoToSelection(cssApplier);        	
        	cssApplier.applyToSelection();        
        	this.base.checkSelection();        	
        }, 

        doFormCancel: function () {
            var me = this,
                customMethods = me.base.customMethods,
                initialValue = me.initialValue;

            this.noAction = false;
            console.log('[extension]cssApplier [method]doFormCancel [var]initialValue: ', initialValue);
            if(!initialValue){
                customMethods.restoreSelection();
                me.hideForm();
                this.base.checkSelection();
            }else{
                this.completeFormSave({
                    title: initialValue
                });
            }
        },

        // form creation and event handling
        attachFormEvents: function (form) {
        	var me = this,
                close = form.querySelector('.medium-editor-toolbar-close') || false,
                save = form.querySelector('.medium-editor-toolbar-save'),
                remove = form.querySelector('.medium-editor-toolbar-remove'),                
                input = me.getInput(form);

            console.log('[extension]cssApplier [method]attachFormEvents [var]close: ', close);
            // Handle clicks on the form itself
            if(form) this.on(form, 'click', this.handleFormClick.bind(this));

            // Handle typing in the textbox
            if(input) this.on(input, 'keyup', this.handleTextboxKeyup.bind(this));

            // Handle close button clicks
            if(close) this.on(close, 'click', this.handleCloseClick.bind(this));

            if(remove) this.on(remove, 'click', this.handleRemoveClick.bind(this));            

            // Handle save button clicks (capture)
            if(save) this.on(save, 'click', this.handleSaveClick.bind(this), true);
        },

        handleRemoveClick: function(){
            var me = this,
                customMethods = me.base.customMethods;

            this.noAction = false;
            customMethods.restoreSelection();
            me.hideForm();
            this.base.checkSelection();
        },

        createForm: function () {
        	var doc = this.document,
                form = doc.createElement('div');

            // Anchor Form (div)
            form.className = 'medium-editor-toolbar-form';
            form.id = 'medium-editor-toolbar-form-anchor-' + this.getEditorId();
            form.innerHTML = this.getTemplate();
            this.attachFormEvents(form);

            return form;
        },

        getInput: function (form) {
            form = form ? form : this.getForm();

        	return form.querySelector('input.medium-editor-toolbar-input');
        },

        handleTextboxKeyup: function (event) {
            // For ENTER -> create the anchor
            if (event.keyCode === MediumEditor.util.keyCode.ENTER) {
            	event.preventDefault();
            	this.doFormSave();
            	return;
            }

            // For ESCAPE -> close the form
            if (event.keyCode === MediumEditor.util.keyCode.ESCAPE) {
            	event.preventDefault();
            	this.doFormCancel();
            }
        },

        handleFormClick: function (event) {
            // make sure not to hide form when clicking inside the form
            event.stopPropagation();
        },

        handleSaveClick: function (event) {
            // Clicking Save -> create the anchor
            event.preventDefault();
            this.doFormSave();
        },

        handleCloseClick: function (event) {
            console.log('[extension]cssApplier [method]handleCloseClick [var]event: ', event);
            event.preventDefault();
            this.doFormCancel();
        }
    });
    

    MediumEditor.extensions.cssApplier = cssApplier;
	return cssApplier;
});