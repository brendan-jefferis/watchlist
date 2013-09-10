//// TEMPLATE HELPERS
Template.userlist.helpers({
	users : function () {
		return Users.find({$nor: [{_id: Meteor.userId()}, {isPrivate: true}, {username: "admin"}] });
	},
	username: function () {
		if (Meteor.users.findOne({_id: Session.get('current_user')})) {
			return Meteor.users.findOne({_id: Session.get('current_user')}).username;
		}
	},
	user_selected : function () {
		return Session.get('user_selected');
	},
	shared_movies : function () {
		return Movies.find({owner: Session.get('current_user')});
	},
	is_private : function () {
		return Meteor.user().isPrivate ? "" : "inactive";
	},
	is_public : function () {
		return Meteor.user().isPrivate ? "inactive" : "";
	},
	show_list : function () {
		return Movies.find({owner: Session.get('current_user')}).count() > 0 ? 
			true : false;
	}
});

Template.user.helpers({
	user_selected : function () {
		return Session.get('user_selected');
	},
	following : function () {
			// change appearance of follow button with btn-primary.
			// change text from "+ Follow" to "Following"
			if ($.inArray(this._id, Meteor.user().following) > -1) {
		    return "btn-primary";
		  }
		  return false;
	},
	unfollow : function () {
		// add class of .follow or .unfollow
		if ($.inArray(this._id, Meteor.user().following) > -1) {
		  return "un";
		}
		return "";
	}
});

Template.movie.username = function () {
	return Meteor.users.findOne({_id: this.owner}).username;
};


//// EVENTS
Template.userlist.events({
	'click a.follow' : function (e,t) {
		Meteor.call('followUser', this._id);
	},
	'click a.unfollow' : function (e,t) {
		Meteor.call("unfollowUser", this._id);
	},
	'click .btn-public' : function (e,t) {
		e.preventDefault();
		Meteor.call("makePublic");
	},
	'click .btn-private' : function (e,t) {
		e.preventDefault();
		Meteor.call("makePrivate");
	}
});

Template.user.events({
	'click a.user' : function (e,t) {
		e.preventDefault();
		Session.set('user_selected', true);
		Session.set('current_user', this._id);
	}
});