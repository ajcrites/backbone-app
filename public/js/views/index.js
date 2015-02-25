(function(App){
	var Index = Backbone.View.extend({
		el: '#viewport',
		template: _.template($('#index-tpl').html()),
		render: function(){
			this.$el.html(this.template({model: this.model}));
			return this;
		},
		// `.remove` should rarely need to be overridden by views
		// (in fact the default view removal removes the element and
		// calls stopListening)`.
		//
		// This alternative does not destroy the #viewport element
		// whereas the usual `remove` method would.
		//
		// Rather than redefining this for each view, I think it would be
		// preferable to handle that in your main rendering function
		// discussed in router.js that will handle the undelegation of
		// the current *main* view
		//
		// You can also not specify an `el` for Backbone (it will default to
		// a newly created empty div) and call `$("#main-view-thingy").empty()`
		// and then append the newly created view to it.  Then you don't have
		// to worry about `.remove` destroying the wrong element.
		remove: function() {
			this.$el.empty().off(); /* off to unbind the events */
			this.stopListening();
			return this;
		}
	});
	App.View.Index = Index;
})(App);

