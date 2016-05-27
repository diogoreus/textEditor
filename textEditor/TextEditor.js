define([
	'jquery',
	'medium-editor',
	'TextEditorConfig',
	'TextEditorPolyfills'	
], function($, MediumEditor, config) {
	"use strict";
	window.MediumEditor = MediumEditor;
	var cleanContent = function($el){
		// Limpa fake selection caso tenha acontecido algum erro e 
		// tenha sobrado sujando a formatação do curso
		cleanWithSelector($el, '.fakeSelection', true);
		cleanWithSelector($el, '.rangySelectionBoundary', false);
		cleanEmptyTags($el);

		return $el.html();
	}

	var cleanWithSelector = function($el, selector, keepConent){
		if (!$el || !selector) return;

		var $nodes = $el.find(selector);
		if(keepConent) $nodes.contents().unwrap()
		$nodes.remove();
	}

	var cleanEmptyTags = function($el){		
		$el.find('*:empty:not(div,p,br)').remove();
	}

	var TextEditor = function(){
		this.editors = [];
		var initEvents = function(editor){
			var me = this,
				callback = editor.options.callback,
				$el = editor.$el;

			editor.subscribe('hidedToolbar', function(){
				var content = cleanContent($el);
				if (callback) callback(content);
			});
		}

		this.new = function($el, opts){						
			var defaults = config.getDefaults(opts),
				options = $.extend(true, {}, defaults, opts),
				el = $el[0],
				editor = new MediumEditor(el, options);			
			
			this.editors.push(editor);
			editor.el = el;
			editor.$el = $el;

			initEvents(editor)
			return editor;
		}

		this.destroy = function(editor){
			var editors = this.editors,
				index = editors.indexOf(editor);

			if(index !== -1){
				editor.destroy();
				editors.splice(index, 1);
			}			
		}
	}

	return TextEditor;
});


/*
params = {
	edition: me,
	$el: me.recView.elems.$content, //Elemento wrapped pelo jquery
	attr: 'content', //atributo do modelo
	textEditor: {
		options: [ //opções do editor de texto
			'bold',
			'italic',
			'underline',
			'color-picker',
			'fontSizeDown',
			'fontSizeUp',
			'removeFormat',
			'align-left',
			'link-file',
			'align-center',
			'align-right',
			'justify',
			'link',
			'glossary',
			'unlink',
			'orderedList',
			'unorderedList',
			'highlighter',
			'spellchecker'
		]
	}
};
*/