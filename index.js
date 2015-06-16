
function MaskedInputEvent(name, input) {
  this.name   = name;
  this.input  = input;
}

function MaskedInput(options) {

  if (!(this instanceof MaskedInput)) {
    return new MaskedInput(el, format);
  }

  this.el       = options.el;
  this.accept   = options.accept;
  this.changed  = options.changed;
  this.event    = null;

  this.el.addEventListener('keydown',   this.onKeyDown.bind(this));
  this.el.addEventListener('keypress',  this.onKeyPress.bind(this));
  this.el.addEventListener('input',     this.onChange.bind(this));

}

MaskedInput.prototype = {

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

    //check whether the character is accepted
    if (this.accept && !this.accept.call(this, char)) {
      event.preventDefault();
    }

    this.event = 'INSERT';

  },

  onChange: function(event) {

    if (this.event) {

      //remove characters that aren't accepted and update the selection start/end as appropiate
      if (event.name === 'PASTE') {
      }

      //dispatch an event to the user to format the value
      this.changed.call(this, new MaskedInputEvent(this.event, this));

    }

    this.event = null;

  }

};

Object.defineProperties(MaskedInput.prototype, {

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

module.exports = MaskedInput;