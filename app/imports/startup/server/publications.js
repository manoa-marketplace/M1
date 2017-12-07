import { Meteor } from 'meteor/meteor';

import { Interests } from '/imports/api/interest/InterestCollection';
import { Profiles } from '/imports/api/profile/ProfileCollection';
import { Categories } from '/imports/api/categories/CategoryCollection';

// Admin List
import { Admins } from '/imports/api/admins/AdminCollection';
// Messages
import { Messages } from '../../api/messages/MessageCollection';

Interests.publish();
Profiles.publish();
Categories.publish();

// Publishes Admin List
Admins.publish();

// Publishes User Applicable Messages
Messages.publish(); // TODO Publishing Wizardry
