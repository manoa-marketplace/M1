import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
// import { ReactiveDict } from 'meteor/reactive-dict';

Template.User_Header.helpers({
  acceptedEULA() {
    if (Meteor.user().profile.eula !== null && Meteor.user().profile.eula === true) {
      return true;
    }
    return false;
  },
  routeUserName() {
    return FlowRouter.getParam('username');
  },
});

Template.User_Header.events({
  'submit .search-form'(event, instance) {
    event.preventDefault();
    const query = event.target.Search.value;
    instance.find('form').reset();
    if (query.trim() !== '') {
      FlowRouter.go(`/${FlowRouter.getParam('username')}/search/${query.trim()}`);
    }
  },
  'click .agree'(event) {
    event.preventDefault();
    Meteor.users.update({_id: Meteor.user()._id}, { $set: { profile: { name: Meteor.user().profile.name, eula: true} } });
    document.getElementById('eula').style.display = "none";
  },
});
