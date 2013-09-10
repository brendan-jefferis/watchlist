//// GENERIC HELPER FUNCTIONS


/* function: adminUser

* determines whether current user making request is admin
================================================== */
adminUser = function (userId) {
  var adminUser = Meteor.users.findOne({username: "admin"});
  return (userId && adminUser && userId === adminUser._id);
};

/* function: addMovie

* enters a new movie document into the database
* called on click #btn-add (client/core/pages/add/add-templates.(js|html))
================================================== */
addMovie = function (title, date, genre) {
  if (!title) {
    return;
  }

  var movie = {
    owner : Meteor.userId(),
    title : title,
    date  : date || "Unknown",
    genre : genre || ""
  };

  Movies.insert(movie, function (error) {
    Session.set('movie_added', true);
    if (!error) {
      Session.set('success', true);
    } else {
      Session.set('success', false);
    }
  });
  
};



/* function: init

* restore all Session variables to defaults
* called on user log in and log out
================================================== */
init = function () {
  // Reset Session vars
  Session.set('adding_new', true);
  Session.set('out_now', false);
  Session.set('filter', null);
  Session.set('current_user', null);
  Session.set('user_selected', false);
  Session.set('confirm_delete', false);
};



/* function: setActiveNav

* toggles visual 'active' status of elements in navbar
* called by Router
================================================== */
setActiveNav = function () {
  $('#nav-main li').removeClass('active');
  $('#nav-main a[href="' + window.location.pathname + '"]').parent().addClass('active');
};



/* function: uniqueInArray

* takes an array and returns an array with duplicate items removed
* called by genre filtering system (client/core/pages/list/list-templates.js)
================================================== */
uniqueInArray = function (array) {
  var uniqueItems = [];
  $.each(array, function(i, el) {
    if ($.inArray(el.genre, uniqueItems) === -1) {
      uniqueItems.push(el.genre);
    }
  });
  return uniqueItems;
};