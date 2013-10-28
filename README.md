# Chosem

An ember selection component build to replicate and augment the traditional `<select>` element, heavily inspired by [Harvest's Chosen library](http://harvesthq.github.io/chosen/) (hence the name).

### [View the demo](http://emberjs.jsbin.com/IGiJIZ/5)

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
