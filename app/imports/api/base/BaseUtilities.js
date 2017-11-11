import { Profiles } from '/imports/api/profile/ProfileCollection';
import { Interests } from '/imports/api/interest/InterestCollection';
import { Categories } from '/imports/api/categories/CategoryCollection';

export function removeAllEntities() {
  Profiles.removeAll();
  Interests.removeAll();
  Categories.removeAll();
}
