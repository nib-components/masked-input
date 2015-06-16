var TextInput = require('..');

var DIGIT = /^\d$/;

new TextInput({

  el: document.querySelector('input'),

  //only allow digits and max length 9 (10 total after we allow this one)
  accept: function(char) {
    return DIGIT.test(char) && this.value.length <= 11;
  },

  changed: function(event) {
    var
      input = this,
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
        if (start === end && (start === 4 || start === 8)) {
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
        if (start === end && (start === 2 || start === 7)) {
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
    input.value           = value.substr(0, 12);
    input.selectionStart  = start;
    input.selectionEnd    = end;

  }

});
