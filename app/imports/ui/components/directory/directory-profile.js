import { Template } from 'meteor/templating';
import { Profiles } from '/imports/api/profile/ProfileCollection';
import { FlowRouter } from 'meteor/kadira:flow-router';

Template.Directory_Profile.onCreated(function onCreated() {
  this.subscribe(Profiles.getPublicationName());
});

Template.Directory_Profile.helpers({

  /**
   * Returns a cursor to profiles, sorted by last name.
   */
  profiles() {
    return Profiles.find({}, { sort: { username: 1 } });
  },
});

Template.Directory_Profile.events({
  'click .delete'(event) {
    event.preventDefault();
    const username = FlowRouter.getParam('username'); // schema requires username.
    Profiles.remove(FlowRouter.getParam('_id'));
    FlowRouter.go(`/${username}/filter`);
  },
});
