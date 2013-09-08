// TODO remove all instances of _id from following[] once user has been deleted



//// SUBSCRIPTIONS
Meteor.subscribe("Movies");




//// SESSION DEFAULTS
Session.setDefault('adding_new', true);
Session.setDefault('out_now', false);
Session.setDefault('filter', null);
Session.setDefault('confirm_delete', false);




//// ROUTING
Router.configure({
  layout: 'layout',
  notFoundTemplate: 'notFound',
  loadingTemplate: 'loading',
  renderTemplates: {
    'nav' : { to: 'nav' },
    'header' : { to: 'header' },
    'footer' : { to: 'footer' }
  },
  onAfterRun: function () {
    // 1ms delay to wait for <body> to contain routed content
    setTimeout(function() {
      setActiveNav();
    }, 1);
  }
});




//// TEMPLATE HELPERS
Template.header.helpers({
  hide: function () {
    if (Meteor.user()) {
      return Meteor.user().hideIntro;
    } 
  }
});

Template.add_movie.helpers({
  out_now : function () {
    return Session.equals('out_now', true);
  },
  movie_added : function () {
    return Session.equals('movie_added', true);
  },
  alert_status : function () {
    if (Session.equals('success', true)) {
      return "alert-success";
    } else {
      return "alert-danger";
    }
  },
  confirmation : function () {
    if (Session.equals('success', true)) {
      return "Movie added!";
    } else {
      return "Movie not added.";
    }
  }
});



Template.footer.helpers({
  confirm_delete : function () {
    return Session.get('confirm_delete');
  }
});

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




//// EVENTS
Template.header.events({
  'click #hide' : function () {
    if (Meteor.userId()) {
      Meteor.call("hideIntro");
    } else {
      Session.set('hide_intro', true);      
    }
  }
});

Template.addPage.events({
  'click #btn-add' : function (e,t) {
    var date = Session.equals('out_now', true) ? "Out Now" : t.find('#new-date').value;
    addMovie(t.find("#new-title").value, date, t.find("#new-genre").value);

    // reset form and display alert
    t.find("#new-title").value = '';
    if (Session.equals('out_now', false)) {
      t.find('#new-date').value = '';
    }
    t.find("#new-genre").value = 'Funny';
    Session.set('out_now', false);
    t.find("#out-now").checked = false;
  },
  'click #out-now' : function (e,t) {
    Session.set('out_now', t.find("#out-now").checked);
  },
  'click' : function () {
    // Dismiss 'movie added' alert
    if (Session.equals('movie_added', true)) {
      Session.set('movie_added', false);
    }
  },
  'click .filter' : function (e,t) {
    e.preventDefault();
    e.target.parentNode.className = "active";
    Session.set('filter', e.target.classList[1]);
  },
  'click #no-filter' : function () {
    Session.set('filter', null);
  }
});

Template.movie.events({
  'click .remove' : function () {
    Movies.remove(this._id);
  }
});

Template.nav.events({
  'click #login-buttons-logout' : function () {
    init();
  }
});

Template.footer.events({
  'click #delete' : function (e) {
    e.preventDefault();
    Session.set('confirm_delete', true);
  },
  'click #dont-delete' : function (e) {
    e.preventDefault();
    Session.set('confirm_delete', false);
  },
  'click #confirm-delete' : function (e) {
    e.preventDefault();
    Meteor.call("removeUser", Meteor.userId());
  }
});




//// GENERIC HELPER FUNCTIONS
function addMovie(title, date, genre) {
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
}



function init () {
  // Reset Session vars
    Session.set('adding_new', true);
    Session.set('out_now', false);
    Session.set('filter', null);
    Session.set('current_user', null);
    Session.set('user_selected', false);
    Session.set('confirm_delete', false);
}

function setActiveNav () {
  $('#nav-main li').removeClass('active');
  $('#nav-main a[href="' + window.location.pathname + '"]').parent().addClass('active');
}




//// ACCOUNTS
Accounts.ui.config({
  passwordSignupFields : 'USERNAME_AND_OPTIONAL_EMAIL'
});

Deps.autorun(function () {
  if (Meteor.loggingIn()) {
    init();
  }
});
