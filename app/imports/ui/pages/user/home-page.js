import { Template } from 'meteor/templating';
import { Admins } from '/imports/api/admins/AdminCollection';

import { Meteor } from 'meteor/meteor';

Template.Home_Page.onCreated(function onCreated() {
  this.subscribe(Admins.getPublicationName());
});
Template.Home_Page.helpers({

  /**
   * Returns a cursor to profiles, sorted by last name.
   */
  admins() {
    return Admins.find();
  },
  isAdmin() {
    console.log(Meteor.user().profile.name);
    console.log(Admins.find({ name: Meteor.user().profile.name }).count());
    return Admins.find({ name: Meteor.user().profile.name }).count() === 1;
  },
});
