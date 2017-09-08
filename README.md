# LostInTranslation.js

You know that thing where people were translating lyrics and such through multiple translations and then singing the lyrics back in English?  Yeah that's what I was thinking of when I wrote this.  A Node.js module that allows you to translate a string multiple times through multiple languages. I've had some fun with it, and maybe you will to.  

![greyscale](https://user-images.githubusercontent.com/5851874/30230448-57bedac8-94b4-11e7-9c8b-42557b06ff4c.png)

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

The first object passed to the constructor should have the following structure:

```
//All parameters are required.
{
    //languageSteps can be either a number or an array of languages e.g. ['az','eu','be','bn']
    languageSteps: 3,
    //the final language returned
    targetLanguage: 'en',
    //the language we are starting with
    startingLanguage: 'en',
    //the string to be translated
    inputString: 'This is my totally rad input string'
}
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

### setLanguageList

LostInTranslation.js includes an internal array of supported language codes.  This is done so that you don't have to rely on language detection at the expense of perhaps not being up to date at all times.  If you find yourself needing to alter the list of language codes, you may replace the existing array using setLanguageList.  

```
var list = ['ps', 'fa', 'pl'];
translator.setLanguageList(list);

//Now the internal list will only contain the languages specified: 'ps', 'fa', 'pl'
```