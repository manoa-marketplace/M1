import SimpleSchema from 'simpl-schema';
import BaseCollection from '/imports/api/base/BaseCollection';
import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { Tracker } from 'meteor/tracker';

/** @module Category */

/**
 * Represents a specific category, such as "Textbooks".
 * @extends module:Base~BaseCollection
 */
class CategoryCollection extends BaseCollection {

  /**
   * Creates the Category collection.
   */
  constructor() {
    super('Category', new SimpleSchema({
      name: { type: String },
      description: { type: String, optional: true },
    }, { tracker: Tracker }));
  }

  /**
   * Defines a new Category.
   * @example
   * Categories.define({ name: 'Software Engineering',
   *                    description: 'Methods for group development of large, high quality software systems' });
   * @param { Object } description Object with keys name and description.
   * Name must be previously undefined. Description is optional.
   * Creates a "slug" for this name and stores it in the slug field.
   * @throws {Meteor.Error} If the interest definition includes a defined name.
   * @returns The newly created docID.
   */
  define({ name, description }) {
    check(name, String);
    check(description, String);
    if (this.find({ name }).count() > 0) {
      throw new Meteor.Error(`${name} is previously defined in another Category`);
    }
    return this._collection.insert({ name, description });
  }

  /**
   * Returns the Category name corresponding to the passed category docID.
   * @param categoryID An category docID.
   * @returns { String } An category name.
   * @throws { Meteor.Error} If the category docID cannot be found.
   */
  findName(categoryID) {
    this.assertDefined(categoryID);
    return this.findDoc(categoryID).name;
  }

  /**
   * Returns a list of Category names corresponding to the passed list of Category docIDs.
   * @param categoryIDs A list of Category docIDs.
   * @returns { Array }
   * @throws { Meteor.Error} If any of the instanceIDs cannot be found.
   */
  findNames(categoryIDs) {
    return categoryIDs.map(categoryID => this.findName(categoryID));
  }

  /**
   * Throws an error if the passed name is not a defined Category name.
   * @param name The name of an category.
   */
  assertName(name) {
    this.findDoc(name);
  }

  /**
   * Throws an error if the passed list of names are not all Category names.
   * @param names An array of (hopefully) Category names.
   */
  assertNames(names) {
    _.each(names, name => this.assertName(name));
  }

  /**
   * Returns the docID associated with the passed Category name, or throws an error if it cannot be found.
   * @param { String } name An category name.
   * @returns { String } The docID associated with the name.
   * @throws { Meteor.Error } If name is not associated with an Category.
   */
  findID(name) {
    return (this.findDoc(name)._id);
  }

  /**
   * Returns the docIDs associated with the array of Category names, or throws an error if any name cannot be found.
   * If nothing is passed, then an empty array is returned.
   * @param { String[] } names An array of category names.
   * @returns { String[] } The docIDs associated with the names.
   * @throws { Meteor.Error } If any instance is not an Category name.
   */
  findIDs(names) {
    return (names) ? names.map((instance) => this.findID(instance)) : [];
  }

  /**
   * Returns an object representing the Category docID in a format acceptable to define().
   * @param docID The docID of an Category.
   * @returns { Object } An object representing the definition of docID.
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const name = doc.name;
    const description = doc.description;
    return { name, description };
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const Categories = new CategoryCollection();
