/* Core client JS
================================================== */



//// SUBSCRIPTIONS
Meteor.subscribe("Movies");
Meteor.subscribe("Users");



//// SESSION DEFAULTS
Session.setDefault('adding_new', true);
Session.setDefault('out_now', false);
Session.setDefault('filter', null);
Session.setDefault('confirm_delete', false);
Session.setDefault('user_selected', false);
Session.setDefault('current_user', null);



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



//// ACCOUNTS
Accounts.ui.config({
  passwordSignupFields : 'USERNAME_AND_OPTIONAL_EMAIL'
});

Deps.autorun(function () {
  if (Meteor.loggingIn()) {
    init();
  }
});
