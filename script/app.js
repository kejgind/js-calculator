// Selecting elements from DOM (screen display and buttons)
const buttonsWrap = document.querySelector('.calculator__buttons');
const screen = document.querySelector('.calculator__screen');

// Rounding number function - source MDN
const round = (number, precision) => {
  const shift = (number, exponent) => {
    const numArray = ('' + number).split('e');
    return +(
      numArray[0] +
      'e' +
      (numArray[1] ? +numArray[1] + exponent : exponent)
    );
  };
  return shift(Math.round(shift(number, +precision)), -precision);
};

// Defining basic arithmetic operations for calculator
const addition = (a, b) => round(a + b, 8);
const subtraction = (a, b) => round(a - b, 8);
const multiplication = (a, b) => round(a * b, 8);
const division = (a, b) => round(a / b, 8);
const sqrt = a => round(Math.sqrt(a), 8);
const percent = a => round(a / 100, 8);

// Setting up variables containing numbers and arithmetic operations
let globalState = [];
let localState = '';

// Function for displaying numbers and operations results
const displayOnScreen = input => {
  const stringy = input.toString();
  const dotIdx = stringy.indexOf('.');
  const ipl = stringy.replace('.', '').length;
  if (ipl <= 10) {
    screen.innerText = stringy;
  } else {
    if (dotIdx === -1 || dotIdx > 10) {
      screen.innerText = stringy
        .slice(0, 8)
        .concat('E')
        .concat(ipl - 8);
    } else if (dotIdx >= 0 && dotIdx <= 10) {
      screen.innerText = stringy.slice(0, 10);
    }
  }
};

// Functions solving equasions
const equasionSolver = arr => {
  switch (arr[1]) {
  case 'addition':
    arr.splice(0, 3, addition(arr[0], arr[2]));
    break;
  case 'subtraction':
    arr.splice(0, 3, subtraction(arr[0], arr[2]));
    break;
  case 'multiplication':
    arr.splice(0, 3, multiplication(arr[0], arr[2]));
    break;
  case 'division':
    arr.splice(0, 3, division(arr[0], arr[2]));
    break;
  }
  displayOnScreen(arr[0]);
};

const shortSolver = arr => {
  switch (arr[1]) {
  case 'sqrt':
    arr.splice(0, 2, sqrt(arr[0]));
    break;
  case 'percent':
    arr.splice(0, 2, percent(arr[0]));
    break;
  }
  displayOnScreen(arr[0]);
};

// Function that handle changes in variables containing numbers and operations
const stateChanges = input => {
  const gl = globalState.length;
  if (!isNaN(parseInt(input))) {
    if (localState.replace('.', '').length < 10) {
      localState += input;
      displayOnScreen(localState);
    }
  } else if (input === '.') {
    if (localState.indexOf('.') === -1) {
      localState += input;
      displayOnScreen(localState);
    }
  } else if (input === 'C') {
    localState = '';
    globalState = [];
    displayOnScreen('');
  } else if (input === 'CE') {
    localState = '';
    globalState = [globalState[0]];
    displayOnScreen(globalState);
  } else if (input === 'equal') {
    if (gl === 0 && (!localState || localState === '.')) {
      localState = '';
      displayOnScreen(globalState);
    } else if (gl === 0 && localState && localState !== '.') {
      globalState.push(parseFloat(localState));
      localState = '';
      displayOnScreen(globalState);
    } else if (gl === 1 || (gl === 2 && (!localState || localState === '.'))) {
      globalState = [globalState[0]];
      displayOnScreen(globalState);
    } else if (gl === 2 && localState && localState !== '.') {
      globalState.push(parseFloat(localState));
      localState = '';
      equasionSolver(globalState);
    }
  } else if (input === 'sqrt' || input === 'percent') {
    if (gl === 0 && localState && localState !== '.') {
      globalState.push(parseFloat(localState));
      localState = '';
      displayOnScreen(localState);
      globalState.push(input);
      shortSolver(globalState);
    } else if (gl === 1 && typeof globalState[0] === 'number') {
      globalState.push(input);
      shortSolver(globalState);
    } else if (gl === 2 && !localState) {
      globalState[1] = input;
      shortSolver(globalState);
    } else if (gl === 2 && localState && localState !== '.') {
      globalState.push(parseFloat(localState));
      localState = '';
      displayOnScreen(localState);
      globalState.push(input);
      equasionSolver(globalState);
      shortSolver(globalState);
    } else if (gl === 2 && !localState) {
      globalState[1] = input;
      shortSolver(globalState);
    }
  } else if (
    input === 'addition' ||
    input === 'subtraction' ||
    input === 'multiplication' ||
    input === 'division'
  ) {
    if (gl === 0 && localState && localState !== '.') {
      globalState.push(parseFloat(localState));
      localState = '';
      displayOnScreen(localState);
      globalState.push(input);
    } else if (gl === 1 && typeof globalState[0] === 'number') {
      globalState.push(input);
    } else if (gl === 2 && localState && localState !== '.') {
      globalState.push(parseFloat(localState));
      localState = '';
      displayOnScreen(localState);
      globalState.push(input);
      equasionSolver(globalState);
    } else if (gl === 2 && !localState) {
      globalState[1] = input;
    }
  }
  console.log(localState);
  console.log(globalState);
};

// Function to handle button clicks
const buttonsHandler = event => {
  console.log(event.target);
  event.target.classList.contains('calculator__button')
    ? stateChanges(event.target.dataset.button)
    : '';
};

// Setting up button listener
buttonsWrap.addEventListener('click', buttonsHandler);
