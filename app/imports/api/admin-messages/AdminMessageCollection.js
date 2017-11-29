import SimpleSchema from 'simpl-schema';
import BaseCollection from '/imports/api/base/BaseCollection';
import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { Tracker } from 'meteor/tracker';

class AdminMessageCollection extends BaseCollection {

  constructor() {
    super('AdminMessage', new SimpleSchema({
      user: { type: String },
      date: { type: Date },
      msg: { type: String },
    }, { tracker: Tracker }));
  }

  define({ user, msg }) {
    check(user, String);
    check(msg, String);
    return this._collection.insert({ user, date: new Date(), msg });
  }

  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const user = doc.user;
    const date = doc.date;
    const msg = doc.msg;
    return { user, date, msg };
  }
}

export const AdminMessages = new AdminMessageCollection();
