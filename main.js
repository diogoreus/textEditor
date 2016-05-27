'use strict';

require.config({
	urlArgs: "bust=" + (new Date()).getTime(),
	waitSeconds: 0,
	shim: {
		'jquery': {
			exports: '$'
		},

		'underscore': {
			exports: '_'
		},

		'rangy-core': {
			exports: 'rangy'
		},

		'rangy-selectionsaverestore': {
			deps: [
				'rangy-core'				
			]
		},

		'rangy-classapplier': {
			deps: [
				'rangy-core'				
			]
		},
	},

	paths: {
		'jquery': './node_modules/jquery/dist/jquery',
		'underscore': './node_modules/underscore/underscore',
		'medium-editor': './node_modules/medium-editor/dist/js/medium-editor',
		'spectrum': './node_modules/spectrum-colorpicker/spectrum',
		'rangy-core': './node_modules/rangy/lib/rangy-core',
		'rangy-selectionsaverestore': './node_modules/rangy/lib/rangy-selectionsaverestore',
		'rangy-classapplier': './node_modules/rangy/lib/rangy-classapplier',

		'TextEditor': './textEditor/TextEditor',
		'TextEditorConfig': './textEditor/config',
		'TextEditorPolyfills': './textEditor/polyfills/polyfills',
		
		//Extensions 
		'tooltipExtension': './textEditor/extensions/cssApplier',
		'colorPickerExtension': './textEditor/extensions/colorPicker',
		'fontSizeExtension': './textEditor/extensions/fontSize',
		

		//Formaters
		'formatURL': './textEditor/extensions/formaters/formatURL',				

	},

	config: {
		
	}
});

require([
	'jquery',
	'TextEditor',
	'rangy-core',
], function($, TextEditor, rangy) {	
	rangy.init();
	window.rangy = rangy;
	
	var textEditor = new TextEditor(),
		$editable1 = $('.editable1'),
		// editor1 = textEditor.new($('.editable1')),
		editor2 = textEditor.new($('.editable2'), {
			callback: function(content){
				console.log('callback: ', content)
			},
			fontSizes: [15, 12, 18, 22],			

		});


	window.textEditor = textEditor;
	// window.editor1 = editor1;
	window.editor2 = editor2;


	$editable1.on({
		mousedown: function(){
			var editable = $editable1.attr('contenteditable');
			if (!editable) textEditor.new($editable1);			
		}
	});
});
