/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

import { Profiles } from '/imports/api/profile/ProfileCollection';
import { Categories } from '/imports/api/categories/CategoryCollection';
import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { removeAllEntities } from '/imports/api/base/BaseUtilities';

if (Meteor.isServer) {
  describe('ProfileCollection', function testSuite() {
    const categoryName = 'Textbooks';
    const categoryDescription = 'Textbooks for UH Campus courses.';
    const itemName = 'Sample Textbook';
    const username = 'Test User';
    const description = 'This is a sample textbook item post.';
    const categories = [categoryName];
    const picture = 'http://philipmjohnson.org/headshot.jpg';
    const email = 'mhsakuda@hawaii.edu';
    const askingPrice = '$10.99';
    const phoneNumber = '808-956-1111';
    const defineObject = { itemName, username, description, categories, picture, email,
      askingPrice, phoneNumber };

    before(function setup() {
      removeAllEntities();
      // Define a sample category.
      Categories.define({ name: categoryName, description: categoryDescription });
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('#define, #isDefined, #removeIt, #dumpOne, #restoreOne', function test() {
      let docID = Profiles.define(defineObject);
      expect(Profiles.isDefined(docID)).to.be.true;
      // Check that fields are available
      const doc = Profiles.findDoc(docID);
      expect(doc.itemName).to.equal(itemName);
      expect(doc.username).to.equal(username);
      expect(doc.description).to.equal(description);
      expect(doc.categories[0]).to.equal(categoryName);
      expect(doc.picture).to.equal(picture);
      expect(doc.email).to.equal(email);
      expect(doc.askingPrice).to.equal(askingPrice);
      expect(doc.phoneNumber).to.equal(phoneNumber);
      // Check that multiple definitions with the same email address fail
      expect(function foo() { Profiles.define(defineObject); }).to.throw(Error);
      // Check that we can dump and restore a Profile.
      const dumpObject = Profiles.dumpOne(docID);
      Profiles.removeIt(docID);
      expect(Profiles.isDefined(docID)).to.be.false;
      docID = Profiles.restoreOne(dumpObject);
      expect(Profiles.isDefined(docID)).to.be.true;
      Profiles.removeIt(docID);
    });

    it('#define (illegal category)', function test() {
      const illegalCategories = ['foo'];
      const defineObject2 = { itemName, username, description, categories: illegalCategories, picture, email,
        askingPrice, phoneNumber };
      expect(function foo() { Profiles.define(defineObject2); }).to.throw(Error);
    });

    it('#define (duplicate categories)', function test() {
      const duplicateCategories = [categoryName, categoryName];
      const defineObject3 = { itemName, username, description, categories: duplicateCategories, picture, email,
        askingPrice, phoneNumber };
      expect(function foo() { Profiles.define(defineObject3); }).to.throw(Error);
    });
  });
}

