var TextInput = require('..');

var DIGIT = /^\d$/;

new TextInput({

  el: document.querySelector('input'),

  //only allow digits and max length 9 (10 total after we allow this one)
  accept: function(char) {
    return DIGIT.test(char) && this.value.length <= 9;
  },

  changed: function(event) {
    var
      input = this,
      value = input.value,
      start = input.selectionStart,
      end   = input.selectionEnd
    ;

    //backspace the slash immediately to the left of the number
    if (event.name === 'BACKSPACE') {
      if (start === end && (start === 2 || start === 5)) {
        value = value.substr(0, start-1)+value.substr(start);
        --start;
        --end;
      }
    }

    //filter non-digit characters so we don't need to know where the digit was inserted
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

    //add the first slash
    if ((event.name !== 'BACKSPACE' && value.length >= 2) || (event.name === 'BACKSPACE' && value.length > 2)) {
      value = value.substr(0, 2)+'/'+value.substr(2);
      if (start >= 2) ++start;
      if (end >= 2) ++end;
    }

    //add the second slash
    if ((event.name !== 'BACKSPACE' && value.length >= 5) || (event.name === 'BACKSPACE' && value.length > 5)) {
      value = value.substr(0, 5)+'/'+value.substr(5);
      if (start >= 5) ++start;
      if (end >= 5) ++end;
    }

    //set the value and position
    input.value           = value.substr(0, 10);
    input.selectionStart  = start;
    input.selectionEnd    = end;

  }

});
