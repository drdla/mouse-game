// Simulate a game where a mouse has to find its way through a field full of cats to reach a piece of cheese.
// The field is a 10x10 grid, with the mouse starting at the top left corner (0, 0) and the cheese being at the bottom right corner (9, 9). Cats are placed at multiple positions on the field.
// Inspired by https://youtu.be/r428O_CMcpI?t=274

const fieldBoundaries = [
  [0, 9], // <- this is the x-axis; the first element (value 0) is the minimum, the second (value 9) is the maximum
  [0, 9], // <- this is the y-axis; the first element (value 0) is the minimum, the second (value 9) is the maximum
];

const possibleMoves = (currentPosition) => {
  return {
    up: currentPosition[1] - 1 >= fieldBoundaries[1][0], // if we deduct 1 from the current y-axis position, is the resulting value still at least as big as the minimum y-axis value?
    right: currentPosition[0] + 1 <= fieldBoundaries[0][1],
    down: currentPosition[1] + 1 <= fieldBoundaries[1][1],
    left: currentPosition[0] - 1 >= fieldBoundaries[0][0],
  };
};

const doMove = (currentPosition, move) => {
  // TODO: implement this function
  return [999999, 999999];
}

const field = [
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

const catPositions = [
  [1, 0],
  [1, 1],
  [1, 2],
  [1, 3],
];

const cheesePosition = [9, 9];

const startPosition = [0, 0];

let currentPosition = startPosition;

// Make an endless number of moves until something happens that ends the game
while (true) {
  const movesForCurrentPosition = possibleMoves(currentPosition);
  const actuallyPossibleMoves = Object.keys(movesForCurrentPosition).filter((move) => moves[move] === true); // this will give us an array of strings, e.g. ['up', 'right', 'down']

  const randomMove = actuallyPossibleMoves[Math.floor(Math.random() * actuallyPossibleMoves.length)]; // get the element at the randomly calculated index of the list called "actuallyPossibleMoves"; returns 'up', 'right', 'down', or 'left'

  const newPosition = doMove(currentPosition, randomMove);
  currentPosition = newPosition;
  if (/* TODO: current position is cat */) {
    break; // we died -> end of the game
  } else if (currentPosition[0] === cheesePosition[0] && currentPosition[1] === cheesePosition[1]) {
    // current position is cheese
    break; // we won -> end of the game
  } else {
    // do nothing -> make next random move
  }
}
