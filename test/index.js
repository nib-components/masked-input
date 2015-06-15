var assert = require('assert');
var simulant = require('simulant');
var MaskedInput = require('..');

var el;
function create(options) {
  el = document.createElement('input');
  document.body.appendChild(el);
  new MaskedInput({
    el: el,
    allow:  options.allow,
    format: options.format
  });
  return el;
}

describe('MaskedInput', function() {

  beforeEach(function() {
  });

  afterEach(function() {
    if (el) document.body.removeChild(el);
    el = null;
  });

  describe('.constructor()', function() {

    it('should construct');

  });

  describe('.allow()', function() {

    it('should receive a char when I type a key', function(done) {

      var input = create({allow: function(char) {
        assert.equal(char, 'A');
        done();
      }});

      simulant.fire(el, 'keypress', {which: 'A'.charCodeAt(0)});

    });

  });

  describe('.format()', function() {

    it('should receive and input event when I type a key', function(done) {

      var input = create({format: function(event) {
        assert.equal(event.name, 'INSERT');
        done();
      }});

      simulant.fire(el, 'keypress', {which: 'A'.charCodeAt(0)});
      simulant.fire(el, 'input', {data: 'A'});

    });

  });

});