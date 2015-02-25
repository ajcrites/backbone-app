(function(App){
	var Router = Backbone.Router.extend({
		routes: {
			'': 'index',
			'notes': 'displayNotes'
		},
		initialize: function(){
			var navbar = new App.View.Navbar();
			navbar.render();
			
			// Seemingly this is done to allow for push state (no hash for
			// history), but it won't work properly because the server is
			// not set up for it so going directly to `localhost:8000/displayNotes`
			// will return a 404.  You can only use push state if the server
			// is going to cooperate
			//
			// I also get the feeling there has to be a nicer way to do this :/
			// at least it should be done in a more convenient spot (a
			// separate function maybe) and commented on.
			$(document).on("click", "a:not([data-bypass])", function(evt) {
				var href = {
					prop: $(this).prop("href"),
					attr: $(this).attr("href")
				};
				var root = location.protocol + "//" + location.host + Backbone.history.options.root;

				if (href.prop && href.prop.slice(0, root.length) === root) {
					evt.preventDefault();
					var page = href.attr;

					Backbone.history.navigate(page, true);
				}
			});
		},
		index: function(){
			var viewportModel = new App.Model.Index({pageTitle: 'Welcome to my notes App!'});
			// Rather than create a new view each time you can also do something
			// along the lines of `this.IndexView = this.IndexView || new App.View.Index`
			//
			// I'm not sure that there is a huge benefit to this, but each time
			// you called `this.IndexView.render()` you would have to remember
			// to call `.delegateEvents()` as well since they would probably
			// have been undelegated by a previous removal
			var viewport = new App.View.Index({model: viewportModel});

			viewport.render();

			// You could do this with a `renderView` function or the like --
			// remove the current *main* view (or undelegate its events)
			// and replace it with the newly created view.  Then you
			// wouldn't have to redefine this in all of the routes
			//
			// I also generally advise against adding function parameters or
			// any other symbols that are not read, i.e.
			// `function ()` vs. `function (route, params)`
			this.on('route', function(route, params) {
				if(route === 'displayNotes'){
					viewport.remove();
				}
			});
		},
		displayNotes: function(){
			var notesView;
			if(typeof App.Collection.Notes === 'function'){
				App.Collection.Notes = new App.Collection.Notes();
			}

			// Indentation got screwed up here.  Make sure your editor is set
			// up to handle whitespace properly!
			App.Collection.Notes.fetch({
		        success: function (collection) {
		            notesView = new App.View.Notes({collection: App.Collection.Notes});
					notesView.render();
		        }
		    });
			// See comments above about an alternative for removing the old view
			this.on('route', function(route, params) {
				if(route === 'index'){
					notesView.remove();
				}
			});
		},
		// This is unused :(
		editNote: function(noteId){
			var model = App.Collection.Notes.get(noteId);
			var editView = new App.View.EditNote({model:model});
			editView.render();
		}
	});
	App.Router = new Router;
	Backbone.history.start({pushState: true});
})(App);
