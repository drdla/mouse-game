function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length != b.length) return false;

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if (new Date().getTime() - start > milliseconds) {
      break;
    }
  }
}

function arrayContainsArray(a, b) {
  var bool = false;
  $.each(b, function () {
    if (arraysEqual(this, a)) {
      bool = true;
    }
  });
  return bool;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function indexOfMax(arr) {
  if (arr.length === 0) {
    return -1;
  }
  var max = arr[0];
  var maxIndex = 0;
  for (var i = 1; i < arr.length; i++) {
    if (arr[i] > max) {
      maxIndex = i;
      max = arr[i];
    }
  }
  return maxIndex;
}

function chunk(array, size) {
  const chunked_arr = [];
  for (let i = 0; i < array.length; i++) {
    const last = chunked_arr[chunked_arr.length - 1];
    if (!last || last.length === size) {
      chunked_arr.push([array[i]]);
    } else {
      last.push(array[i]);
    }
  }
  return chunked_arr;
}

class Game {
  constructor() {
    this.canvas = document.getElementById('main');
    this.ctx = this.canvas.getContext('2d');
    this.reset();
  }

  reset() {
    this.hero = [0, 0];
    this.damsel = [4, 4];
    this.villains = [
      [2, 1],
      [4, 2],
      [1, 2],
      [3, 4],
      [1, 5],
      [5, 0],
    ];
    this.moveCount = 0;
    this.draw();
  }

  play(dir) {
    this.move(dir);
    this.draw();
    var reward = 100;
    if (arraysEqual(this.damsel, this.hero)) {
      reward = 100;
      this.reset();
    } else if (arrayContainsArray(this.hero, this.villains)) {
      reward = -100;
      this.reset();
    } else if (this.hero[0] < 0 || this.hero[1] < 0) {
      reward = -100;
      this.reset();
    } else if (this.hero[0] > 5 || this.hero[1] > 5) {
      reward = -100;
      this.reset();
    } else {
      reward = -1;
    }
    return reward;
  }

  move(dir) {
    if (dir == 'u') {
      this.hero[1] = this.hero[1] - 1;
    } else if (dir == 'd') {
      this.hero[1] = this.hero[1] + 1;
    } else if (dir == 'l') {
      this.hero[0] = this.hero[0] - 1;
    } else if (dir == 'r') {
      this.hero[0] = this.hero[0] + 1;
    }
    this.moveCount = this.moveCount + 1;
  }

  draw() {
    var ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // Draw Damsel
    ctx.fillStyle = '#4BFF32';
    ctx.fillRect(this.damsel[0] * 100, this.damsel[1] * 100, 100, 100);
    // Draw Hero
    ctx.fillStyle = '#FFFFFF';
    this.hero_rect = ctx.fillRect(this.hero[0] * 100, this.hero[1] * 100, 100, 100);
    // Draw Villains
    ctx.fillStyle = '#FF0000';
    this.villains.forEach(function (item, index) {
      ctx.fillRect(item[0] * 100, item[1] * 100, 100, 100);
    });
  }
}

class QNetwork {
  constructor(actions, states) {
    this.initArr(actions, states);
    this.actions = actions;
    this.states = states;
    this.last_action = null;
    this.lr = 1.0;
    this.discount_rate = 1.0;
    this.epsilon = 1.0;
    this.epsilon_decay = 0.001;
    this.currentState = 0;
  }

  initArr(cols, rows) {
    this.qArr = [];
    var i = 0;
    var j = 0;
    for (i = 0; i < rows; i++) {
      var innerArr = [];
      for (j = 0; j < cols; j++) {
        innerArr.push(0);
      }
      this.qArr.push(innerArr);
    }
  }

  think(state) {
    this.currentState = this.qArr[state];
    var action = null;
    if (Math.random() < this.epsilon) {
      action = getRandomInt(0, this.actions - 1);
    } else {
      action = indexOfMax(this.currentState);
    }
    this.epsilon = this.epsilon - this.epsilon_decay * this.epsilon;
    return action;
  }

  giveReward(reward, state, prevState, action) {
    console.log([reward, state, prevState, action]);
    //New Q value = Current Q value + lr * [Reward + discount_rate * (highest Q value between possible actions from the new state s’ ) — Current Q value ]
    var maxArr = this.qArr[state];
    var maxQ = Math.max.apply(Math, maxArr);
    var newQ =
      this.qArr[prevState][action] + this.lr * (reward + this.discount_rate * maxQ) - this.qArr[prevState][action];
    this.qArr[prevState][action] = newQ;
  }
}

// Play the game
game = new Game();
net = new QNetwork(4, 36);

var i = 1; //  set your counter to 1
var generation = 1;
var step = 1;
var history = [];

function myLoop() {
  //  create a loop function
  setTimeout(function () {
    //  call a 3s setTimeout when the loop is called
    state = game.hero[0] * 5 + game.hero[1] + game.hero[0];
    action = net.think(state);
    // Convert action
    var move = null;
    switch (action) {
      case 0:
        move = 'u';
        break;
      case 1:
        move = 'd';
        break;
      case 2:
        move = 'l';
        break;
      case 3:
        move = 'r';
        break;
    }
    reward = game.play(move);
    prevState = state;
    state = game.hero[0] * 5 + game.hero[1] + game.hero[0];
    net.giveReward(reward, state, prevState, action);
    if (reward == -100) {
      history[generation] = { status: 'Lost', steps: step };
      $('#history').prepend('<tr><td>' + generation + '</td><td>Lost</td><td>' + step + '</td></tr>');
      generation = generation + 1;
      step = 1;
    } else if (reward == 100) {
      history[generation] = { status: 'Won', steps: step };
      $('#history').prepend('<tr class="success"><td>' + generation + '</td><td>Won</td><td>' + step + '</td></tr>');
      generation = generation + 1;
      step = 1;
    } else {
      step = step + 1;
    }
    $('#generation').text(generation);
    $('#step').text(step);
    var qOut = '';
    $.each(net.qArr, function () {
      qOut = qOut + JSON.stringify(this) + '<br>';
    });
    $('#q-table').html(qOut);
    $('#epsilon').text(net.epsilon);
    i++; //  increment the counter
    if (i < 10000) {
      //  if the counter < 10, call the loop function
      myLoop(); //  ..  again which will trigger another
    } //  ..  setTimeout()
  }, 75);
}

$(document).ready(function () {
  $('body').addClass('container-fluid').removeClass('container');
  $('#start').click(function () {
    myLoop();
  });
});
