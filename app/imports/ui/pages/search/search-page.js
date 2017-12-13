import { FlowRouter } from 'meteor/kadira:flow-router';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { _ } from 'meteor/underscore';
import { Profiles } from '/imports/api/profile/ProfileCollection';
import { Categories } from '/imports/api/categories/CategoryCollection';

const selectedCategoriesKey = 'selectedCategories';

Template.Search_Page.onCreated(function onCreated() {
  this.subscribe(Categories.getPublicationName());
  this.subscribe(Profiles.getPublicationName());
  this.messageFlags = new ReactiveDict();
  this.messageFlags.set(selectedCategoriesKey, undefined);
});

Template.Search_Page.helpers({
  searchQuery() {
    return FlowRouter.getParam('query');
  },
  profiles() {
    // Initialize selectedCategories to all of them if messageFlags is undefined.
    if (!Template.instance().messageFlags.get(selectedCategoriesKey)) {
      Template.instance().messageFlags.set(selectedCategoriesKey, _.map(Categories.findAll(), category => category.name));
    }
    // Find all profiles with the currently selected categories.
    const allProfiles = Profiles.findAll();
    const selectedCategories = Template.instance().messageFlags.get(selectedCategoriesKey);
    const queries = FlowRouter.getParam('query').toLowerCase().split(" ");
    const results = _.filter(allProfiles, function(profile){
      for(let i = 0; i < queries.length; i++){
        if(profile.itemName.toLowerCase().includes(queries[i])){
          return true;
        }
      }
      const cats = _.map(profile.categories, function(cat) {
        return cat.toLowerCase();
      })
      return _.intersection(cats, queries).length > 0;
    });
    return _.filter(results, profile => _.intersection(profile.categories, selectedCategories).length > 0);
  },
  hasResults() {
    // Initialize selectedCategories to all of them if messageFlags is undefined.
    if (!Template.instance().messageFlags.get(selectedCategoriesKey)) {
      Template.instance().messageFlags.set(selectedCategoriesKey, _.map(Categories.findAll(), category => category.name));
    }
    // Find all profiles with the currently selected categories.
    const allProfiles = Profiles.findAll();
    const selectedCategories = Template.instance().messageFlags.get(selectedCategoriesKey);
    const queries = FlowRouter.getParam('query').toLowerCase().split(" ");
    const results = _.filter(allProfiles, function(profile){
      for(let i = 0; i < queries.length; i++){
        if(profile.itemName.toLowerCase().includes(queries[i])){
          return true;
        }
      }
      const cats = _.map(profile.categories, function(cat) {
        return cat.toLowerCase();
      })
      return _.intersection(cats, queries).length > 0;
    });
    const search = _.filter(results, profile => _.intersection(profile.categories, selectedCategories).length > 0);
    return search.length > 0;
  },
  categories() {
    return _.map(Categories.findAll(),
        function makeCategoryObject(category) {
          return {
            label: category.name,
            selected: _.contains(Template.instance().messageFlags.get(selectedCategoriesKey), category.name),
          };
        });
  },
});

Template.Search_Page.events({
  'submit .filter-data-form'(event, instance) {
    event.preventDefault();
    const selectedOptions = _.filter(event.target.Categories.selectedOptions, (option) => option.selected);
    instance.messageFlags.set(selectedCategoriesKey, _.map(selectedOptions, (option) => option.value));
  },
});
