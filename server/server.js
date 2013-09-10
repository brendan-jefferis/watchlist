/* Core server JS
================================================== */


//// PUBLISHING
Meteor.publish("Movies", function () {
	return Movies.find({});
});

Meteor.publish("Users", function () {
	return Meteor.users.find({});
});



//// ACCOUNTS
Accounts.onCreateUser(function (options, user) {
	// Initialise with following array
	user.following = [user._id];
	user.isPrivate = false;
	return user;
});
