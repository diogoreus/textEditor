define([], function() {
    "use strict";  

    var formatURL = function(url) {
    	console.log('[formater]formatURL [var]url: ', url);
		var formatedURL = url,
			indexProtocol = url.indexOf('//'),
			indexWWW = url.indexOf('www');

		if (indexWWW === -1) formatedURL = 'www.' + formatedURL;
		if (indexProtocol === -1) formatedURL = 'http://' + formatedURL;

		console.log('[formater]formatURL [var]formatedURL: ', formatedURL);
		return formatedURL;
	}  

    return formatURL;
});