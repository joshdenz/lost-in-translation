/**
 * LostInTranslation.js
 * 
 * Attribution for Google:
 * THIS SERVICE MAY CONTAIN TRANSLATIONS POWERED BY GOOGLE. GOOGLE DISCLAIMS ALL WARRANTIES RELATED TO THE TRANSLATIONS, EXPRESS OR IMPLIED, INCLUDING ANY WARRANTIES OF ACCURACY, RELIABILITY, AND ANY IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
 */
const request = require('request');
const extend = require('deep-extend');
const translate = require('@google-cloud/translate');
var translateClient;
var languageList = [];

class Translator {
    constructor(config, credentials) {
        //merge user supplied arguments to the defaults.
        this.config = extend({
            inputString: null,
            startingLanguage: null,
            targetLanguage: null,
            languageSteps: null
        }, config);
        //set credentials
        translateClient = translate({
            projectId: credentials.projectId,
            keyFilename: credentials.keyFilename
        })
        //this determines whether or not the user passed an array of languages, or a number of random language hops
        setOperatingMode(this.config);
        //sets up the configuration object for passing to the translation api
        this.config = setTranslationLanguages(this.config);
    }

    /**
     * Class method to make the translation requests.
     * @returns {Promise}
     */
    getTranslation() {
        return makeApiCalls(this.config);
    }


    /**
     * Takes an object with the same properties as the main constructor.  Allows you to alter the properties for the translation requests.
     * Function returns a promise.
     * @param {Object} paramObject 
     */
    setTranslationParams(paramObject) {
        return new Promise((resolve, reject) => {
            try {
                this.config = extend({
                    inputString: null,
                    startingLanguage: null,
                    targetLanguage: null,
                    languageSteps: null
                }, paramObject);
                setOperatingMode(this.config);
                this.config = setTranslationLanguages(this.config);
                resolve();
            } catch (e) {
                reject(e);
            }
        })
    }

    /**
     * Allows user to set a custom language list.  I provide this so you do not have to rely on the translation API language identification.
     * This saves you some API usage at the cost of potentially being out of date.
     * @param {array} list - An array consisting of two letter language codes.
     */
    setLanguageList(list) {
        if (Array.isArray(list)) {
            try {
                languageList = list;
            } catch (e) {
                console.log(e);
            }
        } else {
            throw new Error('Invalid Input: setLanguageList requires an array.');
        }
    }
}

/**
 * Prepares the request object to be passed to the makeApiCalls() method.
 * @param {Object} input 
 */
function setTranslationLanguages(input) {
    var requestObject = {};
    //input.inputString is the string to be translated
    requestObject.input = input.inputString;
    //initializing the array of language steps... that is the languages that will be translated through to produce the garbage string at the end.
    requestObject.languageSteps = [];
    //add the starting and target languages
    requestObject.startLang = input.startingLanguage;
    //if an array was passed as the languageSteps argument
    if (this.mode == 'array') {
        requestObject.languageSteps = input.languageSteps;
        requestObject.languageSteps.push(input.targetLanguage);
        requestObject.numberOfSteps = requestObject.languageSteps.length;
    }
    //if a number was passed as the languageSteps argument 
    else if (this.mode == 'number') {
        for (let i = 0; i < input.languageSteps; i++) {
            requestObject.languageSteps[i] = languageList[(Math.floor(Math.random() * (languageList.length - 0 + 1) + 0))];
        }
        requestObject.languageSteps.push(input.targetLanguage);
        //numberOfSteps will control the number of hops through the translation loop
        requestObject.numberOfSteps = requestObject.languageSteps.length;
    }
    //return a completed requestObject
    return requestObject;
}


/**
 * This function will determine the operating mode of the module.  Random, or specific
 */
function setOperatingMode(input) {
    //determine if user has passed an array.  If so, assign array to class languageSteps property. Else assign to this.randomSteps.
    if (Array.isArray(input.languageSteps)) {
        this.languageSteps = input.languageSteps
        this.mode = 'array';
    } else {
        this.languageSteps = input.languageSteps;
        this.mode = 'number';
    }
}

/**
 * This is where the magic happens. Takes an object provided by setTranslationLanguages() and makes the actual Google Cloud Translation API request
 * @param {object} requestObject 
 */
async function makeApiCalls(requestObject) {
    var apiOutput = {};
    var numberOfLoops = requestObject.numberOfSteps;
    var response = [];
    response[0] = requestObject.input;
    //nn write some logic to break up the config object into the correct properties
    for (let i = 0; i < numberOfLoops; i++) {
        let options;
        let text = response[i];
        let target = requestObject.languageSteps[i];
        if (i == 0) {
            //if this is the first loop, use the supplied starting language
            options = {
                from: requestObject.startLang,
                to: target
            }
        } else {
            //else use the previous language
            options = {
                from: requestObject.languageSteps[i - 1],
                to: target
            }
        }
        try {
            await translateClient.translate(response[i], options).then((data) => {
                response.push(data[0]);
            })
        } catch (e) {
            console.log("exiting with error: " + e);
        }
    }
    apiOutput = generateResultsObject(requestObject.languageSteps, response, requestObject.startLang);
    return apiOutput;
}

/**
 * Takes in the two arrays that we have been using to make the translation calls, and generates a nice little array of objects representing each step.
 * @param {array} codes - These are the translation codes for each language we translate through.
 * @param {array} results - These are the returned translation for each step. 
 */
function generateResultsObject(codes, results, startLanguage) {
    var returnObj = [];
    for (let i = 0; i < results.length; i++) {
        if (i == 0) {
            returnObj[i] = {
                code: startLanguage,
                translation: results[i]
            }
        } else {
            returnObj[i] = {
                code: codes[i-1],
                translation: results[i]
            }
        }
    }
    return returnObj;
}
/**
 * This list is provided to prevent the need for the translation API to detect which language you are using, and also to add the "random language" functionality.
 * Feel free to overwrite this list using setLanguageList()
 */
languageList = ['af', 'sq', 'am', 'ar', 'hy', 'az', 'eu', 'be', 'bn', 'bs', 'bg', 'ca', 'ceb', 'co', 'hr', 'cs', 'da', 'nl', 'eo', 'et', 'fi', 'fr',
    'fy', 'gl', 'ka', 'de', 'el', 'gu', 'ht', 'ha', 'haw', 'iw', 'hi', 'hmn', 'hu', 'is', 'ig', 'id', 'ga', 'it', 'ja', 'jw', 'kn', 'kk', 'km', 'ko', 'ku', 'ky', 'lo',
    'la', 'lv', 'lt', 'lb', 'mk', 'mg', 'ms', 'ml', 'mi', 'mr', 'mn', 'my', 'ne', 'no', 'ny', 'ps', 'fa', 'pl', 'pt', 'pa', 'ro', 'ru', 'sm', 'gd', 'sr', 'st', 'sn',
    'sd', 'si', 'sk', 'sl', 'so', 'es', 'su', 'sw', 'sv', 'tg', 'ta', 'te', 'th', 'tr', 'uk', 'ur', 'uz', 'vi', 'cy', 'xh', 'yi', 'yo', 'zu'
]

module.exports = Translator;