// Simulate a game where a mouse has to find its way through a field full of cats to reach a piece of cheese.
// The field is a 10x10 grid, with the mouse starting at the top left corner (0, 0) and the cheese being at the bottom right corner (9, 9). Cats are placed at multiple positions on the field.
// Inspired by https://youtu.be/r428O_CMcpI?t=274

// Example solution: https://codepen.io/romuloux/pen/GVjJdY

export const fieldBoundaries = [
  [0, 9], // <- this is the x-axis; the first element (value 0) is the minimum, the second (value 9) is the maximum
  [0, 9], // <- this is the y-axis; the first element (value 0) is the minimum, the second (value 9) is the maximum
];

export const catPositions = [
  [2, 2],
  [2, 1],
  [2, 8],
  [2, 6],
  [5, 4],
];
export const cheesePosition = [9, 9];
export const startPosition = [0, 0];

const getRandomInteger = (max, min = 0) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const possibleMoves = (currentPosition) => {
  return {
    up: currentPosition[1] - 1 >= fieldBoundaries[1][0], // if we deduct 1 from the current y-axis position, is the resulting value still at least as big as the minimum y-axis value?
    right: currentPosition[0] + 1 <= fieldBoundaries[0][1],
    down: currentPosition[1] + 1 <= fieldBoundaries[1][1],
    left: currentPosition[0] - 1 >= fieldBoundaries[0][0],
  };
};

const doMove = (currentPosition, move) => {
  let newXPosition = currentPosition[0];
  let newYPosition = currentPosition[1];

  switch (move) {
    case 'up':
      newXPosition = currentPosition[0];
      newYPosition = currentPosition[1] - 1;
      break;

    case 'right':
      newXPosition = currentPosition[0] + 1;
      newYPosition = currentPosition[1];
      break;

    case 'down':
      newXPosition = currentPosition[0];
      newYPosition = currentPosition[1] + 1;
      break;

    case 'left':
      newXPosition = currentPosition[0] - 1;
      newYPosition = currentPosition[1];
      break;
  }

  return [newXPosition, newYPosition];
};

// Array.from({ length: fieldBoundaries[0][1] + 1 }, (_, index) => index);
// Array.from({ length: fieldBoundaries[1][1] }, (_, index) => index);
export const field = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
];

export const isCatPosition = (currentPosition, catPositions) => {
  return catPositions.some((catPosition) => {
    return currentPosition[0] === catPosition[0] && currentPosition[1] === catPosition[1];
  });
};

export const isCheesePosition = (currentPosition, cheesePosition) => {
  return currentPosition[0] === cheesePosition[0] && currentPosition[1] === cheesePosition[1];
};

export const isMousePosition = (currentPosition, mousePosition) => {
  return currentPosition[0] === mousePosition[0] && currentPosition[1] === mousePosition[1];
};

export function moveThroughField() {

  let counter = 0;

  let currentPosition = startPosition;


  // Make an endless number of moves until something happens that ends the game
  while (true) {
    if (counter > 15000) {
      console.log('Game ended after 15000 moves');
      break;
    }

    counter = counter + 1;

    const movesForCurrentPosition = possibleMoves(currentPosition);
    const actuallyPossibleMoves = Object.keys(movesForCurrentPosition).filter(
      (move) => movesForCurrentPosition[move] === true
    ); // this will give us an array of strings, e.g. ['up', 'right', 'down']

    const randomMove = actuallyPossibleMoves[getRandomInteger(actuallyPossibleMoves.length - 1)]; // get the element at the randomly calculated index of the list called "actuallyPossibleMoves"; returns 'up', 'right', 'down', or 'left'
    const nextMove = randomMove;

    const newPosition = doMove(currentPosition, nextMove);
    currentPosition = newPosition;

    if (isCatPosition(currentPosition, catPositions)) {
      break; // we died -> end of the game
    } else if (isCheesePosition(currentPosition, cheesePosition)) {
      // current position is cheese
      break; // we won -> end of the game
    } else {
      // do nothing -> make next random move
    }
  }

  console.log(`Game ended after ${counter} moves`);

  return {
    counter,
    currentPosition,
  };
}
