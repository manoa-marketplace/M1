import { Template } from 'meteor/templating';
import { Admins } from '/imports/api/admins/AdminCollection';
import { AdminMessages } from '/imports/api/admin-messages/AdminMessageCollection';

import { Meteor } from 'meteor/meteor';

Template.Home_Page.onCreated(function onCreated() {
  this.subscribe(Admins.getPublicationName());
  if (Admins.find({ name: Meteor.user().profile.name }).count() === 1) {
    this.subscribe(AdminMessages.getPublicationName());
  }
});

Template.Home_Page.helpers({

  isAdmin() {
    console.log(Meteor.user().profile.name);
    console.log(Admins.find({ name: Meteor.user().profile.name }).count());
    return Admins.find({ name: Meteor.user().profile.name }).count() === 1;
  },
  adminMessages() {
    if (Admins.find({ name: Meteor.user().profile.name }).count() === 1) {
      return AdminMessages.find();
    }
    return null;
  },
  adminMessagesEmpty() {
    if (Admins.find({ name: Meteor.user().profile.name }).count() === 1) {
      return AdminMessages.find().count() === 0;
    }
    return true;
  },
});
