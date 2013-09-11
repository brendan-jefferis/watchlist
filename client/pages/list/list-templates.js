/* List Page JS
================================================== */



//// HELPERS
Template.list.movies = function () {
  if (Meteor.user()) {
    Meteor.call("cleanupArray", Meteor.user().following);
    return Session.get('filter') ?
            Movies.find({owner: {$in: Meteor.user().following}, genre: Session.get('filter')}, {sort: {date: -1}}) :
            Movies.find({owner: {$in: Meteor.user().following}}, {sort: {date: -1}});
  }
};

Template.movie.can_remove = function () {
  return (this.owner === Meteor.userId()) ? true : false;
};

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

Template.movie.events({
  'click .remove' : function () {
    Movies.remove(this._id);
  }
});

Template.filters.events({
  'click #no-filter' : function () {
    Session.set('filter', null);
  }
});

Template.genre.events({
  'click .filter' : function (e,t) {
    e.preventDefault();
    window.location.hash = e.target.classList[1];
    Session.set('filter', e.target.classList[1]);
  }
});

Template.genre.rendered = function () {
  $('#filters a[href="' + window.location.hash + '"]').parent().addClass('active');
}