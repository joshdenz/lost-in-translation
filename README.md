# LostInTranslation.js

You know that thing where people were translating lyrics and such through multiple translations and then singing the lyrics back in English?  Yeah this let's you easily get those translations.

## Installation

To install:
```
npm install lost-in-translation 
```
## Usage

```
const Translator = require('lost-in-translation');
```
Setup:
You must pass two objects to the constructor.  The first is your translation parameters, and the second contains authentication information for the Google Cloud Translation API.
```
var instance = new Translator({
    languageSteps: 3,
    targetLanguage: 'en',
    startingLanguage: 'en',
    inputString: 'This is my totally rad input string'
}, {
    projectId: 'your projectId',
    keyFilename: 'path to keyfile'
})
```
Translate:
```
instance.getTranslation().then((data)=>{
    console.log("The text became: " + data[4].translation);
})
```