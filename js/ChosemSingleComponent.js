/**
  DOING: Add support for multiple selection
  TODO: Vastly improve search functionality and highlighting
  TODO: Improve CSS

  A selection component build to replicate and augment the traditional `<select>` element, heavily inspired by Harvest's Chosen library (hence the name).

  Supports expected `focus` behaviour, proper keyboard navigation, and scrolling of the option list to selected options.
  Features 

  Requires options in the form of:
  ```javascript
  [
    {
      name: 'United Kingdom',
      value: 'uk'
      }
  ]
  ```
  So that's an array of objects, where each object has a name and a value.

  
  In the template, all you have to provide is a value and some options:

  ```handlebars
  {{chosem-select value=person options=people}}
  ```

  You can also provide a placeholder (although it has a default):

  ```handlebars
  {{chosem-select value=place placeholder='Choose a place...' options=places}}
  ```
  
  @class ChosemSelectComponent
*/
App.ChosemSelectComponent = Ember.Component.extend({

  /**
    Whether or not the select is open, and options are visible.

    @property isOpen
    @type Boolean
    @default false
  */
  isOpen: false,

  /**
    The search input's value

    @property input
    @type String
    @default ''
  */
  input: '',

  /**
    The active value of the select (in the traditional select/input context).
    Will either be a single object, or if it's a multiple select, will be an array of objects.

    @property value
    @type Object OR Array
    @default null
  */
  value: null,

  /**
    The placeholder for the select

    @property placeholder
    @type String
    @default 'Choose something...'
  */
  placeholder: function() {
    if (this.get('multiple')) {
      return 'Choose some things...';
    } else {
      return 'Choose something...';
    }
  }.property('multiple'),

  /**
    We have to define a tabindex so the browser will pickup that this element is focusable.
    
    @property tabindex
    @type Number
    @default 0
  */
  tabindex: 0,

  /**
    The classnames for the component, dynamic and static.

    @property classNameBindings
    @type Array
  */
  classNameBindings: [':chosem', 'isOpen:chosem--open:chosem--closed', 'multiple:chosem--multiple'],

  /**
    The bound attributes for the component

    @property attributeBindings
    @type Array
  */
  attributeBindings: ['tabindex'],

  /**
    A boolean that gets set by event watchers on `didInsertElement()`.

    We have a `blur` handler on the search input, so when the user clicks away from it, it'll close. However, the blur event also runs if they click the value at the top of the element. On the blur event, we check if `mouseOnContainer` is true, and if it is we don't run the typical blur behaviour.

    Essentially means that if the user clicks the top part of the element while the select is open, it doesn't close and reopen immediately.

    @property mouseOnContainer
    @type Boolean
    @default false
  */
  mouseOnContainer: false,

  /**
    If there's an input, returns options filtered with the input.

    @property filtered
    @return {Array} The filtered options
  */
  filtered: function() {
    var options = this.get('options'),
      input = this.get('input'),
      _this = this;

    if (input) {
      return options.filter(function(option, i, array) {

        // TODO: Make this filtering way less crappy
        var l_input = input.toLowerCase(),
          l_match = option.get('name')
            .toLowerCase();

        return l_match.indexOf(l_input) !== -1;
      });
    } else {
      return options;
    }

  }.property('input'),
  
  /**
    When the results get filtered, highlight the first result.
    
    @method selectFilteredOnChange
  */
  selectFilteredOnChange: function() {
      var firstObject = this.get('filtered.firstObject');
      this.send('highlight', firstObject);
    }.observes('filtered'),

  /**
    Post-DOM-render setup method.

    Sets up the `mouseOnContainer` mouse watchers.

    Hard-sets the width of the element to be the original rendered width, otherwise the whole thing changes width when it opens. I couldn't figure out how to do this with CSS, seemed impossible.

    Set's the first option in it's options list to be active so the user can hit return immediately when it's opened.

    @method didInsertElement
  */
  didInsertElement: function() {
    var $me = this.$(),
      $value = this.$('.chosem__value'),
      _this = this;

    // Setup mouseOnContainer observer
    $me.mouseenter(function() {
      _this.set('mouseOnContainer', true);
    });
    $me.mouseleave(function() {
      _this.set('mouseOnContainer', false);
    });

    // Hard-set open width to be the same as closed width
    $me.css('width', $me.css('width'));

    this.set('options.firstObject.selected', true);
  },

  /**
    Hooks up key handlers for the select.

    Available keys:
    Up: moves the selection up
    Down: guess...
    Return: EITHER sets the current selection to the value OR opens the select if the select has focus but is closed.
    Esc: Closes

    @method keyDown
    @param {Event} e
  */
  keyDown: function(e) {
    var _this = this;
    var options = _this.get('options'),
      selected = options.findProperty('selected', true),
      i = options.indexOf(selected),
      k = e.keyCode;

    // If the list is open
    if (this.get('isOpen')) {

      // Enter
      if (k === 13) {
        this.send('select', selected);
      }

      // Up arrow
      if (k === 38 && selected && i !== 0) {
        this.send('moveSelection', 'up');
      }

      // Down arrow
      if (k === 40 && selected && i !== options.length - 1) {
        this.send('moveSelection', 'down');
      }

      // Esc
      if (k === 27) {
        this.set('isOpen', false);
        Ember.run.scheduleOnce('afterRender', this, function() {
          this.$()
            .focus();
        });
      }

    } else { // If the list is closed

      // Enter, up and down arrows if closed
      if (k === 13 || k === 38 || k === 40) {
        this.set('isOpen', true);
      }
    }
  },

  actions: {

    /**
      Toggles the `isOpen` property, opening/closing the select.

      Gives the search input focus when the select opens, and sets up the blur event. Both run inside an `Ember.Run.scheduleOnce` on the `afterRender` queue, making sure the DOM is ready before doing stuff with jQuery

      @method toggleOpen
    */
    toggleOpen: function() {
      var _this = this;

      this.toggleProperty('isOpen');

      // If it's now open, focus the input and setup the blur
      if (this.get('isOpen')) {
        Ember.run.scheduleOnce('afterRender', this, function() {
          this.$('input')
            .focus();

          this.$('input')
            .blur(function(e) {

              // Check if the mouse is on the container. If it is, just do the usual `toggleOpen` behaviour. If it isn't, close the dropdown.
              if (!_this.get('mouseOnContainer')) {
                _this.set('isOpen', false);
              }
            });
        });
      }

    },

    /**
      Single select usage:
        Sets all options to be not selected, then sets the given item to be the select's value.

      Multiple select usage:
        Sets all options to be not selected, then adds the given item to the value array (which it also sets up). Sets the given item to be disabled so it can't be selected again.

      Gives the select focus afterwards, so the user can hit return to reopen the dropdown. This runs inside an `Ember.run.next` to wait for DOM changes.
      
      @method select
      @param {Class} item The item to set the select's value to
    */
    select: function(item) {

      if (item.get('disabled')) return;

      // Set all options to not be highlighted
      this.get('options')
        .setEach('selected', false);

      // Check if we're a multiple select
      if (this.get('multiple')) {

        // Initialise the array if it's not been set yet
        if (this.get('value') === null) {
          this.set('value', []);
        }

        // Push the item into the array
        this.get('value').pushObject(item);

        // Set that same item to be disabled, so it can't be selected again
        item.set('disabled', true);

        // Find the first not-disabled option and select it
        var abled = this.get('options').find(function(option, i, array) {
          return option.get('disabled') === false;
        });
        console.log(abled);
        abled.set('selected', true);

      } else {
        item.set('selected', true);
        this.set('value', item);
      }

      this.set('isOpen', false);
      this.set('input', null);

      Ember.run.next(this, function() {
        this.$()
          .focus();
      });
    },

    /**
      Highlights the given item.

      NOTE: Although highlighted items are set to be 'selected', they don't get set to be the value of the select. `select()` does that.

      @method highlight
      @param {Class} item The item to highlight
    */
    highlight: function(item) {
      if (item.get('disabled')) return;
      this.get('options')
        .setEach('selected', false);
      item.set('selected', true);
    },

    /**
      Moves the current selection up or down by 1, depending on the given selection.

      Handles visiblity of the current selection, scrolling the options container so the current selection is visible.

      @method moveSelection
      @param {String} direction The direction to move the selection in.
    */
    moveSelection: function(direction) {
      var options = this.get('options'),
        selected = options.findProperty('selected', true),
        i = options.indexOf(selected),
        _this = this;

      // Redeclare direction to be -1 if up, 1 if down
      direction = direction === 'down' ? 1 : -1;

      selected.set('selected', false);
      options
        .objectAt(i + direction)
        .set('selected', true);

      // Now we've moved the selection, check the item is visible. If not, scroll to it.
      var $options = this.$('.chosem__options'),
        $option = this.$('.chosem__option--selected'),
        offset = selected.get('offset'),
        listHeight = $options.height();

      if (offset > listHeight) {
        $options.scrollTop(offset);
      }

    }
  }
});
