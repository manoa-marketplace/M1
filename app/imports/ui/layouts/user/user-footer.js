import { Meteor } from 'meteor/meteor';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Template } from 'meteor/templating';

import { Messages } from '/imports/api/messages/MessageCollection';

const displaySuccessMessage = 'displaySuccessMessage';
const displayErrorMessages = 'displayErrorMessages';

Template.User_Footer.onCreated(function onCreated(){
  this.subscribe(Messages.getPublicationName());
  this.messageFlags = new ReactiveDict();
  this.messageFlags.set(displaySuccessMessage, false);
  this.messageFlags.set(displayErrorMessages, false);
  this.context = Messages.getSchema().namedContext('User_Footer');
});

Template.User_Footer.helpers({

});

Template.User_Footer.events({
  'submit .admin-message-form'(event, instance) {
    event.preventDefault();
    const type = 'admin'
    const to = '/na'
    const from = Meteor.user().profile.name;
    const dt = new Date();
    const date = `${dt.getMonth() + 1}/${dt.getDate()}/${dt.getFullYear()}`;
    const msg = event.target.Message.value;
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
      document.getElementById("adminMessageForm").style.display = "none";
      document.getElementById("adminMessageConfirmation").style.display = "block";
    } else {
      instance.messageFlags.set(displayErrorMessages, true);
    }
  },
  'click .contactAdmin'(event, instance) {
    event.preventDefault();
    document.getElementById("adminMessageOverlay").style.display = "block";
    scroll(0, 0);
  },
  'click .closeButton'(event, instance) {
    event.preventDefault();

    document.getElementById("adminMessageOverlay").style.display = "none";
    document.getElementById("adminMessageForm").style.display = "block";
    document.getElementById("adminMessageConfirmation").style.display = "none";
  },
});

function off() {
  document.getElementById("adminMessageOverlay").style.display = "none";
}
