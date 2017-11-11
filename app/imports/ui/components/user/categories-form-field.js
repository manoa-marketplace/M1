import { Template } from 'meteor/templating';

Template.Categories_Form_Field.onRendered(function onRendered() {
  this.$('.dropdown').dropdown();
});

