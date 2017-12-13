import { Template } from 'meteor/templating';
import { Admins } from '/imports/api/admins/AdminCollection';
import { Messages } from '/imports/api/messages/MessageCollection';

import { Profiles } from '/imports/api/profile/ProfileCollection';

import { Meteor } from 'meteor/meteor';

Template.Home_Page.onCreated(function onCreated() {
  this.subscribe(Admins.getPublicationName());
  // this.subscribe(AdminMessages.getPublicationName());
  this.subscribe(Messages.getPublicationName());
  this.subscribe(Profiles.getPublicationName());
});

Template.Home_Page.helpers({
  // Status Checks
  isAdmin() {
    return Admins.find({ name: Meteor.user().profile.name }).count() === 1;
  },
  // profiles
  yourProfiles() {
    return Profiles.find({ username: Meteor.user().profile.name });
  },
  hasListings() {
    return Profiles.find({ username: Meteor.user().profile.name }).count() > 0;
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
    return Messages.find({ $and: [{ type: 'user' }, { to: Meteor.user().profile.name }, { status: 'unread' }] });
  },
  userMessagesEmpty() {
    return Messages.find({ $and: [{ type: 'user' }, { to: Meteor.user().profile.name }, { status: 'unread' }] }).count() === 0;
  },
});

Template.Home_Page.events({
  'click .resolve'(event) {
    event.preventDefault();
    if(confirm("Resolve this message? You will be unable to view it in the future if you do.")) {
      Messages.update(event.target.id, { $set: { status: 'resolved' } })
    }
  }
});
