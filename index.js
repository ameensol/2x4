/* TODO
 * Prompt user for cuts - Length of cut, and quantity.
 * Store user input as a list of objects
 * Set up the recursive function
 */


var prompt = require('prompt');
var clone = require('clone');

prompt.start();

console.log("Welcome to the 2x4 calculator!\nInput your cut length (inches) and the quantity at that length.");

promptUser();

var cuts = [];

function promptUser () {
  prompt.get(['length', 'quantity', 'done'], function (err, result) {
    if (err) { return new Error(err); }
    console.log('Command-line input received:');
    storeInput(result, cuts);
    console.log('  Length: ' + result.length);
    console.log('  Quantity: ' + result.quantity);
    if (result.done.toLowerCase() != "y") {
      promptUser();
    } else {
      // TODO recursive function first call is here
      // clone cuts
      // call minLumber
      // create lumberMaps
      var lumberMaps = [];
      minLumber([], cuts, lumberMaps);
      fewestIndex = null;
      fewestLumber = null
      for (var i=0; i<minLumber.length;i++) {
        if (lumberMaps[i].length < fewestLumber || fewestLumber == null) {
          fewestLumber = lumberMaps[i].length;
          fewestIndex = i;
        }
      }
      console.log(lumberMaps[fewestIndex]);
    }
  });
}

function storeInput (result) {
  var newCut = {
    length: parseInt(result.length),
    quantity: parseInt(result.quantity
  };
  cuts.push(newCut);
}

function minLumber (lumberMap, cutsPending, lumberMaps) {
  if (cutsPending.length === 0) {
    lumberMaps.push(lumberMap);
    return;
  }

  if (lumberMap.length === 0) {
    lumberMap.push([]);
  }

  cutsPending.forEach(function(cut, index) {
    var lumberMapClone = cloneArray(lumberMap);
    var cutsPendingClone = cloneArray(cutsPending);

    var sum = lumberMapClone[lumberMapClone.length - 1].reduce(function(acc, el) {
      return acc += el;
    }, 0);
    console.log(sum);
    if ((sum + cut.length) < 96) {
      // I need to add the cut to the lumberMap's last array element
      lumberMapClone[lumberMapClone.length - 1].push(cut.length);
      // I need to reduce the value of the cut.quantity by 1 for the cut that we are on, and remove it from the list if that value is 0.
      cutsPendingClone[index].quantity -= 1;
      if (cutsPendingClone[index].quantity <= 0) {
        cutsPendingClone.splice(index, 1);
      }
      minLumber(lumberMapClone, cutsPendingClone, lumberMaps);
    } else {
      lumberMapClone.push([cut.length]);
      cutsPendingClone[index].quantity -= 1;
      if (cutsPendingClone[index].quantity <= 0) {
        cutsPendingClone.splice(index, 1);
      }
      minLumber(lumerMapClone, cutsPendingClone, lumberMaps);
    }
  });
}

function cloneArray (array) {
  return array.reduce(function(acc, el) {
    var object = clone(el);
    acc.push(object);
    return acc;
  }, []);
}

/*
cuts is the main list, and for this function I need 2 more lists.  1 of the total cuts on lumber used so far, and 1 for the cuts yet to go.
Both of these lists need to be passed into a new function when it is created.  the global cuts variable can not be changed.  

Ok, the first time minLumber is called, it is called with a lumberMap as an empty list, and cutsPending as a clone of 'cuts' (to prevent changing it)

What are the termination conditions? If the cutsPending is an empty object, then exit.  When exiting, add the lumberMap to a list called lumberMaps.
Then, find the lumberMap in lumberMaps with the shortest length, and we are good.  

So what do we do first?  When the function is first called, we need to iterate through the different cuts in cutsPending and in turn add each to lumberMap,
remove them from cutsPending, and call the function again with the new lists. 

How do we add the length to lumberMap?  What is lumberMap?  lumberMap is a list of pieces of lumber, and each piece of lumber is itself a list of cuts. 
So the first thing we need to do is to create an empty list on lumberMap if the length of lumberMap is 0, as an initialization condition.  
Next, we add a list with one value when the total length of the cuts is more than 96.   */