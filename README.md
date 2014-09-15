# Chosem

An ember selection component build to replicate and augment the traditional `<select>` element, heavily inspired by [Harvest's Chosen library](http://harvesthq.github.io/chosen/) (hence the name).

### [View the demo](http://emberjs.jsbin.com/IGiJIZ/5)

  Supports expected `focus` behaviour, proper keyboard navigation, and scrolling of the option list to selected options.
  Features search, and will shortly have full `multiple` support.

  Requires options in the form of:
  ```javascript
  [
    Ember.Object.create({
      name: 'United Kingdom',
      value: 'uk'
      })
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

# How to use

You'll need to put all the components in the right place in your app, and if you're using a namespace different from `App`, you'll need to change this to whatever you're using, .e.g `MyApp.ChosemSelectComponent = ...`

Unfortunately there's no nice an easy way to package up these components for re-use across projects, but I'm sure the ember team will come up with something soon!
