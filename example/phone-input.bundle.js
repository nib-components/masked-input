(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var TextInput = require('..');

var DIGIT = /^\d$/;

new TextInput({

  el: document.querySelector('input'),

  //only allow digits and max length 9 (10 total after we allow this one)
  allow: function(char) {
    return DIGIT.test(char) && this.value.length <= 11;
  },

  format: function(event) {
    var
      input = event.input,
      value = input.value,
      start = input.selectionStart,
      end   = input.selectionEnd
    ;

    //filter non-digit characters so we don't need to know where the digit was inserted
    function filter() {
      for (var i=0; i<value.length; ++i) {
        if (!DIGIT.test(value[i])) {
          value = value.substr(0, i)+value.substr(i+1);
          if (start > i) {
            --start;
          }
          if (end > i) {
            --end;
          }
          --i;
        }
      }
    }

    if (value.substr(0, 2) === '04') {

      //backspace the space immediately to the left of the number
      if (event.name === 'BACKSPACE') {
        if (start === end && (start === 5 || start === 9)) {
          value = value.substr(0, start-1)+value.substr(start);
          --start;
          --end;
        }
      }

      filter();

      //add the first space
      if ((event.name !== 'BACKSPACE' && value.length >= 4) || (event.name === 'BACKSPACE' && value.length > 4)) {
        value = value.substr(0, 4)+' '+value.substr(4);
        if (start >= 4) ++start;
        if (end >= 4) ++end;
      }

      //add the second space
      if ((event.name !== 'BACKSPACE' && value.length >= 8) || (event.name === 'BACKSPACE' && value.length > 8)) {
        value = value.substr(0, 8)+' '+value.substr(8);
        if (start >= 8) ++start;
        if (end >= 8) ++end;
      }

    } else {

      //backspace the space immediately to the left of the number
      if (event.name === 'BACKSPACE') {
        if (start === end && (start === 3 || start === 8)) {
          value = value.substr(0, start-1)+value.substr(start);
          --start;
          --end;
        }
      }

      filter();

      //add the first space
      if ((event.name !== 'BACKSPACE' && value.length >= 2) || (event.name === 'BACKSPACE' && value.length > 2)) {
        value = value.substr(0, 2)+' '+value.substr(2);
        if (start >= 2) ++start;
        if (end >= 2) ++end;
      }

      //add the second space
      if ((event.name !== 'BACKSPACE' && value.length >= 7) || (event.name === 'BACKSPACE' && value.length > 7)) {
        value = value.substr(0, 7)+' '+value.substr(7);
        if (start >= 7) ++start;
        if (end >= 7) ++end;
      }

    }

    //set the value and position
    input.value           = value;
    input.selectionStart  = start;
    input.selectionEnd    = end;

  }

});

},{"..":2}],2:[function(require,module,exports){

function TextInputEvent(name, input) {
  this.name   = name;
  this.input  = input;
}

function TextInput(options) {

  if (!(this instanceof TextInput)) {
    return new TextInput(el, format);
  }

  this.el     = options.el;
  this.allow  = options.allow;
  this.format = options.format;
  this.event  = null;

  this.el.addEventListener('keydown',   this.onKeyDown.bind(this));
  this.el.addEventListener('keypress',  this.onKeyPress.bind(this));
  this.el.addEventListener('input',     this.onChange.bind(this));

}

TextInput.prototype = {

  onKeyDown: function(event) {
    var code = event.keyCode || event.which;
    var char = String.fromCharCode(event.charCode || code);

    //we'll let the browser handle all multi-key key presses
    if (event.altKey || event.metaKey || event.ctrlKey) {
      if (event.ctrlKey && (char === 'X' || char === 'V')) {
        this.event = char === 'X' ? 'CUT' : 'PASTE';
      }
      //TODO: CTRL-Z
      return;
    }

    //we'll handle backspace and delete separately
    if (code === 8) {
      this.event = 'BACKSPACE';
    } else if (code === 46) {
      this.event = 'DELETE';
    }

  },

  onKeyPress: function(event) {
    var code = event.keyCode || event.which;
    var char = String.fromCharCode(event.charCode || code);

    //let the browser handle non-visible key presses as per default
    if (code < 32 || code === 127) {
      return;
    }

    //ignore keys pressed in conjunction with CTRL|ALT etc (for FF)
    if (event.ctrlKey || event.altKey || event.metaKey) {
      return;
    }

    //check whether the character is allowed
    if (this.allow && !this.allow.call(this, char)) {
      event.preventDefault();
    }

    this.event = 'INSERT';

  },

  onChange: function(event) {

    if (this.event) {

      //remove characters that aren't allowed and update the selection start/end as appropiate
      if (event.name === 'PASTE') {
      }

      //dispatch an event to the user to format the value
      this.format.call(this, new TextInputEvent(this.event, this));

    }

    this.event = null;

  }

};

Object.defineProperties(TextInput.prototype, {

  value: {
    get: function() {
      return this.el.value;
    },
    set: function(value) {
      this.el.value = value;
    }
  },

  selection: {
    get: function() {
      return this.el.value.substr(this.selectionStart, this.selectionEnd-this.selectionStart);
    }
  },

  selectionStart: {
    get: function() {
      return this.el.selectionStart;
    },
    set: function(value) {
      this.el.selectionStart = value;
    }
  },

  selectionEnd: {
    get: function() {
      return this.el.selectionEnd;
    },
    set: function(value) {
      this.el.selectionEnd = value;
    }
  }

});

module.exports = TextInput;
},{}]},{},[1]);
