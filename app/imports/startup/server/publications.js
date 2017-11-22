import { Interests } from '/imports/api/interest/InterestCollection';
import { Profiles } from '/imports/api/profile/ProfileCollection';
import { Categories } from '/imports/api/categories/CategoryCollection';

// Added for Admins
import { Admins } from '/imports/api/admins/AdminCollection';

Interests.publish();
Profiles.publish();
Categories.publish();

// Added for Admins
Admins.publish();
