import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

Template.Search_Page.helpers({
  searchQuery() {
    return FlowRouter.getParam('query');
  },
});
