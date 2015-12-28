var request = require('request');
var dotenv = require('dotenv');
var _ = require('underscore');

// load the api key
dotenv.load();

module.exports = {
  generateIntegers: generateIntegers,
  generateDecimalFractions: generateDecimalFractions,
  generateGaussians: generateGaussians,
  generateStrings: generateStrings,
  generateUUIDs: generateUUIDs,
  generateBlobs: generateBlobs,
  getUsage: getUsage
}

function payloadObj(){
  return {
    jsonrpc: "2.0",
    params: {
      apiKey: process.env.RANDOM_API_KEY
    },
    id: Math.round(Math.random() * 100000)
  }
}

function makeRequest(payload, callback){
  request({
    method: 'POST',
    uri: 'https://api.random.org/json-rpc/1/invoke',
    json: true,
    body: payload
  }, function(error, response, body){
    responseCallback(error, response, body, callback);
  });
}

function responseCallback(error, response, body, callback){
  if(error){
    console.error(body.error.message)
    return callback(error);
  }
  return callback(null, body.result);
}

function generateIntegers(n, min, max, replacement, base, callback){
  // replacement and base are independent, so we have to do a bit of
  // gymnastics to get things sorted
  var args = copyValues(arguments);

  if(args.length == 5){
    // have only one optional argument
    callback = args.pop();
    if(_.isBoolean(args[3])){
      replacement = args[3];
      base = null;
    } else {
      base = args[3];
      replacement = null;
    }
  } else if(args.length == 4){
    // no optional arguments
    callback = args.pop();
    replacement = null;
    base = null;
  }
  if(!_.isFunction(callback)){
    // something has gone wrong, throw an error
    console.error("Callback is not a function")
    return new Error("Callback is not a function")
  }
  payload = payloadObj()
  payload.method = "generateIntegers";
  payload.params.n = n;
  payload.params.min = min;
  payload.params.max = max;
  if(!_.isNull(replacement)){
    payload.params.replacement = replacement;
  }
  if(!_.isNull(base)){
    payload.params.base = base;
  }
  makeRequest(payload, callback);
}

function generateDecimalFractions(n, decimalPlaces, replacement, callback){
  var args = copyValues(arguments);

  if(args.length == 3){
    callback = args.pop();
  }

  if(!_.isFunction(callback)){
    console.log("Callback is not a function");
    return new Error("Callback is not a function");
  }

  payload = payloadObj();
  payload.method = "generateDecimalFractions";
  payload.params.n = n;
  payload.params.decimalPlaces = decimalPlaces;
  if(_.isBoolean(replacement)){
    payload.params.replacement = replacement;
  }
  makeRequest(payload, callback);
}

function generateGaussians(n, mean, standardDeviation, significantDigits, callback){
  payload = payloadObj();
  payload.method = "generateGaussians";
  payload.params.n = n;
  payload.params.mean = mean;
  payload.params.standardDeviation = standardDeviation;
  payload.params.significantDigits = significantDigits;

  makeRequest(payload, callback);
}

function generateStrings(n, length, characters, replacement, callback){
  var args = copyValues(arguments);

  if(args.length==4){
    callback = args.pop()
  }

  if(!_.isFunction(callback)){
    console.log("Callback is not a function");
    return new Error("Callback is not a function");
  }

  payload = payloadObj();
  payload.method = 'generateStrings';
  payload.params.n = n;
  payload.params.length = length;
  payload.params.characters = characters;
  if(_.isBoolean(replacement)){
    payload.params.replacement = replacement;
  }

  makeRequest(payload, callback);
}

function generateUUIDs(n, callback){
  payload = payloadObj();
  payload.method = 'generateUUIDs';
  payload.params.n = n;
  makeRequest(payload, callback);
}

function generateBlobs(n, size, format, callback){
  var args = copyValues(arguments);

  payload = payloadObj();

  if(args.length==3){
    callback = args.pop();
  } else {
    // verify that the format is acceptable
    if(_.isString(format)){
      if(!(format === 'base64' || format === 'hex')){
        return new Error("Format must be base64 or hex, not " + format);
      }
      payload.params.format = format;
    }
  }

  payload.method = "generateBlobs";
  payload.params.n = n;
  payload.params.size = size;

  makeRequest(payload, callback);
}

function getUsage(callback){
  payload = payloadObj();
  payload.method = "getUsage";
  makeRequest(payload, callback);
}

function copyValues(obj){
  var arr = [];
  for(var i=0; i < obj.length; i++){
    arr.push(obj[i]);
  }
  return arr;
}

