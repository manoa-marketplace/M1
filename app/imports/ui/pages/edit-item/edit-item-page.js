import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/underscore';
import { Profiles } from '/imports/api/profile/ProfileCollection';
import { Categories } from '/imports/api/categories/CategoryCollection';

const displaySuccessMessage = 'displaySuccessMessage';
const displayErrorMessages = 'displayErrorMessages';

Template.Edit_Item_Page.onCreated(function onCreated() {
  this.subscribe(Profiles.getPublicationName());
  this.subscribe(Categories.getPublicationName());
  this.messageFlags = new ReactiveDict();
  this.messageFlags.set(displaySuccessMessage, false);
  this.messageFlags.set(displayErrorMessages, false);
  this.context = Profiles.getSchema().namedContext('Edit_Item_Page');
});

Template.Edit_Item_Page.helpers({
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
    const invalidKeys = Template.instance().context.validationErrors();
    const errorObject = _.find(invalidKeys, (keyObj) => keyObj.name === fieldName);
    return errorObject && Template.instance().context.keyErrorMessage(errorObject.name);
  },
  profile() {
    return Profiles.findDoc(FlowRouter.getParam('username'));
  },
  categories() {
    const profile = Profiles.findDoc(FlowRouter.getParam('_id'));
    const selectedCategories = profile.categories;
    console.log(profile.categories);
    return _.map(Categories.findAll(),
        function makeCategoryObject(category) {
          return { label: category.name, selected: _.contains(selectedCategories, category.name) };
        });
  },
  profileDataField(fieldName) {
    const profileData = Profiles._collection.findOne(FlowRouter.getParam('_id'));
    // See https://dweldon.silvrback.com/guards to understand '&&' in next line.
    return profileData && profileData[fieldName];
  },
});

Template.Edit_Item_Page.events({
  'submit .profile-data-form'(event, instance) {
    event.preventDefault();
    const itemName = event.target.Item.value;
    const username = FlowRouter.getParam('username'); // schema requires username.
    const picture = event.target.Picture.value;
    const description = event.target.Description.value;
    const email = event.target.Email.value;
    const askingPrice = event.target.Price.value;
    const phoneNumber = event.target.Telephone.value;
    const selectedCategories = _.filter(event.target.Categories.selectedOptions, (option) => option.selected);
    let categories = _.map(selectedCategories, (option) => option.value);
    if(categories.length === 0) {
      categories = null;
    }

    const updatedProfileData = { itemName, picture, description, email, askingPrice,
      username, phoneNumber, categories };

    // Clear out any old validation errors.
    instance.context.reset();
    // Invoke clean so that updatedProfileData reflects what will be inserted.
    const cleanData = Profiles.getSchema().clean(updatedProfileData);
    // Determine validity.
    instance.context.validate(cleanData);

    if (instance.context.isValid()) {
      Profiles.update(FlowRouter.getParam('_id'), { $set: updatedProfileData });
      instance.messageFlags.set(displaySuccessMessage, true);
      FlowRouter.go(`/${username}/home`);
    } else {
      instance.messageFlags.set(displayErrorMessages, true);
    }
  },

  'click .delete'(event) {
    event.preventDefault();
    const username = FlowRouter.getParam('username'); // schema requires username.
    if(confirm("Delete this listing?")) {
      Profiles.remove(FlowRouter.getParam('_id'));
      FlowRouter.go(`/${username}/browse`);
    }
  },
});
