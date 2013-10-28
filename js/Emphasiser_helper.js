Ember.Handlebars.registerBoundHelper('emphasiser', function(input, against) {

  /*
    TODO
    - Return the match in it's original form, not lowercased.
  */

  if (against) {

    input = input.toLowerCase(),
    against = against.toLowerCase();

    var output = input.split(against);

    var string = output[0] +
      '<strong>' + against +
      '</strong>' + output[1];

    return new Ember.Handlebars.SafeString(string);
  } else {
    return input;
  }
});