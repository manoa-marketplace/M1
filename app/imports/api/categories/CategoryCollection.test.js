import { Categories } from '/imports/api/categories/CategoryCollection';
import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { removeAllEntities } from '/imports/api/base/BaseUtilities';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('CategoryCollection', function testSuite() {
    const name = 'Software Engineering';
    const description = 'Tools and techniques for team-based development of high quality software systems';
    const defineObject = { name, description };

    before(function setup() {
      removeAllEntities();
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('#define, #isDefined, #removeIt, #dumpOne, #restoreOne', function test() {
      let docID = Categories.define(defineObject);
      expect(Categories.isDefined(docID)).to.be.true;
      // Check that fields are available
      const doc = Categories.findDoc(docID);
      expect(doc.name).to.equal(name);
      expect(doc.description).to.equal(description);
      // Check that multiple definitions with the same name fail
      expect(function foo() { Categories.define(defineObject); }).to.throw(Error);
      // Check that we can dump and restore a Category.
      const dumpObject = Categories.dumpOne(docID);
      Categories.removeIt(docID);
      expect(Categories.isDefined(docID)).to.be.false;
      docID = Categories.restoreOne(dumpObject);
      expect(Categories.isDefined(docID)).to.be.true;
      Categories.removeIt(docID);
    });

    it('#findID, #findIDs', function test() {
      const docID = Categories.define(defineObject);
      expect(Categories.isDefined(docID)).to.be.true;
      const docID2 = Categories.findID(name);
      expect(docID).to.equal(docID2);
      Categories.findIDs([name, name]);
      Categories.removeIt(docID);
    });
  });
}

