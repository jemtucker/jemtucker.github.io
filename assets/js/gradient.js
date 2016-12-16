// target to give background to
var $div = document.getElementById("gradient");

// rgb vals of the gradients
var gradients = [
  { start: [0, 0, 50],   stop: [0, 0, 100] },
  { start: [0, 0, 100],  stop: [50, 0, 100] },
  { start: [50, 0, 100], stop: [50, 0, 150] },
  { start: [50, 0, 150], stop: [50, 0, 100] },
  { start: [50, 0, 100], stop: [0, 0, 100] },
  { start: [0, 0, 100], stop: [0, 0, 50] }
];

// how long for each transition
var transitionTime = 1;

// how many frames per second
var fps = 120;

// interal type vars
var timer; // for the setInterval
var intervalTime = Math.round(5000 / fps); // how often to interval
var currentIndex = 0; // where we are in the gradients array
var currentDegrees = -45; // starting position for gradient
var nextIndex = 1; // what index of the gradients array is next
var stepsCount = 0; // steps counter
var stepsTotal = Math.round(transitionTime * fps); // total amount of steps

var rgbSteps = {
  start: [0,0,0],
  stop: [0,0,0]
}; // how much to alter each rgb value
var rgbValues = {
  start: [0,0,0],
  stop: [0,0,0]
}; // the current rgb values, gets altered by rgb steps on each interval

var prefixes = ["-webkit-","-moz-","-o-","-ms-",""]; // for looping through adding styles
var divStyle = $div.style; // short cut to actually adding styles
var gradientsTested = false;
var color1, color2;

// sets next current and next index of gradients array
function set_next(num) {
  return (num + 1 < gradients.length) ? num + 1 : 0;
}

// work out how big each rgb step is
function calcStepSize(a,b) {
  return (a - b) / stepsTotal;
}

// populate the rgbValues and rgbSteps objects
function calc_steps() {
  for (var key in rgbValues) {
    if (rgbValues.hasOwnProperty(key)) {
      for(var i = 0; i < 3; i++) {
        rgbValues[key][i] = gradients[currentIndex][key][i];
        rgbSteps[key][i] = calcStepSize(gradients[nextIndex][key][i],rgbValues[key][i]);
      }
    }
  }
}

// Return int from -75 to -15 in round robin style incrementing
function nextDegree(curr, increment) {
    var next = (curr + 75 + increment) % 60;
    return next - 75;
}

// update current rgb vals, update DOM element with new CSS background
function updateGradient() {
  // update the current rgb vals
  for (var key in rgbValues) {
    if (rgbValues.hasOwnProperty(key)) {
      for(var i = 0; i < 3; i++) {
        rgbValues[key][i] += rgbSteps[key][i];
      }
    }
  }

  // generate CSS rgb values
  var t_color1 = "rgb("+(rgbValues.start[0] | 0)+","+(rgbValues.start[1] | 0)+","+(rgbValues.start[2] | 0)+")";
  var t_color2 = "rgb("+(rgbValues.stop[0] | 0)+","+(rgbValues.stop[1] | 0)+","+(rgbValues.stop[2] | 0)+")";

  // has anything changed on this interation
  if (t_color1 != color1 || t_color2 != color2) {

    // update cols strings
    color1 = t_color1;
    color2 = t_color2;

    currentDegrees = nextDegree(currentDegrees, 1);
    var degreeString = (currentDegrees > 0 ? "" : "-") + currentDegrees;

    // update DOM element style attribute
    divStyle.backgroundImage = "-webkit-gradient(linear, left top, right bottom, from(" + color1 + "), to(" + color2 + "))";
    for (var i = 0; i < 4; i++) {
      divStyle.backgroundImage = prefixes[i]+"linear-gradient(-" + degreeString + "deg, " + color1 + ", " + color2 + ")";
    }
  }

  // test if the browser can do CSS gradients
  if (divStyle.backgroundImage.indexOf("gradient") == -1 && !gradientsTested) {
    // if not, kill the timer
    clearTimeout(timer);
  }

  gradientsTested = true;

  // we did another step
  stepsCount++;

  // did we do too many steps?
  if (stepsCount > stepsTotal) {
    // reset steps count
    stepsCount = 0;

    // set new indexs
    currentIndex = set_next(currentIndex);
    nextIndex = set_next(nextIndex);

    calc_steps();
  }
}

// initial step calc
calc_steps();

// go go go!
timer = setInterval(updateGradient,intervalTime);
