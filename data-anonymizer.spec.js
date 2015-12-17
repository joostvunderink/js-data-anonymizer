'use strict';

require('should');

var Anonymizer = require('./data-anonymizer.js');

var a = new Anonymizer({ diacritics: true });
var inputs = [
  'Jouke Visser',
  'Hoofdweg 103',
  'Froombosch',
  'Łódż, Polska'
];
inputs.forEach(function(string) {
  console.log(string + ' -> ' + a.anonymize(string));
});

// console.log(a.anonymize("Założenie, że nowa RPP będzie podejmowała racjonalne decyzje, to tylko jeden ze scenariuszy"));

describe('character classes for just basic latin alphabet', function() {
  var testdata = [
    // character, class
    ['a', 'lowercase'],
    ['F', 'uppercase'],
    ['4', 'number'],
    [' ', 'other'],
    ['@', 'other'],
    ['ć', 'other'],
  ];

  testdata.forEach(function(tc) {
    var input = tc[0];
    var expectedCharClass = tc[1];
    it('should have the right char class for "' + input + '": ' + expectedCharClass, function() {
      var anonymizer = new Anonymizer({ diacritics: false });
      var charClass = anonymizer.getCharClass(input);
      charClass.name.should.equal(expectedCharClass);
    });
  })
});

describe('character classes when including diacritics', function() {
  var testdata = [
    // character, class
    ['a', 'lowercase'],
    ['F', 'uppercase'],
    ['4', 'number'],
    [' ', 'other'],
    ['@', 'other'],
    ['ć', 'diacritic lowercase'],
    ['ä', 'diacritic lowercase'],
    ['Å', 'diacritic uppercase'],
  ];

  testdata.forEach(function(tc) {
    var input = tc[0];
    var expectedCharClass = tc[1];
    it('should have the right char class for "' + input + '": ' + expectedCharClass, function() {
      var anonymizer = new Anonymizer({ diacritics: true });
      var charClass = anonymizer.getCharClass(input);
      charClass.name.should.equal(expectedCharClass);
    });
  })
});

describe('character class for "other" contains only that character', function() {
  it('should only contain this character', function() {
    var anonymizer = new Anonymizer();
    var input = '&';
    var charClass = anonymizer.getCharClass(input);
    charClass.name.should.equal('other');
    charClass.chars.should.equal(input);
  });
});

describe('anonymizer logic', function() {
  var anonymizer = new Anonymizer({ diacritics: false });

  it('should return a string different from the input', function() {
    var input = 'some string for input';
    var output = anonymizer.anonymize(input);
    output.should.not.equal(input);
  });

  it('should return a string of equal length to the input', function() {
    var input = 'some string';
    var output = anonymizer.anonymize(input);
    output.should.have.length(input.length);
  });

  it('should return the same output when anonymizing the same string twice', function() {
    var input = 'some string';
    var output = anonymizer.anonymize(input);
    var output2 = anonymizer.anonymize(input);
    output2.should.equal(output);
  });

  it('should return the same output when anonymizing with the same seed twice', function() {
    var input = 'some string';
    var anonymizer1 = new Anonymizer({ seed: 'seed' });
    var anonymizer2 = new Anonymizer({ seed: 'seed' });
    var output = anonymizer1.anonymize(input);
    var output2 = anonymizer2.anonymize(input);
    output2.should.equal(output);
  });
});

