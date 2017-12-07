import { Template } from 'meteor/templating';
import { Admins } from '/imports/api/admins/AdminCollection';
import { Messages } from '/imports/api/messages/MessageCollection';

import { Meteor } from 'meteor/meteor';

Template.Home_Page.onCreated(function onCreated() {
  this.subscribe(Admins.getPublicationName());
  // this.subscribe(AdminMessages.getPublicationName());
  this.subscribe(Messages.getPublicationName());
});

Template.Home_Page.helpers({
  // Status Checks
  isAdmin() {
    return Admins.find({ name: Meteor.user().profile.name }).count() === 1;
  },
  // Announcements
  announcements() {
    return Messages.find({ type: 'announcement' });
  },
  announcementsEmpty() {
    return Messages.find({ type: 'announcement' }).count() === 0;
  },
  // Admin Messages
  adminMessages() {
    if (Admins.find({ name: Meteor.user().profile.name }).count() === 1) {
      return Messages.find({ type: 'admin' });
    }
    return null;
  },
  adminMessagesEmpty() {
    if (Admins.find({ name: Meteor.user().profile.name }).count() === 1) {
      return Messages.find({ type: 'admin' }).count() === 0;
    }
    return true;
  },
  // User Messages
  userMessages() {
    return Messages.findLimit({ $and: [{ type: 'user' }, { to: Meteor.user().profile.name }] }, null, { date: 1 }, 2);
  },
  userMessagesEmpty() {
    return Messages.find({ $and: [{ type: 'user' }, { to: Meteor.user().profile.name }] }).count() === 0;
  },
});
