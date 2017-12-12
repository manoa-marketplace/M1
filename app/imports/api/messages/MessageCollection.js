import SimpleSchema from 'simpl-schema';
import BaseCollection from '/imports/api/base/BaseCollection';
import { check } from 'meteor/check';
import { Tracker } from 'meteor/tracker';

class MessageCollection extends BaseCollection {
  constructor() {
    super('Message', new SimpleSchema({
      type: { type: String }, // Admin, User, Annoucement
      to: { type: String },
      from: { type: String },
      date: { type: String },
      msg: { type: String },
      status: { type: String }, //Unread, Read, Urgent
    }, { tracker: Tracker }));
  }

  define({ type, to, from, date, msg, status }) {
    check(type, String);
    check(to, String);
    check(from, String);
    check(date, String);
    check(msg, String);
    check(status, String);
    return this._collection.insert({ type, to, from, date, msg, status });
  }

}

export const Messages = new MessageCollection();
