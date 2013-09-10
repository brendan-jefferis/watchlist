/* Common client JS
================================================== */


/* Templates
================================================== */

	// Templates: Header
	Template.header.helpers({
	  hide: function () {
	    if (Meteor.user()) {
	      return Meteor.user().hideIntro;
	    } 
	  }
	});


	// Templates: Footer
	Template.footer.helpers({
	  confirm_delete : function () {
	    return Session.get('confirm_delete');
	  }
	});


	// Templates: Admin Panel
	Template.adminpanel.helpers({
		admin : function () {
			return adminUser(Meteor.userId());
		},
		user_selected: function () {
			return Session.get('user_selected');
		},
		username : function () {
			if (Meteor.users.findOne({_id: Session.get('current_user')})) {
				return Meteor.users.findOne({_id: Session.get('current_user')}).username;
			}
		}
	});


/* Events
================================================== */

	// Events: Nav
	Template.nav.events({
	  'click #login-buttons-logout' : function () {
	    init();
	  }
	});


	// Events: Header
	Template.header.events({
	  'click #hide' : function () {
	    if (Meteor.userId()) {
	      Meteor.call("hideIntro");
	    } else {
	      Session.set('hide_intro', true);      
	    }
	  }
	});


	// Events: Footer
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


	// Events: Admin Panel
	Template.adminpanel.events({
		'click .remove' : function (e,t) {
			Meteor.users.remove({_id: Session.get('current_user')});
			Session.set('current_user', null);
			Session.set('user_selected', false);
		}
	});