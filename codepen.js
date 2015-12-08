var pattern = [];
var playerPattern = [];
var badClick = false;
var strict;

$(document).ready(function() {
  $('#off').on('click', function(){
    turnOffColorHandlers()
    $('#on').css('background', 'white');
    $('#off').css('background', 'navy');
    $('#start').off();
    $('#strict').off();
    endGame("off");
    strict = false;
    clearAllTimeouts()
    removeCursors()
  })

  $('#on').on('click', function(){
    $('#off').css('background', 'white');
    $('#on').css('background', 'navy');
    $('#start').on('click', function(){
      turnOnColorHandlers()
      strict = false;
      newGame();
    });
    $('#strict').on('click', function(){
      turnOnColorHandlers();
      strict = true;
      newGame();
    })
    addCursors();
  })

  $('.colors').on('mouseup', function(){
    var color = $(this).attr('id')
    if ( badClick ) { return; }
    inactiveColor(color)
  })

  $(document).on('show.bs.modal', '#gameOver', function (event) {
     var modal = $(this)
     if( pattern.length < 20 ) {
      modal.find('.modal-title').text('YOU LOSS');
      modal.find('.modal-body p').text("Ughh tough loss. You'll do better next time")
     } else {
      modal.find('.modal-title').text('YOU WON');
      modal.find('.modal-body p').text("Congratilations! You are a Simon Master. Play again?")
     }
  })

  $(document).on('click', '#playAgain', function(){
    newGame();
  })
})
/*****************
 Game Play
******************/

function newGame() {
  clearDisplay();
  $('#gameboard').removeClass('animated wobble')
  clearAllTimeouts();
  pattern = []
  playerPattern = []
  computerTurn()
}

function computerTurn() {
  addToPattern();
  setTimeout(setCount, 150);
  playPattern();
}

function randomColor() {
  var colors = ['green', 'red', 'yellow', 'blue']
  var index = Math.floor(Math.random() * (4 - 0)) + 0;
  return colors[index];
}

function addToPattern() {
  var color = randomColor();
  pattern.push(color);
}

function playPattern() {
  var i;
  var speed = setTempo();
  debugger;
  turnOffColorHandlers();
  badClick = false;

  for(i = 0; i < pattern.length; i++ ){
    var color = pattern[i]
    playColor(color, speed, i + 1);
    stopColor(color, speed, i + 1)
  }
  turnOnColorHandlers(i * speed )
}

function setTempo() {
  var count = pattern.length;
  var speed;

    if( count < 5  ) { speed = 1600; } else
    if( count < 9  ) { speed = 1400; } else
    if( count < 13 ) { speed = 1000; } else
                     { speed = 800;  }
  return speed;
}

function playColor(color, timeout, i) {
  i = i || 1
  setTimeout(function(){
    activeColor(color);
  }, timeout * i)
}

function stopColor(color, timeout, i) {
  i = i || 1
  timeout = (timeout * i) + 250
  setTimeout(function(){
    inactiveColor(color);
  }, timeout)
}

function setCount() {
  var count = pattern.length
  if( count < 10 ) { count = "0" + count.toString() }
  $('#number').html("<h2 class='animated flipInX' id='number'>" + count.toString() + "</h2>")
  $('#count').remove('#number');
}

function checkColor(color, index) {
  if( color === pattern[index] ) {
      playerPattern.push(color);
      if ( playerPattern.length === 20 ) { endGame(); }
      else { turnCheck() }
  } else {
    badClick = true;
    wrongMove(color);
  }
}

function turnCheck() {
  if( pattern.length === playerPattern.length ) {
    playerPattern = [];
    computerTurn();
  }
}

function wrongMove(color) {
  playerPattern = [];
  turnOffColorHandlers();
  playSound('wrong');
  if( strict ) { return endGame(); }
  stopColor(color, 1800);
  setTimeout(playPattern, 2000);
}

function endGame(off) {
  $('#gameboard').addClass('animated wobble')
  if(!off) { displayModal(); }
  pattern = [];
  playerPattern =  [];
  setCount();
}

function displayModal() {
  $('#gameOver').modal('show');
}

function clearAllTimeouts() {
  var id = window.setTimeout(function() {}, 100000);
  var i;
  for(i = 1; i < id; i++) {
    clearTimeout(i);
  }
}


/*****************
 event handlers
******************/
function turnOffColorHandlers() {
  $('.colors').off('mousedown');
}

function turnOnColorHandlers(timeout) {
  timeout = timeout || 0
  setTimeout(function() {
    turnOnMouseDown();
  }, timeout)
}

function turnOnMouseDown() {
  $('.colors').on('mousedown', function(){
  var color = $(this).attr('id')
  var index = playerPattern.length
  checkColor(color, index);
  activeColor(color)
})
}

function removeCursors() {
  $('.colors').css('cursor', 'default')
  $('#strict').css('cursor', 'default')
  $('#start').css('cursor', 'default')
}

function addCursors() {
  $('.colors').css('cursor', 'hand')
  $('#strict').css('cursor', 'hand')
  $('#start').css('cursor', 'hand')
}

/*****************
 colors and sounds
******************/

function activeColor(color) {
  var id = '#' + color
  $(id).addClass(color+'Active');
  playSound(color)
}

function inactiveColor(color) {
 var id = '#' + color
 $(id).removeClass(color+'Active')
}

function clearDisplay() {
  var colors = ['green', 'red', 'yellow', 'blue']
  var i;
  for (i = 0; i < colors.length; i++) {
    var color = colors[i]
    inactiveColor(color);
  }
}

function playSound(color) {
  var id = '#' + color
  var audio = $(id+'Sound')[0];

  audio.currentTime = 0;
  audio.playbackRate = 0.5;
  audio.play();
}


