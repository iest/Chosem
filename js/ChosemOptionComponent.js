App.ChosemOptionComponent = Ember.Component.extend({
  classNameBindings: [':chosem__option', 'item.selected:chosem__option--selected', 'item.disabled:chosem__option--disabled'],

  didInsertElement: function() {
    var top = this.$().position().top;
    this.set('item.offset', top);
  },

  mouseUp: function() {
    this.sendAction('select', this.get('item'));
  },
  mouseEnter: function() {
    this.sendAction('hover', this.get('item'));
  }
});