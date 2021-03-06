WAF.define('HandlebarsTemplate', ['waf-core/widget'], function(widget) {
	
    var HandlebarsTemplate = widget.create('HandlebarsTemplate', {
        init: function() {
            try {
            	var _this = this;

                // validate datasource
                if (_this.templateDataCollection()) {
                    // datasource
                    _this.templateDataAttributes = _this.templateDataCollection().getAttributeNames().join(',');
                    // add on collection change listener
                    _this.templateDataCollection().addListener('onCollectionChange', function(event) {
                        _this.toHandlebarsArray();
                    });
                }
                // load template                
                var templateFileRequest = new XMLHttpRequest();
                templateFileRequest.open('GET', _this.templatePath(), true);
                templateFileRequest.onload = function() {
                    if (templateFileRequest.status >= 200 && templateFileRequest.status < 400) {
                        // get file content
                        _this.templateSource = templateFileRequest.responseText;
                        // call html renderer function
                        _this.render();
                    } else {
                        throw 'reached target server of template file, but server returned an error'
                    }
                };
                templateFileRequest.onerror = function() {
                    throw 'connection error'
                };
                templateFileRequest.send();
            } catch (e) {
            	console.log(e);
            }
        },
        templateDataCollection: widget.property({
    		type: 'datasource'
    	}),
        templatePath: widget.property({
    		type: 'string',
    		defaultValue: '/path/to/template.html',
    		bindable: false
    	}),
    	toHandlebarsArray: function(){
    	    var _this = this;
    	    
             // load template data
            _this.templateDataCollection().toArray(_this.templateDataAttributes, {
                onSuccess: function(event){
                    // add content to element                
                    _this.templateData = {
                        items: event.result
                    };
                    // call html renderer function
                    _this.render();
                }
            });
    	},
    	setHandlebarsArray: function(value){
    	    var _this = this;
    	    
            // add content to element                
            _this.templateData = {
                entity: value
            };
            // call html renderer function
            _this.render();
    	},
    	render: function(){
    	    var _this = this,
    	        templateFn;
           
    	    // render data
    	    if (_this.templateData && _this.templateSource) {
    	        var templateFn = Handlebars.compile(_this.templateSource),
    	            clickListenerArr;

    	        // add html to element
    	        _this.node.innerHTML = templateFn(_this.templateData);
    	        // add click event
    	        clickListenerArr = _this.node.getElementsByClassName('click');
    	        // loop elements
    	        for (var i = 0; i < clickListenerArr.length; i++) {
    	            var element = clickListenerArr[i];
    	            
    	            // add listener to element
		            element.addEventListener('click', function() {_this.fire('click', {element: element});}, false);
	            };
    	        // fire complete event
    	        _this.fire('render');
    	    }
    	}
    });

    return HandlebarsTemplate;

});

/* For more information, refer to http://doc.wakanda.org/Wakanda0.DevBranch/help/Title/en/page3871.html */