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


//// EVENTS
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