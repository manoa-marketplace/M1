import { Template } from 'meteor/templating';
import { Profiles } from '/imports/api/profile/ProfileCollection';

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
});
