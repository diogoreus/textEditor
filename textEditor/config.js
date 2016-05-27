define([
	'jquery',
	'rangy-core',
	'rangy-classapplier',	
	'tooltipExtension',	
	'colorPickerExtension',
	'fontSizeExtension',
	'formatURL'
], function($, rangy, classapplier, tooltipExtension, colorPickerExtension, fontSizeExtension, formatURL) {
	console.log('[colorPicker]config [var]formatURL')
	var config = {
		getDefaults: function(opts){
			var	buttons = getButtons(['format', 'lists', 'paragraph', 'links']),
				extensions = getExtensions({
					fontSizes: opts && opts.fontSizes ? opts.fontSizes : []
				});
			
			return {
				buttonLabels: 'fontawesome',
				anchorPreview: false,
				toolbar: {
					allowMultiParagraphSelection: true,
					
					buttons: buttons,				
					// static: true,
					// updateOnEmptySelection: true,
					// align: 'center'				
				},

				extensions: extensions
			}		
		}
	}

	var settings = {
		groups: {
			format: {
				opts: ['bold', 'italic', 'underline', 'strikethrough', 'subscript', 'superscript', 'fontSize', 'colorPicker', 'removeFormat']
			},
			paragraph: {
				opts: ['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull']
			},
			lists: {
				opts: ['orderedlist', 'unorderedlist', 'indent', 'outdent']	
			},
			links: {
				opts: ['anchor', 'tooltip', 'files']
			}
		}
	}

	var getButtons = function(groups){
		var buttons = groups.filter(function(group){
				return settings.groups[group]
			}).map(function(group){
				var options = settings.groups[group].opts.map(function(option){
						return {
							name: option
						}
					});

				options[options.length - 1].lastFromGroup = true;
				return options;
			});

		buttons = [].concat.apply([], buttons);
		return buttons;		
	}

	var getExtensions = function(opts){
		var fontSizes = opts.fontSizes;

		return {
			'colorPicker': new colorPickerExtension({				
				cssApplier: rangy.createClassApplier("mb-link", {
					elementTagName: "span",
					elementAttributes: {
						'style': ''
					}
				})
			}),

			'fontSize': new fontSizeExtension({
				name: 'fontSize',
				attr: 'style',
				cleanOnClick: false,
				fontSizes: fontSizes,
				contentFA: '<i class="fa fa-text-height" aria-hidden="true"></i>',
				format: function(fontSize){
					return 'font-size:' + fontSize + ';'
				},
				cssApplier: rangy.createClassApplier("mb-fontSize", {
					elementTagName: "span",
					elementAttributes: {							
						'style': ''
					}
				})
			}),

			'anchor':  new tooltipExtension({
				name: 'anchor',
				attr: 'href',
				format: formatURL,
				cssApplier: rangy.createClassApplier("mb-link", {
					elementTagName: "a",
					elementAttributes: {							
						'href': '#'
					}
				})
			}),

			'tooltip': new tooltipExtension({				
				name: 'tooltip',
				attr: 'title',					
				contentFA: '<i class="fa fa-info-circle" aria-hidden="true"></i>',			
				cssApplier: rangy.createClassApplier("tooltipstered", {
					elementTagName: "span",
					elementAttributes: {							
						'title': 'asd'
					}
				})
			}),

			'fileLink': new tooltipExtension({				
				name: 'fileLink',
				attr: 'href',
				cssApplier: rangy.createClassApplier("textLink", {
					elementTagName: "a",
					elementAttributes: {							
						'href': '#'
					}
				})
			})
		}
	}
	
	return config;
})

