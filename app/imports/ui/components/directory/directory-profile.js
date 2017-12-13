import { Meteor } from 'meteor/meteor';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Template } from 'meteor/templating';

import { Profiles } from '/imports/api/profile/ProfileCollection';
import { Messages } from '/imports/api/messages/MessageCollection';

const displaySuccessMessage = 'displaySuccessMessage';
const displayErrorMessages = 'displayErrorMessages';

Template.Directory_Profile.onCreated(function onCreated() {
  this.subscribe(Profiles.getPublicationName());
  this.subscribe(Messages.getPublicationName());
  this.messageFlags = new ReactiveDict();
  this.messageFlags.set(displaySuccessMessage, false);
  this.messageFlags.set(displayErrorMessages, false);
  this.context = Messages.getSchema().namedContext('Directory_Profile');
});

Template.Directory_Profile.helpers({

  /**
   * Returns a cursor to profiles, sorted by last name.
   */
  profiles() {
    return Profiles.find({}, { sort: { username: 1 } });
  },
  isOwner(message) {
    return message.username === Meteor.user().profile.name;
  }
});

Template.Directory_Profile.events({
  'submit .user-message-form'(event, instance) {
    event.preventDefault();
    const type = 'user'
    const to = instance.data.profile.username;
    const from = Meteor.user().profile.name;
    const dt = new Date();
    const date = `${dt.getMonth() + 1}/${dt.getDate()}/${dt.getFullYear()}`;
    const msg = `${from} (${from}@hawaii.edu) is interested in your "${instance.data.profile.itemName}"\n\n\tMessage: "${event.target.Message.value}"\n\nPlease contact ${from} regarding their inquiry in a timely fashion.`;
    const status = 'unread';

    const newMessage = { type, to, from, date, msg, status };

    // Clear out any old validation errors.
    instance.context.reset();
    // Invoke clean so that updatedProfileData reflects what will be inserted.
    const cleanData = Messages.getSchema().clean(newMessage);
    // Determine validity.
    instance.context.validate(cleanData);

    if (instance.context.isValid()) {
      Messages.insert(cleanData);
      instance.messageFlags.set(displaySuccessMessage, true);
      instance.find('form').reset();
      document.getElementById(instance.data.profile._id + "Form").style.display = "none";
      document.getElementById(instance.data.profile._id + "MessageConfirmation").style.display = "block";
    } else {
      instance.messageFlags.set(displayErrorMessages, true);
    }
  },
  'click .inquire'(event, instance) {
    event.preventDefault();
    document.getElementById(instance.data.profile._id + 'Overlay').style.display= 'block';
  },
  'click .cancelButton'(event, instance) {
    event.preventDefault();
    document.getElementById(instance.data.profile._id + 'Overlay').style.display= 'none';
    document.getElementById(instance.data.profile._id + "Form").style.display = "block";
    document.getElementById(instance.data.profile._id + "MessageConfirmation").style.display = "none";
  },

});
