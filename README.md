# Data anonymizer

Simple module for simple and predictable data anonymization.

# Introduction

Sometimes, you want to provide realistic data to someone, but you don't want to give them your original data.

For example, you have a test server for your API, which talks to your test database. You don't want to have that database be a copy of your production database, because that would expose real names and real addresses of people.

What to do? You could replace all names by 'John Doe', but that would mean the test data is not representative of the real data anymore.

You can use this module to anonymize all sensitive strings in a predictable manner.

# Synopsis

### node.js

```
var DataAnonymizer = require('data-anonymizer');
var a = new DataAnonymizer({ seed: 'my secret seed' });

// Read your original data from somewhere.
var person = readPerson();

// Replace the sensitive fields.
person.firstName = a.anonymize(person.firstName);
person.lastName  = a.anonymize(person.lastName);

// Now you can store the data elsewhere.
```

### Raw HTML script

```
<!-- You only need seedrandom if you want to set the seed of the anonymizer. -->
<script src="//cdnjs.cloudflare.com/ajax/libs/seedrandom/2.4.0/seedrandom.min.js"></script>

<script src="data-anonymizer.js"></script>

<script>
var a = new DataAnonymizer({ seed: 'my secret seed' });
console.log(a.anonymize('some text'));
</script>
```

# Behaviour

Data anonymizer defines 5 character classes:

  * Uppercase letters (e.g. 'A')
  * Lowercase letters (e.g. 'f')
  * Numbers ('0' to '9')
  * Uppercase letters with diacritics (e.g. 'Å')
  * Lowercase letters with diacritics (e.g. 'ć')

Data anonymizer goes over each character in the input string. For each character, if it is in one of the defined character classes, it replaces the character by a character from the same class (sometimes replacing it by itself). If it's not in a defined character class, the character is left alone.

For a given seed, the behaviour on one specific system should always give the same results.

By default, diacritics are enabled. You can disabling them by doing `var anonymizer = new Anonymizer({ diacritics: false })`.

# Seeding

It would be good if the same input string would be converted to the same output consistently. That way, if you run the anonymization process twice, maybe because your original data has a few extra fields, the result of the data that is anonymized again will be the same.

This can be accomplished with the `seed` constructor argument.

# Configuration

```
// This seeds the anonymizer with your secret seed. This makes sure that the
// output becomes predictable for a given input.
var anonymizer = new Anonymizer({ seed: 'secret' });

// Disables diacritics. Any letters with diacritics are now left alone.
var anonymizer = new Anonymizer({ diacritics: false });
```

# FAQ

Q. Can the original data be retrieved from the anonymized data without knowing the seed?

A. As I am not a cryptology expert, I do not know the answer to this question. If you want to be 100% sure that your original data cannot be retrieved, I recommend you find something else than this module. Something that is cryptologically sound.

Q. Why are you not using the British spelling for 'anonymisation'?

A. I would actually prefer to use the British spelling. Using the American spelling is a marketing decision, because I think more people will search for 'anonymization' than 'anonymisation'.
