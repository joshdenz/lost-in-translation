# LostInTranslation.js

You know that thing where people were translating lyrics and such through multiple translations and then singing the lyrics back in English?  Yeah that's what I was thinking of when I wrote this.  I've had some fun with it, and maybe you will to.

## Installation

To install:
```
npm install lost-in-translation 
```
## Usage

### Setup:
You must pass two objects to the constructor.  The first is your translation parameters, and the second contains authentication information for the Google Cloud Translation API.
```
const Translator = require('lost-in-translation');

var translator = new Translator({
    languageSteps: 3,
    targetLanguage: 'en',
    startingLanguage: 'en',
    inputString: 'This is my totally rad input string'
}, {
    projectId: 'your projectId',
    keyFilename: 'path to keyfile'
})
```
### getTranslation:

```
translator.getTranslation().then((data)=>{
    console.log("The text became: " + data[data.length - 1].translation);
})

// Logged: The text became: This is the absolute line input line.
```
The getTranslation method returns an array of objects, each representing a translation step.  For example, if you specify 3 languages to translate through then the returned object will have 5 elements.  The element at data[0] is the first step, so it is the input and input language.  And the last item in the array is the completed translation and output language.

If you want to know the languages that were used to translate the inputString you can access the 'code' property of each element in the returned array.
```
condole.log(data[data.length - 1].code)

//Logs: en
```

### setTranslationParams

This function lets you provide new translation parameters to the translator.

```
translator.setTranslationParams({
    languageSteps: ['az','eu','be','bn'],
    targetLanguage: 'en',
    startingLanguage: 'en',
    inputString: 'This is a new string that is totally more awesome than the last one.'
})
.then(()=>{
    return translator.getTranslation();
})
.then((data)=>{
    console.log("The text became: " + data[data.length - 1].translation);
})

//Logged: The text became: Secondly, more beautiful than circuits is not completely new.
```