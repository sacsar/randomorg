# randomorg
Node package for random.org API

This package presumes your API key is stored in an environment variable called `RANDOM_API_KEY`. It will use `dotenv` to load 
the api key from a file.

The available functions are:
- `generateIntegers(n, min, max, [replacement, base,] callback)`
- `generateDecimalFractions(n, decimalPlaces, [replacement,] callback)`
- `generateGaussians(n, mean, standardDeviation, significantDigits, callback)`
- `generateStrings(n, length, characters, [replacement,] callback)`
- `generateUUIDs(n, callback)`
- `generateBlobs(n, size, [format,] callback)`
- `getUsage(callback)`

Respecting the advisoryDelay in the response needs to be handled by the callback.

Note that I've really only used `generateIntegers` so far. Tests and such are in progress.

## Example

```javascript
function(n, callback){
  function callRandomOrgApi(){
    randomorg.generateIntegers(n, 1, 10, RandomOrgCallback);
  };

  function RandomOrgCallback(err, body){
    if(!_.isNull(err)){
      // something went wrong, call the fallback
      fallback();
    } else {
      setTimeout(semaphore.leave, body.advisoryDelay);
      callback(body.random.data);
    }
  };

  function fallback(){
    roll = _.map(random.dice(10, n), function(k){return k-1;});
    callback(roll);
  }

  semaphore.take(callRandomOrgApi, fallback);
}
```
