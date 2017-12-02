import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/underscore';
import { Profiles } from '/imports/api/profile/ProfileCollection';
import { Categories } from '/imports/api/categories/CategoryCollection';

const displaySuccessMessage = 'displaySuccessMessage';
const displayErrorMessages = 'displayErrorMessages';

Template.Update_Item_Page.onCreated(function onCreated() {
  this.subscribe(Profiles.getPublicationName());
  this.subscribe(Categories.getPublicationName());
  this.messageFlags = new ReactiveDict();
  this.messageFlags.set(displaySuccessMessage, false);
  this.messageFlags.set(displayErrorMessages, false);
  this.context = Profiles.getSchema().namedContext('Update_Item_Page');
});

Template.Update_Item_Page.helpers({
  successClass() {
    return Template.instance().messageFlags.get(displaySuccessMessage) ? 'success' : '';
  },
  displaySuccessMessage() {
    return Template.instance().messageFlags.get(displaySuccessMessage);
  },
  errorClass() {
    return Template.instance().messageFlags.get(displayErrorMessages) ? 'error' : '';
  },
  fieldError(fieldName) {
    const invalidKeys = Template.instance().context.invalidKeys();
    const errorObject = _.find(invalidKeys, (keyObj) => keyObj.name === fieldName);
    return errorObject && Template.instance().context.keyErrorMessage(errorObject.name);
  },
  profile() {
    return Profiles.findDoc(FlowRouter.getParam('username'));
  },
  categories() {
    const profile = Profiles.findDoc(FlowRouter.getParam('username'));
    const selectedCategories = profile.categories;
    return profile && _.map(Categories.findAll(),
        function makeCategoryObject(category) {
          return { label: category.name, selected: _.contains(selectedCategories, category.name) };
        });
  },
});

Template.Update_Item_Page.events({
  'submit .profile-data-form'(event, instance) {
    event.preventDefault();
    const itemName = event.target.Item.value;
    const username = FlowRouter.getParam('username'); // schema requires username.
    const picture = event.target.Picture.value;
    const description = event.target.Description.value;
    const email = event.target.Email.value;
    const askingPrice = event.target.Price.value;
    const telephone = event.target.Telephone.value;
    const selectedCategories = _.filter(event.target.Categories.selectedOptions, (option) => option.selected);
    const categories = _.map(selectedCategories, (option) => option.value);

    const newProfileData = { itemName, picture, description, email, askingPrice, categories,
      username, telephone };

    // Clear out any old validation errors.
    instance.context.reset();
    // Invoke clean so that updatedProfileData reflects what will be inserted.
    const cleanData = Profiles.getSchema().clean(newProfileData);
    // Determine validity.
    instance.context.validate(cleanData);

    if (instance.context.isValid()) {
      Profiles.insert(cleanData);
      instance.messageFlags.set(displaySuccessMessage, true);
      FlowRouter.go(`/${username}/filter`);
    } else {
      instance.messageFlags.set(displayErrorMessages, true);
    }
  },
});

