import SimpleSchema from 'simpl-schema';
import BaseCollection from '/imports/api/base/BaseCollection';
import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { Tracker } from 'meteor/tracker';

/** @module Admin */

/**
 * Represents an admin, such as "Software Engineering".
 * @extends module:Base~BaseCollection
 */
class AdminCollection extends BaseCollection {

  /**
   * Creates the Interest collection.
   */
  constructor() {
    super('Admin', new SimpleSchema({
      name: { type: String },
    }, { tracker: Tracker }));
  }

  /**
   * Defines a new Admin.
   * @example
   * Admins.define({ name: 'name' });
   * @param { Object } description Object with key name.
   * Name must be previously undefined.
   * Creates a "slug" for this name and stores it in the slug field.
   * @throws {Meteor.Error} If the interest definition includes a defined name.
   * @returns The newly created docID.
   */
  define({ name }) {
    check(name, String);
    if (this.find({ name }).count() > 0) {
      throw new Meteor.Error(`${name} is previously defined in another Admin`);
    }
    return this._collection.insert({ name });
  }

  /**
   * Returns an object representing the Admin docID in a format acceptable to define().
   * @param docID The docID of an Admin.
   * @returns { Object } An object representing the definition of docID.
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const name = doc.name;
    return { name };
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const Admins = new AdminCollection();
