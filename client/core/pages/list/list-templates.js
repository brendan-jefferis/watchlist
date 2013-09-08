//// HELPERS
Template.listPage.helpers({
  count : function () {
    return (Movies.find({}).count() === 0) ? false : true;
  }
});

Template.filters.helpers({
  genres : function () {
    if (Meteor.user()) {
      var genres = Movies.find({owner: {$in: Meteor.user().following}}, {fields: {genre: 1}, sort: {genre: 1}}).fetch();
      uniqueGenres = uniqueInArray(genres);
      return uniqueGenres;
    }
  },
  no_filter : function () {
    return !Session.get('filter') ? "active" : "";
  }
});




//// EVENTS
Template.listPage.events({
	'click .add-movie' : function (e) {
	  e.preventDefault();
	  Router.go('addPage');
	  Session.set('adding_new', true);
	}
});



//// GENERIC HELPER FUNCTIONS
function uniqueInArray (array) {
  var uniqueItems = [];
  $.each(array, function(i, el) {
    if ($.inArray(el.genre, uniqueItems) === -1) {
      uniqueItems.push(el.genre);
    }
  });
  return uniqueItems;
}