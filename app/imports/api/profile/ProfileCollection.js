import SimpleSchema from 'simpl-schema';
import BaseCollection from '/imports/api/base/BaseCollection';
import { Categories } from '/imports/api/categories/CategoryCollection';
import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { Tracker } from 'meteor/tracker';

/** @module Profile */

/**
 * Profiles provide portfolio data for a user.
 * @extends module:Base~BaseCollection
 */
class ProfileCollection extends BaseCollection {

  /**
   * Creates the Profile collection.
   */
  constructor() {
    super('Profile', new SimpleSchema({
      username: { type: String },
      itemName: { type: String, optional: true  },
      picture: { type: SimpleSchema.RegEx.Url, optional: true },
      description: { type: String, optional: true  },
      categories: { type: Array, optional: true  },
      'categories.$': { type: String },
      askingPrice: { type: String, optional: true  },
      email: { type: SimpleSchema.RegEx.Url, optional: true  },
      phoneNumber: { type: String, optional: true },
    }, { tracker: Tracker }));
  }

  /**
   * Defines a new Profile.
   * @example
   * Profiles.define({ firstName: 'Philip',
   *                   lastName: 'Johnson',
   *                   username: 'johnson',
   *                   bio: 'I have been a professor of computer science at UH since 1990.',
   *                   categories: ['Application Development', 'Software Engineering', 'Databases'],
   *                   title: 'Professor of Information and Computer Sciences',
   *                   picture: 'http://philipmjohnson.org/headshot.jpg',
   *                   github: 'https://github.com/philipmjohnson',
   *                   facebook: 'https://facebook.com/philipmjohnson',
   *                   instagram: 'https://instagram.com/philipmjohnson' });
   * @param { Object } description Object with required key username.
   * Remaining keys are optional.
   * Username must be unique for all users. It should be the UH email account.
   * Interests is an array of defined category names.
   * @throws { Meteor.Error } If a user with the supplied username already exists, or
   * if one or more categories are not defined, or if github, facebook, and instagram are not URLs.
   * @returns The newly created docID.
   */
  define({ itemName = '', username, description = '', categories = [], picture = '', email = '', phoneNumber = '',
    askingPrice = '' }) {
    // make sure required fields are OK.
    const checkPattern = { itemName: String, username: String, email: String, askingPrice: String };
    check({ itemName, username, email, askingPrice }, checkPattern);

    /* if (this.find({ username }).count() > 0) {
      throw new Meteor.Error(`${username} is previously defined in another Profile`);
    } */

    // Throw an error if any of the passed Interest names are not defined.
    Categories.assertNames(categories);

    // Throw an error if there are duplicates in the passed category names.
    if (categories.length !== _.uniq(categories).length) {
      throw new Meteor.Error(`${categories} contains duplicates`);
    }

    return this._collection.insert({ itemName, username, description, categories, picture, email, phoneNumber,
      askingPrice });
  }

  /**
   * Returns an object representing the Profile docID in a format acceptable to define().
   * @param docID The docID of a Profile.
   * @returns { Object } An object representing the definition of docID.
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const itemName = doc.itemName;
    const username = doc.username;
    const description = doc.description;
    const categories = doc.categories;
    const picture = doc.picture;
    const email = doc.email;
    const phoneNumber = doc.phoneNumber;
    const askingPrice = doc.askingPrice;
    return { itemName, username, description, categories, picture, email, phoneNumber, askingPrice };
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const Profiles = new ProfileCollection();
