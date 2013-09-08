////// COLLECTIONS
Movies = new Meteor.Collection('movies');
Users = Meteor.users;



////// ROUTING
Router.map(function () {
	this.route('listPage', { path: '/' });
	this.route('addPage', { path: '/add' });
	this.route('usersPage', { path: '/users' });
	this.route('notFound', { path: '*'});
});


// Checks to see if the current user making the request to update is the admin user
function adminUser (userId) {
	var adminUser = Meteor.users.findOne({username: "admin"});
	return (userId && adminUser && userId === adminUser._id);
}


////// ALLOW

// Allow users control over their own content
Movies.allow({
	insert: function (userId, doc) {
		return (adminUser(userId) || (userId && doc.owner === userId));
	},
	update: function (userId, doc, fields, modifier) {
		return (adminUser(userId) || (userId && doc.owner === userId));
	},
	remove: function (userId, doc) {
		return (adminUser(userId) || (userId && doc.owner === userId));
	}
});

// Allow Admin privileges
Meteor.users.allow({
	insert: function (userId, doc) {
		return (adminUser(userId));
	},
	update: function (userId, doc) {
		return (adminUser(userId));
	},
	remove: function (userId, doc) {
		return (adminUser(userId));
	}
});



//////// METHODS
Meteor.methods({
	hideIntro : function () {
		Meteor.users.update({_id: this.userId}, {$set: {hideIntro: true}});
	},
	//// features/wl-usersharing.js
	followUser : function (user) {
		if (!Meteor.user().following) {
		  Meteor.users.update({_id: this.userId}, {$set: {following: [this.userId]}});
		}
		if (user) {
			Meteor.users.update({_id: this.userId}, {$addToSet: {following: user}});
		}
	},
	unfollowUser : function (user) {
	  Meteor.users.update({_id: this.userId}, {$pull: {following: user}});
	},
	makePrivate : function () {
		Meteor.users.update({_id: this.userId}, {$set: {isPrivate: true}});
	},
	makePublic : function () {
		Meteor.users.update({_id: this.userId}, {$set: {isPrivate: false}})
	},
	// UPDATE EXISTING USERS WITH following AND isPrivate PROPERTIES
	update : function (userId) {
		if (adminUser(userId)) {
			// Get users who are lacking either: isPrivate or following[] 
			var isPrivateUsers = Meteor.users.find({isPrivate: undefined}).fetch(),
					followingUsers = Meteor.users.find({following: undefined}).fetch();

			// Add isPrivate property
			for (var i = 0, j = isPrivateUsers.length; i < j; i++) {
				Meteor.users.update({_id: isPrivateUsers[i]._id}, {$set: {isPrivate: false}});
			}
			// Add following[] property
			for (var i = 0, j = followingUsers.length; i < j; i++) {
				Meteor.users.update({_id: followingUsers[i]._id}, {$set: {following: [followingUsers[i]._id]}});
			}
		}
	},
	cleanupArray : function (array) {
		var newArray = [];
		for (var i = 0, j = array.length; i < j; i++) {
		  if (Meteor.users.findOne({_id: array[i]})) {
		    newArray.push(array[i]);
		  } 
		}
		Meteor.users.update({_id: this.userId}, {$set: {following: newArray}});
	},
	removeUser : function (userId) {
		Meteor.users.remove({_id: userId});
	}
});