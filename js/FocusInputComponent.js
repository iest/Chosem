App.FocusInputComponent = Ember.TextField.extend({
  didInsertElement: function () {
    this.$().focus();
  }
});